const dns =
    require("dns");

const { Readable } =
    require("stream");

// Nhiều VPS gán IPv6 nhưng không route được, khiến UDP discovery
// của @discordjs/voice bị treo tới khi timeout. Ưu tiên IPv4 để né lỗi này.
dns.setDefaultResultOrder("ipv4first");

const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    entersState,
    AudioPlayerStatus,
    VoiceConnectionStatus
} = require("@discordjs/voice");


// ======================================================
// CONFIG
// ======================================================

const GTTS_LANG = "vi";

const GTTS_CHUNK_LENGTH = 200;

const MAX_LENGTH = 300;


// ======================================================
// SESSIONS (guildId -> session)
// ======================================================

const sessions = new Map();


// ======================================================
// DỌN TEXT TRƯỚC KHI ĐỌC
// ======================================================

function sanitizeText(text) {

    let clean =
        String(text || "")
            .replace(/https?:\/\/\S+/g, "đường dẫn")
            .trim();


    if (clean.length > MAX_LENGTH) {

        clean =
            clean.slice(0, MAX_LENGTH) + "...";

    }


    return clean;

}


// ======================================================
// CHIA CÂU DÀI THÀNH ĐOẠN NGẮN (giới hạn của Google TTS)
// ======================================================

function splitGttsChunks(text) {

    const chunks = [];

    let remaining =
        text.trim();

    while (remaining.length > GTTS_CHUNK_LENGTH) {

        let cut =
            remaining.lastIndexOf(" ", GTTS_CHUNK_LENGTH);

        if (cut <= 0)
            cut = GTTS_CHUNK_LENGTH;

        chunks.push(remaining.slice(0, cut).trim());

        remaining =
            remaining.slice(cut).trim();

    }

    if (remaining)
        chunks.push(remaining);

    return chunks;

}


// ======================================================
// GỌI GOOGLE TRANSLATE TTS CHO 1 ĐOẠN
// ======================================================

const GTTS_RETRIES = 3;

const GTTS_RETRY_DELAY_MS = 500;

function delay(ms) {

    return new Promise(resolve =>
        setTimeout(resolve, ms)
    );

}

async function fetchGttsChunkOnce(text) {

    const params =
        new URLSearchParams({
            ie: "UTF-8",
            q: text,
            tl: GTTS_LANG,
            client: "tw-ob"
        });

    const res =
        await fetch(
            `https://translate.google.com/translate_tts?${params.toString()}`,
            {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
                }
            }
        );

    if (!res.ok) {

        throw new Error(`gTTS HTTP ${res.status}`);

    }

    return Buffer.from(await res.arrayBuffer());

}

// gTTS là endpoint không chính thức, thỉnh thoảng bị reset/timeout
// tạm thời - retry vài lần trước khi bỏ cuộc, tránh mất cả câu chat.
async function fetchGttsChunk(text) {

    let lastErr;

    for (
        let attempt = 1;
        attempt <= GTTS_RETRIES;
        attempt++
    ) {

        try {

            return await fetchGttsChunkOnce(text);

        }
        catch (err) {

            lastErr = err;

            console.error(
                `❌ gTTS lỗi (lần ${attempt}/${GTTS_RETRIES}):`,
                err.message,
                err.cause || ""
            );

            if (attempt < GTTS_RETRIES) {

                await delay(
                    GTTS_RETRY_DELAY_MS * attempt
                );

            }

        }

    }

    throw lastErr;

}


// ======================================================
// TẠO AUDIO MP3 CHO CẢ CÂU (GHÉP CÁC ĐOẠN)
// ======================================================

async function synthesizeGtts(text) {

    const chunks =
        splitGttsChunks(text);

    const buffers = [];

    for (const chunk of chunks) {

        buffers.push(
            await fetchGttsChunk(chunk)
        );

    }

    return Buffer.concat(buffers);

}


// ======================================================
// XỬ LÝ HÀNG ĐỢI ĐỌC
// ======================================================

async function processQueue(session) {

    if (session.speaking)
        return;

    if (!session.queue.length)
        return;

    session.speaking = true;

    const text =
        session.queue.shift();

    try {

        const mp3 =
            await synthesizeGtts(text);

        const resource =
            createAudioResource(
                Readable.from(mp3)
            );

        session.player.play(resource);

        await new Promise(resolve => {

            const onDone = () => {

                session.player.off(AudioPlayerStatus.Idle, onDone);
                session.player.off("error", onDone);

                resolve();

            };

            session.player.once(AudioPlayerStatus.Idle, onDone);
            session.player.once("error", onDone);

        });

    }
    catch (err) {

        console.error("❌ TTS lỗi:", err);

    }
    finally {

        session.speaking = false;
        processQueue(session);

    }

}


// ======================================================
// ĐỌC 1 CÂU
// ======================================================

function speakText(guildId, text) {

    const session =
        sessions.get(guildId);

    if (!session)
        return;

    const clean =
        sanitizeText(text);

    if (!clean)
        return;

    session.queue.push(clean);

    processQueue(session);

}


// ======================================================
// VÀO VOICE CHANNEL
// ======================================================

async function joinSession(message) {

    const guildId =
        message.guild.id;

    const voiceChannel =
        message.member?.voice?.channel;

    if (!voiceChannel) {

        return {
            ok: false,
            reason: "Bạn cần vào một voice channel trước."
        };

    }

    if (sessions.has(guildId)) {

        return {
            ok: false,
            reason: "Bot đang đọc TTS trong server này rồi."
        };

    }

    const connection =
        joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId,
            adapterCreator: message.guild.voiceAdapterCreator
        });

    connection.on("error", err => {

        console.error("❌ [Voice error]", err);

    });

    try {

        await entersState(
            connection,
            VoiceConnectionStatus.Ready,
            15_000
        );

    }
    catch (err) {

        console.error("❌ [Voice] Không vào được voice channel:", err);

        connection.destroy();

        return {
            ok: false,
            reason: "Không thể kết nối vào voice channel (timeout)."
        };

    }

    const player =
        createAudioPlayer();

    connection.subscribe(player);

    const session = {
        connection,
        player,
        textChannelId: message.channel.id,
        queue: [],
        speaking: false
    };

    sessions.set(guildId, session);

    connection.on(
        VoiceConnectionStatus.Disconnected,
        () => leaveSession(guildId)
    );

    return {
        ok: true,
        voiceChannelName: voiceChannel.name
    };

}


// ======================================================
// RỜI VOICE CHANNEL
// ======================================================

function leaveSession(guildId) {

    const session =
        sessions.get(guildId);

    if (!session)
        return false;

    try { session.player.stop(); } catch {}
    try { session.connection.destroy(); } catch {}

    sessions.delete(guildId);

    return true;

}


// ======================================================
// LẤY SESSION
// ======================================================

function getSession(guildId) {

    return sessions.get(guildId);

}


module.exports = {
    joinSession,
    leaveSession,
    getSession,
    speakText
};

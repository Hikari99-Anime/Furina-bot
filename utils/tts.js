const dns =
    require("dns");

// Nhiều VPS gán IPv6 nhưng không route được, khiến UDP discovery
// của @discordjs/voice bị treo tới khi timeout. Ưu tiên IPv4 để né lỗi này.
dns.setDefaultResultOrder("ipv4first");

const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    entersState,
    StreamType,
    AudioPlayerStatus,
    VoiceConnectionStatus
} = require("@discordjs/voice");

const {
    MsEdgeTTS,
    OUTPUT_FORMAT
} = require("msedge-tts");


// ======================================================
// CONFIG
// ======================================================

const VOICE_NAME =
    "vi-VN-HoaiMyNeural";

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

        const tts =
            new MsEdgeTTS();

        await tts.setMetadata(
            VOICE_NAME,
            OUTPUT_FORMAT.WEBM_24KHZ_16BIT_MONO_OPUS
        );

        const { audioStream } =
            tts.toStream(text);

        const resource =
            createAudioResource(audioStream, {
                inputType: StreamType.WebmOpus
            });

        session.player.play(resource);

        await new Promise(resolve => {

            session.player.once(AudioPlayerStatus.Idle, resolve);
            session.player.once("error", resolve);

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
            adapterCreator: message.guild.voiceAdapterCreator,
            debug: true
        });

    connection.on("stateChange", (oldState, newState) => {

        console.log(`🔊 [Voice] ${oldState.status} -> ${newState.status}`);

        const networking = newState.networking;

        if (networking && !networking._loggedClose) {

            networking._loggedClose = true;

            networking.on("close", code => {

                console.log("🔊 [Voice] NW close code:", code);

            });

        }

    });

    connection.on("debug", msg => {

        console.log("🔊 [Voice debug]", msg);

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

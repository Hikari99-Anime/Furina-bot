const {
    EmbedBuilder
} = require("discord.js");

const fs =
    require("fs");

const path =
    require("path");


const STATE_FILE =
    path.join(__dirname, "status_message.json");


// ==========================================
// TRẠNG THÁI
// ==========================================

const STATES = {

    online: {
        color: "#86EFAC",
        title: "🟢 BOT ĐANG HOẠT ĐỘNG",
        desc: "Furina-bot đã kết nối thành công và sẵn sàng phục vụ."
    },

    reconnecting: {
        color: "#FDE68A",
        title: "🟡 ĐANG KẾT NỐI LẠI...",
        desc: "Kết nối tới Discord bị gián đoạn, bot đang thử kết nối lại."
    },

    resumed: {
        color: "#86EFAC",
        title: "🟢 ĐÃ KẾT NỐI LẠI",
        desc: "Bot đã khôi phục kết nối và đang hoạt động bình thường."
    },

    disconnected: {
        color: "#F87171",
        title: "🔴 MẤT KẾT NỐI",
        desc: "Bot đã mất kết nối tới Discord."
    },

    restarting: {
        color: "#93C5FD",
        title: "🔄 ĐANG KHỞI ĐỘNG LẠI",
        desc: "Bot đang được khởi động lại (deploy/update)."
    }

};


// ==========================================
// EMBED
// ==========================================

function buildEmbed(state) {

    const s =
        STATES[state] || STATES.online;

    return new EmbedBuilder()

        .setColor(s.color)

        .setTitle(s.title)

        .setDescription(s.desc)

        .setFooter({
            text: "✦ Furina-sama · Trạng thái hệ thống"
        })

        .setTimestamp();
}


// ==========================================
// ĐỌC / LƯU MESSAGE ID
// ==========================================

function readState() {

    try {

        return JSON.parse(
            fs.readFileSync(STATE_FILE, "utf8")
        );

    }

    catch {

        return null;

    }

}

function saveState(data) {

    try {

        fs.writeFileSync(
            STATE_FILE,
            JSON.stringify(data)
        );

    }

    catch (err) {

        console.error(
            "❌ Lỗi lưu status_message.json:",
            err
        );

    }

}


let cachedMessage = null;


// ==========================================
// CẬP NHẬT TRẠNG THÁI
// ==========================================

async function updateStatus(client, state) {

    const channelId =
        process.env.STATUS_CHANNEL_ID;

    if (!channelId)
        return;

    try {

        const embed =
            buildEmbed(state);


        // ==================================
        // EDIT MESSAGE ĐANG CACHE
        // ==================================

        if (cachedMessage) {

            const edited =
                await cachedMessage
                    .edit({ embeds: [embed] })
                    .catch(() => null);

            if (edited)
                return;

            cachedMessage = null;

        }


        const channel =
            await client.channels
                .fetch(channelId)
                .catch(() => null);

        if (!channel)
            return;


        // ==================================
        // FETCH MESSAGE ĐÃ LƯU
        // ==================================

        const saved =
            readState();

        if (saved?.messageId) {

            const msg =
                await channel.messages
                    .fetch(saved.messageId)
                    .catch(() => null);

            if (msg) {

                cachedMessage = msg;

                await msg
                    .edit({ embeds: [embed] })
                    .catch(() => {});

                return;

            }

        }


        // ==================================
        // GỬI MESSAGE MỚI
        // ==================================

        const sent =
            await channel.send({ embeds: [embed] });

        cachedMessage = sent;

        saveState({
            channelId,
            messageId: sent.id
        });

    }

    catch (err) {

        console.error(
            "❌ Lỗi cập nhật status:",
            err
        );

    }

}


module.exports = {
    updateStatus
};

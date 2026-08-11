const {
    leaveSession
} = require("../../utils/tts");


// ======================================================
// COMMAND
// ======================================================

module.exports = {

    name: "voiceleave",

    aliases: [
        "voiceoff",
        "ttsleave",
        "ttsoff"
    ],

    async execute(message) {

        if (!message.guild) {

            return message.reply(
                "❌ Lệnh này chỉ dùng được trong server."
            );

        }

        const ok =
            leaveSession(message.guild.id);

        if (!ok) {

            return message.reply(
                "❌ Furina hiện không ở trong voice channel nào (TTS)."
            );

        }

        return message.reply(
            "👋 Furina đã rời voice channel, dừng đọc TTS."
        );

    }

};

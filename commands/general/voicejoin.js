const {
    joinSession,
    speakText
} = require("../../utils/tts");


// ======================================================
// COMMAND
// ======================================================

module.exports = {

    name: "voicejoin",

    aliases: [
        "voiceon",
        "ttsjoin",
        "ttson"
    ],

    async execute(message) {

        try {

            if (!message.guild) {

                return message.reply(
                    "❌ Lệnh này chỉ dùng được trong server."
                );

            }

            const result =
                await joinSession(message);

            if (!result.ok) {

                return message.reply(
                    `❌ ${result.reason}`
                );

            }

            speakText(
                message.guild.id,
                `Furina đã vào, sẵn sàng đọc chat trong kênh ${message.channel.name}!`
            );

            return message.reply(

                `🔊 Furina đã vào **${result.voiceChannelName}**.\n` +
                `Mọi tin nhắn gõ trong kênh **${message.channel.name}** ` +
                `sẽ được đọc to trong voice.\n\n` +
                `Gõ \`fvoiceleave\` để dừng.`

            );

        }
        catch (err) {

            console.error("❌ VOICEJOIN ERROR:", err);

            return message.reply(
                "❌ Không thể vào voice channel."
            );

        }

    }

};

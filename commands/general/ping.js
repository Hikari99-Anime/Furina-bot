const {
    EmbedBuilder
} = require("discord.js");

// ======================================================
// MODULE
// ======================================================

module.exports = {

    name: "ping",

    aliases: [
        "p"
    ],

    async execute(
        message,
        args,
        client
    ) {

        const sent =
            await message.reply(
                "🏓 Pinging..."
            );

        const latency =
            sent.createdTimestamp -
            message.createdTimestamp;

        const embed =
            new EmbedBuilder()
                .setColor(0x6fd5f5)
                .setTitle("🏓 Pong!")
                .setDescription(
                    `Độ trễ tin nhắn: **${latency}ms**\n` +
                    `API: **${Math.round(client.ws.ping)}ms**`
                )
                .setFooter({
                    text:
                        "✦ Fishing Adventure · Furina's Blessing"
                });

        await sent.edit({
            content: null,
            embeds: [embed]
        });

    }

};
const {
    EmbedBuilder
} = require("discord.js");

const {
    rateStone,
    emoji
} = require("../../config");

const {
    getUser
} = require("../../data");

// Cùng ô lưu trữ với commands/fish/upgrade.js (RATE_STONE_ID = "da_rate")
const RATE_STONE_ID = "da_rate";

function getRateStoneCount(user) {

    return Math.max(
        0,
        Number(
            user?.[RATE_STONE_ID] ||
            user?.inventory?.[RATE_STONE_ID] ||
            user?.items?.[RATE_STONE_ID] ||
            0
        )
    );
}

module.exports = {

    name: "stonerate",

    aliases: [
        "darate",
        "dastone"
    ],

    async execute(message) {

        const user =
            getUser(
                message.author.id
            );

        const count =
            getRateStoneCount(user);

        const info =
            rateStone?.da_tang_rate;

        const embed =
            new EmbedBuilder()
                .setColor("#A78BFA")
                .setTitle(
                    "🪨 `RATE STONE`"
                )
                .setDescription(
                    `${info?.emoji || "🪨"} **${info?.name || "Đá tăng tỉ lệ"}**\n\n` +
                    `📦 Bạn đang có: **${count}** viên\n` +
                    `📈 Mỗi viên: **+${info?.rate ?? 5}%** tỉ lệ cường hóa\n` +
                    `🎯 Tối đa mỗi lần cường hóa: **5 viên**\n\n` +
                    `✦ Dùng \`fshop\` để mua thêm, dùng \`fupgrade\` để cường hóa.`
                )
                .setFooter({
                    text:
                        "✦ Fishing Adventure · Rate Stone"
                });

        return message.reply({
            embeds: [
                embed
            ]
        });
    }
};

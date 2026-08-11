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

// ======================================================
// ID ĐÁ TĂNG TỈ LỆ
// Cùng storage với commands/fish/upgrade.js
// ======================================================

const RATE_STONE_ID = "da_rate";

// ======================================================
// LẤY SỐ LƯỢNG ĐÁ
// ======================================================

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

// ======================================================
// MODULE
// ======================================================

module.exports = {

    name: "stonerate",

    aliases: [
        "darate",
        "dastone"
    ],

    async execute(message) {

        // ==================================================
        // USER
        // ==================================================

        const user =
            getUser(
                message.author.id
            );

        // ==================================================
        // DATA
        // ==================================================

        const count =
            getRateStoneCount(
                user
            );

        const info =
            rateStone?.da_tang_rate;

        const stoneEmoji =
            info?.emoji ||
            "🪨";

        const stoneName =
            info?.name ||
            "Đá tăng tỉ lệ";

        const rate =
            Number(
                info?.rate ?? 5
            );

        const maxUse = 5;


        // ==================================================
        // EMBED
        // ==================================================

        const embed =
            new EmbedBuilder()

                .setColor(
                    "#A78BFA"
                )

                .setAuthor({

                    name:
                        `${message.author.username} · Fishing`,

                    iconURL:
                        message.author.displayAvatarURL({
                            extension: "png",
                            size: 128
                        })

                })

                .setTitle(
                    `${stoneEmoji} \`RATE STONE\``
                )

                .setDescription(

                    `୨୧ ───────── ୨୧\n\n` +

                    `${stoneEmoji} ${stoneName}\n` +
                    `*Vật phẩm hỗ trợ tăng tỉ lệ cường hóa cần câu.*\n\n` +

                    `📦 Đang sở hữu: **${count} viên**\n` +
                    `📈 Hiệu quả: **+${rate}% / viên**\n` +
                    `🎯 Tối đa mỗi lần: **${maxUse} viên**\n\n` +

                    `୨୧ ───────── ୨୧\n\n` +

                    `💡 Mỗi viên đá sẽ cộng thêm **${rate}%** tỉ lệ cường hóa.\n` +
                    `⚒️ Có thể sử dụng tối đa **${maxUse} viên** trong một lần nâng cấp.\n\n` +

                    `🛒 Mua thêm tại \`fshop\`\n` +
                    `⚡ Sử dụng tại \`fupgrade\`\n\n` +

                    `୨୧ ───────── ୨୧`

                )

                .setFooter({

                    text:
                        "✦ Fishing Adventure · Rate Stone"

                })

                .setTimestamp();


        // ==================================================
        // SEND
        // ==================================================

        return message.reply({

            embeds: [
                embed
            ]

        });

    }

};
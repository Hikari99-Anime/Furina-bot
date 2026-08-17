const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const {
    emoji
} = require("../../config");

const {
    getUser
} = require("../../data");

// ======================================================
// 🛒 SHOP
// ======================================================

module.exports = {

    name: "shop",

    aliases: [
        "cuahang",
        "shopca"
    ],

    async execute(message) {

        // ==================================================
        // 👤 USER
        // ==================================================

        const user =
            getUser(
                message.author.id
            );

        if (!user) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor("#ff6b81")

                        .setTitle(
                            "୨୧ ───────────── ୨୧\n" +
                            "❌ KHÔNG TÌM THẤY\n" +
                            "୨୧ ───────────── ୨୧"
                        )

                        .setDescription(
                            "Không tìm thấy dữ liệu người chơi."
                        )

                        .setFooter({
                            text: "✦ Fishing Adventure"
                        })

                ]

            });

        }

        // ==================================================
        // 💰 BALANCE
        // ==================================================

        const balance =
            Number(
                user.money || 0
            );

        // ==================================================
        // 🛒 EMBED
        // ==================================================

        const embed =
            new EmbedBuilder()

                .setColor("#7DD3FC")

                .setAuthor({

                    name:
                        `${message.author.username} · Shop`,

                    iconURL:
                        message.author.displayAvatarURL({
                            extension: "png",
                            size: 128
                        })

                })

                .setDescription(

                    `୨୧ ───────────── ୨୧\n` +
                    `🛒 **FISHING SHOP**\n` +
                    `୨୧ ───────────── ୨୧\n\n` +

                    `💰 **Số dư**\n` +
                    `${balance.toLocaleString()} Fcoin ${emoji.money}\n\n` +

                    `🎣 **Cần câu**  ·  🪱 **Mồi câu**\n` +
                    `🎟️ **Chìa khóa**  ·  🪨 **Đá tăng tỉ lệ**\n\n` +

                    `Chọn danh mục bên dưới để xem vật phẩm.\n\n` +

                    `୨୧ ───────────── ୨୧`

                )

                .setFooter({

                    text:
                        "✦ Fishing Adventure · Shop"

                })

                .setTimestamp();

        // ==================================================
        // 🔘 BUTTONS
        // ==================================================

        const row =
            new ActionRowBuilder()

                .addComponents(

                    new ButtonBuilder()

                        .setCustomId(
                            "shop_rod"
                        )

                        .setLabel(
                            "Cần câu"
                        )

                        .setEmoji(
                            "🎣"
                        )

                        .setStyle(
                            ButtonStyle.Primary
                        ),

                    new ButtonBuilder()

                        .setCustomId(
                            "shop_bait"
                        )

                        .setLabel(
                            "Mồi câu"
                        )

                        .setEmoji(
                            "🪱"
                        )

                        .setStyle(
                            ButtonStyle.Success
                        ),

                    new ButtonBuilder()

                        .setCustomId(
                            "shop_key"
                        )

                        .setLabel(
                            "Chìa khóa"
                        )

                        .setEmoji(
                            "🎟️"
                        )

                        .setStyle(
                            ButtonStyle.Secondary
                        ),

                    new ButtonBuilder()

                        .setCustomId(
                            "shop_stone"
                        )

                        .setLabel(
                            "Đá tăng tỉ lệ"
                        )

                        .setEmoji(
                            "🪨"
                        )

                        .setStyle(
                            ButtonStyle.Secondary
                        )

                );

        // ==================================================
        // 📤 SEND
        // ==================================================

        return message.reply({

            embeds: [
                embed
            ],

            components: [
                row
            ]

        });

    }

};
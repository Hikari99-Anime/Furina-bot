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
// SHOP COMMAND
// ======================================================

module.exports = {

    name: "shop",

    aliases: [
        "cuahang",
        "shopca"
    ],

    async execute(message) {

        // ==================================================
        // USER
        // ==================================================

        const user =
            getUser(
                message.author.id
            );

        const balance =
            Number(
                user?.money || 0
            );


        // ==================================================
        // EMBED
        // ==================================================

        const embed =
            new EmbedBuilder()

                .setColor(
                    "#7DD3FC"
                )

                .setAuthor({

                    name:
                        `${message.author.username} · Fishing Shop`,

                    iconURL:
                        message.author.displayAvatarURL({
                            extension: "png",
                            size: 128
                        })

                })

                .setTitle(
                    "🛒 `FISHING MARKET`"
                )

                .setDescription(

                    `୨୧ ───────── ୨୧\n\n` +

                    `Chào mừng đến với cửa hàng của ngư dân.\n` +
                    `Hãy chọn danh mục bạn muốn xem.\n\n` +

                    `💰 Số dư: **${balance.toLocaleString()} Fcoin** ${emoji.money}\n\n` +

                    `୨୧ ───────── ୨୧\n\n` +

                    `🎣 Cần câu\n` +
                    `> Trang bị và nâng cấp cần câu.\n\n` +

                    `🪱 Mồi câu\n` +
                    `> Hỗ trợ tăng cơ hội câu cá.\n\n` +

                    `🎟️ Chìa khóa & Bảo hiểm\n` +
                    `> Vật phẩm đặc biệt và bảo vệ cần câu.\n\n` +

                    `🪨 Đá tăng tỉ lệ\n` +
                    `> Hỗ trợ cường hóa và tăng Luck.\n\n` +

                    `୨୧ ───────── ୨୧`

                )

                .setFooter({

                    text:
                        "✦ Fishing Adventure · Shop"

                })

                .setTimestamp();


        // ==================================================
        // BUTTON
        // ==================================================

        const row =
            new ActionRowBuilder()

                .addComponents(

                    // ======================================
                    // CẦN CÂU
                    // ======================================

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


                    // ======================================
                    // MỒI CÂU
                    // ======================================

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


                    // ======================================
                    // CHÌA KHÓA
                    // ======================================

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


                    // ======================================
                    // ĐÁ TĂNG TỈ LỆ
                    // ======================================

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
        // SEND
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
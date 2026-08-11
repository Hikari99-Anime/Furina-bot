const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const {
    prefix
} = require("../../config");

// ======================================================
// STYLE
// ======================================================

const SEPARATOR =
    "୨୧ ───────── ୨୧";

const FOOTER =
    "✦ Fishing Adventure · Furina's Blessing";

// ======================================================
// MODULE
// ======================================================

module.exports = {

    name: "help",

    aliases: [
        "h",
        "menu"
    ],

    async execute(message) {

        // ==================================================
        // PAGES
        // ==================================================

        const pages = [

            // ==================================================
            // TRANG 1 · CÂU CÁ
            // ==================================================

            new EmbedBuilder()

                .setColor("#8ed8ff")

                .setTitle(
                    "🌊 FISHING ADVENTURE"
                )

                .setDescription(

                    `${SEPARATOR}\n\n` +

                    `🎣 CÂU CÁ\n\n` +

                    `${prefix}fish [số lần] · Câu cá\n` +
                    `${prefix}rod · Xem / trang bị cần\n` +
                    `${prefix}upgrade · Cường hóa cần\n` +
                    `${prefix}repair · Sửa chữa cần\n` +
                    `${prefix}zone · Xem khu vực câu\n\n` +

                    `${SEPARATOR}\n\n` +

                    `👤 NGƯỜI CHƠI\n\n` +

                    `${prefix}profile · Xem hồ sơ\n` +
                    `${prefix}top · Bảng xếp hạng\n` +
                    `${prefix}gold · Xem số dư\n` +
                    `${prefix}givemoney @user <số tiền> · Chuyển xu\n\n` +

                    `${SEPARATOR}\n\n` +

                    `✨ Furina chúc bạn may mắn,\n` +
                    `và câu được thật nhiều cá hiếm!`

                )

                .setFooter({
                    text:
                        `${FOOTER} · Trang 1/4`
                })

                .setTimestamp(),


            // ==================================================
            // TRANG 2 · CỬA HÀNG
            // ==================================================

            new EmbedBuilder()

                .setColor("#9debc4")

                .setTitle(
                    "🛒 CỬA HÀNG & KHO ĐỒ"
                )

                .setDescription(

                    `${SEPARATOR}\n\n` +

                    `🛒 CỬA HÀNG\n\n` +

                    `${prefix}shop · Xem cửa hàng và mua vật phẩm\n\n` +

                    `🎒 KHO ĐỒ\n\n` +

                    `${prefix}inventory · Xem kho\n` +
                    `${prefix}bag · Xem kho\n` +
                    `${prefix}sell [tên cá] · Bán cá\n` +
                    `${prefix}sell all · Bán toàn bộ cá\n\n` +

                    `🛡️ BẢO HIỂM\n\n` +

                    `Vé bảo hiểm giúp bảo vệ cần\n` +
                    `khi cường hóa thất bại.\n\n` +

                    `${SEPARATOR}\n\n` +

                    `💰 Bán cá để kiếm xu,\n` +
                    `sau đó nâng cấp hành trang của bạn.\n\n` +

                    `✨ Furina chúc bạn luôn có thật nhiều Fcoin!`

                )

                .setFooter({
                    text:
                        `${FOOTER} · Trang 2/4`
                })

                .setTimestamp(),


            // ==================================================
            // TRANG 3 · NGƯỜI CHƠI
            // ==================================================

            new EmbedBuilder()

                .setColor("#ffd98a")

                .setTitle(
                    "👤 NGƯỜI CHƠI & HOẠT ĐỘNG"
                )

                .setDescription(

                    `${SEPARATOR}\n\n` +

                    `👤 NGƯỜI CHƠI\n\n` +

                    `${prefix}profile · Xem hồ sơ\n` +
                    `${prefix}top · Bảng xếp hạng\n` +
                    `${prefix}givemoney @user [số tiền] · Chuyển xu\n\n` +

                    `🎁 HOẠT ĐỘNG\n\n` +

                    `${prefix}daily · Nhận thưởng hằng ngày\n` +
                    `${prefix}quest · Xem nhiệm vụ\n` +
                    `${prefix}open [rương] · Mở rương\n\n` +

                    `🏆 XẾP HẠNG\n\n` +

                    `${prefix}top money · BXH tiền\n` +
                    `${prefix}top fish · BXH số cá\n` +
                    `${prefix}top kg · BXH cân nặng\n\n` +

                    `🌍 KHU VỰC\n\n` +

                    `${prefix}zone · Xem khu vực hiện tại\n\n` +

                    `${SEPARATOR}\n\n` +

                    `💙 Chúc bạn có một chuyến câu thật thuận lợi!`

                )

                .setFooter({
                    text:
                        `${FOOTER} · Trang 3/4`
                })

                .setTimestamp(),


            // ==================================================
            // TRANG 4 · MINI GAME
            // ==================================================

            new EmbedBuilder()

                .setColor("#c6a7ff")

                .setTitle(
                    "🎮 MINI-GAME & THÔNG TIN"
                )

                .setDescription(

                    `${SEPARATOR}\n\n` +

                    `🔗 NỐI TỪ\n\n` +

                    `${prefix}noitu vi · Nối từ tiếng Việt\n` +
                    `${prefix}noitu en · Word chain tiếng Anh\n\n` +

                    `💰 PHẦN THƯỞNG\n\n` +

                    `Nối đúng · +300 xu\n` +
                    `Dead-end · +1.000 xu\n` +
                    `Hết đường nối · Tạo round mới\n\n` +

                    `🎲 CỜ BẠC\n\n` +

                    `${prefix}taixiu · Tài xỉu\n` +
                    `${prefix}xidach <tiền cược> · Xì dách\n` +
                    `${prefix}tdx n/s <tiền cược> · Tung đồng xu\n\n` +

                    `🖼️ ẢNH\n\n` +

                    `${prefix}danbooru [tag] · Ảnh phổ biến Danbooru\n\n` +

                    `🛑 ADMIN\n\n` +

                    `${prefix}noitu stop · Dừng mini-game\n` +
                    `${prefix}danbooruauto on/off/now/status · Auto-post ảnh Danbooru\n\n` +

                    `${SEPARATOR}\n\n` +

                    `✨ Furina chúc bạn may mắn\n` +
                    `và mang về thật nhiều Fcoin!`

                )

                .setFooter({
                    text:
                        `${FOOTER} · Trang 4/4`
                })

                .setTimestamp()

        ];


        // ==================================================
        // PAGE HIỆN TẠI
        // ==================================================

        let page = 0;


        // ==================================================
        // TẠO BUTTON
        // ==================================================

        function getRow() {

            return new ActionRowBuilder()

                .addComponents(

                    // ==============================
                    // TRANG TRƯỚC
                    // ==============================

                    new ButtonBuilder()

                        .setCustomId(
                            `help_prev_${message.author.id}`
                        )

                        .setLabel(
                            "◀"
                        )

                        .setStyle(
                            ButtonStyle.Secondary
                        )

                        .setDisabled(
                            page === 0
                        ),


                    // ==============================
                    // TRANG SAU
                    // ==============================

                    new ButtonBuilder()

                        .setCustomId(
                            `help_next_${message.author.id}`
                        )

                        .setLabel(
                            "▶"
                        )

                        .setStyle(
                            ButtonStyle.Primary
                        )

                        .setDisabled(
                            page === pages.length - 1
                        )

                );

        }


        // ==================================================
        // GỬI HELP
        // ==================================================

        const msg =
            await message.reply({

                embeds: [
                    pages[page]
                ],

                components: [
                    getRow()
                ]

            });


        // ==================================================
        // COLLECTOR
        // ==================================================

        const collector =
            msg.createMessageComponentCollector({

                time: 120000

            });


        // ==================================================
        // BUTTON COLLECT
        // ==================================================

        collector.on(
            "collect",
            async interaction => {

                // ==========================================
                // CHECK USER
                // ==========================================

                if (
                    interaction.user.id !==
                    message.author.id
                ) {

                    return interaction.reply({

                        content:
                            "❌ Đây không phải bảng trợ giúp của bạn.",

                        ephemeral: true

                    });

                }


                // ==========================================
                // TRANG TRƯỚC
                // ==========================================

                if (
                    interaction.customId ===
                    `help_prev_${message.author.id}`
                ) {

                    page--;

                }


                // ==========================================
                // TRANG SAU
                // ==========================================

                if (
                    interaction.customId ===
                    `help_next_${message.author.id}`
                ) {

                    page++;

                }


                // ==========================================
                // GIỚI HẠN
                // ==========================================

                page =
                    Math.max(
                        0,
                        Math.min(
                            pages.length - 1,
                            page
                        )
                    );


                // ==========================================
                // UPDATE
                // ==========================================

                return interaction.update({

                    embeds: [
                        pages[page]
                    ],

                    components: [
                        getRow()
                    ]

                });

            }
        );


        // ==================================================
        // HẾT THỜI GIAN
        // ==================================================

        collector.on(
            "end",
            async () => {

                try {

                    await msg.edit({

                        components: []

                    });

                } catch {}

            }
        );

    }

};
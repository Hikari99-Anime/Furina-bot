const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const {
    prefix
} = require("../../config");

module.exports = {

    name: "help",

    aliases: [
        "h",
        "menu"
    ],

    async execute(message) {

        const pages = [

            // ==========================
            // TRANG 1 · CÂU CÁ
            // ==========================

            new EmbedBuilder()
                .setColor("#7cc7ff")
                .setTitle("🌊 FISHING ADVENTURE")
                .setDescription(
                    `🎣 CÂU CÁ\n\n` +

                    `${prefix}fish [số lần] · Câu cá\n` +
                    `${prefix}rod · Xem / trang bị cần\n` +
                    `${prefix}upgrade · Cường hóa cần\n` +
                    `${prefix}repair · Sửa chữa cần\n` +
                    `${prefix}zone · Xem khu vực câu\n\n` +

                    `💡 Ví dụ\n` +
                    `${prefix}fish 10\n` +
                    `Câu 10 lần và tiêu hao 10 độ bền.\n\n` +

                    `🔧 Sửa cần\n` +
                    `Độ bền càng thấp → phí sửa càng cao.\n` +
                    `Cần gãy → phí sửa rất cao.\n\n` +

                    `✨ Cường hóa\n` +
                    `+5 trở lên có nguy cơ giảm cấp.\n` +
                    `+10 trở lên có thể làm gãy cần khi thất bại.\n` +
                    `🎫 Vé bảo hiểm có thể bảo vệ cần.`
                )
                .setFooter({
                    text: "Fishing Adventure · Trang 1/4"
                }),


            // ==========================
            // TRANG 2 · CỬA HÀNG
            // ==========================

            new EmbedBuilder()
                .setColor("#8affb2")
                .setTitle("🛒 CỬA HÀNG & KHO ĐỒ")
                .setDescription(
                    `🛒 CỬA HÀNG\n\n` +

                    `${prefix}shop · Xem cửa hàng\n` +
                    `${prefix}buy [id] · Mua vật phẩm\n\n` +

                    `🎒 KHO ĐỒ\n\n` +

                    `${prefix}inventory · Xem kho\n` +
                    `${prefix}bag · Xem kho\n` +
                    `${prefix}sell [tên cá] · Bán cá\n` +
                    `${prefix}sell all · Bán toàn bộ cá\n\n` +

                    `🎫 BẢO HIỂM\n\n` +

                    `Vé bảo hiểm dùng để bảo vệ cần ` +
                    `khi cường hóa thất bại có rủi ro.\n\n` +

                    `💰 Mẹo\n` +
                    `Bán cá để kiếm xu và nâng cấp trang bị.`
                )
                .setFooter({
                    text: "Fishing Adventure · Trang 2/4"
                }),


            // ==========================
            // TRANG 3 · NGƯỜI CHƠI
            // ==========================

            new EmbedBuilder()
                .setColor("#ffd166")
                .setTitle("👤 NGƯỜI CHƠI & HOẠT ĐỘNG")
                .setDescription(
                    `👤 NGƯỜI CHƠI\n\n` +

                    `${prefix}profile · Xem hồ sơ\n` +
                    `${prefix}top · Bảng xếp hạng\n` +
                    `${prefix}givemoney @user [số tiền] · Chuyển xu\n\n` +

                    `🎁 HOẠT ĐỘNG\n\n` +

                    `${prefix}daily · Nhận thưởng hằng ngày\n` +
                    `${prefix}quest · Xem nhiệm vụ\n` +
                    `${prefix}open [rương] · Mở rương\n\n` +

                    `🏆 BẢNG XẾP HẠNG\n\n` +

                    `${prefix}top money · BXH tiền\n` +
                    `${prefix}top fish · BXH số cá\n` +
                    `${prefix}top kg · BXH cân nặng\n\n` +

                    `🌍 KHU VỰC\n\n` +

                    `${prefix}zone · Xem khu vực hiện tại`
                )
                .setFooter({
                    text: "Fishing Adventure · Trang 3/4"
                }),


            // ==========================
            // TRANG 4 · MINI-GAME
            // ==========================

            new EmbedBuilder()
                .setColor("#c59cff")
                .setTitle("🎮 MINI-GAME & THÔNG TIN")
                .setDescription(
                    `🔗 NỐI TỪ\n\n` +

                    `${prefix}noitu vi · Nối từ tiếng Việt\n` +
                    `${prefix}noitu en · Word chain tiếng Anh\n\n` +

                    `💰 PHẦN THƯỞNG\n\n` +

                    `Nối đúng → +300 xu\n` +
                    `Dead-end → +1.000 xu\n` +
                    `Hết đường nối → tự tạo round mới\n\n` +

                    `🔄 ROUND\n\n` +

                    `Round tự đếm và reset mỗi 10.\n` +
                    `Mini-game không tự dừng.\n\n` +

                    `🛑 ADMIN\n\n` +

                    `${prefix}noitu stop · Dừng mini-game\n\n` +

                    `💡 Mẹo\n` +
                    `Cần tốt → câu nhanh hơn.\n` +
                    `Độ bền thấp → sửa trước khi câu tiếp.\n` +
                    `Cường hóa cao → nên cân nhắc vé bảo hiểm.`
                )
                .setFooter({
                    text: "Fishing Adventure · Trang 4/4"
                })
        ];


        let page = 0;


        // ==========================
        // NÚT CHUYỂN TRANG
        // ==========================

        function getRow() {

            return new ActionRowBuilder()
                .addComponents(

                    new ButtonBuilder()
                        .setCustomId(
                            `help_prev_${message.author.id}`
                        )
                        .setLabel("◀")
                        .setStyle(
                            ButtonStyle.Secondary
                        )
                        .setDisabled(
                            page === 0
                        ),

                    new ButtonBuilder()
                        .setCustomId(
                            `help_next_${message.author.id}`
                        )
                        .setLabel("▶")
                        .setStyle(
                            ButtonStyle.Primary
                        )
                        .setDisabled(
                            page === pages.length - 1
                        )
                );
        }


        // ==========================
        // GỬI MENU
        // ==========================

        const msg =
            await message.reply({

                embeds: [
                    pages[page]
                ],

                components: [
                    getRow()
                ]

            });


        // ==========================
        // COLLECTOR
        // ==========================

        const collector =
            msg.createMessageComponentCollector({
                time: 120000
            });


        collector.on(
            "collect",
            async interaction => {

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


                if (
                    interaction.customId ===
                    `help_prev_${message.author.id}`
                ) {

                    page--;

                }


                if (
                    interaction.customId ===
                    `help_next_${message.author.id}`
                ) {

                    page++;

                }


                page =
                    Math.max(
                        0,
                        Math.min(
                            pages.length - 1,
                            page
                        )
                    );


                await interaction.update({

                    embeds: [
                        pages[page]
                    ],

                    components: [
                        getRow()
                    ]

                });

            }
        );


        // ==========================
        // HẾT THỜI GIAN
        // ==========================

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

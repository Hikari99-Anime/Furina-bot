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

module.exports = {
    name: "shop",

    aliases: [
        "cuahang",
        "shopca"
    ],

    async execute(message) {

        const user =
            getUser(
                message.author.id
            );

        const balance =
            user.money ?? 0;

        const embed =
            new EmbedBuilder()
                .setColor("#7DD3FC")
                .setTitle(
                    "🛒 `FISHING MARKET`"
                )
                .setDescription(
                    `*Nơi chuẩn bị mọi thứ cần thiết cho hành trình trên biển.*\n` +
                    `*Lựa chọn trang bị phù hợp và bắt đầu chuyến câu.*\n\n` +

                    `> 💰 **Số dư:** ${emoji.money} ${balance.toLocaleString()} Fcoin\n\n` +

                    `🎣 **Cần câu** · Tăng sức mạnh câu cá\n` +
                    `🪱 **Mồi câu** · Tăng cơ hội câu cá hiếm\n` +
                    `🎟️ **Chìa khóa & Bảo hiểm** · Mở rương, bảo vệ cần\n\n` +

                    `✦ *Chọn danh mục bên dưới để xem vật phẩm.*`
                )
                .setFooter({
                    text:
                        "✦ Ocean Adventure"
                });

        const row =
            new ActionRowBuilder()
                .addComponents(

                    new ButtonBuilder()
                        .setCustomId(
                            "shop_rod"
                        )
                        .setLabel(
                            "🎣 Cần câu"
                        )
                        .setStyle(
                            ButtonStyle.Primary
                        ),

                    new ButtonBuilder()
                        .setCustomId(
                            "shop_bait"
                        )
                        .setLabel(
                            "🪱 Mồi câu"
                        )
                        .setStyle(
                            ButtonStyle.Success
                        ),

                    new ButtonBuilder()
                        .setCustomId(
                            "shop_key"
                        )
                        .setLabel(
                            "🎟️ Chìa khóa & Bảo hiểm"
                        )
                        .setStyle(
                            ButtonStyle.Secondary
                        )
                );

        await message.reply({
            embeds: [
                embed
            ],
            components: [
                row
            ]
        });
    }
};
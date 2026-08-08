const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const {
    rods,
    rodTitles
} = require("../../config");

const {
    getUser,
    save
} = require("../../data");

module.exports = {
    name: "rod",

    aliases: [
        "can",
        "cancau"
    ],

    async execute(message) {

        const user =
            getUser(
                message.author.id
            );

        const list =
            Object.keys(
                user.can.danhSach || {}
            );

        if (!list.length)
            return message.reply({
                content:
                    "╰・❌ Bạn chưa có cần câu"
            });

        let text = "";

        for (const id of list) {

            const base =
                rods[id];

            const rod =
                user.rodData[id];

            if (!rod)
                continue;

            const active =
                user.can.dangDung === id
                    ? "🟢"
                    : "🔴";

            let title = "";

            if (rodTitles[rod.level])
                title =
                    ` · ${rodTitles[rod.level]}`;

            text +=
                `${active} ${base.emoji} ${base.name} \`+${rod.level}\` \`L${rod.luck}\` \`${rod.uses}/${rod.maxUses}\`${title}\n`;
        }

        const row =
            new ActionRowBuilder();

        for (
            const id of list.slice(0, 5)
        ) {

            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(
                        "equip_" + id
                    )
                    .setLabel(
                        rods[id].name
                    )
                    .setStyle(
                        ButtonStyle.Primary
                    )
            );
        }

        const currentRod =
            rods[user.can.dangDung]
                ? rods[user.can.dangDung].name
                : "Chưa có";

        const msg =
            await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(
                            "#89ddff"
                        )
                        .setTitle(
                            "🎣 `ROD COLLECTION`"
                        )
                        .setDescription(
                            `*Kho cần câu đồng hành cùng bạn trên mọi vùng biển.*\n` +
                            `*Mỗi cây cần mang một sức mạnh riêng.*\n\n` +

                            `${text}\n` +

                            `✦ 🟢 Đang trang bị · 🔴 Chưa trang bị\n\n` +

                            `*Chọn cần bên dưới để bắt đầu hành trình.*`
                        )
                        .setFooter({
                            text:
                                "✦ Fishing Adventure"
                        })
                ],
                components: [
                    row
                ]
            });

        const collector =
            msg.createMessageComponentCollector({
                time: 60000
            });

        collector.on(
            "collect",
            async interaction => {

                if (
                    interaction.user.id !==
                    message.author.id
                )
                    return interaction.reply({
                        content:
                            "╰・❌ Đây không phải cần của bạn",
                        ephemeral: true
                    });

                const id =
                    interaction.customId.replace(
                        "equip_",
                        ""
                    );

                if (
                    !user.can.danhSach[id]
                )
                    return interaction.reply({
                        content:
                            "╰・❌ Bạn chưa sở hữu cần này",
                        ephemeral: true
                    });

                user.can.dangDung =
                    id;

                save();

                const rod =
                    user.rodData[id];

                interaction.update({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(
                                "#a8ffb8"
                            )
                            .setTitle(
                                "🎣 `ROD EQUIPPED`"
                            )
                            .setDescription(
                                `${rods[id].emoji} ${rods[id].name} \`+${rod.level}\` \`L${rod.luck}\` \`${rod.uses}/${rod.maxUses}\`\n\n` +
                                `🟢 *Cần câu đã được trang bị.*\n` +
                                `*Sẵn sàng cho chuyến câu tiếp theo.*`
                            )
                            .setFooter({
                                text:
                                    "✦ Fishing Adventure"
                            })
                    ]
                });
            }
        );
    }
};
const {
    EmbedBuilder
} = require("discord.js");

const {
    emoji,
    formatMoney
} = require("../../config");

const {
    data
} = require("../../data");


module.exports = {

    name: "top",

    aliases: [
        "leaderboard",
        "bxh"
    ],

    async execute(message, args) {

        const type =
            (args[0] || "money").toLowerCase();


        // ==================================================
        // KIỂM TRA LOẠI BXH
        // ==================================================

        if (
            ![
                "money",
                "fish",
                "kg"
            ].includes(type)
        ) {

            return message.reply(
                "╰・❌ Loại BXH không hợp lệ. Dùng: `top money`, `top fish`, `top kg`"
            );

        }


        // ==================================================
        // TÍNH DỮ LIỆU
        // ==================================================

        const list = [];

        for (
            const id in data
        ) {

            const user =
                data[id];

            let value = 0;


            if (
                type === "fish"
            ) {

                for (
                    const id in (
                        user.fish || {}
                    )
                ) {

                    value +=
                        user.fish[id]?.length || 0;

                }

            }

            else if (
                type === "kg"
            ) {

                for (
                    const id in (
                        user.fish || {}
                    )
                ) {

                    value +=
                        (
                            user.fish[id] || []
                        ).reduce(
                            (a, b) =>
                                a + b,
                            0
                        );

                }

            }

            else {

                value =
                    user.money || 0;

            }


            list.push({
                id,
                value
            });

        }


        // ==================================================
        // XẾP HẠNG
        // ==================================================

        list.sort(
            (a, b) =>
                b.value - a.value
        );


        const top =
            list.slice(
                0,
                10
            );


        // ==================================================
        // ICON TOP
        // ==================================================

        const rankIcon = [
            "🥇",
            "🥈",
            "🥉"
        ];


        // ==================================================
        // DANH SÁCH
        // ==================================================

        let text = "";

        for (
            let i = 0;
            i < top.length;
            i++
        ) {

            const player =
                top[i];


            const member =
                await message.guild.members
                    .fetch(player.id)
                    .catch(
                        () => null
                    );


            const name =
                member
                    ? member.user.username
                    : "Người chơi";


            let value;


            if (
                type === "kg"
            ) {

                value =
                    `${player.value.toFixed(2)} KG`;

            }

            else if (
                type === "fish"
            ) {

                value =
                    `${player.value} con`;

            }

            else {

                value =
                    `${formatMoney(player.value)} ${emoji.money}`;

            }


            const rank =
                rankIcon[i] ||
                `#${i + 1}`;


            text +=
                `${rank} ${name}\n` +
                `╰・${value}\n\n`;

        }


        // ==================================================
        // TIÊU ĐỀ
        // ==================================================

        const title =

            type === "fish"
                ? "🐟 BXH CÂU CÁ"

                : type === "kg"
                    ? "⚖️ BXH CÂN NẶNG"

                    : "💰 BXH GIÀU CÓ";


        // ==================================================
        // EMBED
        // ==================================================

        const embed =
            new EmbedBuilder()

                .setColor(
                    "#ffd43b"
                )

                .setTitle(
                    title
                )

                .setDescription(
                    text ||
                    "╰・Chưa có dữ liệu"
                )

                .setFooter({
                    text:
                        "✦ Fishing Adventure · Leaderboard"
                })

                .setTimestamp();


        return message.reply({

            embeds: [
                embed
            ]

        });

    }

};
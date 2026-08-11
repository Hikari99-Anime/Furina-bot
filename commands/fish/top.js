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


// ======================================================
// MODULE
// ======================================================

module.exports = {

    name: "top",

    aliases: [
        "leaderboard",
        "bxh"
    ],

    async execute(message, args) {

        // ==================================================
        // TYPE
        // ==================================================

        const type =
            String(
                args?.[0] || "money"
            ).toLowerCase();


        // ==================================================
        // KIỂM TRA
        // ==================================================

        if (
            ![
                "money",
                "fish",
                "kg"
            ].includes(type)
        ) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor("#ff6b81")

                        .setTitle(
                            "❌ `INVALID TYPE`"
                        )

                        .setDescription(

                            "Loại BXH không hợp lệ.\n\n" +

                            "୨୧ ───────── ୨୧\n\n" +

                            `💰 \`${"top money"}\` · Giàu có\n` +
                            `🐟 \`${"top fish"}\` · Số cá\n` +
                            `⚖️ \`${"top kg"}\` · Cân nặng\n\n` +

                            "୨୧ ───────── ୨୧"

                        )

                        .setFooter({

                            text:
                                "✦ Fishing Adventure · Leaderboard"

                        })

                ]

            });

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


            // ==============================================
            // MONEY
            // ==============================================

            if (
                type === "money"
            ) {

                value =
                    Number(
                        user.money || 0
                    );

            }


            // ==============================================
            // FISH
            // ==============================================

            else if (
                type === "fish"
            ) {

                for (
                    const fishId in (
                        user.fish || {}
                    )
                ) {

                    const fishes =
                        user.fish[fishId];

                    if (
                        Array.isArray(fishes)
                    ) {

                        value +=
                            fishes.length;

                    }

                }

            }


            // ==============================================
            // KG
            // ==============================================

            else if (
                type === "kg"
            ) {

                for (
                    const fishId in (
                        user.fish || {}
                    )
                ) {

                    const fishes =
                        user.fish[fishId];

                    if (
                        !Array.isArray(fishes)
                    ) {
                        continue;
                    }

                    for (
                        const weight of fishes
                    ) {

                        const kg =
                            Number(weight);

                        if (
                            Number.isFinite(kg)
                        ) {

                            value +=
                                kg;

                        }

                    }

                }

            }


            // ==============================================
            // PUSH
            // ==============================================

            list.push({

                id,

                value

            });

        }


        // ==================================================
        // SORT
        // ==================================================

        list.sort(
            (a, b) =>
                b.value -
                a.value
        );


        // ==================================================
        // TOP 10
        // ==================================================

        const top =
            list
                .filter(
                    x =>
                        x.value > 0
                )
                .slice(
                    0,
                    10
                );


        // ==================================================
        // ICON
        // ==================================================

        const rankIcon = [

            "🥇",
            "🥈",
            "🥉"

        ];


        // ==================================================
        // TITLE
        // ==================================================

        let title;

        let subtitle;


        if (
            type === "fish"
        ) {

            title =
                "🐟 `FISH LEADERBOARD`";

            subtitle =
                "Những người câu được nhiều cá nhất.";

        }

        else if (
            type === "kg"
        ) {

            title =
                "⚖️ `WEIGHT LEADERBOARD`";

            subtitle =
                "Những người sở hữu tổng cân nặng cá lớn nhất.";

        }

        else {

            title =
                "💰 `MONEY LEADERBOARD`";

            subtitle =
                "Những người chơi giàu có nhất.";

        }


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


            // ==============================================
            // MEMBER
            // ==============================================

            const member =
                await message.guild.members
                    .fetch(
                        player.id
                    )
                    .catch(
                        () => null
                    );


            const name =
                member
                    ? member.user.username
                    : "Người chơi";


            // ==============================================
            // VALUE
            // ==============================================

            let value;


            if (
                type === "money"
            ) {

                value =
                    `${formatMoney(
                        player.value
                    )} ${emoji.money}`;

            }

            else if (
                type === "fish"
            ) {

                value =
                    `${player.value} con`;

            }

            else {

                value =
                    `${player.value.toFixed(2)} KG`;

            }


            // ==============================================
            // RANK
            // ==============================================

            const rank =
                rankIcon[i] ||
                `\`#${i + 1}\``;


            // ==============================================
            // TEXT
            // ==============================================

            text +=

                `${rank} **${name}**\n` +

                `╰・${value}\n\n`;

        }


        // ==================================================
        // KHÔNG CÓ DATA
        // ==================================================

        if (!text) {

            text =
                "╰・Chưa có dữ liệu BXH.";

        }


        // ==================================================
        // EMBED
        // ==================================================

        const embed =
            new EmbedBuilder()

                .setColor(
                    "#FFD43B"
                )

                .setTitle(
                    title
                )

                .setDescription(

                    `*${subtitle}*\n\n` +

                    "୨୧ ───────── ୨୧\n\n" +

                    text +

                    "୨୧ ───────── ୨୧"

                )

                .setFooter({

                    text:
                        "✦ Fishing Adventure · Leaderboard"

                })

                .setTimestamp();


        // ==================================================
        // REPLY
        // ==================================================

        return message.reply({

            embeds: [
                embed
            ]

        });

    }

};
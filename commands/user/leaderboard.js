const {
    EmbedBuilder
} = require("discord.js");

const {
    emoji,
    formatMoney,
    prefix
} = require("../../config");

const {
    data
} = require("../../data");

module.exports = {

    name: "leaderboard",

    aliases: [
        "top",
        "bxh"
    ],

    async execute(message, args) {

        try {

            // ==================================================
            // LOẠI BXH
            // ==================================================

            const type =
                String(args[0] || "money")
                    .trim()
                    .toLowerCase();


            // ==================================================
            // LẤY TOÀN BỘ USER
            // ==================================================

            const users = [];


            for (
                const guildId in data
            ) {

                const guildData =
                    data[guildId];

                if (
                    !guildData ||
                    typeof guildData !== "object"
                ) {
                    continue;
                }


                for (
                    const userId in guildData
                ) {

                    const user =
                        guildData[userId];

                    if (
                        !user ||
                        typeof user !== "object"
                    ) {
                        continue;
                    }


                    users.push({

                        id: userId,

                        user: user

                    });

                }

            }


            // ==================================================
            // KHÔNG CÓ DỮ LIỆU
            // ==================================================

            if (!users.length) {

                return message.reply({

                    embeds: [

                        createEmbed(

                            "#A7D8F5",

                            "🏆 BẢNG XẾP HẠNG",

                            "Hiện chưa có dữ liệu người chơi."

                        )

                    ]

                });

            }


            // ==================================================
            // HÀM LẤY USERNAME DISCORD
            // ==================================================

            const getUsername =
                async userId => {

                    try {

                        const discordUser =
                            await message.client.users.fetch(
                                userId
                            );

                        return (
                            discordUser.username ||
                            discordUser.globalName ||
                            `User ${userId}`
                        );

                    }
                    catch {

                        return `User ${userId}`;

                    }

                };


            // ==================================================
            // BXH TIỀN
            // ==================================================

            if (
                type === "money" ||
                type === "coin" ||
                type === "xu"
            ) {

                users.sort(
                    (a, b) => {

                        const moneyA =
                            Number(
                                a.user.money || 0
                            );

                        const moneyB =
                            Number(
                                b.user.money || 0
                            );

                        return moneyB - moneyA;

                    }
                );


                const topUsers =
                    users.slice(0, 10);


                const text =
                    (
                        await Promise.all(

                            topUsers.map(
                                async (x, index) => {

                                    const username =
                                        await getUsername(
                                            x.id
                                        );

                                    const money =
                                        Number(
                                            x.user.money || 0
                                        );


                                    return (

                                        `${getRank(index)} **${escapeMarkdown(username)}**\n` +

                                        `└ 💰 ${formatMoney(money)} ${emoji.money}`

                                    );

                                }
                            )

                        )
                    ).join("\n\n");


                return sendLeaderboard(

                    message,

                    "#FFD86B",

                    "💰 BẢNG XẾP HẠNG ĐẠI GIA",

                    text

                );

            }


            // ==================================================
            // BXH CƯỜNG HÓA
            // ==================================================

            if (
                type === "rod" ||
                type === "can"
            ) {

                const getRodLevel =
                    user => {

                        let level = 0;


                        const rods =
                            user.rodData || {};


                        if (
                            typeof rods !== "object"
                        ) {
                            return 0;
                        }


                        for (
                            const rodId in rods
                        ) {

                            const rod =
                                rods[rodId];


                            const rodLevel =
                                Number(
                                    rod?.level || 0
                                );


                            level =
                                Math.max(
                                    level,
                                    rodLevel
                                );

                        }


                        return level;

                    };


                users.sort(
                    (a, b) =>
                        getRodLevel(b.user) -
                        getRodLevel(a.user)
                );


                const topUsers =
                    users.slice(0, 10);


                const text =
                    (
                        await Promise.all(

                            topUsers.map(
                                async (x, index) => {

                                    const username =
                                        await getUsername(
                                            x.id
                                        );

                                    const level =
                                        getRodLevel(
                                            x.user
                                        );


                                    return (

                                        `${getRank(index)} **${escapeMarkdown(username)}**\n` +

                                        `└ 🎣 Cần câu: +${level}`

                                    );

                                }
                            )

                        )
                    ).join("\n\n");


                return sendLeaderboard(

                    message,

                    "#89DDFF",

                    "🎣 BẢNG XẾP HẠNG CƯỜNG HÓA",

                    text

                );

            }


            // ==================================================
            // BXH SỐ CÁ
            // ==================================================

            if (
                type === "fish" ||
                type === "ca"
            ) {

                const getFishCount =
                    user => {

                        let count = 0;


                        const fish =
                            user.fish || {};


                        if (
                            typeof fish !== "object"
                        ) {
                            return 0;
                        }


                        for (
                            const fishId in fish
                        ) {

                            const list =
                                fish[fishId];


                            if (
                                Array.isArray(list)
                            ) {

                                count +=
                                    list.length;

                            }
                            else if (
                                typeof list === "number"
                            ) {

                                count +=
                                    list;

                            }

                        }


                        return count;

                    };


                users.sort(
                    (a, b) =>
                        getFishCount(b.user) -
                        getFishCount(a.user)
                );


                const topUsers =
                    users.slice(0, 10);


                const text =
                    (
                        await Promise.all(

                            topUsers.map(
                                async (x, index) => {

                                    const username =
                                        await getUsername(
                                            x.id
                                        );

                                    const count =
                                        getFishCount(
                                            x.user
                                        );


                                    return (

                                        `${getRank(index)} **${escapeMarkdown(username)}**\n` +

                                        `└ 🐟 ${count.toLocaleString()} con cá`

                                    );

                                }
                            )

                        )
                    ).join("\n\n");


                return sendLeaderboard(

                    message,

                    "#8AFFB2",

                    "🐟 BẢNG XẾP HẠNG NGƯ DÂN",

                    text

                );

            }


            // ==================================================
            // BXH CÂN NẶNG
            // ==================================================

            if (
                type === "kg" ||
                type === "weight" ||
                type === "weightfish"
            ) {

                const getWeight =
                    user => {

                        let weight = 0;


                        const fish =
                            user.fish || {};


                        if (
                            typeof fish !== "object"
                        ) {
                            return 0;
                        }


                        for (
                            const fishId in fish
                        ) {

                            const list =
                                fish[fishId];


                            if (
                                Array.isArray(list)
                            ) {

                                for (
                                    const value
                                    of list
                                ) {

                                    weight +=
                                        Number(
                                            value
                                        ) || 0;

                                }

                            }

                        }


                        return weight;

                    };


                users.sort(
                    (a, b) =>
                        getWeight(b.user) -
                        getWeight(a.user)
                );


                const topUsers =
                    users.slice(0, 10);


                const text =
                    (
                        await Promise.all(

                            topUsers.map(
                                async (x, index) => {

                                    const username =
                                        await getUsername(
                                            x.id
                                        );

                                    const weight =
                                        getWeight(
                                            x.user
                                        );


                                    return (

                                        `${getRank(index)} **${escapeMarkdown(username)}**\n` +

                                        `└ ⚖️ ${weight.toFixed(2)} KG`

                                    );

                                }
                            )

                        )
                    ).join("\n\n");


                return sendLeaderboard(

                    message,

                    "#C4B5FD",

                    "⚖️ BẢNG XẾP HẠNG CÂN NẶNG",

                    text

                );

            }


            // ==================================================
            // SAI LOẠI
            // ==================================================

            return message.reply({

                embeds: [

                    createEmbed(

                        "#EF4444",

                        "❌ KHÔNG TÌM THẤY BXH",

                        `Bạn có thể sử dụng:\n\n` +

                        `💰 \`${prefix}top money\` · BXH tiền\n` +

                        `🎣 \`${prefix}top rod\` · BXH cường hóa\n` +

                        `🐟 \`${prefix}top fish\` · BXH số cá\n` +

                        `⚖️ \`${prefix}top kg\` · BXH cân nặng`

                    )

                ]

            });

        }

        catch (error) {

            console.error(
                "❌ LEADERBOARD ERROR:",
                error
            );


            return message.reply({

                embeds: [

                    createEmbed(

                        "#EF4444",

                        "❌ KHÔNG THỂ HIỂN THỊ BXH",

                        "Đã xảy ra lỗi khi lấy dữ liệu bảng xếp hạng.\n\n" +

                        "Vui lòng kiểm tra console của bot."

                    )

                ]

            });

        }

    }

};


// ======================================================
// ESCAPE MARKDOWN
// ======================================================

function escapeMarkdown(text) {

    return String(text)
        .replace(/([\\`*_{}[\]()#+\-.!|>])/g, "\\$1");

}


// ======================================================
// EMBED
// ======================================================

function createEmbed(
    color,
    title,
    description
) {

    return new EmbedBuilder()

        .setColor(color)

        .setTitle(title)

        .setDescription(

            `୨୧ ───────── ୨୧\n\n` +

            description +

            `\n\n୨୧ ───────── ୨୧`

        )

        .setFooter({

            text:
                "✦ Fishing Adventure"

        })

        .setTimestamp();

}


// ======================================================
// GỬI LEADERBOARD
// ======================================================

function sendLeaderboard(
    message,
    color,
    title,
    text
) {

    return message.reply({

        embeds: [

            createEmbed(

                color,

                title,

                text ||
                "Chưa có dữ liệu."

            )

        ]

    });

}


// ======================================================
// RANK
// ======================================================

function getRank(index) {

    if (index === 0) {

        return "🥇";

    }

    if (index === 1) {

        return "🥈";

    }

    if (index === 2) {

        return "🥉";

    }

    return `\`${index + 1}.\``;

}

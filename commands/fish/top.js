const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const {
    emoji,
    formatMoney
} = require("../../config");

const {
    data
} = require("../../data");


// ======================================================
// CONFIG
// ======================================================

const MAX_TOP = 100;
const PER_PAGE = 10;
const COLLECTOR_TIME = 180000;


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

        try {

            // ==================================================
            // GUILD
            // ==================================================

            if (!message.guild) {

                return message.reply(
                    "❌ Lệnh này chỉ có thể sử dụng trong server."
                );

            }


            // ==================================================
            // LẤY USER DATA
            // ==================================================

            const users =
                getUsers(data);


            if (!users.length) {

                return message.reply({

                    embeds: [

                        new EmbedBuilder()

                            .setColor("#FF6B81")

                            .setTitle(
                                "🏆 BẢNG XẾP HẠNG"
                            )

                            .setDescription(

                                "୨୧ ───────────────── ୨୧\n\n" +

                                "Chưa tìm thấy dữ liệu người chơi.\n\n" +

                                "୨୧ ───────────────── ୨୧"

                            )

                            .setFooter({
                                text:
                                    "✦ Fishing Adventure"
                            })

                    ]

                });

            }


            // ==================================================
            // TYPE
            // ==================================================

            let type =
                normalizeType(
                    args?.[0]
                );


            // ==================================================
            // PAGE
            // ==================================================

            let page = 0;


            // ==================================================
            // USERNAME CACHE
            // ==================================================

            const usernameCache =
                new Map();


            // ==================================================
            // GET USERNAME
            // ==================================================

            async function getUsername(userId) {

                if (
                    usernameCache.has(userId)
                ) {

                    return usernameCache.get(
                        userId
                    );

                }


                // ==================================================
                // CACHE MEMBER
                // ==================================================

                const cachedMember =
                    message.guild.members.cache.get(
                        userId
                    );


                if (
                    cachedMember
                ) {

                    const name =
                        cachedMember.displayName ||
                        cachedMember.user.globalName ||
                        cachedMember.user.username;


                    usernameCache.set(
                        userId,
                        name
                    );


                    return name;

                }


                // ==================================================
                // FETCH MEMBER
                // ==================================================

                try {

                    const member =
                        await message.guild.members.fetch(
                            userId
                        );


                    if (
                        member
                    ) {

                        const name =
                            member.displayName ||
                            member.user.globalName ||
                            member.user.username;


                        usernameCache.set(
                            userId,
                            name
                        );


                        return name;

                    }

                }

                catch {
                    // Không còn trong server
                }


                // ==================================================
                // FETCH USER
                // ==================================================

                try {

                    const user =
                        await message.client.users.fetch(
                            userId
                        );


                    if (
                        user
                    ) {

                        const name =
                            user.globalName ||
                            user.username;


                        usernameCache.set(
                            userId,
                            name
                        );


                        return name;

                    }

                }

                catch {
                    // Ignore
                }


                // ==================================================
                // FALLBACK
                // ==================================================

                const fallback =
                    `User ${String(userId).slice(-4)}`;


                usernameCache.set(
                    userId,
                    fallback
                );


                return fallback;

            }


            // ==================================================
            // GET VALUE
            // ==================================================

            function getValue(user) {

                if (
                    type === "money"
                ) {

                    return getMoney(user);

                }


                if (
                    type === "fish"
                ) {

                    return getFishCount(user);

                }


                if (
                    type === "kg"
                ) {

                    return getWeight(user);

                }


                return 0;

            }


            // ==================================================
            // BUILD RANKING
            // ==================================================

            function buildRanking() {

                const ranking = [];


                for (
                    const item of users
                ) {

                    const value =
                        getValue(
                            item.user
                        );


                    if (
                        !Number.isFinite(value)
                    ) {

                        continue;

                    }


                    if (
                        value <= 0
                    ) {

                        continue;

                    }


                    ranking.push({

                        id:
                            item.id,

                        value:
                            value

                    });

                }


                ranking.sort(
                    (a, b) => {

                        if (
                            b.value !==
                            a.value
                        ) {

                            return (
                                b.value -
                                a.value
                            );

                        }


                        return (
                            String(a.id)
                                .localeCompare(
                                    String(b.id)
                                )
                        );

                    }
                );


                return ranking.slice(
                    0,
                    MAX_TOP
                );

            }


            // ==================================================
            // TITLE
            // ==================================================

            function getTitle() {

                if (
                    type === "money"
                ) {

                    return (
                        `${getMoneyEmoji()} BẢNG XẾP HẠNG XU`
                    );

                }


                if (
                    type === "fish"
                ) {

                    return (
                        "🐟 BẢNG XẾP HẠNG SỐ CÁ"
                    );

                }


                return (
                    "⚖️ BẢNG XẾP HẠNG CÂN NẶNG"
                );

            }


            // ==================================================
            // SUBTITLE
            // ==================================================

            function getSubtitle() {

                if (
                    type === "money"
                ) {

                    return (
                        "Những người chơi sở hữu nhiều Xu nhất."
                    );

                }


                if (
                    type === "fish"
                ) {

                    return (
                        "Những ngư dân sở hữu nhiều cá nhất."
                    );

                }


                return (
                    "Những người chơi sở hữu tổng cân nặng cá lớn nhất."
                );

            }


            // ==================================================
            // COLOR
            // ==================================================

            function getColor() {

                if (
                    type === "money"
                ) {

                    return "#FFD43B";

                }


                if (
                    type === "fish"
                ) {

                    return "#58C7FF";

                }


                return "#B99CFF";

            }


            // ==================================================
            // MONEY EMOJI
            // ==================================================

            function getMoneyEmoji() {

                return (
                    emoji?.money ||
                    "🪙"
                );

            }


            // ==================================================
            // VALUE
            // ==================================================

            function formatValue(value) {

                if (
                    type === "money"
                ) {

                    return (
                        `${formatMoney(value)} ${getMoneyEmoji()}`
                    );

                }


                if (
                    type === "fish"
                ) {

                    return (
                        `${value.toLocaleString("vi-VN")} cá`
                    );

                }


                return (
                    `${value.toFixed(2)} KG`
                );

            }


            // ==================================================
            // RANK
            // ==================================================

            function getRank(rank) {

                if (
                    rank === 1
                ) {

                    return "🥇";

                }


                if (
                    rank === 2
                ) {

                    return "🥈";

                }


                if (
                    rank === 3
                ) {

                    return "🥉";

                }


                return `#${rank}`;

            }


            // ==================================================
            // EMBED
            // ==================================================

            async function createEmbed() {

                const ranking =
                    buildRanking();


                const totalPages =
                    Math.max(

                        1,

                        Math.ceil(
                            ranking.length /
                            PER_PAGE
                        )

                    );


                // ==================================================
                // FIX PAGE
                // ==================================================

                if (
                    page >= totalPages
                ) {

                    page =
                        totalPages - 1;

                }


                if (
                    page < 0
                ) {

                    page = 0;

                }


                // ==================================================
                // CURRENT DATA
                // ==================================================

                const start =
                    page *
                    PER_PAGE;


                const current =
                    ranking.slice(

                        start,

                        start +
                        PER_PAGE

                    );


                // ==================================================
                // HEADER
                // ==================================================

                let text =

                    `${getSubtitle()}\n\n` +

                    "୨୧ ───────────────── ୨୧\n\n";


                // ==================================================
                // EMPTY
                // ==================================================

                if (
                    !current.length
                ) {

                    text +=
                        "Chưa có dữ liệu.";

                }


                // ==================================================
                // LIST
                // ==================================================

                else {

                    const names =
                        await Promise.all(

                            current.map(
                                player =>
                                    getUsername(
                                        player.id
                                    )
                            )

                        );


                    for (
                        let i = 0;
                        i < current.length;
                        i++
                    ) {

                        const player =
                            current[i];


                        const rank =
                            start +
                            i +
                            1;


                        let name =
                            names[i];


                        // ==================================================
                        // LIMIT NAME
                        // ==================================================

                        if (
                            name.length > 24
                        ) {

                            name =
                                name.slice(
                                    0,
                                    21
                                ) +
                                "...";

                        }


                        // ==================================================
                        // ONE LINE
                        // ==================================================

                        text +=

                            `${getRank(rank)} ${name} — ${formatValue(player.value)}\n`;

                    }

                }


                // ==================================================
                // FOOTER TEXT
                // ==================================================

                text +=

                    "\n୨୧ ───────────────── ୨୧\n\n" +

                    `Top ${ranking.length}/${MAX_TOP} · ` +

                    `Trang ${page + 1}/${totalPages}`;


                // ==================================================
                // EMBED
                // ==================================================

                return {

                    embed:

                        new EmbedBuilder()

                            .setColor(
                                getColor()
                            )

                            .setTitle(
                                getTitle()
                            )

                            .setDescription(
                                text
                            )

                            .setFooter({

                                text:
                                    "✦ Fishing Adventure"

                            })

                            .setTimestamp(),

                    totalPages

                };

            }


            // ==================================================
            // TYPE BUTTONS
            // ==================================================

            function createTypeButtons() {

                return new ActionRowBuilder()
                    .addComponents(

                        new ButtonBuilder()

                            .setCustomId(
                                "top_money"
                            )

                            .setLabel(
                                "Xu"
                            )

                            .setEmoji(
                                getMoneyEmoji()
                            )

                            .setStyle(

                                type === "money"
                                    ? ButtonStyle.Success
                                    : ButtonStyle.Secondary

                            ),


                        new ButtonBuilder()

                            .setCustomId(
                                "top_fish"
                            )

                            .setLabel(
                                "Cá"
                            )

                            .setEmoji(
                                "🐟"
                            )

                            .setStyle(

                                type === "fish"
                                    ? ButtonStyle.Success
                                    : ButtonStyle.Secondary

                            ),


                        new ButtonBuilder()

                            .setCustomId(
                                "top_kg"
                            )

                            .setLabel(
                                "KG"
                            )

                            .setEmoji(
                                "⚖️"
                            )

                            .setStyle(

                                type === "kg"
                                    ? ButtonStyle.Success
                                    : ButtonStyle.Secondary

                            )

                    );

            }


            // ==================================================
            // PAGE BUTTONS
            // ==================================================

            function createPageButtons(
                totalPages
            ) {

                return new ActionRowBuilder()
                    .addComponents(

                        new ButtonBuilder()

                            .setCustomId(
                                "top_previous"
                            )

                            .setLabel(
                                "Trước"
                            )

                            .setEmoji(
                                "◀️"
                            )

                            .setStyle(
                                ButtonStyle.Primary
                            )

                            .setDisabled(
                                page <= 0
                            ),


                        new ButtonBuilder()

                            .setCustomId(
                                "top_page"
                            )

                            .setLabel(
                                `${page + 1} / ${totalPages}`
                            )

                            .setStyle(
                                ButtonStyle.Secondary
                            )

                            .setDisabled(
                                true
                            ),


                        new ButtonBuilder()

                            .setCustomId(
                                "top_next"
                            )

                            .setLabel(
                                "Sau"
                            )

                            .setEmoji(
                                "▶️"
                            )

                            .setStyle(
                                ButtonStyle.Primary
                            )

                            .setDisabled(
                                page >= totalPages - 1
                            )

                    );

            }


            // ==================================================
            // FIRST MESSAGE
            // ==================================================

            let result =
                await createEmbed();


            const reply =
                await message.reply({

                    embeds: [

                        result.embed

                    ],

                    components: [

                        createTypeButtons(),

                        createPageButtons(
                            result.totalPages
                        )

                    ]

                });


            // ==================================================
            // COLLECTOR
            // ==================================================

            const collector =
                reply.createMessageComponentCollector({

                    time:
                        COLLECTOR_TIME

                });


            // ==================================================
            // COLLECT
            // ==================================================

            collector.on(
                "collect",
                async interaction => {

                    try {

                        // ==================================================
                        // OWNER CHECK
                        // ==================================================

                        if (
                            interaction.user.id !==
                            message.author.id
                        ) {

                            return interaction.reply({

                                content:
                                    "❌ Đây không phải bảng xếp hạng của bạn.",

                                ephemeral:
                                    true

                            });

                        }


                        // ==================================================
                        // TYPE
                        // ==================================================

                        if (
                            interaction.customId ===
                            "top_money"
                        ) {

                            type =
                                "money";

                            page =
                                0;

                        }


                        else if (
                            interaction.customId ===
                            "top_fish"
                        ) {

                            type =
                                "fish";

                            page =
                                0;

                        }


                        else if (
                            interaction.customId ===
                            "top_kg"
                        ) {

                            type =
                                "kg";

                            page =
                                0;

                        }


                        // ==================================================
                        // PREVIOUS
                        // ==================================================

                        else if (
                            interaction.customId ===
                            "top_previous"
                        ) {

                            if (
                                page > 0
                            ) {

                                page--;

                            }

                        }


                        // ==================================================
                        // NEXT
                        // ==================================================

                        else if (
                            interaction.customId ===
                            "top_next"
                        ) {

                            const ranking =
                                buildRanking();


                            const totalPages =
                                Math.max(

                                    1,

                                    Math.ceil(
                                        ranking.length /
                                        PER_PAGE
                                    )

                                );


                            if (
                                page <
                                totalPages - 1
                            ) {

                                page++;

                            }

                        }


                        // ==================================================
                        // UPDATE
                        // ==================================================

                        result =
                            await createEmbed();


                        await interaction.update({

                            embeds: [

                                result.embed

                            ],

                            components: [

                                createTypeButtons(),

                                createPageButtons(
                                    result.totalPages
                                )

                            ]

                        });

                    }

                    catch (error) {

                        console.error(
                            "❌ TOP BUTTON ERROR:",
                            error
                        );


                        try {

                            if (
                                !interaction.replied &&
                                !interaction.deferred
                            ) {

                                await interaction.reply({

                                    content:
                                        "❌ Không thể cập nhật bảng xếp hạng.",

                                    ephemeral:
                                        true

                                });

                            }

                        }

                        catch {
                            // Ignore
                        }

                    }

                }
            );


            // ==================================================
            // END
            // ==================================================

            collector.on(
                "end",
                async () => {

                    try {

                        const disabledType =
                            new ActionRowBuilder()
                                .addComponents(

                                    new ButtonBuilder()

                                        .setCustomId(
                                            "top_money_end"
                                        )

                                        .setLabel(
                                            "Xu"
                                        )

                                        .setEmoji(
                                            getMoneyEmoji()
                                        )

                                        .setStyle(
                                            ButtonStyle.Secondary
                                        )

                                        .setDisabled(
                                            true
                                        ),


                                    new ButtonBuilder()

                                        .setCustomId(
                                            "top_fish_end"
                                        )

                                        .setLabel(
                                            "Cá"
                                        )

                                        .setEmoji(
                                            "🐟"
                                        )

                                        .setStyle(
                                            ButtonStyle.Secondary
                                        )

                                        .setDisabled(
                                            true
                                        ),


                                    new ButtonBuilder()

                                        .setCustomId(
                                            "top_kg_end"
                                        )

                                        .setLabel(
                                            "KG"
                                        )

                                        .setEmoji(
                                            "⚖️"
                                        )

                                        .setStyle(
                                            ButtonStyle.Secondary
                                        )

                                        .setDisabled(
                                            true
                                        )

                                );


                        const disabledPage =
                            new ActionRowBuilder()
                                .addComponents(

                                    new ButtonBuilder()

                                        .setCustomId(
                                            "top_previous_end"
                                        )

                                        .setLabel(
                                            "Trước"
                                        )

                                        .setEmoji(
                                            "◀️"
                                        )

                                        .setStyle(
                                            ButtonStyle.Secondary
                                        )

                                        .setDisabled(
                                            true
                                        ),


                                    new ButtonBuilder()

                                        .setCustomId(
                                            "top_page_end"
                                        )

                                        .setLabel(
                                            `${page + 1}`
                                        )

                                        .setStyle(
                                            ButtonStyle.Secondary
                                        )

                                        .setDisabled(
                                            true
                                        ),


                                    new ButtonBuilder()

                                        .setCustomId(
                                            "top_next_end"
                                        )

                                        .setLabel(
                                            "Sau"
                                        )

                                        .setEmoji(
                                            "▶️"
                                        )

                                        .setStyle(
                                            ButtonStyle.Secondary
                                        )

                                        .setDisabled(
                                            true
                                        )

                                );


                        await reply.edit({

                            components: [

                                disabledType,

                                disabledPage

                            ]

                        });

                    }

                    catch {
                        // Message bị xóa
                    }

                }
            );


            return reply;

        }

        catch (error) {

            console.error(
                "❌ TOP ERROR:",
                error
            );


            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor("#FF4757")

                        .setTitle(
                            "❌ KHÔNG THỂ HIỂN THỊ BXH"
                        )

                        .setDescription(

                            "Đã xảy ra lỗi khi tải dữ liệu.\n\n" +

                            `\`${error.message}\``

                        )

                ]

            });

        }

    }

};


// ======================================================
// NORMALIZE TYPE
// ======================================================

function normalizeType(type) {

    type =
        String(
            type || "money"
        )
            .trim()
            .toLowerCase();


    if (
        [
            "fish",
            "ca",
            "cá"
        ].includes(type)
    ) {

        return "fish";

    }


    if (
        [
            "kg",
            "weight",
            "can",
            "cân"
        ].includes(type)
    ) {

        return "kg";

    }


    return "money";

}


// ======================================================
// MONEY
// ======================================================

function getMoney(user) {

    const money =
        Number(
            user?.money || 0
        );


    if (
        !Number.isFinite(money)
    ) {

        return 0;

    }


    return money;

}


// ======================================================
// FISH COUNT
// ======================================================

function getFishCount(user) {

    let total =
        0;


    const fish =
        user?.fish;


    if (
        !fish ||
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

            total +=
                list.length;

        }

        else if (
            typeof list === "number"
        ) {

            total +=
                list;

        }

        else if (
            typeof list === "object" &&
            list !== null
        ) {

            if (
                Number.isFinite(
                    Number(list.amount)
                )
            ) {

                total +=
                    Number(list.amount);

            }

        }

    }


    return total;

}


// ======================================================
// WEIGHT
// ======================================================

function getWeight(user) {

    let total =
        0;


    const fish =
        user?.fish;


    if (
        !fish ||
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
            !Array.isArray(list)
        ) {

            continue;

        }


        for (
            const value of list
        ) {

            // ----------------------------------------------
            // Array dạng [1.5, 2.3, 4.1]
            // ----------------------------------------------

            if (
                typeof value === "number"
            ) {

                if (
                    Number.isFinite(value)
                ) {

                    total +=
                        value;

                }

                continue;

            }


            // ----------------------------------------------
            // Object dạng { weight: 1.5 }
            // ----------------------------------------------

            if (
                value &&
                typeof value === "object"
            ) {

                const weight =
                    Number(
                        value.weight ??
                        value.kg ??
                        value.weightKg ??
                        0
                    );


                if (
                    Number.isFinite(weight)
                ) {

                    total +=
                        weight;

                }

                continue;

            }


            // ----------------------------------------------
            // String dạng "1.5"
            // ----------------------------------------------

            const weight =
                Number(
                    value
                );


            if (
                Number.isFinite(weight)
            ) {

                total +=
                    weight;

            }

        }

    }


    return total;

}


// ======================================================
// GET USERS
// ======================================================

function getUsers(database) {

    const result =
        [];


    if (
        !database ||
        typeof database !== "object"
    ) {

        return result;

    }


    // ==================================================
    // DATA DẠNG
    //
    // data[userId] = {
    //     money: ...
    // }
    // ==================================================

    for (
        const id in database
    ) {

        const user =
            database[id];


        if (
            isUserData(user)
        ) {

            result.push({

                id:
                    id,

                user:
                    user

            });

        }

    }


    if (
        result.length
    ) {

        return result;

    }


    // ==================================================
    // DATA DẠNG
    //
    // data[guildId][userId]
    // ==================================================

    for (
        const guildId in database
    ) {

        const guild =
            database[guildId];


        if (
            !guild ||
            typeof guild !== "object" ||
            Array.isArray(guild)
        ) {

            continue;

        }


        for (
            const userId in guild
        ) {

            const user =
                guild[userId];


            if (
                isUserData(user)
            ) {

                result.push({

                    id:
                        userId,

                    user:
                        user

                });

            }

        }

    }


    return result;

}


// ======================================================
// CHECK USER DATA
// ======================================================

function isUserData(value) {

    if (
        !value ||
        typeof value !== "object" ||
        Array.isArray(value)
    ) {

        return false;

    }


    return (

        Object.prototype.hasOwnProperty.call(
            value,
            "money"
        ) ||

        Object.prototype.hasOwnProperty.call(
            value,
            "fish"
        ) ||

        Object.prototype.hasOwnProperty.call(
            value,
            "rodData"
        )

    );

};
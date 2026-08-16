const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const {
    formatMoney
} = require("../../config");

const {
    data
} = require("../../data");


// ======================================================
// SETTINGS
// ======================================================

const PER_PAGE = 10;
const MAX_TOP = 100;
const COLLECTOR_TIME = 180000;


// ======================================================
// MODULE
// ======================================================

module.exports = {

    name: "leaderboard",

    aliases: [],


    async execute(message, args) {

        try {

            // ==================================================
            // CHECK GUILD
            // ==================================================

            if (!message.guild) {

                return message.reply(
                    "❌ Lệnh này chỉ có thể sử dụng trong server."
                );

            }


            // ==================================================
            // DATA SERVER
            // ==================================================

            const guildData =
                data?.[message.guild.id];


            if (
                !guildData ||
                typeof guildData !== "object"
            ) {

                return message.reply({

                    embeds: [

                        new EmbedBuilder()

                            .setColor("#EF4444")

                            .setTitle(
                                "❌ CHƯA CÓ DỮ LIỆU"
                            )

                            .setDescription(

                                "Server này hiện chưa có dữ liệu người chơi.\n\n" +

                                "୨୧ ───────────────── ୨୧\n\n" +

                                "Hãy chơi Fishing Adventure để xuất hiện trên bảng xếp hạng."

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
                String(
                    args?.[0] || "money"
                )
                    .trim()
                    .toLowerCase();


            // ==================================================
            // ALIAS
            // ==================================================

            if (
                [
                    "coin",
                    "xu",
                    "fcoin"
                ].includes(type)
            ) {

                type = "money";

            }

            else if (
                [
                    "ca",
                    "fish"
                ].includes(type)
            ) {

                type = "fish";

            }

            else if (
                [
                    "weight",
                    "weightfish",
                    "can",
                    "kg"
                ].includes(type)
            ) {

                type = "kg";

            }

            else {

                type = "money";

            }


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

                    return usernameCache.get(userId);

                }


                let username =
                    null;


                // ------------------------------------------------
                // CACHE MEMBER
                // ------------------------------------------------

                const cachedMember =
                    message.guild.members.cache.get(
                        userId
                    );


                if (
                    cachedMember?.user
                ) {

                    username =
                        cachedMember.user.globalName ||
                        cachedMember.user.username;

                }


                // ------------------------------------------------
                // FETCH MEMBER
                // ------------------------------------------------

                if (
                    !username
                ) {

                    try {

                        const member =
                            await message.guild.members.fetch(
                                userId
                            );


                        if (
                            member?.user
                        ) {

                            username =
                                member.user.globalName ||
                                member.user.username;

                        }

                    }

                    catch {

                        // Không tìm thấy member

                    }

                }


                // ------------------------------------------------
                // FETCH USER
                // ------------------------------------------------

                if (
                    !username
                ) {

                    try {

                        const user =
                            await message.client.users.fetch(
                                userId
                            );


                        if (
                            user
                        ) {

                            username =
                                user.globalName ||
                                user.username;

                        }

                    }

                    catch {

                        // Không tìm thấy user

                    }

                }


                // ------------------------------------------------
                // FALLBACK
                // ------------------------------------------------

                if (
                    !username
                ) {

                    username =
                        `User ${userId}`;

                }


                usernameCache.set(
                    userId,
                    username
                );


                return username;

            }


            // ==================================================
            // MONEY
            // ==================================================

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


            // ==================================================
            // FISH COUNT
            // ==================================================

            function getFishCount(user) {

                let count =
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


                    // ------------------------------------------
                    // DATA DẠNG ARRAY
                    // ------------------------------------------

                    if (
                        Array.isArray(list)
                    ) {

                        count +=
                            list.length;

                    }


                    // ------------------------------------------
                    // DATA DẠNG NUMBER
                    // ------------------------------------------

                    else if (
                        typeof list === "number"
                    ) {

                        count +=
                            list;

                    }

                }


                return count;

            }


            // ==================================================
            // TOTAL KG
            // ==================================================

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

                        const kg =
                            Number(value);


                        if (
                            Number.isFinite(kg)
                        ) {

                            total +=
                                kg;

                        }

                    }

                }


                return total;

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
            // BUILD LEADERBOARD
            // ==================================================

            function buildLeaderboard() {

                const list =
                    [];


                // ==================================================
                // QUAN TRỌNG
                //
                // DATA:
                //
                // data[guildId][userId]
                // ==================================================

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


                    const value =
                        getValue(user);


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


                    list.push({

                        id:
                            userId,

                        value:
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
                // TOP 100
                // ==================================================

                return list.slice(
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

                    return "💰 `FCOIN RANKING`";

                }


                if (
                    type === "fish"
                ) {

                    return "🐟 `FISH RANKING`";

                }


                return "⚖️ `WEIGHT RANKING`";

            }


            // ==================================================
            // DESCRIPTION
            // ==================================================

            function getDescription() {

                if (
                    type === "money"
                ) {

                    return (
                        "「 Hãy xem ai đang đứng trên đỉnh nào. 」\n\n" +

                        "Những cái tên xuất sắc nhất\n" +
                        "đã được ghi lại tại đây."
                    );

                }


                if (
                    type === "fish"
                ) {

                    return (
                        "「 Hãy xem ai đã chinh phục đại dương. 」\n\n" +

                        "Những ngư dân xuất sắc nhất\n" +
                        "đã ghi danh trên bảng xếp hạng."
                    );

                }


                return (
                    "「 Hãy xem chiến tích của ai nặng nhất nào. 」\n\n" +

                    "Những người chơi sở hữu\n" +
                    "tổng cân nặng cá đáng kinh ngạc."
                );

            }


            // ==================================================
            // COLOR
            // ==================================================

            function getColor() {

                if (
                    type === "money"
                ) {

                    return "#FFD86B";

                }


                if (
                    type === "fish"
                ) {

                    return "#72D6FF";

                }


                return "#C4B5FD";

            }


            // ==================================================
            // VALUE TEXT
            // ==================================================

            function getValueText(value) {

                if (
                    type === "money"
                ) {

                    return (
                        `${formatMoney(value)} Fcoin`
                    );

                }


                if (
                    type === "fish"
                ) {

                    return (
                        `${value.toLocaleString("vi-VN")} con cá`
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
            // PAGE
            // ==================================================

            let page =
                0;


            // ==================================================
            // CREATE EMBED
            // ==================================================

            async function createEmbed() {

                const leaderboard =
                    buildLeaderboard();


                const totalPages =
                    Math.max(
                        1,
                        Math.ceil(
                            leaderboard.length /
                            PER_PAGE
                        )
                    );


                // ----------------------------------------------
                // FIX PAGE
                // ----------------------------------------------

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


                // ----------------------------------------------
                // SLICE
                // ----------------------------------------------

                const start =
                    page *
                    PER_PAGE;


                const players =
                    leaderboard.slice(
                        start,
                        start + PER_PAGE
                    );


                // ----------------------------------------------
                // EMBED
                // ----------------------------------------------

                const embed =
                    new EmbedBuilder()

                        .setColor(
                            getColor()
                        )

                        .setTitle(
                            "🎭 `FONTAINE • HALL OF FAME`"
                        )

                        .setDescription(

                            `${getDescription()}\n\n` +

                            "୨୧ ───────────────── ୨୧\n\n" +

                            `${getTitle()}`

                        );


                // ==================================================
                // KHÔNG DATA
                // ==================================================

                if (
                    players.length === 0
                ) {

                    embed.addFields({

                        name:
                            "📜 BẢNG XẾP HẠNG",

                        value:
                            "Hiện chưa có ai được ghi danh.",

                        inline:
                            false

                    });

                }


                // ==================================================
                // DATA
                // ==================================================

                else {

                    let text =
                        "";


                    // ----------------------------------------------
                    // USERNAME
                    // ----------------------------------------------

                    const usernames =
                        await Promise.all(

                            players.map(
                                player =>
                                    getUsername(
                                        player.id
                                    )
                            )

                        );


                    // ----------------------------------------------
                    // ROW
                    // ----------------------------------------------

                    for (
                        let i = 0;
                        i < players.length;
                        i++
                    ) {

                        const player =
                            players[i];


                        const rank =
                            start +
                            i +
                            1;


                        let username =
                            usernames[i];


                        // ------------------------------------------
                        // GIỚI HẠN USERNAME
                        // ------------------------------------------

                        if (
                            username.length > 24
                        ) {

                            username =
                                username.slice(
                                    0,
                                    21
                                ) +
                                "...";

                        }


                        const rankText =
                            getRank(rank);


                        const valueText =
                            getValueText(
                                player.value
                            );


                        text +=
                            `${rankText} ${username}\n` +
                            `${valueText}\n\n`;

                    }


                    embed.addFields({

                        name:
                            "📜 BẢNG XẾP HẠNG",

                        value:
                            text,

                        inline:
                            false

                    });

                }


                // ==================================================
                // FOOTER
                // ==================================================

                embed.setFooter({

                    text:
                        `✦ Top ${leaderboard.length}/${MAX_TOP} · Trang ${page + 1}/${totalPages}`

                });


                embed.setTimestamp();


                return {

                    embed:
                        embed,

                    totalPages:
                        totalPages,

                    total:
                        leaderboard.length

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
                                "lb_money"
                            )

                            .setLabel(
                                "Fcoin"
                            )

                            .setEmoji(
                                "💰"
                            )

                            .setStyle(

                                type === "money"
                                    ? ButtonStyle.Success
                                    : ButtonStyle.Secondary

                            ),


                        new ButtonBuilder()

                            .setCustomId(
                                "lb_fish"
                            )

                            .setLabel(
                                "Số cá"
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
                                "lb_kg"
                            )

                            .setLabel(
                                "Cân nặng"
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

            function createPageButtons(totalPages) {

                return new ActionRowBuilder()
                    .addComponents(

                        new ButtonBuilder()

                            .setCustomId(
                                "lb_prev"
                            )

                            .setLabel(
                                "Trang trước"
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
                                "lb_page"
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
                                "lb_next"
                            )

                            .setLabel(
                                "Trang sau"
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
            // FIRST EMBED
            // ==================================================

            const result =
                await createEmbed();


            // ==================================================
            // SEND
            // ==================================================

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
            // BUTTON COLLECT
            // ==================================================

            collector.on(
                "collect",
                async interaction => {

                    try {

                        // ==========================================
                        // NGƯỜI KHÁC
                        // ==========================================

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


                        // ==========================================
                        // FCOIN
                        // ==========================================

                        if (
                            interaction.customId ===
                            "lb_money"
                        ) {

                            type =
                                "money";

                            page =
                                0;

                        }


                        // ==========================================
                        // FISH
                        // ==========================================

                        else if (
                            interaction.customId ===
                            "lb_fish"
                        ) {

                            type =
                                "fish";

                            page =
                                0;

                        }


                        // ==========================================
                        // KG
                        // ==========================================

                        else if (
                            interaction.customId ===
                            "lb_kg"
                        ) {

                            type =
                                "kg";

                            page =
                                0;

                        }


                        // ==========================================
                        // PREVIOUS
                        // ==========================================

                        else if (
                            interaction.customId ===
                            "lb_prev"
                        ) {

                            if (
                                page > 0
                            ) {

                                page--;

                            }

                        }


                        // ==========================================
                        // NEXT
                        // ==========================================

                        else if (
                            interaction.customId ===
                            "lb_next"
                        ) {

                            const current =
                                buildLeaderboard();


                            const totalPages =
                                Math.max(
                                    1,
                                    Math.ceil(
                                        current.length /
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


                        // ==========================================
                        // PAGE
                        // ==========================================

                        else if (
                            interaction.customId ===
                            "lb_page"
                        ) {

                            return interaction.deferUpdate();

                        }


                        // ==========================================
                        // CREATE NEW
                        // ==========================================

                        const newResult =
                            await createEmbed();


                        // ==========================================
                        // UPDATE
                        // ==========================================

                        await interaction.update({

                            embeds: [

                                newResult.embed

                            ],

                            components: [

                                createTypeButtons(),

                                createPageButtons(
                                    newResult.totalPages
                                )

                            ]

                        });

                    }

                    catch (error) {

                        console.error(
                            "❌ LEADERBOARD BUTTON ERROR:",
                            error
                        );


                        try {

                            if (
                                interaction.replied ||
                                interaction.deferred
                            ) {

                                await interaction.editReply({

                                    content:
                                        "❌ Không thể cập nhật bảng xếp hạng."

                                });

                            }

                            else {

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
            // COLLECTOR END
            // ==================================================

            collector.on(
                "end",
                async () => {

                    try {

                        const disabledTypeButtons =
                            new ActionRowBuilder()
                                .addComponents(

                                    new ButtonBuilder()

                                        .setCustomId(
                                            "lb_money_end"
                                        )

                                        .setLabel(
                                            "Fcoin"
                                        )

                                        .setEmoji(
                                            "💰"
                                        )

                                        .setStyle(
                                            ButtonStyle.Secondary
                                        )

                                        .setDisabled(
                                            true
                                        ),


                                    new ButtonBuilder()

                                        .setCustomId(
                                            "lb_fish_end"
                                        )

                                        .setLabel(
                                            "Số cá"
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
                                            "lb_kg_end"
                                        )

                                        .setLabel(
                                            "Cân nặng"
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


                        const disabledPageButtons =
                            new ActionRowBuilder()
                                .addComponents(

                                    new ButtonBuilder()

                                        .setCustomId(
                                            "lb_prev_end"
                                        )

                                        .setLabel(
                                            "Trang trước"
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
                                            "lb_page_end"
                                        )

                                        .setLabel(
                                            "Hết thời gian"
                                        )

                                        .setStyle(
                                            ButtonStyle.Secondary
                                        )

                                        .setDisabled(
                                            true
                                        ),


                                    new ButtonBuilder()

                                        .setCustomId(
                                            "lb_next_end"
                                        )

                                        .setLabel(
                                            "Trang sau"
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

                                disabledTypeButtons,

                                disabledPageButtons

                            ]

                        });

                    }

                    catch {

                        // Message đã bị xóa

                    }

                }
            );


            return reply;

        }

        catch (error) {

            console.error(
                "❌ LEADERBOARD ERROR:",
                error
            );


            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor("#EF4444")

                        .setTitle(
                            "❌ KHÔNG THỂ HIỂN THỊ BXH"
                        )

                        .setDescription(

                            "Đã xảy ra lỗi khi lấy dữ liệu bảng xếp hạng.\n\n" +

                            `\`\`\`js\n${error.message}\n\`\`\``

                        )

                        .setFooter({

                            text:
                                "✦ Fishing Adventure"

                        })

                ]

            });

        }

    }

};

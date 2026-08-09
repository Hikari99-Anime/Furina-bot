const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require("discord.js");

const {
    createGame,
    getGame,
    closeGame
} = require("../games/taixiugame");

const {
    getUser,
    save
} = require("../database");

// ======================================================
// PAYOUT CỬA SỐ
// ======================================================

const SO_PAYOUT = {
    3: 180,
    4: 60,
    5: 30,
    6: 17,
    7: 12,
    8: 8,
    9: 6,
    10: 6,
    11: 6,
    12: 6,
    13: 8,
    14: 12,
    15: 17,
    16: 30,
    17: 60,
    18: 180
};

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
            text: "✦ Fishing Adventure · Tài Xỉu"
        })

        .setTimestamp();
}

// ======================================================
// TÊN CỬA
// ======================================================

function nhanCua(p) {

    if (p.type === "tai")
        return "🔴 TÀI";

    if (p.type === "xiu")
        return "🔵 XỈU";

    if (p.type === "chan")
        return "⚫ CHẴN";

    if (p.type === "le")
        return "⚪ LẺ";

    if (p.type === "so")
        return `🔢 SỐ ${p.number}`;

    return "❓ KHÔNG RÕ";
}

// ======================================================
// FORMAT TIỀN
// ======================================================

function money(value) {

    return Number(value || 0)
        .toLocaleString("en-US");
}

// ======================================================
// TỔNG CƯỢC
// ======================================================

function tongCuoc(game) {

    return game.players.reduce(
        (sum, p) =>
            sum + Number(p.money || 0),
        0
    );
}

// ======================================================
// DANH SÁCH CƯỢC
// ======================================================

function danhSachCuoc(game) {

    if (
        !game ||
        !Array.isArray(game.players) ||
        !game.players.length
    ) {

        return "Chưa có ai đặt cược.";
    }

    const byUser = new Map();

    for (const p of game.players) {

        if (!byUser.has(p.id)) {

            byUser.set(
                p.id,
                []
            );

        }

        byUser
            .get(p.id)
            .push(
                `${nhanCua(p)} \`${money(p.money)}\``
            );
    }

    const lines = [];

    for (
        const [id, bets]
        of byUser
    ) {

        lines.push(
            `<@${id}>\n└ ${bets.join(" · ")}`
        );

    }

    return lines.join("\n\n");
}

// ======================================================
// ROW NÚT
// ======================================================

function createRows() {

    const row1 =
        new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                    .setCustomId("tx_tai")
                    .setLabel("🔴 TÀI")
                    .setStyle(
                        ButtonStyle.Danger
                    ),

                new ButtonBuilder()
                    .setCustomId("tx_xiu")
                    .setLabel("🔵 XỈU")
                    .setStyle(
                        ButtonStyle.Primary
                    ),

                new ButtonBuilder()
                    .setCustomId("tx_chan")
                    .setLabel("⚫ CHẴN")
                    .setStyle(
                        ButtonStyle.Secondary
                    ),

                new ButtonBuilder()
                    .setCustomId("tx_le")
                    .setLabel("⚪ LẺ")
                    .setStyle(
                        ButtonStyle.Secondary
                    ),

                new ButtonBuilder()
                    .setCustomId("tx_so")
                    .setLabel("🔢 CHỌN SỐ")
                    .setStyle(
                        ButtonStyle.Success
                    )

            );

    const row2 =
        new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                    .setCustomId("tx_quick_10000")
                    .setLabel("10K")
                    .setStyle(
                        ButtonStyle.Success
                    ),

                new ButtonBuilder()
                    .setCustomId("tx_quick_50000")
                    .setLabel("50K")
                    .setStyle(
                        ButtonStyle.Success
                    ),

                new ButtonBuilder()
                    .setCustomId("tx_quick_100000")
                    .setLabel("100K")
                    .setStyle(
                        ButtonStyle.Success
                    )

            );

    return [
        row1,
        row2
    ];
}

// ======================================================
// MODAL CƯỢC
// ======================================================

function createBetModal(type) {

    const modal =
        new ModalBuilder()
            .setCustomId(
                `txbet_${type}`
            )
            .setTitle(
                `💰 Cược ${type === "tai"
                    ? "TÀI"
                    : type === "xiu"
                        ? "XỈU"
                        : type === "chan"
                            ? "CHẴN"
                            : "LẺ"}`
            );

    const input =
        new TextInputBuilder()
            .setCustomId("money")
            .setLabel("Số tiền cược")
            .setPlaceholder(
                "Ví dụ: 10000"
            )
            .setStyle(
                TextInputStyle.Short
            )
            .setRequired(true);

    modal.addComponents(

        new ActionRowBuilder()
            .addComponents(input)

    );

    return modal;
}

// ======================================================
// MODAL CHỌN SỐ
// ======================================================

function createNumberModal() {

    const modal =
        new ModalBuilder()
            .setCustomId(
                "txbet_so"
            )
            .setTitle(
                "🔢 CƯỢC CHỌN SỐ"
            );

    const numberInput =
        new TextInputBuilder()
            .setCustomId("sonum")
            .setLabel(
                "Tổng 3 xúc xắc (3 - 18)"
            )
            .setPlaceholder(
                "Ví dụ: 12"
            )
            .setStyle(
                TextInputStyle.Short
            )
            .setRequired(true);

    const moneyInput =
        new TextInputBuilder()
            .setCustomId("money")
            .setLabel(
                "Số tiền cược"
            )
            .setPlaceholder(
                "Ví dụ: 10000"
            )
            .setStyle(
                TextInputStyle.Short
            )
            .setRequired(true);

    modal.addComponents(

        new ActionRowBuilder()
            .addComponents(
                numberInput
            ),

        new ActionRowBuilder()
            .addComponents(
                moneyInput
            )

    );

    return modal;
}

// ======================================================
// COMMAND
// ======================================================

module.exports = {

    name: "taixiu",

    aliases: [
        "tx",
        "taixiu"
    ],

    async execute(message) {

        // ==================================================
        // CHECK GAME
        // ==================================================

        if (getGame()) {

            return message.reply({

                embeds: [

                    createEmbed(

                        "#F59E0B",

                        "⚠️ TÀI XỈU ĐANG DIỄN RA",

                        "Hiện tại đã có một ván Tài Xỉu đang diễn ra.\n\n" +
                        "🎲 Hãy chờ ván hiện tại kết thúc."

                    )

                ]

            });

        }

        // ==================================================
        // CREATE GAME
        // ==================================================

        const game =
            createGame();

        let time = 30;

        // ==================================================
        // MESSAGE
        // ==================================================

        const msg =
            await message.channel.send({

                embeds: [

                    createEmbed(

                        "#F5C451",

                        "🎲 TÀI XỈU",

                        `⏳ **Thời gian:** \`30 giây\`\n\n` +

                        `🎯 **Cửa cược**\n` +
                        `🔴 TÀI · 🔵 XỈU · ⚫ CHẴN · ⚪ LẺ\n` +
                        `🔢 Chọn số từ **3 → 18**\n\n` +

                        `💰 **Cược nhanh**\n` +
                        `10K · 50K · 100K\n\n` +

                        `👥 **Người chơi**\n` +
                        `Chưa có ai đặt cược.`

                    )

                ],

                components:
                    createRows()

            });

        // ==================================================
        // UPDATE EMBED
        // ==================================================

        const updateMessage =
            async () => {

                if (!game)
                    return;

                const players =
                    danhSachCuoc(game);

                await msg.edit({

                    embeds: [

                        createEmbed(

                            "#F5C451",

                            "🎲 TÀI XỈU",

                            `⏳ **Còn:** \`${Math.max(time, 0)} giây\`\n\n` +

                            `🎯 **Cửa cược**\n` +
                            `🔴 TÀI · 🔵 XỈU · ⚫ CHẴN · ⚪ LẺ\n` +
                            `🔢 Số **3 → 18**\n\n` +

                            `👥 **Cược hiện tại**\n` +
                            `${players}\n\n` +

                            `💰 **Tổng cược:** \`${money(
                                tongCuoc(game)
                            )}\` xu`

                        )

                    ],

                    components:
                        time > 0
                            ? createRows()
                            : []

                });

            };

        // ==================================================
        // COLLECTOR
        // ==================================================

        const collector =
            msg.createMessageComponentCollector({
                time: 30000
            });

        // ==================================================
        // BUTTON
        // ==================================================

        collector.on(
            "collect",
            async interaction => {

                try {

                    // ==========================================
                    // CHỌN SỐ
                    // ==========================================

                    if (
                        interaction.customId ===
                        "tx_so"
                    ) {

                        return interaction.showModal(
                            createNumberModal()
                        );

                    }

                    // ==========================================
                    // CỬA
                    // ==========================================

                    const typeMap = {

                        tx_tai: "tai",
                        tx_xiu: "xiu",
                        tx_chan: "chan",
                        tx_le: "le"

                    };

                    if (
                        typeMap[
                            interaction.customId
                        ]
                    ) {

                        return interaction.showModal(

                            createBetModal(
                                typeMap[
                                    interaction.customId
                                ]
                            )

                        );

                    }

                    // ==========================================
                    // CƯỢC NHANH
                    // ==========================================

                    const quickMap = {

                        tx_quick_10000: 10000,
                        tx_quick_50000: 50000,
                        tx_quick_100000: 100000

                    };

                    const quickAmount =
                        quickMap[
                            interaction.customId
                        ];

                    if (!quickAmount)
                        return;

                    const modal =
                        new ModalBuilder()
                            .setCustomId(
                                `txquick_${quickAmount}`
                            )
                            .setTitle(
                                `🎲 CƯỢC NHANH ${money(
                                    quickAmount
                                )}`
                            );

                    const typeInput =
                        new TextInputBuilder()
                            .setCustomId(
                                "type"
                            )
                            .setLabel(
                                "Nhập cửa: tai / xiu / chan / le"
                            )
                            .setPlaceholder(
                                "Ví dụ: tai"
                            )
                            .setStyle(
                                TextInputStyle.Short
                            )
                            .setRequired(true);

                    modal.addComponents(

                        new ActionRowBuilder()
                            .addComponents(
                                typeInput
                            )

                    );

                    return interaction.showModal(
                        modal
                    );

                } catch (err) {

                    console.error(
                        "TAIXIU BUTTON ERROR:",
                        err
                    );

                }

            }
        );

        // ==================================================
        // MODAL
        // ==================================================

        collector.on(
            "collect",
            async interaction => {

                if (
                    !interaction.isModalSubmit()
                )
                    return;

                try {

                    const customId =
                        interaction.customId;

                    let type = null;
                    let bet = 0;
                    let number = null;

                    // ==========================================
                    // CƯỢC SỐ
                    // ==========================================

                    if (
                        customId ===
                        "txbet_so"
                    ) {

                        number =
                            Number(
                                interaction.fields.getTextInputValue(
                                    "sonum"
                                )
                            );

                        bet =
                            Number(
                                interaction.fields.getTextInputValue(
                                    "money"
                                )
                            );

                        type = "so";

                    }

                    // ==========================================
                    // CƯỢC THƯỜNG
                    // ==========================================

                    else if (
                        customId.startsWith(
                            "txbet_"
                        )
                    ) {

                        type =
                            customId.replace(
                                "txbet_",
                                ""
                            );

                        bet =
                            Number(
                                interaction.fields.getTextInputValue(
                                    "money"
                                )
                            );

                    }

                    // ==========================================
                    // CƯỢC NHANH
                    // ==========================================

                    else if (
                        customId.startsWith(
                            "txquick_"
                        )
                    ) {

                        bet =
                            Number(
                                customId.replace(
                                    "txquick_",
                                    ""
                                )
                            );

                        type =
                            interaction.fields
                                .getTextInputValue(
                                    "type"
                                )
                                .trim()
                                .toLowerCase();

                    }

                    else {

                        return;

                    }

                    // ==========================================
                    // CHECK TYPE
                    // ==========================================

                    if (
                        ![
                            "tai",
                            "xiu",
                            "chan",
                            "le",
                            "so"
                        ].includes(type)
                    ) {

                        return interaction.reply({

                            embeds: [

                                createEmbed(

                                    "#EF4444",

                                    "❌ CỬA KHÔNG HỢP LỆ",

                                    "Vui lòng chọn:\n" +
                                    "`tai` · `xiu` · `chan` · `le`"

                                )

                            ],

                            ephemeral: true

                        });

                    }

                    // ==========================================
                    // CHECK NUMBER
                    // ==========================================

                    if (type === "so") {

                        if (
                            !Number.isInteger(
                                number
                            ) ||
                            number < 3 ||
                            number > 18
                        ) {

                            return interaction.reply({

                                embeds: [

                                    createEmbed(

                                        "#EF4444",

                                        "❌ SỐ KHÔNG HỢP LỆ",

                                        "Số dự đoán phải nằm trong khoảng **3 → 18**."

                                    )

                                ],

                                ephemeral: true

                            });

                        }

                    }

                    // ==========================================
                    // CHECK MONEY
                    // ==========================================

                    if (
                        !Number.isSafeInteger(
                            bet
                        ) ||
                        bet <= 0
                    ) {

                        return interaction.reply({

                            embeds: [

                                createEmbed(

                                    "#EF4444",

                                    "❌ TIỀN CƯỢC KHÔNG HỢP LỆ",

                                    "Số tiền cược phải là số nguyên lớn hơn 0."

                                )

                            ],

                            ephemeral: true

                        });

                    }

                    // ==========================================
                    // USER
                    // ==========================================

                    const user =
                        getUser(
                            interaction.user.id
                        );

                    if (!user) {

                        return interaction.reply({

                            embeds: [

                                createEmbed(

                                    "#EF4444",

                                    "❌ LỖI DỮ LIỆU",

                                    "Không tìm thấy dữ liệu người chơi."

                                )

                            ],

                            ephemeral: true

                        });

                    }

                    // ==========================================
                    // CHECK BALANCE
                    // ==========================================

                    if (
                        Number(user.money || 0) <
                        bet
                    ) {

                        return interaction.reply({

                            embeds: [

                                createEmbed(

                                    "#EF4444",

                                    "❌ KHÔNG ĐỦ TIỀN",

                                    `Bạn đang có **${money(
                                        user.money
                                    )} xu**.\n\n` +
                                    `💰 Cược yêu cầu: **${money(
                                        bet
                                    )} xu**.`

                                )

                            ],

                            ephemeral: true

                        });

                    }

                    // ==========================================
                    // PUSH BET
                    // ==========================================

                    game.players.push({

                        id:
                            interaction.user.id,

                        type,

                        number,

                        money: bet

                    });

                    // ==========================================
                    // UPDATE
                    // ==========================================

                    await interaction.reply({

                        embeds: [

                            createEmbed(

                                "#86EFAC",

                                "✅ ĐẶT CƯỢC THÀNH CÔNG",

                                `🎯 **Cửa:** ${nhanCua({
                                    type,
                                    number
                                })}\n\n` +

                                `💰 **Tiền cược:** ${money(
                                    bet
                                )} xu\n\n` +

                                `💳 **Số dư:** ${money(
                                    user.money - bet
                                )} xu`

                            )

                        ],

                        ephemeral: true

                    });

                    await updateMessage();

                } catch (err) {

                    console.error(
                        "TAIXIU MODAL ERROR:",
                        err
                    );

                    if (
                        !interaction.replied &&
                        !interaction.deferred
                    ) {

                        await interaction.reply({

                            content:
                                "❌ Có lỗi xảy ra khi đặt cược.",

                            ephemeral: true

                        });

                    }

                }

            }
        );

        // ==================================================
        // TIMER
        // ==================================================

        const timer =
            setInterval(
                async () => {

                    time--;

                    if (
                        time <= 0
                    ) {

                        clearInterval(
                            timer
                        );

                        collector.stop(
                            "time"
                        );

                        await endGame(
                            msg
                        );

                        return;

                    }

                    await updateMessage();

                },
                1000
            );

        // ==================================================
        // COLLECTOR END
        // ==================================================

        collector.on(
            "end",
            async (
                collected,
                reason
            ) => {

                if (
                    reason !== "time"
                ) {

                    clearInterval(
                        timer
                    );

                }

            }
        );

    }

};

// ======================================================
// END GAME
// ======================================================

async function endGame(msg) {

    const game =
        closeGame();

    if (!game)
        return;

    // ==================================================
    // DICE
    // ==================================================

    const dice = [

        Math.floor(
            Math.random() * 6
        ) + 1,

        Math.floor(
            Math.random() * 6
        ) + 1,

        Math.floor(
            Math.random() * 6
        ) + 1

    ];

    const total =
        dice[0] +
        dice[1] +
        dice[2];

    const isTai =
        total >= 11;

    const isChan =
        total % 2 === 0;

    // ==================================================
    // RESULTS
    // ==================================================

    const resultsByUser =
        new Map();

    for (
        const p
        of game.players
    ) {

        const user =
            getUser(p.id);

        if (!user)
            continue;

        let win = false;

        let payout = 1;

        // ==============================================
        // CHECK WIN
        // ==============================================

        if (
            p.type === "tai"
        ) {

            win = isTai;

        }

        else if (
            p.type === "xiu"
        ) {

            win = !isTai;

        }

        else if (
            p.type === "chan"
        ) {

            win = isChan;

        }

        else if (
            p.type === "le"
        ) {

            win = !isChan;

        }

        else if (
            p.type === "so"
        ) {

            win =
                p.number === total;

            payout =
                SO_PAYOUT[
                    p.number
                ] || 1;

        }

        // ==============================================
        // RESULT OBJECT
        // ==============================================

        if (
            !resultsByUser.has(
                p.id
            )
        ) {

            resultsByUser.set(
                p.id,
                {
                    lines: [],
                    net: 0
                }
            );

        }

        const entry =
            resultsByUser.get(
                p.id
            );

        // ==============================================
        // WIN
        // ==============================================

        if (win) {

            const reward =
                p.money * payout;

            user.money += reward;

            entry.net +=
                reward;

            entry.lines.push(

                `✅ ${nhanCua(p)} ` +
                `+${money(reward)} xu`

            );

        }

        // ==============================================
        // LOSE
        // ==============================================

        else {

            user.money -=
                p.money;

            entry.net -=
                p.money;

            entry.lines.push(

                `❌ ${nhanCua(p)} ` +
                `-${money(p.money)} xu`

            );

        }

    }

    // ==================================================
    // SAVE
    // ==================================================

    save();

    // ==================================================
    // TEXT RESULT
    // ==================================================

    let resultText = "";

    for (
        const [
            id,
            entry
        ]
        of resultsByUser
    ) {

        let status;

        if (
            entry.net > 0
        ) {

            status =
                `💚 Lời **${money(
                    entry.net
                )} xu**`;

        }

        else if (
            entry.net < 0
        ) {

            status =
                `❤️ Lỗ **${money(
                    Math.abs(
                        entry.net
                    )
                )} xu**`;

        }

        else {

            status =
                "➖ Hòa vốn";

        }

        resultText +=

            `<@${id}>\n` +
            `${entry.lines.join("\n")}\n` +
            `${status}\n\n`;

    }

    // ==================================================
    // MENTIONS
    // ==================================================

    const mentions =
        [
            ...resultsByUser.keys()
        ]
            .map(
                id =>
                    `<@${id}>`
            )
            .join(" ");

    // ==================================================
    // RESULT EMBED
    // ==================================================

    await msg.edit({

        content:
            mentions || undefined,

        embeds: [

            createEmbed(

                "#86EFAC",

                "🎲 KẾT QUẢ TÀI XỈU",

                `🎲 **Xúc xắc:**\n` +
                `> ${dice.join("  ·  ")}\n\n` +

                `🔢 **Tổng:**\n` +
                `> **${total}** · ` +
                `${isTai ? "🔴 TÀI" : "🔵 XỈU"} · ` +
                `${isChan ? "⚫ CHẴN" : "⚪ LẺ"}\n\n` +

                `👥 **Kết quả cược**\n` +
                `${resultText || "Không có ai cược."}`

            )

        ],

        components: []

    });

}
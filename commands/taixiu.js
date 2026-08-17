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
// FURINA QUOTES
// ======================================================

const FURINA_QUOTES = {
    start: [
        "“Màn diễn bắt đầu.” — Furina",
        "“Hãy để số phận lên tiếng.” — Furina",
        "“Khán giả đã sẵn sàng chưa?” — Furina",
        "“Một ván cược thú vị đấy.” — Furina"
    ],
    betting: [
        "“Chọn thật cẩn thận.” — Furina",
        "“Đừng để vận may vuột mất.” — Furina",
        "“Số phận đang dõi theo ngươi.” — Furina",
        "“Nhanh lên nào.” — Furina"
    ],
    warning: [
        "“Sắp đến hồi kết rồi.” — Furina",
        "“Thời gian không còn nhiều.” — Furina",
        "“Khoảnh khắc quyết định.” — Furina"
    ],
    result: [
        "“Và đây là kết quả.” — Furina",
        "“Màn diễn đã hạ màn.” — Furina",
        "“Số phận đã lên tiếng.” — Furina",
        "“Xin chúc mừng người chiến thắng.” — Furina"
    ]
};

function randomFurinaQuote(type) {
    const quotes = FURINA_QUOTES[type] || FURINA_QUOTES.betting;
    return quotes[Math.floor(Math.random() * quotes.length)];
}

// ======================================================
// EMBED
// ======================================================

function createEmbed(color, title, description) {
    return new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setDescription(
            `୨୧ ───────── ୨୧\n\n` +
            description +
            `\n\n୨୧ ───────── ୨୧`
        )
        .setFooter({
            text: "✦ Furina · Fontaine · Tài Xỉu"
        })
        .setTimestamp();
}

// ======================================================
// TÊN CỬA
// ======================================================

function nhanCua(p) {
    if (p.type === "tai") return "🔴 TÀI";
    if (p.type === "xiu") return "🔵 XỈU";
    if (p.type === "chan") return "⚫ CHẴN";
    if (p.type === "le") return "⚪ LẺ";
    if (p.type === "so") return `🔢 SỐ ${p.number}`;
    return "❔ KHÔNG RÕ";
}

// ======================================================
// SYMBOL CỬA
// ======================================================

function symbolCua(type) {
    if (type === "tai") return "✦ TÀI";
    if (type === "xiu") return "✧ XỈU";
    if (type === "chan") return "◇ CHẴN";
    if (type === "le") return "❖ LẺ";
    if (type === "so") return "♢ CHỌN SỐ";
    return "❔";
}

// ======================================================
// FORMAT MONEY
// ======================================================

function money(value) {
    return Number(value || 0).toLocaleString("en-US");
}

// ======================================================
// TỔNG CƯỢC
// ======================================================

function tongCuoc(game) {
    if (!game || !Array.isArray(game.players)) {
        return 0;
    }

    return game.players.reduce(
        (sum, p) => sum + Number(p.money || 0),
        0
    );
}

// ======================================================
// SỐ NGƯỜI CƯỢC
// ======================================================

function soNguoiCuoc(game) {
    if (!game || !Array.isArray(game.players)) {
        return 0;
    }

    return new Set(
        game.players.map(p => p.id)
    ).size;
}

// ======================================================
// BUTTONS
// ======================================================

function createRows() {
    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("tx_tai")
            .setLabel("✦ TÀI")
            .setStyle(ButtonStyle.Danger),

        new ButtonBuilder()
            .setCustomId("tx_xiu")
            .setLabel("✧ XỈU")
            .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
            .setCustomId("tx_chan")
            .setLabel("◇ CHẴN")
            .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
            .setCustomId("tx_le")
            .setLabel("❖ LẺ")
            .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
            .setCustomId("tx_so")
            .setLabel("♢ CHỌN SỐ")
            .setStyle(ButtonStyle.Success)
    );

    return [row];
}

// ======================================================
// MODAL CƯỢC
// ======================================================

function createBetModal(type) {
    const names = {
        tai: "✦ TÀI",
        xiu: "✧ XỈU",
        chan: "◇ CHẴN",
        le: "❖ LẺ"
    };

    const modal = new ModalBuilder()
        .setCustomId(`txbet_${type}`)
        .setTitle(`Cược ${names[type]}`);

    const input = new TextInputBuilder()
        .setCustomId("money")
        .setLabel("Số tiền cược")
        .setPlaceholder("Ví dụ: 10000")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    modal.addComponents(
        new ActionRowBuilder().addComponents(input)
    );

    return modal;
}

// ======================================================
// MODAL CHỌN SỐ
// ======================================================

function createNumberModal() {
    const modal = new ModalBuilder()
        .setCustomId("txbet_so")
        .setTitle("♢ CƯỢC CHỌN SỐ");

    const numberInput = new TextInputBuilder()
        .setCustomId("sonum")
        .setLabel("Tổng 3 xúc xắc")
        .setPlaceholder("Nhập số từ 3 đến 18")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const moneyInput = new TextInputBuilder()
        .setCustomId("money")
        .setLabel("Số tiền cược")
        .setPlaceholder("Ví dụ: 10000")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    modal.addComponents(
        new ActionRowBuilder().addComponents(numberInput),
        new ActionRowBuilder().addComponents(moneyInput)
    );

    return modal;
}

// ======================================================
// ERROR
// ======================================================

async function errorReply(interaction, title, description) {
    if (interaction.replied || interaction.deferred) {
        return;
    }

    await interaction.reply({
        embeds: [
            createEmbed(
                "#F3B6C2",
                title,
                description
            )
        ],
        ephemeral: true
    });
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
                        "#F3C6D0",
                        "✧ TÀI XỈU",
                        `${randomFurinaQuote("betting")}\n\n` +
                        `> ♡ Một ván đang diễn ra.\n` +
                        `> Hãy chờ màn diễn kết thúc.`
                    )
                ]
            });
        }

        // ==================================================
        // CREATE GAME
        // ==================================================

        const game = createGame();

        let time = 30;

        // ==================================================
        // MESSAGE BAN ĐẦU
        // ==================================================

        const msg = await message.channel.send({
            embeds: [
                createEmbed(
                    "#B9D7F5",
                    "✦ TÀI XỈU",
                    `${randomFurinaQuote("start")}\n\n` +

                    `**✦ TÀI — ✧ XỈU | ◇ CHẴN — ❖ LẺ**\n` +
                    `**♢ CHỌN SỐ**\n\n` +

                    `> ⏳ **Thời gian:** \`30 giây\`\n` +
                    `> 👥 **Người cược:** \`0 người\`\n` +
                    `> 💰 **Tổng cược:** \`0 xu\`\n\n` +

                    `*Chọn cửa bên dưới và nhập số xu muốn cược.*`
                )
            ],
            components: createRows()
        });

        // ==================================================
        // UPDATE EMBED
        // ==================================================

        const updateMessage = async () => {
            if (!game) return;

            try {
                const playerCount = soNguoiCuoc(game);
                const totalBet = tongCuoc(game);

                const quote =
                    time <= 10
                        ? randomFurinaQuote("warning")
                        : randomFurinaQuote("betting");

                await msg.edit({
                    embeds: [
                        createEmbed(
                            "#B9D7F5",
                            "✦ TÀI XỈU",
                            `${quote}\n\n` +

                            `**✦ TÀI — ✧ XỈU | ◇ CHẴN — ❖ LẺ**\n` +
                            `**♢ CHỌN SỐ**\n\n` +

                            `> ⏳ **Còn lại:** \`${Math.max(time, 0)} giây\`\n` +
                            `> 👥 **Người cược:** \`${playerCount} người\`\n` +
                            `> 💰 **Tổng cược:** \`${money(totalBet)} xu\`\n\n` +

                            `*Hãy chọn thật cẩn thận...*`
                        )
                    ],
                    components: time > 0 ? createRows() : []
                });

            } catch (err) {
                console.error(
                    "TAIXIU UPDATE ERROR:",
                    err
                );
            }
        };

        // ==================================================
        // BUTTON COLLECTOR
        // ==================================================

        const collector =
            msg.createMessageComponentCollector({
                time: 30000
            });

        collector.on(
            "collect",
            async interaction => {

                try {

                    // ======================================
                    // CHỌN SỐ
                    // ======================================

                    if (
                        interaction.customId ===
                        "tx_so"
                    ) {

                        await interaction.showModal(
                            createNumberModal()
                        );

                        return;
                    }

                    // ======================================
                    // CỬA
                    // ======================================

                    const typeMap = {
                        tx_tai: "tai",
                        tx_xiu: "xiu",
                        tx_chan: "chan",
                        tx_le: "le"
                    };

                    const type =
                        typeMap[
                            interaction.customId
                        ];

                    if (!type) return;

                    await interaction.showModal(
                        createBetModal(type)
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
        // MODAL HANDLER
        // ==================================================

        const handleModal =
            async interaction => {

                if (!interaction.isModalSubmit()) {
                    return;
                }

                const customId =
                    interaction.customId;

                if (
                    !customId.startsWith(
                        "txbet_"
                    )
                ) {
                    return;
                }

                try {

                    let type = null;
                    let bet = 0;
                    let number = null;

                    // ==================================
                    // CHỌN SỐ
                    // ==================================

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

                    // ==================================
                    // CỬA THƯỜNG
                    // ==================================

                    else {

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

                    // ==================================
                    // CHECK GAME
                    // ==================================

                    if (
                        !game ||
                        !getGame()
                    ) {

                        return errorReply(
                            interaction,
                            "✧ VÁN ĐÃ KẾT THÚC",
                            "Ván Tài Xỉu này đã kết thúc."
                        );
                    }

                    // ==================================
                    // CHECK TIME
                    // ==================================

                    if (time <= 0) {

                        return errorReply(
                            interaction,
                            "✧ HẾT THỜI GIAN",
                            "Thời gian đặt cược đã kết thúc."
                        );
                    }

                    // ==================================
                    // CHECK TYPE
                    // ==================================

                    if (
                        ![
                            "tai",
                            "xiu",
                            "chan",
                            "le",
                            "so"
                        ].includes(type)
                    ) {

                        return errorReply(
                            interaction,
                            "❖ CỬA KHÔNG HỢP LỆ",
                            "Cửa cược không hợp lệ."
                        );
                    }

                    // ==================================
                    // CHECK NUMBER
                    // ==================================

                    if (type === "so") {

                        if (
                            !Number.isInteger(number) ||
                            number < 3 ||
                            number > 18
                        ) {

                            return errorReply(
                                interaction,
                                "♢ SỐ KHÔNG HỢP LỆ",
                                "Số dự đoán phải nằm trong khoảng **3 → 18**."
                            );
                        }
                    }

                    // ==================================
                    // CHECK MONEY
                    // ==================================

                    if (
                        !Number.isSafeInteger(bet) ||
                        bet <= 0
                    ) {

                        return errorReply(
                            interaction,
                            "✧ TIỀN CƯỢC KHÔNG HỢP LỆ",
                            "Số tiền cược phải là số nguyên lớn hơn 0."
                        );
                    }

                    // ==================================
                    // USER
                    // ==================================

                    const user =
                        getUser(
                            interaction.user.id
                        );

                    if (!user) {

                        return errorReply(
                            interaction,
                            "❖ LỖI DỮ LIỆU",
                            "Không tìm thấy dữ liệu người chơi."
                        );
                    }

                    // ==================================
                    // BALANCE
                    // ==================================

                    if (
                        Number(user.money || 0) <
                        bet
                    ) {

                        return errorReply(
                            interaction,
                            "♡ KHÔNG ĐỦ TIỀN",
                            `Bạn đang có **${money(user.money)} xu**.\n\n` +
                            `Cần **${money(bet)} xu** để đặt cược.`
                        );
                    }

                    // ==================================
                    // PUSH BET
                    // ==================================

                    game.players.push({
                        id: interaction.user.id,
                        type,
                        number,
                        money: bet
                    });

                    // ==================================
                    // SUCCESS
                    // ==================================

                    await interaction.reply({
                        embeds: [
                            createEmbed(
                                "#B7E4C7",
                                "✦ ĐẶT CƯỢC THÀNH CÔNG",
                                `${randomFurinaQuote("betting")}\n\n` +

                                `> 🎯 **Cửa:** ${symbolCua(type)}${type === "so" ? ` \`${number}\`` : ""}\n` +
                                `> 💰 **Cược:** \`${money(bet)} xu\`\n` +
                                `> ♡ **Số dư:** \`${money(user.money - bet)} xu\`\n\n` +

                                `*Lựa chọn đã được ghi nhận.*`
                            )
                        ],
                        ephemeral: true
                    });

                    // ==================================
                    // UPDATE
                    // ==================================

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
                                "❖ Có lỗi xảy ra khi đặt cược.",
                            ephemeral: true
                        });
                    }
                }
            };

        // ==================================================
        // CLIENT MODAL LISTENER
        // ==================================================

        const client =
            message.client;

        client.on(
            "interactionCreate",
            handleModal
        );

        // ==================================================
        // TIMER
        // ==================================================

        const timer =
            setInterval(
                async () => {

                    time--;

                    if (time <= 0) {

                        clearInterval(timer);

                        collector.stop("time");

                        client.off(
                            "interactionCreate",
                            handleModal
                        );

                        await endGame(msg);

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

                if (reason !== "time") {
                    clearInterval(timer);
                }

                client.off(
                    "interactionCreate",
                    handleModal
                );
            }
        );
    }
};

// ======================================================
// END GAME
// ======================================================

async function endGame(msg) {

    const game = closeGame();

    if (!game) return;

    // ==================================================
    // DICE
    // ==================================================

    const dice = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
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

    for (const p of game.players) {

        const user =
            getUser(p.id);

        if (!user) continue;

        let win = false;
        let payout = 1;

        // ==============================================
        // CHECK WIN
        // ==============================================

        if (p.type === "tai") {
            win = isTai;
        }

        else if (p.type === "xiu") {
            win = !isTai;
        }

        else if (p.type === "chan") {
            win = isChan;
        }

        else if (p.type === "le") {
            win = !isChan;
        }

        else if (p.type === "so") {

            win =
                p.number === total;

            payout =
                SO_PAYOUT[p.number] || 1;
        }

        // ==============================================
        // RESULT USER
        // ==============================================

        if (!resultsByUser.has(p.id)) {

            resultsByUser.set(
                p.id,
                {
                    wins: [],
                    losses: [],
                    net: 0
                }
            );
        }

        const entry =
            resultsByUser.get(p.id);

        // ==============================================
        // WIN
        // ==============================================

        if (win) {

            const reward =
                p.money * payout;

            user.money += reward;

            entry.net += reward;

            entry.wins.push({
                type: nhanCua(p),
                bet: p.money,
                reward
            });

        }

        // ==============================================
        // LOSE
        // ==============================================

        else {

            user.money -= p.money;

            entry.net -= p.money;

            entry.losses.push({
                type: nhanCua(p),
                bet: p.money
            });
        }
    }

    // ==================================================
    // SAVE
    // ==================================================

    save();

    // ==================================================
    // PLAYER COUNT
    // ==================================================

    const playerCount =
        soNguoiCuoc(game);

    const totalBet =
        tongCuoc(game);

    // ==================================================
    // WINNER TEXT
    // ==================================================

    let winnerText = "";

    for (
        const [id, entry]
        of resultsByUser
    ) {

        if (!entry.wins.length) {
            continue;
        }

        const member =
            msg.guild?.members.cache.get(id);

        const displayName =
            member?.displayName ||
            "Người chơi";

        for (
            const win
            of entry.wins
        ) {

            winnerText +=
                `**${displayName}**\n` +
                `> 🎯 ${win.type}\n` +
                `> 💰 Cược: \`${money(win.bet)} xu\`\n` +
                `> ✦ Nhận: **+${money(win.reward)} xu**\n\n`;
        }
    }

    if (!winnerText) {

        winnerText =
            `> ❖ Không có người chiến thắng.`;
    }

    // ==================================================
    // DELETE OLD EMBED
    // ==================================================

    try {

        await msg.delete();

    } catch (err) {

        console.error(
            "TAIXIU DELETE ERROR:",
            err
        );
    }

    // ==================================================
    // RESULT
    // ==================================================

    const resultColor =
        isTai
            ? "#F3B0BC"
            : "#AFCBF2";

    const resultEmbed =
        createEmbed(
            resultColor,
            "❖ KẾT QUẢ TÀI XỈU",
            `${randomFurinaQuote("result")}\n\n` +

            `**🎲 XÚC XẮC**\n` +
            `> \`${dice[0]}\` · \`${dice[1]}\` · \`${dice[2]}\`\n\n` +

            `**🔢 TỔNG**\n` +
            `> **${total}**\n\n` +

            `**🎯 KẾT QUẢ**\n` +
            `> ${isTai ? "🔴 **TÀI**" : "🔵 **XỈU**"}\n` +
            `> ${isChan ? "⚫ **CHẴN**" : "⚪ **LẺ**"}\n\n` +

            `**♡ VÁN ĐẤU**\n` +
            `> 👥 \`${playerCount} người\`\n` +
            `> 💰 \`${money(totalBet)} xu\`\n\n` +

            `**✦ NGƯỜI CHIẾN THẮNG**\n` +
            `${winnerText}`
        );

    // ==================================================
    // SEND NEW MESSAGE
    // ==================================================

    await msg.channel.send({
        embeds: [
            resultEmbed
        ],
        allowedMentions: {
            parse: []
        }
    });
}
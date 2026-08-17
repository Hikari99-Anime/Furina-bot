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
// FURINA RANDOM QUOTES
// ======================================================

const FURINA_QUOTES = {

    start: [
        "“Một màn trình diễn mới sắp bắt đầu...” — Furina",
        "“Khán giả đã sẵn sàng chưa? Vở diễn chính thức bắt đầu!” — Furina",
        "“Hãy để ta xem hôm nay, số phận sẽ mỉm cười với ai.” — Furina",
        "“Mọi ánh mắt hướng lên sân khấu. Màn trình diễn bắt đầu!” — Furina",
        "“Fontaine hôm nay thật náo nhiệt... thật thích hợp cho một ván cược.” — Furina"
    ],

    betting: [
        "“Hãy lựa chọn thật cẩn thận... số phận đang dõi theo ngươi.” — Furina",
        "“Đừng chỉ đứng nhìn! Hãy đưa ra lựa chọn của ngươi!” — Furina",
        "“Một quyết định nhỏ cũng có thể thay đổi toàn bộ màn diễn.” — Furina",
        "“Hmm... ta đang rất tò mò xem vận may thuộc về ai.” — Furina",
        "“Nhanh lên nào, sân khấu không chờ đợi bất kỳ ai.” — Furina"
    ],

    warning: [
        "“Nhanh lên nào... màn diễn sắp đến hồi kết rồi.” — Furina",
        "“Chỉ còn một chút thời gian! Đừng để cơ hội vụt mất!” — Furina",
        "“Màn kịch sắp đến hồi cao trào rồi!” — Furina",
        "“Khoảnh khắc quyết định đang đến gần...” — Furina",
        "“Số phận sắp được hé lộ... thật hồi hộp!” — Furina"
    ],

    result: [
        "“Và đây... chính là khoảnh khắc mà tất cả chúng ta chờ đợi.” — Furina",
        "“Vở diễn đã hạ màn. Hãy xem ai là người được số phận mỉm cười.” — Furina",
        "“Một kết quả thật đáng nhớ... xin chúc mừng người chiến thắng!” — Furina",
        "“Màn trình diễn kết thúc, nhưng câu chuyện của người chiến thắng mới bắt đầu.” — Furina",
        "“Một màn trình diễn tuyệt đẹp... quả nhiên rất xứng đáng với Fontaine.” — Furina"
    ]
};

function randomFurinaQuote(type) {

    const quotes =
        FURINA_QUOTES[type] ||
        FURINA_QUOTES.betting;

    return quotes[
        Math.floor(
            Math.random() * quotes.length
        )
    ];
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
            text: "✦ Furina · Fontaine · Tài Xỉu"
        })

        .setTimestamp();
}

// ======================================================
// TÊN CỬA
// ======================================================

function nhanCua(p) {

    if (p.type === "tai")
        return "✦ TÀI";

    if (p.type === "xiu")
        return "✧ XỈU";

    if (p.type === "chan")
        return "◇ CHẴN";

    if (p.type === "le")
        return "❖ LẺ";

    if (p.type === "so")
        return `♢ SỐ ${p.number}`;

    return "◇ KHÔNG RÕ";
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

    if (
        !game ||
        !Array.isArray(game.players)
    ) {
        return 0;
    }

    return game.players.reduce(
        (sum, p) =>
            sum + Number(p.money || 0),
        0
    );
}

// ======================================================
// SỐ NGƯỜI CƯỢC
// ======================================================

function soNguoiCuoc(game) {

    if (
        !game ||
        !Array.isArray(game.players)
    ) {
        return 0;
    }

    return new Set(
        game.players.map(
            p => p.id
        )
    ).size;
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

        return "*Chưa có ai đặt cược...*";
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
            `<@${id}>\n` +
            `└ ${bets.join(" · ")}`
        );

    }

    return lines.join("\n\n");
}

// ======================================================
// ROW NÚT
// ======================================================

function createRows() {

    const row =
        new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                    .setCustomId("tx_tai")
                    .setLabel("✦ TÀI")
                    .setStyle(
                        ButtonStyle.Danger
                    ),

                new ButtonBuilder()
                    .setCustomId("tx_xiu")
                    .setLabel("✧ XỈU")
                    .setStyle(
                        ButtonStyle.Primary
                    ),

                new ButtonBuilder()
                    .setCustomId("tx_chan")
                    .setLabel("◇ CHẴN")
                    .setStyle(
                        ButtonStyle.Secondary
                    ),

                new ButtonBuilder()
                    .setCustomId("tx_le")
                    .setLabel("❖ LẺ")
                    .setStyle(
                        ButtonStyle.Secondary
                    ),

                new ButtonBuilder()
                    .setCustomId("tx_so")
                    .setLabel("♢ CHỌN SỐ")
                    .setStyle(
                        ButtonStyle.Success
                    )

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

    const modal =
        new ModalBuilder()
            .setCustomId(
                `txbet_${type}`
            )
            .setTitle(
                `Cược ${names[type]}`
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
                "♢ CƯỢC CHỌN SỐ"
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
// ERROR REPLY
// ======================================================

async function errorReply(
    interaction,
    title,
    description
) {

    if (
        interaction.replied ||
        interaction.deferred
    ) {
        return;
    }

    await interaction.reply({

        embeds: [

            createEmbed(
                "#F7C8D0",
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

                        "#F8D49D",

                        "✧ 𝑻à𝒊 𝑿ỉ𝒖",

                        `*“Một ván vẫn đang diễn ra... hãy kiên nhẫn.”* — Furina

> ♡ **Ván hiện tại chưa kết thúc.**

Hãy chờ màn trình diễn hiện tại hạ màn
rồi tham gia ván tiếp theo.`

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

                        "#B8D8FF",

                        "✦ 𝑻à𝒊 𝑿ỉ𝒖",

                        `${randomFurinaQuote("start")}

**✦ TÀI**
**✧ XỈU**
**◇ CHẴN**
**❖ LẺ**
**♢ CHỌN SỐ**

Chọn một cửa bên dưới và nhập
số xu mà bạn muốn đặt cược.

**👥 Người đặt cược**
> \`0 người\`

**💰 Tổng cược**
> \`0 xu\`

*Fontaine đang chờ đợi lựa chọn của bạn...*`

                    )

                ],

                components:
                    createRows()

            });

        // ==================================================
        // UPDATE MESSAGE
        // ==================================================

        const updateMessage =
            async () => {

                if (!game)
                    return;

                try {

                    const players =
                        danhSachCuoc(game);

                    const playerCount =
                        soNguoiCuoc(game);

                    const totalBet =
                        tongCuoc(game);

                    const quote =
                        time <= 10
                            ? randomFurinaQuote(
                                "warning"
                            )
                            : randomFurinaQuote(
                                "betting"
                            );

                    await msg.edit({

                        embeds: [

                            createEmbed(

                                "#B8D8FF",

                                "✦ 𝑻à𝒊 𝑿ỉ𝒖",

                                `${quote}

> ⏳ **Còn lại:** \`${Math.max(time, 0)} giây\`

**✦ TÀI**
**✧ XỈU**
**◇ CHẴN**
**❖ LẺ**
**♢ CHỌN SỐ**

**👥 Người đặt cược**
> \`${playerCount} người\`

**💰 Tổng cược**
> \`${money(totalBet)} xu\`

${playerCount > 0
    ? `**Danh sách cược**

${players}`
    : "*Chưa có ai đặt cược...*"
}

*Hãy chọn thật cẩn thận...*
*...số phận đang dõi theo ngươi.*`

                            )

                        ],

                        components:
                            time > 0
                                ? createRows()
                                : []

                    });

                } catch (err) {

                    console.error(
                        "TAIXIU UPDATE ERROR:",
                        err
                    );

                }

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

                        await interaction.showModal(
                            createNumberModal()
                        );

                        return;

                    }

                    // ==========================================
                    // CỬA THƯỜNG
                    // ==========================================

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

                    if (!type)
                        return;

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
        // HANDLE MODAL
        // ==================================================

        const handleModal =
            async interaction => {

                if (
                    !interaction.isModalSubmit()
                ) {
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

                    // ==========================================
                    // CHECK GAME
                    // ==========================================

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

                    // ==========================================
                    // CHECK TIME
                    // ==========================================

                    if (time <= 0) {

                        return errorReply(
                            interaction,
                            "✧ HẾT THỜI GIAN",
                            "Thời gian đặt cược đã kết thúc."
                        );

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

                        return errorReply(
                            interaction,
                            "❖ CỬA KHÔNG HỢP LỆ",
                            "Cửa cược không hợp lệ."
                        );

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

                            return errorReply(
                                interaction,
                                "♢ SỐ KHÔNG HỢP LỆ",
                                "Số dự đoán phải nằm trong khoảng **3 → 18**."
                            );

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

                        return errorReply(
                            interaction,
                            "✧ TIỀN CƯỢC KHÔNG HỢP LỆ",
                            "Số tiền cược phải là số nguyên lớn hơn 0."
                        );

                    }

                    // ==========================================
                    // USER
                    // ==========================================

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

                    // ==========================================
                    // CHECK BALANCE
                    // ==========================================

                    if (
                        Number(
                            user.money || 0
                        ) < bet
                    ) {

                        return errorReply(
                            interaction,
                            "♡ KHÔNG ĐỦ TIỀN",
                            `Bạn đang có **${money(
                                user.money
                            )} xu**.

Cần ít nhất **${money(
                                bet
                            )} xu** để đặt cược.`
                        );

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
                    // SUCCESS
                    // ==========================================

                    await interaction.reply({

                        embeds: [

                            createEmbed(

                                "#B7E4C7",

                                "✦ 𝑪𝒖̛𝒐̛̣𝒄 𝑻𝒉𝒂̀𝒏𝒉 𝑪𝒐̂𝒏𝒈",

                                `${randomFurinaQuote("betting")}

**${nhanCua({
    type,
    number
})}**

> 💰 **Tiền cược:** \`${money(
    bet
)} xu\`

> ♡ **Số dư:** \`${money(
    user.money - bet
)} xu\`

*Lựa chọn của bạn đã được ghi nhận.*`

                            )

                        ],

                        ephemeral: true

                    });

                    // ==========================================
                    // UPDATE EMBED
                    // ==========================================

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

                    if (
                        time <= 0
                    ) {

                        clearInterval(
                            timer
                        );

                        collector.stop(
                            "time"
                        );

                        client.off(
                            "interactionCreate",
                            handleModal
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
        // USER RESULT
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
                    net: 0,
                    wins: []
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

            user.money +=
                reward;

            entry.net +=
                reward;

            entry.wins.push({

                type:
                    nhanCua(p),

                bet:
                    p.money,

                reward

            });

        }

        // ==============================================
        // LOSE
        // ==============================================

        else {

            user.money -=
                p.money;

            entry.net -=
                p.money;

        }

    }

    // ==================================================
    // SAVE
    // ==================================================

    save();

    // ==================================================
    // WINNERS
    // ==================================================

    let winnerText = "";

    for (
        const [
            id,
            entry
        ]
        of resultsByUser
    ) {

        if (
            !entry.wins.length
        ) {
            continue;
        }

        const member =
            msg.guild?.members.cache.get(
                id
            );

        const displayName =
            member?.displayName ||
            `<@${id}>`;

        for (
            const win
            of entry.wins
        ) {

            winnerText +=

                `**${displayName}**\n` +

                `> ${win.type}\n` +

                `> ♡ Cược: \`${money(
                    win.bet
                )} xu\`\n` +

                `> ✦ Nhận: **+${money(
                    win.reward
                )} xu**\n\n`;

        }

    }

    // ==================================================
    // NO WINNER
    // ==================================================

    if (!winnerText) {

        winnerText =
            "*Không có người chiến thắng trong ván này...*";

    }

    // ==================================================
    // PLAYER COUNT
    // ==================================================

    const playerCount =
        soNguoiCuoc(game);

    const totalBet =
        tongCuoc(game);

    // ==================================================
    // RESULT COLOR
    // ==================================================

    const resultColor =
        isTai
            ? "#F2A7B5"
            : "#A8C7FA";

    // ==================================================
    // DELETE OLD MESSAGE
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
    // RESULT EMBED
    // ==================================================

    const resultEmbed =
        createEmbed(

            resultColor,

            "❖ 𝑲ế𝒕 𝑸𝒖ả 𝑻à𝒊 𝑿ỉ𝒖",

            `${randomFurinaQuote("result")}

**🎲 Xúc xắc**

> \`${dice[0]}\` · \`${dice[1]}\` · \`${dice[2]}\`

**◇ Tổng**

> **${total}**

**✦ Kết quả**

> ${isTai
                ? "✦ **TÀI**"
                : "✧ **XỈU**"
            }

> ${isChan
                ? "◇ **CHẴN**"
                : "❖ **LẺ**"
            }

**♡ Ván đấu**

> 👥 \`${playerCount} người\`
> 💰 \`${money(totalBet)} xu\`

**WINNER**

${winnerText}

*“Một màn trình diễn tuyệt đẹp... xin chúc mừng những người chiến thắng.”* ♡`

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
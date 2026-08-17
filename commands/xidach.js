const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const {
    prefix,
    emoji,
    formatMoney
} = require("../config");

const {
    getUser,
    save
} = require("../data");

// ======================================================
// TẠO BỘ BÀI
// ======================================================

function taoBoBai() {
    const ranks = [
        "2", "3", "4", "5", "6", "7",
        "8", "9", "10", "J", "Q", "K", "A"
    ];

    const suits = [
        "♠",
        "♥",
        "♦",
        "♣"
    ];

    const deck = [];

    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({
                rank,
                suit
            });
        }
    }

    // Fisher-Yates shuffle
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(
            Math.random() * (i + 1)
        );

        [deck[i], deck[j]] = [
            deck[j],
            deck[i]
        ];
    }

    return deck;
}

// ======================================================
// GIÁ TRỊ BÀI
// ======================================================

function giaTri(rank) {
    if (rank === "A") {
        return 1;
    }

    if (
        rank === "J" ||
        rank === "Q" ||
        rank === "K"
    ) {
        return 10;
    }

    return Number(rank);
}

// ======================================================
// TỔNG ĐIỂM
// ======================================================

function tongDiem(hand) {
    return hand.reduce(
        (sum, card) =>
            sum + giaTri(card.rank),
        0
    );
}

// ======================================================
// HIỂN THỊ BÀI
// ======================================================

function hienThi(hand) {
    return hand
        .map(
            card =>
                `${card.rank}${card.suit}`
        )
        .join("  ");
}

// ======================================================
// XÌ DÁCH
// ======================================================

function laXiDach(hand) {
    if (hand.length !== 2) {
        return false;
    }

    const hasAce = hand.some(
        card =>
            card.rank === "A"
    );

    const hasTen = hand.some(
        card =>
            giaTri(card.rank) === 10
    );

    return hasAce && hasTen;
}

// ======================================================
// NGŨ LINH
// ======================================================

function laNguLinh(hand) {
    return (
        hand.length >= 5 &&
        tongDiem(hand) <= 21
    );
}

// ======================================================
// EMBED
// ======================================================

function taoEmbed(
    color,
    title,
    description
) {
    return new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setDescription(description)
        .setFooter({
            text: "✦ Furina · Fontaine · Xì Dách"
        })
        .setTimestamp();
}

// ======================================================
// NÚT
// ======================================================

function taoButtons(userId) {
    return new ActionRowBuilder()
        .addComponents(

            new ButtonBuilder()
                .setCustomId(
                    `xidach_hit_${userId}`
                )
                .setLabel(
                    "✦ RÚT BÀI"
                )
                .setStyle(
                    ButtonStyle.Primary
                ),

            new ButtonBuilder()
                .setCustomId(
                    `xidach_stand_${userId}`
                )
                .setLabel(
                    "✧ DỪNG"
                )
                .setStyle(
                    ButtonStyle.Secondary
                )

        );
}

// ======================================================
// COMMAND
// ======================================================

module.exports = {

    name: "xidach",

    aliases: [
        "xd"
    ],

    async execute(
        message,
        args
    ) {

        // ==================================================
        // KIỂM TRA CƯỢC
        // ==================================================

        const bet =
            Number(args[0]);

        if (
            !Number.isSafeInteger(bet) ||
            bet <= 0
        ) {

            return message.reply({

                embeds: [

                    taoEmbed(
                        "#F7C8D0",
                        "✧ CƯỢC KHÔNG HỢP LỆ",

                        `♢ Cách dùng

${prefix}xidach <số tiền>

♢ Ví dụ

${prefix}xidach 10000`
                    )

                ]

            });

        }

        // ==================================================
        // USER
        // ==================================================

        const user =
            getUser(
                message.author.id
            );

        if (!user) {

            return message.reply({

                embeds: [

                    taoEmbed(
                        "#F7C8D0",
                        "❖ KHÔNG TÌM THẤY DỮ LIỆU",

                        `Không tìm thấy dữ liệu người chơi.`
                    )

                ]

            });

        }

        user.money =
            Number(
                user.money || 0
            );

        // ==================================================
        // KIỂM TRA TIỀN
        // ==================================================

        if (
            user.money < bet
        ) {

            return message.reply({

                embeds: [

                    taoEmbed(
                        "#F7C8D0",
                        "✧ KHÔNG ĐỦ FCOIN",

                        `♢ SỐ DƯ

${formatMoney(user.money)} ${emoji.money}

♢ TIỀN CƯỢC

${formatMoney(bet)} ${emoji.money}

Bạn không đủ tiền để bắt đầu ván.`
                    )

                ]

            });

        }

        // ==================================================
        // TRỪ TIỀN NGAY KHI BẮT ĐẦU
        // ==================================================

        user.money -= bet;

        save();

        // ==================================================
        // TẠO BÀI
        // ==================================================

        const deck =
            taoBoBai();

        const playerHand = [
            deck.pop(),
            deck.pop()
        ];

        const dealerHand = [
            deck.pop(),
            deck.pop()
        ];

        // ==================================================
        // TRẠNG THÁI
        // ==================================================

        let finished = false;

        // ==================================================
        // KẾT THÚC
        // ==================================================

        async function ketThuc(
            msg,
            ketQua,
            heSo = 0
        ) {

            if (finished) {
                return;
            }

            finished = true;

            let reward = 0;
            let resultText = "";
            let color = "#A8A8B8";
            let title = "◇ HÒA";

            // ==================================================
            // THẮNG
            // ==================================================

            if (
                ketQua === "win"
            ) {

                reward =
                    Math.floor(
                        bet * heSo
                    );

                user.money += reward;

                resultText =
                    `✦ BẠN THẮNG`;

                color =
                    "#B7E4C7";

                title =
                    "✦ KẾT QUẢ XÌ DÁCH";

            }

            // ==================================================
            // THUA
            // ==================================================

            else if (
                ketQua === "lose"
            ) {

                resultText =
                    `✧ BẠN THUA`;

                color =
                    "#F7C8D0";

                title =
                    "✧ KẾT QUẢ XÌ DÁCH";

            }

            // ==================================================
            // HÒA
            // ==================================================

            else {

                user.money += bet;

                reward = bet;

                resultText =
                    `◇ HÒA`;

                color =
                    "#F5D7A1";

                title =
                    "◇ KẾT QUẢ XÌ DÁCH";

            }

            save();

            const playerScore =
                tongDiem(
                    playerHand
                );

            const dealerScore =
                tongDiem(
                    dealerHand
                );

            let resultDetails = "";

            if (
                ketQua === "win"
            ) {

                resultDetails =
                    `❖ KẾT QUẢ

${resultText}

♢ TIỀN CƯỢC
${formatMoney(bet)} ${emoji.money}

✦ TIỀN NHẬN
+${formatMoney(reward)} ${emoji.money}

◇ SỐ DƯ
${formatMoney(user.money)} ${emoji.money}`;

            }

            else if (
                ketQua === "lose"
            ) {

                resultDetails =
                    `❖ KẾT QUẢ

${resultText}

♢ TIỀN CƯỢC
${formatMoney(bet)} ${emoji.money}

◇ SỐ DƯ
${formatMoney(user.money)} ${emoji.money}`;

            }

            else {

                resultDetails =
                    `❖ KẾT QUẢ

${resultText}

♢ TIỀN CƯỢC
${formatMoney(bet)} ${emoji.money}

✦ HOÀN LẠI
+${formatMoney(bet)} ${emoji.money}

◇ SỐ DƯ
${formatMoney(user.money)} ${emoji.money}`;

            }

            const embed =
                taoEmbed(

                    color,

                    title,

                    `✦ BẠN

${hienThi(playerHand)}
◇ ${playerScore} điểm

✧ NHÀ CÁI

${hienThi(dealerHand)}
◇ ${dealerScore} điểm

────────────────────

${resultDetails}

${randomQuote(ketQua)}`
                );

            try {

                await msg.edit({

                    embeds: [
                        embed
                    ],

                    components: []

                });

            } catch (err) {

                console.error(
                    "XIDACH RESULT ERROR:",
                    err
                );

            }

        }

        // ==================================================
        // THOẠI NGẮN
        // ==================================================

        function randomQuote(type) {

            const quotes = {

                win: [
                    "“Một màn trình diễn tuyệt đẹp.” — Furina",
                    "“Quả nhiên vận may đã mỉm cười.” — Furina",
                    "“Thật xứng đáng với một chiến thắng.” — Furina"
                ],

                lose: [
                    "“Ôi... thật đáng tiếc.” — Furina",
                    "“Có vẻ hôm nay số phận không đứng về phía ngươi.” — Furina",
                    "“Một kết quả ngoài dự đoán...” — Furina"
                ],

                push: [
                    "“Xem ra số phận vẫn chưa chọn ai.” — Furina",
                    "“Một kết quả cân bằng.” — Furina",
                    "“Hai bên đều giữ được vị trí của mình.” — Furina"
                ]

            };

            const list =
                quotes[type] ||
                quotes.push;

            return (
                "\n" +
                list[
                    Math.floor(
                        Math.random() *
                        list.length
                    )
                ]
            );
        }

        // ==================================================
        // NHÀ CÁI
        // ==================================================

        async function nhaCaiChoi(
            msg
        ) {

            while (
                tongDiem(dealerHand) < 17 &&
                dealerHand.length < 5
            ) {

                dealerHand.push(
                    deck.pop()
                );

            }

            const playerScore =
                tongDiem(
                    playerHand
                );

            const dealerScore =
                tongDiem(
                    dealerHand
                );

            // ==================================================
            // NHÀ CÁI XÌ DÁCH
            // ==================================================

            if (
                laXiDach(
                    dealerHand
                )
            ) {

                return ketThuc(
                    msg,
                    "lose"
                );

            }

            // ==================================================
            // NHÀ CÁI NGŨ LINH
            // ==================================================

            if (
                laNguLinh(
                    dealerHand
                )
            ) {

                if (
                    laNguLinh(
                        playerHand
                    )
                ) {

                    return ketThuc(
                        msg,
                        "push"
                    );

                }

                return ketThuc(
                    msg,
                    "lose"
                );

            }

            // ==================================================
            // NHÀ CÁI QUÁ 21
            // ==================================================

            if (
                dealerScore > 21
            ) {

                return ketThuc(
                    msg,
                    "win",
                    2
                );

            }

            // ==================================================
            // SO ĐIỂM
            // ==================================================

            if (
                playerScore >
                dealerScore
            ) {

                return ketThuc(
                    msg,
                    "win",
                    2
                );

            }

            if (
                playerScore <
                dealerScore
            ) {

                return ketThuc(
                    msg,
                    "lose"
                );

            }

            return ketThuc(
                msg,
                "push"
            );

        }

        // ==================================================
        // NGƯỜI CHƠI XÌ DÁCH
        // ==================================================

        if (
            laXiDach(
                playerHand
            )
        ) {

            const reward =
                bet * 3;

            user.money += reward;

            save();

            return message.reply({

                embeds: [

                    taoEmbed(

                        "#F6D77A",

                        "✦ XÌ DÁCH!",

                        `✦ BẠN

${hienThi(playerHand)}
◇ 21 điểm · XÌ DÁCH

────────────────────

❖ KẾT QUẢ

✦ XÌ DÁCH

♢ TIỀN CƯỢC
${formatMoney(bet)} ${emoji.money}

✦ TIỀN NHẬN
+${formatMoney(reward)} ${emoji.money}

◇ SỐ DƯ
${formatMoney(user.money)} ${emoji.money}

“Quả nhiên là một màn trình diễn tuyệt đẹp.” — Furina`
                    )

                ]

            });

        }

        // ==================================================
        // EMBED BAN ĐẦU
        // ==================================================

        const msg =
            await message.channel.send({

                embeds: [

                    taoEmbed(

                        "#F6D77A",

                        "✦ XÌ DÁCH",

                        `✦ BÀI CỦA BẠN

${hienThi(playerHand)}
◇ ${tongDiem(playerHand)} điểm

✧ NHÀ CÁI

${dealerHand[0].rank}${dealerHand[0].suit}  🂠

♢ CƯỢC

${formatMoney(bet)} ${emoji.money}

⏳ THỜI GIAN

30 giây

“Ván diễn đã bắt đầu.” — Furina`
                    )

                ],

                components: [

                    taoButtons(
                        message.author.id
                    )

                ]

            });

        // ==================================================
        // COLLECTOR
        // ==================================================

        const collector =
            msg.createMessageComponentCollector({

                time: 30000

            });

        // ==================================================
        // CLICK BUTTON
        // ==================================================

        collector.on(
            "collect",
            async interaction => {

                // ==================================================
                // CHỈ CHỦ VÁN
                // ==================================================

                if (
                    interaction.user.id !==
                    message.author.id
                ) {

                    return interaction.reply({

                        embeds: [

                            taoEmbed(
                                "#F7C8D0",
                                "✧ KHÔNG PHẢI VÁN CỦA BẠN",
                                `Ván Xì Dách này thuộc về <@${message.author.id}>.`
                            )

                        ],

                        ephemeral: true

                    });

                }

                // ==================================================
                // RÚT BÀI
                // ==================================================

                if (
                    interaction.customId ===
                    `xidach_hit_${message.author.id}`
                ) {

                    playerHand.push(
                        deck.pop()
                    );

                    const score =
                        tongDiem(
                            playerHand
                        );

                    // ==================================================
                    // QUÁ 21
                    // ==================================================

                    if (
                        score > 21
                    ) {

                        collector.stop(
                            "resolved"
                        );

                        await interaction.update({

                            components: []

                        });

                        return ketThuc(
                            msg,
                            "lose"
                        );

                    }

                    // ==================================================
                    // NGŨ LINH
                    // ==================================================

                    if (
                        laNguLinh(
                            playerHand
                        )
                    ) {

                        collector.stop(
                            "resolved"
                        );

                        await interaction.update({

                            components: []

                        });

                        return ketThuc(
                            msg,
                            "win",
                            3
                        );

                    }

                    // ==================================================
                    // CẬP NHẬT
                    // ==================================================

                    return interaction.update({

                        embeds: [

                            taoEmbed(

                                "#F6D77A",

                                "✦ XÌ DÁCH",

                                `✦ BÀI CỦA BẠN

${hienThi(playerHand)}
◇ ${score} điểm

✧ NHÀ CÁI

${dealerHand[0].rank}${dealerHand[0].suit}  🂠

♢ CƯỢC

${formatMoney(bet)} ${emoji.money}

⏳ Vẫn còn thời gian để lựa chọn.

“Hmm... vẫn còn cơ hội.” — Furina`
                            )

                        ],

                        components: [

                            taoButtons(
                                message.author.id
                            )

                        ]

                    });

                }

                // ==================================================
                // DỪNG
                // ==================================================

                if (
                    interaction.customId ===
                    `xidach_stand_${message.author.id}`
                ) {

                    collector.stop(
                        "resolved"
                    );

                    await interaction.update({

                        components: []

                    });

                    return nhaCaiChoi(
                        msg
                    );

                }

            }
        );

        // ==================================================
        // HẾT THỜI GIAN
        // ==================================================

        collector.on(
            "end",
            async (
                collected,
                reason
            ) => {

                if (
                    reason === "time"
                ) {

                    if (
                        finished
                    ) {

                        return;

                    }

                    try {

                        await msg.edit({

                            components: []

                        });

                    } catch {}

                    return nhaCaiChoi(
                        msg
                    );

                }

            }
        );

    }

};
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
} = require("../../config");

const {
    getUser,
    save
} = require("../../data");

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

    for (
        let i = deck.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            deck[i],
            deck[j]
        ] = [
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
                `\`${card.rank}${card.suit}\``
        )
        .join(" ");

}

// ======================================================
// XÌ DÁCH
// ======================================================

function laXiDach(hand) {

    if (hand.length !== 2) {
        return false;
    }

    const hasAce =
        hand.some(
            card =>
                card.rank === "A"
        );

    const hasTen =
        hand.some(
            card =>
                giaTri(card.rank) === 10
        );

    return (
        hasAce &&
        hasTen
    );
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

        .setTitle(
            "୨୧ ───────── ୨୧\n" +
            title +
            "\n୨୧ ───────── ୨୧"
        )

        .setDescription(
            description
        )

        .setFooter({
            text:
                "✦ Fishing Adventure · Xì Dách"
        })

        .setTimestamp();

}

// ======================================================
// NÚT
// ======================================================

function taoButtons(
    userId
) {

    return new ActionRowBuilder()

        .addComponents(

            new ButtonBuilder()

                .setCustomId(
                    `xidach_hit_${userId}`
                )

                .setLabel(
                    "🃏 Rút bài"
                )

                .setStyle(
                    ButtonStyle.Primary
                ),

            new ButtonBuilder()

                .setCustomId(
                    `xidach_stand_${userId}`
                )

                .setLabel(
                    "✋ Dừng"
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

                        "#EF4444",

                        "❌ CƯỢC KHÔNG HỢP LỆ",

                        `Cách dùng:\n\n` +
                        `\`${prefix}xidach <số tiền>\`\n\n` +
                        `Ví dụ:\n` +
                        `\`${prefix}xidach 10000\``

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

                        "#EF4444",

                        "❌ KHÔNG TÌM THẤY DỮ LIỆU",

                        "Không tìm thấy dữ liệu người chơi."

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

                        "#EF4444",

                        "❌ KHÔNG ĐỦ FCOIN",

                        `💰 Số dư hiện tại: ` +
                        `**${formatMoney(user.money)}** ${emoji.money}\n\n` +

                        `🎲 Tiền cược: ` +
                        `**${formatMoney(bet)}** ${emoji.money}\n\n` +

                        `Bạn không đủ tiền để bắt đầu ván.`

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
        // XỬ LÝ KẾT THÚC
        // ==================================================

        let finished = false;

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
            let color = "#9CA3AF";
            let title = "🤝 HÒA";

            // ==============================================
            // THẮNG
            // ==============================================

            if (
                ketQua === "win"
            ) {

                reward =
                    Math.floor(
                        bet * heSo
                    );

                user.money +=
                    reward;

                resultText =
                    `✅ **Bạn thắng!**\n` +
                    `💰 Nhận: **+${formatMoney(reward)}** ${emoji.money}`;

                color =
                    "#86EFAC";

                title =
                    "🎉 BẠN THẮNG";

            }

            // ==============================================
            // THUA
            // ==============================================

            else if (
                ketQua === "lose"
            ) {

                resultText =
                    `❌ **Bạn thua!**\n` +
                    `💸 Mất: **${formatMoney(bet)}** ${emoji.money}`;

                color =
                    "#EF4444";

                title =
                    "💀 BẠN THUA";

            }

            // ==============================================
            // HÒA
            // ==============================================

            else {

                user.money +=
                    bet;

                reward =
                    bet;

                resultText =
                    `🤝 **Hòa!**\n` +
                    `💰 Hoàn lại: **${formatMoney(bet)}** ${emoji.money}`;

                color =
                    "#F5C451";

                title =
                    "🤝 HÒA";

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

            const embed =
                taoEmbed(

                    color,

                    title,

                    `👤 **Bài của bạn**\n` +
                    `${hienThi(playerHand)}\n` +
                    `📊 Điểm: **${playerScore}**\n\n` +

                    `🤖 **Bài nhà cái**\n` +
                    `${hienThi(dealerHand)}\n` +
                    `📊 Điểm: **${dealerScore}**\n\n` +

                    `୨୧ ───────── ୨୧\n\n` +

                    `${resultText}\n\n` +

                    `💳 **Số dư:** ` +
                    `${formatMoney(user.money)} ${emoji.money}`

                );

            try {

                await msg.edit({

                    embeds: [
                        embed
                    ],

                    components: []

                });

            } catch {}

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

            // ==============================================
            // NHÀ CÁI XÌ DÁCH
            // ==============================================

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

            // ==============================================
            // NHÀ CÁI NGŨ LINH
            // ==============================================

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

            // ==============================================
            // NHÀ CÁI QUÁ 21
            // ==============================================

            if (
                dealerScore > 21
            ) {

                return ketThuc(
                    msg,
                    "win",
                    2
                );

            }

            // ==============================================
            // SO ĐIỂM
            // ==============================================

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

            user.money +=
                reward;

            save();

            return message.reply({

                embeds: [

                    taoEmbed(

                        "#FFD700",

                        "🃏 XÌ DÁCH!"

                        ,

                        `👤 **Bài của bạn**\n` +
                        `${hienThi(playerHand)}\n` +
                        `📊 **21 điểm · XÌ DÁCH**\n\n` +

                        `୨୧ ───────── ୨୧\n\n` +

                        `🎉 **XÌ DÁCH!**\n` +
                        `💰 Tiền nhận: **+${formatMoney(reward)}** ${emoji.money}\n\n` +

                        `💳 Số dư mới: ` +
                        `**${formatMoney(user.money)}** ${emoji.money}`

                    )

                ]

            });

        }

        // ==================================================
        // GIAO DIỆN BAN ĐẦU
        // ==================================================

        const msg =
            await message.channel.send({

                embeds: [

                    taoEmbed(

                        "#FFD166",

                        "🃏 XÌ DÁCH",

                        `👤 **Bài của bạn**\n` +
                        `${hienThi(playerHand)}\n` +
                        `📊 Điểm: **${tongDiem(playerHand)}**\n\n` +

                        `🤖 **Nhà cái**\n` +
                        `${dealerHand[0].rank}${dealerHand[0].suit} 🂠\n\n` +

                        `୨୧ ───────── ୨୧\n\n` +

                        `💰 **Tiền cược:** ` +
                        `${formatMoney(bet)} ${emoji.money}\n\n` +

                        `🃏 Rút bài để tiếp tục\n` +
                        `✋ Dừng để nhà cái chơi\n\n` +

                        `⏳ Bạn có **30 giây** để hành động.`

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

                // ==========================================
                // CHỈ CHỦ VÁN
                // ==========================================

                if (
                    interaction.user.id !==
                    message.author.id
                ) {

                    return interaction.reply({

                        content:
                            "❌ Đây không phải ván Xì Dách của bạn.",

                        ephemeral: true

                    });

                }

                // ==========================================
                // RÚT BÀI
                // ==========================================

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

                    // ======================================
                    // QUÁ 21
                    // ======================================

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

                    // ======================================
                    // NGŨ LINH
                    // ======================================

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

                    // ======================================
                    // CẬP NHẬT
                    // ======================================

                    return interaction.update({

                        embeds: [

                            taoEmbed(

                                "#FFD166",

                                "🃏 XÌ DÁCH",

                                `👤 **Bài của bạn**\n` +
                                `${hienThi(playerHand)}\n` +
                                `📊 Điểm: **${score}**\n\n` +

                                `🤖 **Nhà cái**\n` +
                                `${dealerHand[0].rank}${dealerHand[0].suit} 🂠\n\n` +

                                `୨୧ ───────── ୨୧\n\n` +

                                `💰 **Tiền cược:** ` +
                                `${formatMoney(bet)} ${emoji.money}\n\n` +

                                `🃏 Bạn có thể rút tiếp hoặc dừng.`

                            )

                        ],

                        components: [

                            taoButtons(
                                message.author.id
                            )

                        ]

                    });

                }

                // ==========================================
                // DỪNG
                // ==========================================

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
                    reason ===
                    "time"
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
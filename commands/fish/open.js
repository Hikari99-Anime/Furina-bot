const {
    EmbedBuilder
} = require("discord.js");

const {
    chests,
    keys,
    emoji,
    formatMoney,
    prefix
} = require("../../config");

const {
    getUser,
    save
} = require("../../data");

// ======================================================
// MODULE
// ======================================================

module.exports = {

    name: "open",

    aliases: [
        "chest",
        "ruong",
        "openchest",
        "mo"
    ],

    async execute(message, args) {

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

                    new EmbedBuilder()

                        .setColor("#ff6b81")

                        .setTitle("❌ Không tìm thấy dữ liệu")

                        .setDescription(
                            "Không thể tìm thấy dữ liệu người chơi của bạn."
                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure"
                        })
                ]

            });

        }


        // ==================================================
        // KHÔNG CHỌN RƯƠNG
        // ==================================================

        const id =
            args?.[0]?.toLowerCase();


        if (!id) {

            const chestIds =
                Object.keys(
                    chests || {}
                );


            if (
                chestIds.length === 0
            ) {

                return message.reply({

                    embeds: [

                        new EmbedBuilder()

                            .setColor("#ff6b81")

                            .setTitle("🎁 Rương kho báu")

                            .setDescription(
                                "Hiện chưa có rương nào."
                            )

                            .setFooter({
                                text:
                                    "✦ Fishing Adventure"
                            })
                    ]

                });

            }


            const chestList =
                chestIds
                    .map(
                        chestID => {

                            const chest =
                                chests[
                                    chestID
                                ];

                            return (
                                `${chest.emoji || "🎁"} **${chest.name || chestID}**\n` +
                                `└ ⭐ Độ hiếm: **${chest.star || 1}** · \`${chestID}\``
                            );

                        }
                    )
                    .join("\n\n");


            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor("#9b59ff")

                        .setTitle("🎁 Rương kho báu")

                        .setDescription(

                            `✨ **Danh sách rương**\n\n` +

                            `${chestList}\n\n` +

                            `💡 Dùng \`${prefix}open <tên rương>\` để mở.`
                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure · Treasure"
                        })
                ]

            });

        }


        // ==================================================
        // TÌM RƯƠNG
        // ==================================================

        const chest =
            chests?.[id];


        if (!chest) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor("#ff6b81")

                        .setTitle("❌ Không tìm thấy rương")

                        .setDescription(

                            `Không có rương với ID:\n` +
                            `\`${id}\`\n\n` +

                            `💡 Dùng \`${prefix}open\` để xem danh sách rương.`
                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure"
                        })
                ]

            });

        }


        // ==================================================
        // CHÌA KHÓA
        // ==================================================

        const keyID =
            chest.key;


        const key =
            keys?.[keyID];


        if (!key) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor("#ff6b81")

                        .setTitle("❌ Lỗi cấu hình rương")

                        .setDescription(

                            `${chest.emoji || "🎁"} **${chest.name || id}**\n\n` +

                            `Rương này chưa được cấu hình chìa khóa hợp lệ.\n\n` +

                            `🔑 Key ID: \`${keyID || "Không có"}\``
                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure"
                        })
                ]

            });

        }


        // ==================================================
        // SỐ CHÌA KHÓA
        // ==================================================

        const keyCount =
            Math.max(
                0,
                Number(
                    user.keys?.[keyID] || 0
                )
            );


        // ==================================================
        // KHÔNG ĐỦ CHÌA KHÓA
        // ==================================================

        if (
            keyCount <= 0
        ) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor("#ff6b81")

                        .setTitle("🔑 Không đủ chìa khóa")

                        .setDescription(

                            `${chest.emoji || "🎁"} **${chest.name || id}**\n\n` +

                            `Bạn cần:\n` +
                            `🔑 ${key.emoji || "🔑"} **${key.name || keyID}** ×1\n\n` +

                            `Bạn đang có:\n` +
                            `🔑 **0**\n\n` +

                            `💡 Hãy mua thêm chìa khóa rồi thử lại.`
                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure · Treasure"
                        })
                ]

            });

        }


        // ==================================================
        // KIỂM TRA DROP
        // ==================================================

        if (
            !Array.isArray(
                chest.drop
            ) ||
            chest.drop.length === 0
        ) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor("#ff6b81")

                        .setTitle("❌ Rương chưa có phần thưởng")

                        .setDescription(

                            `${chest.emoji || "🎁"} **${chest.name || id}**\n\n` +

                            `Rương này hiện chưa được cấu hình phần thưởng.`
                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure"
                        })
                ]

            });

        }


        // ==================================================
        // TRỪ CHÌA KHÓA
        // ==================================================

        user.keys =
            user.keys || {};


        user.keys[keyID] =
            Math.max(
                0,
                Number(
                    user.keys[keyID] || 0
                ) - 1
            );


        // ==================================================
        // RANDOM PHẦN THƯỞNG
        // ==================================================

        const drop =
            chest.drop[
                Math.floor(
                    Math.random() *
                    chest.drop.length
                )
            ];


        let rewardText =
            "🎁 Phần thưởng không xác định";


        // ==================================================
        // TIỀN
        // ==================================================

        if (
            drop.type === "money"
        ) {

            const min =
                Math.max(
                    0,
                    Number(
                        drop.min || 0
                    )
                );


            const max =
                Math.max(
                    min,
                    Number(
                        drop.max ?? min
                    )
                );


            const money =
                Math.floor(
                    Math.random() *
                    (
                        max -
                        min +
                        1
                    ) +
                    min
                );


            user.money =
                Number(
                    user.money || 0
                ) +
                money;


            rewardText =
                `💰 **${formatMoney(money)} ${emoji.money}**`;

        }


        // ==================================================
        // CHÌA KHÓA
        // ==================================================

        else if (
            drop.type === "key"
        ) {

            const amount =
                Math.max(
                    1,
                    Number(
                        drop.amount || 1
                    )
                );


            user.keys =
                user.keys || {};


            user.keys[drop.id] =
                (
                    Number(
                        user.keys[
                            drop.id
                        ] || 0
                    )
                ) +
                amount;


            const rewardKey =
                keys?.[
                    drop.id
                ];


            rewardText =
                `${rewardKey?.emoji || "🔑"} **${rewardKey?.name || drop.id} ×${amount}**`;

        }


        // ==================================================
        // LOẠI DROP KHÔNG HỖ TRỢ
        // ==================================================

        else {

            rewardText =
                `🎁 **${drop.id || "Phần thưởng không xác định"}**`;

        }


        // ==================================================
        // SAVE
        // ==================================================

        save();


        // ==================================================
        // EMBED KẾT QUẢ
        // ==================================================

        const embed =
            new EmbedBuilder()

                .setColor("#ffd166")

                .setTitle(
                    "🎁 Mở rương thành công"
                )

                .setDescription(

                    `${chest.emoji || "🎁"} **${chest.name || id}**\n\n` +

                    `✨ Bạn đã mở rương và nhận được:\n\n` +

                    `> ${rewardText}\n\n` +

                    `🔑 **Chìa khóa còn lại:** ${user.keys[keyID] || 0}\n\n` +

                    `🌊 Chúc bạn may mắn trong lần mở tiếp theo!`
                )

                .setFooter({
                    text:
                        "✦ Fishing Adventure · Treasure"
                })

                .setTimestamp();


        return message.reply({

            embeds: [
                embed
            ]

        });

    }

};
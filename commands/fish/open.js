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


module.exports = {

    name: "open",

    aliases: [
        "chest",
        "ruong",
        "openchest",
        "mo"
    ],

    async execute(message, args) {

        const user =
            getUser(
                message.author.id
            );


        // ==================================================
        // KHÔNG CHỌN RƯƠNG
        // ==================================================

        const id =
            args[0]?.toLowerCase();


        if (!id) {

            const chestList =
                Object.values(chests)
                    .map(
                        chest =>
                            `${chest.emoji} ${chest.name} · ⭐${chest.star || 1}`
                    )
                    .join("\n");


            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor("#ffd166")

                        .setTitle(
                            "🎁 `TREASURE CHESTS`"
                        )

                        .setDescription(

                            `${chestList}\n\n` +

                            `╰・Dùng: \`${prefix}open <tên rương>\``

                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure"
                        })

                ]

            });

        }


        // ==================================================
        // TÌM RƯƠNG
        // ==================================================

        const chest =
            chests[id];


        if (!chest) {

            return message.reply(
                "╰・❌ Không tìm thấy rương"
            );

        }


        // ==================================================
        // CHÌA KHÓA
        // ==================================================

        const keyID =
            chest.key;

        const key =
            keys[keyID];


        if (!key) {

            return message.reply(
                "╰・❌ Rương này chưa được cấu hình chìa khóa"
            );

        }


        if (
            (user.keys?.[keyID] || 0) <= 0
        ) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor("#ff6b81")

                        .setTitle(
                            "🔑 `NOT ENOUGH KEY`"
                        )

                        .setDescription(

                            `${chest.emoji} ${chest.name}\n\n` +

                            `> 🔑 Cần: ${key.emoji} ${key.name}\n` +
                            `> 📦 Bạn có: 0\n\n` +

                            `╰・Hãy mua thêm chìa khóa để mở rương.`

                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure"
                        })

                ]

            });

        }


        // ==================================================
        // KIỂM TRA DROP
        // ==================================================

        if (
            !Array.isArray(chest.drop) ||
            chest.drop.length === 0
        ) {

            return message.reply(
                "╰・❌ Rương này chưa có phần thưởng"
            );

        }


        // ==================================================
        // TRỪ CHÌA KHÓA
        // ==================================================

        user.keys[keyID]--;


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
                Number(
                    drop.min || 0
                );

            const max =
                Number(
                    drop.max || min
                );


            const money = Math.floor(
                 Math.random() * (drop.max - drop.min + 1) + drop.min
                 );
            min;


            user.money +=
                money;


            rewardText =
                `💰 Nhận được: ${formatMoney(money)} ${emoji.money}`;

        }


        // ==================================================
        // ITEM
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


            user.keys[drop.id] =
                (
                    user.keys[drop.id] ||
                    0
                ) +
                amount;


            const rewardKey =
                keys[drop.id];


            rewardText =
                `🔑 Nhận được: ${rewardKey?.emoji || "🔑"} ${rewardKey?.name || drop.id} x${amount}`;

        }


        // ==================================================
        // LƯU
        // ==================================================

        save();


        // ==================================================
        // EMBED
        // ==================================================

        const embed =
            new EmbedBuilder()

                .setColor("#ffd86b")

                .setTitle(
                    "🎁 `CHEST OPENED`"
                )

                .setDescription(

                    `${chest.emoji} ${chest.name}\n\n` +

                    `✨ Rương đã mở thành công!\n\n` +

                    `> ${rewardText}\n` +
                    `> 🔑 Chìa khóa còn lại: ${user.keys[keyID]}\n\n` +

                    `╰・🌊 Chúc bạn may mắn!`

                )

                .setFooter({
                    text:
                        "✦ Fishing Adventure"
                })

                .setTimestamp();


        return message.reply({

            embeds: [
                embed
            ]

        });

    }

};
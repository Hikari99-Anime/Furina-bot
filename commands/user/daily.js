const {
    EmbedBuilder
} = require("discord.js");

const {
    emoji,
    formatMoney
} = require("../../config.js");

const {
    getUser,
    save
} = require("../../data.js");

module.exports = {

    name: "daily",

    aliases: [
        "nhan",
        "reward"
    ],

    async execute(message) {

        const user =
            getUser(
                message.author.id
            );

        // ======================
        // FIX DAILY DATA
        // ======================

        user.daily ??= {
            last: 0,
            streak: 0
        };

        user.daily.last =
            Number(user.daily.last) || 0;

        user.daily.streak =
            Number(user.daily.streak) || 0;

        const now = Date.now();
        const cooldown =
            24 * 60 * 60 * 1000;

        const passed =
            now - user.daily.last;

        // ======================
        // CHƯA ĐỦ 24 GIỜ
        // ======================

        if (passed < cooldown) {

            const remain =
                cooldown - passed;

            const hours =
                Math.floor(
                    remain / (1000 * 60 * 60)
                );

            const minutes =
                Math.floor(
                    (remain % (1000 * 60 * 60)) /
                    (1000 * 60)
                );

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor("#f5c451")

                        .setTitle(
                            "🎁 `DAILY REWARD`"
                        )

                        .setDescription(
                            `*Bạn đã nhận phần thưởng hôm nay.*\n` +
                            `*Hãy quay lại sau khi hết thời gian chờ.*\n\n` +

                            `⏳ Còn lại: \`${hours} giờ ${minutes} phút\`\n` +
                            `🔥 Chuỗi hiện tại: \`${user.daily.streak} ngày\`\n\n` +

                            `╰・🎣 Hẹn gặp lại!`
                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure"
                        })

                ]

            });

        }

        // ======================
        // RESET CHUỖI
        // ======================

        if (
            user.daily.last > 0 &&
            passed > cooldown * 2
        ) {

            user.daily.streak = 0;

        }

        // ======================
        // NHẬN THƯỞNG
        // ======================

        user.daily.streak++;

        const reward =
            5000 +
            (user.daily.streak * 1000);

        user.money += reward;
        user.daily.last = now;

        save();

        // ======================
        // EMBED
        // ======================

        const embed =
            new EmbedBuilder()

                .setColor("#8affb2")

                .setTitle(
                    "🎁 `DAILY REWARD`"
                )

                .setDescription(
                    `*Bạn đã nhận phần thưởng hôm nay.*\n` +
                    `*Chuỗi đăng nhập của bạn tiếp tục được duy trì.*\n\n` +

                    `🔥 Chuỗi: \`${user.daily.streak} ngày\`\n` +
                    `💰 Nhận được: \`${formatMoney(reward)}\` ${emoji.money}\n` +
                    `💳 Số dư: \`${formatMoney(user.money)}\` ${emoji.money}\n\n` +

                    `╰・🎣 Chúc bạn câu được nhiều cá hiếm hơn!`
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

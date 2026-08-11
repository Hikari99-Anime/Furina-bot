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

// ======================================================
// CONFIG
// ======================================================

const SEPARATOR =
    "୨୧ ───────── ୨୧";

const FOOTER = {
    text:
        "✦ Fishing Adventure · Daily Reward"
};

// ======================================================
// MODULE
// ======================================================

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

        if (!user) {

            return message.reply({
                content:
                    "❌ Không tìm thấy dữ liệu người chơi."
            });

        }

        // ==================================================
        // FIX DAILY DATA
        // ==================================================

        user.daily ??= {
            last: 0,
            streak: 0
        };

        user.daily.last =
            Number(user.daily.last) || 0;

        user.daily.streak =
            Number(user.daily.streak) || 0;

        const now =
            Date.now();

        const cooldown =
            24 * 60 * 60 * 1000;

        const passed =
            now - user.daily.last;

        // ==================================================
        // CHƯA ĐỦ 24 GIỜ
        // ==================================================

        if (passed < cooldown) {

            const remain =
                cooldown - passed;

            const hours =
                Math.floor(
                    remain /
                    (1000 * 60 * 60)
                );

            const minutes =
                Math.floor(
                    (
                        remain %
                        (1000 * 60 * 60)
                    ) /
                    (1000 * 60)
                );

            const embed =
                new EmbedBuilder()

                    .setColor("#f5c451")

                    .setTitle(
                        "🎁 `DAILY REWARD`"
                    )

                    .setDescription(

                        `${SEPARATOR}\n\n` +

                        `Bạn đã nhận phần thưởng hôm nay.\n` +
                        `Hãy quay lại khi thời gian chờ kết thúc.\n\n` +

                        `⏳ Còn lại: ` +
                        `${hours} giờ ${minutes} phút\n` +

                        `🔥 Chuỗi hiện tại: ` +
                        `${user.daily.streak} ngày\n\n` +

                        `${SEPARATOR}\n\n` +

                        `“Furina chúc bạn kiên nhẫn một chút, ` +
                        `phần thưởng tiếp theo đang chờ bạn đấy!”`

                    )

                    .setFooter(
                        FOOTER
                    )

                    .setTimestamp();

            return message.reply({
                embeds: [
                    embed
                ]
            });

        }

        // ==================================================
        // RESET CHUỖI
        // ==================================================

        if (
            user.daily.last > 0 &&
            passed > cooldown * 2
        ) {

            user.daily.streak = 0;

        }

        // ==================================================
        // NHẬN THƯỞNG
        // ==================================================

        user.daily.streak++;

        const reward =
            5000 +
            (
                user.daily.streak *
                1000
            );

        user.money =
            Number(user.money || 0) +
            reward;

        user.daily.last =
            now;

        save();

        // ==================================================
        // EMBED THÀNH CÔNG
        // ==================================================

        const embed =
            new EmbedBuilder()

                .setColor("#8affb2")

                .setTitle(
                    "🎁 `DAILY REWARD`"
                )

                .setDescription(

                    `${SEPARATOR}\n\n` +

                    `Bạn đã nhận phần thưởng hôm nay.\n` +
                    `Chuỗi đăng nhập của bạn tiếp tục được duy trì.\n\n` +

                    `🔥 Chuỗi: ` +
                    `${user.daily.streak} ngày\n` +

                    `💰 Nhận được: ` +
                    `${formatMoney(reward)} ${emoji.money}\n` +

                    `💳 Số dư: ` +
                    `${formatMoney(user.money)} ${emoji.money}\n\n` +

                    `${SEPARATOR}\n\n` +

                    `“Furina chúc bạn thật may mắn ` +
                    `và nhận được thật nhiều Fcoin!”`

                )

                .setFooter(
                    FOOTER
                )

                .setTimestamp();

        return message.reply({
            embeds: [
                embed
            ]
        });

    }

};
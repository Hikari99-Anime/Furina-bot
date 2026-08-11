const {
    EmbedBuilder
} = require("discord.js");

const {
    getUser
} = require("../../data");

const {
    emoji,
    formatMoney
} = require("../../config");

// ======================================================
// CONFIG
// ======================================================

const SEPARATOR =
    "୨୧ ───────── ୨୧";

const FOOTER = {
    text:
        "✦ Fishing Adventure · Wallet"
};

// ======================================================
// MODULE
// ======================================================

module.exports = {

    name: "gold",

    aliases: [
        "xu"
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

        const money =
            Number(
                user.money || 0
            );

        const embed =
            new EmbedBuilder()

                .setColor("#f5c451")

                .setTitle(
                    "💰 `FCOIN WALLET`"
                )

                .setDescription(

                    `${SEPARATOR}\n\n` +

                    `👤 Chủ tài khoản: ${message.author}\n\n` +

                    `💰 Số dư hiện tại\n` +
                    `${formatMoney(money)} ${emoji.money}\n\n` +

                    `${SEPARATOR}\n\n` +

                    `“Furina chúc bạn luôn rủng rỉnh túi tiền ` +
                    `và kiếm được thật nhiều Fcoin!”`

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
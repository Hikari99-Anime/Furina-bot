const {
    EmbedBuilder
} = require("discord.js");

const {
    emoji,
    formatMoney,
    prefix
} = require("../../config");

const {
    getUser,
    save
} = require("../../database");

const {
    isAdmin
} = require("../../admin");

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
            text: "✦ Fishing Adventure · Admin"
        })

        .setTimestamp();

}

// ======================================================
// COMMAND
// ======================================================

module.exports = {

    name: "setmoney",

    aliases: [
        "setxu",
        "setcoin"
    ],

    async execute(
        message,
        args
    ) {

        // ==================================================
        // CHECK ADMIN
        // ==================================================

        if (
            !isAdmin(
                message.author.id
            )
        ) {

            return message.reply({

                embeds: [

                    createEmbed(

                        "#EF4444",

                        "❌ KHÔNG CÓ QUYỀN",

                        "Bạn cần quyền **Admin** để sử dụng lệnh này."

                    )

                ]

            });

        }

        // ==================================================
        // TARGET
        // ==================================================

        const target =
            message.mentions.users.first();

        // ==================================================
        // AMOUNT
        // ==================================================

        const amount =
            Number(
                args[1]
            );

        // ==================================================
        // CHECK INPUT
        // ==================================================

        if (
            !target ||
            args[1] === undefined
        ) {

            return message.reply({

                embeds: [

                    createEmbed(

                        "#F59E0B",

                        "⚠️ THIẾU THÔNG TIN",

                        `Cách sử dụng:\n\n` +

                        `\`${prefix}setmoney @user <số tiền>\`\n\n` +

                        `💡 Ví dụ:\n` +

                        `\`${prefix}setmoney @Furina 50000\``

                    )

                ]

            });

        }

        // ==================================================
        // CHECK TARGET BOT
        // ==================================================

        if (
            target.bot
        ) {

            return message.reply({

                embeds: [

                    createEmbed(

                        "#EF4444",

                        "❌ KHÔNG HỢP LỆ",

                        "Không thể đặt tiền cho tài khoản **Bot**."

                    )

                ]

            });

        }

        // ==================================================
        // CHECK AMOUNT
        // ==================================================

        if (
            !Number.isSafeInteger(amount) ||
            amount < 0
        ) {

            return message.reply({

                embeds: [

                    createEmbed(

                        "#EF4444",

                        "❌ SỐ TIỀN KHÔNG HỢP LỆ",

                        `Số tiền phải là **số nguyên từ 0 trở lên**.\n\n` +

                        `💡 Ví dụ:\n` +

                        `\`${prefix}setmoney @user 100000\``

                    )

                ]

            });

        }

        // ==================================================
        // GET USER
        // ==================================================

        const user =
            getUser(
                target.id
            );

        if (!user) {

            return message.reply({

                embeds: [

                    createEmbed(

                        "#EF4444",

                        "❌ KHÔNG TÌM THẤY DỮ LIỆU",

                        "Không tìm thấy dữ liệu người chơi này."

                    )

                ]

            });

        }

        // ==================================================
        // OLD MONEY
        // ==================================================

        const oldMoney =
            Number(
                user.money || 0
            );

        // ==================================================
        // SET MONEY
        // ==================================================

        user.money =
            amount;

        // ==================================================
        // SAVE
        // ==================================================

        try {

            save();

        } catch (err) {

            console.error(
                "❌ SETMONEY SAVE ERROR:",
                err
            );

            // rollback

            user.money =
                oldMoney;

            return message.reply({

                embeds: [

                    createEmbed(

                        "#EF4444",

                        "❌ KHÔNG THỂ LƯU",

                        "Không thể lưu thay đổi số dư.\n" +
                        "Số tiền của người chơi **chưa được thay đổi**."

                    )

                ]

            });

        }

        // ==================================================
        // SUCCESS
        // ==================================================

        return message.reply({

            embeds: [

                createEmbed(

                    "#86EFAC",

                    "💰 ĐẶT SỐ DƯ THÀNH CÔNG",

                    `👤 **Người chơi:** ${target}\n\n` +

                    `💵 **Số dư cũ:** ` +
                    `${formatMoney(oldMoney)} ${emoji.money}\n\n` +

                    `💰 **Số dư mới:** ` +
                    `${formatMoney(amount)} ${emoji.money}\n\n` +

                    `🛠️ **Admin thực hiện:** ${message.author}`

                )

            ]

        });

    }

};
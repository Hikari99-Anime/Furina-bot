const {
    EmbedBuilder
} = require("discord.js");

const {
    emoji,
    formatMoney,
    prefix
} = require("../config");

const {
    getUser,
    save
} = require("../database");

const {
    isAdmin
} = require("../admin");


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
            text: "✦ Fishing Adventure"
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

        // ==========================
        // ADMIN
        // ==========================

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

                        `Bạn không có quyền sử dụng lệnh này.`

                    )

                ]

            });

        }


        // ==========================
        // TARGET
        // ==========================

        const target =
            message.mentions.users.first();


        // ==========================
        // AMOUNT
        // ==========================

        const amount =
            Number(args[1]);


        // ==========================
        // CHECK
        // ==========================

        if (
            !target ||
            args[1] === undefined ||
            !Number.isSafeInteger(amount)
        ) {

            return message.reply({

                embeds: [

                    createEmbed(

                        "#F59E0B",

                        "⚠️ SAI CÚ PHÁP",

                        `Cách dùng:\n` +
                        `\`${prefix}setmoney @user <số tiền>\`\n\n` +

                        `💡 Ví dụ:\n` +
                        `\`${prefix}setmoney @user 100000\``

                    )

                ]

            });

        }


        // ==========================
        // CHECK MONEY
        // ==========================

        if (
            amount < 0
        ) {

            return message.reply({

                embeds: [

                    createEmbed(

                        "#EF4444",

                        "❌ SỐ TIỀN KHÔNG HỢP LỆ",

                        `Số tiền phải lớn hơn hoặc bằng **0**.`

                    )

                ]

            });

        }


        // ==========================
        // GET USER
        // ==========================

        const user =
            getUser(
                target.id
            );


        if (!user) {

            return message.reply({

                embeds: [

                    createEmbed(

                        "#EF4444",

                        "❌ KHÔNG TÌM THẤY",

                        `Không tìm thấy dữ liệu của ${target}.`

                    )

                ]

            });

        }


        // ==========================
        // OLD MONEY
        // ==========================

        const oldMoney =
            Number(
                user.money || 0
            );


        // ==========================
        // SET MONEY
        // ==========================

        user.money =
            amount;


        // ==========================
        // SAVE
        // ==========================

        try {

            save();

        } catch (err) {

            console.error(
                "❌ SETMONEY ERROR:",
                err
            );

            user.money =
                oldMoney;

            return message.reply({

                embeds: [

                    createEmbed(

                        "#EF4444",

                        "❌ KHÔNG THỂ LƯU",

                        `Đã xảy ra lỗi khi lưu dữ liệu.\n` +
                        `Số dư của ${target} vẫn được giữ nguyên.`

                    )

                ]

            });

        }


        // ==========================
        // SUCCESS
        // ==========================

        return message.reply({

            embeds: [

                createEmbed(

                    "#86EFAC",

                    "💰 SET MONEY THÀNH CÔNG",

                    `👤 **Người chơi:** ${target}\n\n` +

                    `💳 **Số dư cũ:** ` +
                    `${formatMoney(oldMoney)} ${emoji.money}\n\n` +

                    `💰 **Số dư mới:** ` +
                    `${formatMoney(amount)} ${emoji.money}\n\n` +

                    `🛠️ **Admin:** ${message.author}\n\n` +

                    `✦ Đã cập nhật số dư thành công.`

                )

            ]

        });

    }

};
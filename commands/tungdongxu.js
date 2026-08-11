const {
    EmbedBuilder
} = require("discord.js");

const {
    prefix,
    emoji
} = require("../config");

const {
    getUser,
    save
} = require("../database");


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
            text: "✦ Furina-sama · Fishing Adventure"
        })

        .setTimestamp();
}


// ======================================================
// COMMAND
// ======================================================

module.exports = {

    name: "tungdongxu",

    aliases: [
        "tdx"
    ],

    async execute(
        message,
        args
    ) {

        const side =
            (
                args[0] || ""
            )
                .toLowerCase();

        const bet =
            Number(
                args[1]
            );


        // ==================================================
        // CHECK INPUT
        // ==================================================

        if (

            (
                side !== "n" &&
                side !== "s"
            )

            ||

            !Number.isInteger(
                bet
            )

            ||

            bet <= 0

        ) {

            return message.reply({

                embeds: [

                    createEmbed(

                        "#EF4444",

                        "❌ CÁCH SỬ DỤNG",

                        `Vui lòng nhập đúng cú pháp.\n\n` +

                        `🪙 **Ngửa**\n` +
                        `\`${prefix}tdx n 1000\`\n\n` +

                        `🪙 **Sấp**\n` +
                        `\`${prefix}tdx s 1000\`\n\n` +

                        `💡 Ví dụ: \`${prefix}tdx n 10000\``

                    )

                ]

            });

        }


        // ==================================================
        // GET USER
        // ==================================================

        const user =
            getUser(
                message.author.id
            );


        // ==================================================
        // CHECK MONEY
        // ==================================================

        if (
            Number(user.money || 0) <
            bet
        ) {

            return message.reply({

                embeds: [

                    createEmbed(

                        "#EF4444",

                        "❌ KHÔNG ĐỦ XU",

                        `💰 **Số dư:** ` +
                        `${user.money.toLocaleString()} ${emoji.money}\n\n` +

                        `🎲 **Tiền cược:** ` +
                        `${bet.toLocaleString()} ${emoji.money}\n\n` +

                        `Bạn không có đủ xu để thực hiện lượt cược này.`

                    )

                ]

            });

        }


        // ==================================================
        // ANIMATION - HỒI HỘP CHỜ KẾT QUẢ
        // ==================================================

        const choiceTextPreview =
            side === "n"
                ? "🪙 Ngửa"
                : "🪙 Sấp";

        const msg =
            await message.reply({

                embeds: [

                    createEmbed(

                        "#7ddcff",

                        "🪙 ĐANG TUNG ĐỒNG XU...",

                        `🎯 **Bạn chọn:**\n` +
                        `${choiceTextPreview}\n\n` +

                        `🎲 **Tiền cược:** ` +
                        `${bet.toLocaleString()} ${emoji.money}\n\n` +

                        `🪙 Đồng xu đang xoay...`

                    )

                ]

            });


        await new Promise(
            r => setTimeout(r, 3000)
        );


        // ==================================================
        // TUNG ĐỒNG XU
        // ==================================================

        const result =
            Math.random() < 0.5
                ? "n"
                : "s";


        const win =
            result === side;


        // ==================================================
        // CỘNG / TRỪ TIỀN
        // ==================================================

        if (win) {

            user.money += bet;

        } else {

            user.money -= bet;

        }


        save();


        // ==================================================
        // RESULT TEXT
        // ==================================================

        const resultText =
            result === "n"
                ? "🪙 **NGỬA**"
                : "🪙 **SẤP**";


        const choiceText =
            side === "n"
                ? "🪙 Ngửa"
                : "🪙 Sấp";


        // ==================================================
        // FURINA TEXT
        // ==================================================

        const furinaText =
            win

                ?

                "✦ Furina chúc mừng bạn!\n" +
                "Hôm nay vận may đang đứng về phía bạn đấy~\n" +
                "Hãy tận hưởng chiến thắng này nhé! ♡"

                :

                "✦ Furina rất tiếc cho bạn...\n" +
                "Có lẽ vận may hôm nay chưa đứng về phía bạn.\n" +
                "Đừng buồn, lần sau chắc chắn sẽ may mắn hơn! ♡";


        // ==================================================
        // EMBED
        // ==================================================

        return msg.edit({

            embeds: [

                createEmbed(

                    win
                        ? "#86EFAC"
                        : "#F9A8D4",

                    win
                        ? "🪙 TUNG ĐỒNG XU · THẮNG"
                        : "🪙 TUNG ĐỒNG XU · THUA",

                    `🎯 **Bạn chọn:**\n` +
                    `${choiceText}\n\n` +

                    `🪙 **Kết quả:**\n` +
                    `${resultText}\n\n` +

                    (
                        win

                            ?

                            `✅ **Bạn thắng:** ` +
                            `+${bet.toLocaleString()} ${emoji.money}\n\n`

                            :

                            `❌ **Bạn thua:** ` +
                            `-${bet.toLocaleString()} ${emoji.money}\n\n`
                    ) +

                    `💰 **Số dư:**\n` +
                    `${user.money.toLocaleString()} ${emoji.money}\n\n` +

                    `୨୧ **Furina nói** ୨୧\n` +
                    `*${furinaText}*`

                )

            ]

        });

    }

};
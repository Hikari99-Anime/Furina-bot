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
} = require("../../data.js");


module.exports = {

    name: "givemoney",

    aliases: [
        "give",
        "transfer",
        "chuyentien"
    ],

    async execute(message, args) {

        const target = message.mentions.users.first();

        const amount = Number(args[1]);

        if (!target || !amount) {

            return message.reply(
                `╰・❌ Cách dùng: \`!${prefix}givemoney @user <số tiền>\``
            );

        }

        if (target.id === message.author.id) {

            return message.reply(
                "╰・❌ Không thể tự chuyển tiền cho bản thân"
            );

        }

        if (target.bot) {

            return message.reply(
                "╰・❌ Không thể chuyển tiền cho bot"
            );

        }

        if (!Number.isInteger(amount) || amount <= 0) {

            return message.reply(
                "╰・❌ Số tiền không hợp lệ"
            );

        }

        const sender = getUser(
            message.guild.id,
            message.author.id
        );

        if (sender.money < amount) {

            return message.reply(
                "╰・❌ Bạn không đủ tiền"
            );

        }

        const receiver = getUser(
            message.guild.id,
            target.id
        );

        sender.money -= amount;

        receiver.money += amount;

        save();

        return message.reply({

            embeds: [

                new EmbedBuilder()
                    .setColor("#86EFAC")
                    .setTitle("╭・💸 CHUYỂN TIỀN")
                    .setDescription(
`✅ ${message.author} đã chuyển ${formatMoney(amount)} ${emoji.money} cho ${target}

💳 Số dư của bạn: ${formatMoney(sender.money)} ${emoji.money}

╰・🎣 Fishing Adventure`
                    )
                    .setFooter({
                        text: "✦ Fishing Adventure"
                    })
                    .setTimestamp()

            ]

        });

    }

};

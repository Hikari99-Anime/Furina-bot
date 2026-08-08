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




module.exports = {

    name:"tungdongxu",

    aliases:["tdx"],

    async execute(message,args){

        const side = (args[0] || "").toLowerCase();

        const bet = Number(args[1]);


        if(

            (side !== "n" && side !== "s")
            ||
            !Number.isInteger(bet)
            ||
            bet <= 0

        ){

            return message.reply(
                `❌ Ví dụ: \`${prefix}tdx n 1000\` (ngửa) hoặc \`${prefix}tdx s 1000\` (sấp)`
            );

        }


        const user = getUser(message.author.id);


        if(user.money < bet){

            return message.reply(
                "❌ Không đủ tiền"
            );

        }


        const result = Math.random() < 0.5 ? "n" : "s";

        const win = result === side;


        if(win){

            user.money += bet;

        }else{

            user.money -= bet;

        }


        save();


        const resultText =
        result === "n"
        ?
        "🪙 NGỬA"
        :
        "🪙 SẤP";


        return message.reply({

            embeds:[

                new EmbedBuilder()

                .setColor(win ? "Green" : "Red")

                .setTitle("🪙 TUNG ĐỒNG XU")

                .setDescription(

`Kết quả: **${resultText}**

${
    win
    ?
    `✅ Bạn thắng +${bet.toLocaleString()} xu`
    :
    `❌ Bạn thua -${bet.toLocaleString()} xu`
}
💰 Số dư: ${user.money.toLocaleString()} ${emoji.money}`

                )

            ]

        });

    }

};

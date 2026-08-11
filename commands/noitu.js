const {
    EmbedBuilder
} = require("discord.js");


const {
    createGame,
    getGame,
    stopGame,
    getRoundCount,
    pickStarter
} = require("../games/noitugame");


const {
    isAdmin
} = require("../admin");


const {
    prefix
} = require("../config");




module.exports = {

    name:"noitu",

    aliases:["wordchain"],

    async execute(message,args){

        const lang = (args[0] || "").toLowerCase();


        if(lang === "stop"){

            if(!isAdmin(message.author.id))

                return message.reply(
                    "╰・❌ Chỉ admin mới được dừng ván nối từ"
                );


            if(!stopGame(message.channel.id))

                return message.reply(
                    "╰・❌ Không có ván nối từ nào đang diễn ra ở channel này"
                );


            return message.reply(
                "╰・✅ Đã dừng ván nối từ ở channel này và reset round"
            );

        }


        if(lang !== "vi" && lang !== "en")

            return message.reply(
                `╰・❌ Cách dùng: \`${prefix}noitu vi\` (nối từ tiếng Việt), \`${prefix}noitu en\` (word chain tiếng Anh) hoặc \`${prefix}noitu stop\` (admin)`
            );


        if(getGame(message.channel.id))

            return message.reply(
                "╰・❌ Đang có ván nối từ diễn ra ở channel này!"
            );


        const starter = pickStarter(lang);


        createGame(lang,message.channel,starter);


        return message.channel.send({

            embeds:[

                new EmbedBuilder()

                .setColor("Blue")

                .setTitle(
                    lang === "vi"
                    ?
                    "🔗 NỐI TỪ TIẾNG VIỆT"
                    :
                    "🔗 WORD CHAIN (ENGLISH)"
                )

                .setDescription(

lang === "vi"
?
`Từ bắt đầu: **${starter}**

Nhập cụm 2 từ, từ đầu phải là từ cuối của cụm trên (VD: **${starter}** → **${starter.split(" ")[1]} ...**)
Nối đúng: +300 xu · Nối được từ cuối (hết từ để nối tiếp): +1,000 xu
📊 Round: ${getRoundCount("vi")}/10 · Không tự dừng, chơi đến khi hết từ hoặc admin gõ \`${prefix}noitu stop\``
:
`Starting word: **${starter}**

Type a word starting with **${starter[starter.length-1]}**, no repeats.
Correct word: +300 xu · Word that ends the chain (no continuation left): +1,000 xu
📊 Round: ${getRoundCount("en")}/10 · No auto-stop, keeps going until dead-end or an admin runs \`${prefix}noitu stop\``

                )

            ]

        });

    }

};

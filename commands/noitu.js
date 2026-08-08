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


            if(!getGame())

                return message.reply(
                    "╰・❌ Không có ván nối từ nào đang diễn ra"
                );


            stopGame();

            return message.reply(
                "╰・✅ Đã dừng ván nối từ và reset lại round (VI + EN)"
            );

        }


        if(lang !== "vi" && lang !== "en")

            return message.reply(
                "╰・❌ Cách dùng: `fnoitu vi` (nối từ tiếng Việt), `fnoitu en` (word chain tiếng Anh) hoặc `fnoitu stop` (admin)"
            );


        if(getGame())

            return message.reply(
                "╰・❌ Đang có ván nối từ diễn ra!"
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
📊 Round: ${getRoundCount("vi")}/10 · Không tự dừng, chơi đến khi hết từ hoặc admin gõ \`fnoitu stop\``
:
`Starting word: **${starter}**

Type a word starting with **${starter[starter.length-1]}**, no repeats.
Correct word: +300 xu · Word that ends the chain (no continuation left): +1,000 xu
📊 Round: ${getRoundCount("en")}/10 · No auto-stop, keeps going until dead-end or an admin runs \`fnoitu stop\``

                )

            ]

        });

    }

};

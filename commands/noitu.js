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
    prefix
} = require("../config");


// Chống spam lệnh stop: mỗi user phải đợi giữa 2 lần dùng.
const STOP_COOLDOWN_MS = 30_000;

const lastStopAttempt = new Map();




module.exports = {

    name:"noitu",

    aliases:["wordchain"],

    async execute(message,args){

        const lang = (args[0] || "").toLowerCase();


        if(lang === "stop"){

            const now = Date.now();

            const last = lastStopAttempt.get(message.author.id) || 0;

            if(now - last < STOP_COOLDOWN_MS){

                const remain = Math.ceil(
                    (STOP_COOLDOWN_MS - (now - last)) / 1000
                );

                return message.reply(
                    `╰・⚠️ Đừng spam lệnh dừng, đợi thêm ${remain}s rồi thử lại.`
                );

            }

            lastStopAttempt.set(message.author.id, now);


            if(!stopGame(message.channel.id))

                return message.reply(
                    "╰・❌ Không có ván nối từ nào đang diễn ra ở channel này"
                );


            return message.reply(
                "╰・✅ Đã dừng ván nối từ ở channel này và reset round"
            );

        }


        if(lang === "state"){

            const game = getGame(message.channel.id);

            if(!game)

                return message.reply(
                    "╰・ℹ️ Hiện không có ván nối từ nào đang diễn ra ở channel này"
                );

            return message.reply(
                `╰・ℹ️ Đang có ván nối từ **${game.lang === "vi" ? "tiếng Việt" : "tiếng Anh (word chain)"}** diễn ra ở channel này\n` +
                `🔗 Từ/cụm hiện tại: **${game.current}**\n` +
                `📊 Chuỗi: ${game.chainLength} từ · Round: ${getRoundCount(game.lang)}/10`
            );

        }


        if(lang !== "vi" && lang !== "en")

            return message.reply(
                `╰・❌ Cách dùng: \`${prefix}noitu vi\` (nối từ tiếng Việt), \`${prefix}noitu en\` (word chain tiếng Anh), \`${prefix}noitu state\` (xem ván đang diễn ra) hoặc \`${prefix}noitu stop\` (dừng ván)`
            );


        const existing = getGame(message.channel.id);

        if(existing)

            return message.reply(
                `╰・❌ Đang có ván nối từ **${existing.lang === "vi" ? "tiếng Việt" : "tiếng Anh"}** diễn ra ở channel này! Dùng \`${prefix}noitu stop\` để dừng ván hiện tại trước khi bắt đầu ván mới.`
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
📊 Round: ${getRoundCount("vi")}/10 · Không tự dừng, chơi đến khi hết từ hoặc ai đó gõ \`${prefix}noitu stop\``
:
`Starting word: **${starter}**

Type a word starting with **${starter[starter.length-1]}**, no repeats.
Correct word: +300 xu · Word that ends the chain (no continuation left): +1,000 xu
📊 Round: ${getRoundCount("en")}/10 · No auto-stop, keeps going until dead-end or anyone runs \`${prefix}noitu stop\``

                )

            ]

        });

    }

};

const {
    EmbedBuilder
} = require("discord.js");


const {
    getUser,
    save
} = require("../database");


const {
    enWords,
    viPhrases,
    enWordSet,
    viPhraseSet,
    hasContinuation
} = require("./dictionary");


const REWARD_NORMAL = 300;

const REWARD_DEADEND = 1000;

const MAX_ROUND = 10;


const enStarters =
enWords.filter(w => w.length >= 3 && w.length <= 8);


const games = new Map();

const roundCount = { vi:0, en:0 };




function pickStarter(lang){

    return lang === "vi"
    ?
    viPhrases[Math.floor(Math.random() * viPhrases.length)]
    :
    enStarters[Math.floor(Math.random() * enStarters.length)];

}




function getGame(channelId){

    return games.get(channelId);

}




function getRoundCount(lang){

    return roundCount[lang];

}




function startRound(game,starter){

    game.current = starter;

    game.used = new Set([starter]);

    game.chainLength = 1;

    game.lastUser = null;

}




function createGame(lang,channel,starter){

    const game = {

        lang,

        channel,

        scores: new Map()

    };

    startRound(game,starter);

    games.set(channel.id,game);

    return game;

}




function stopGame(channelId){

    const game = games.get(channelId);

    if(!game)
        return false;

    games.delete(channelId);

    roundCount[game.lang] = 0;

    return true;

}




function lastSyllableOf(entry,lang){

    if(lang === "en")
        return entry[entry.length - 1];

    return entry.split(" ")[1];

}




function validateEntry(raw,game,authorId){

    if(game.lang === "en"){

        const word = raw.trim().toLowerCase();

        if(!/^[a-z]+$/.test(word))
            return { ok:false, close:false };

        const required = lastSyllableOf(game.current,"en");

        if(word[0] !== required)
            return { ok:false, close:false };

        if(game.lastUser === authorId)
            return { ok:false, close:true, reason:"╰・❌ Phải để người khác nối rồi mới được nối tiếp" };

        if(game.used.has(word))
            return { ok:false, close:true, reason:"╰・❌ Từ này đã được dùng rồi" };

        if(!enWordSet.has(word))
            return { ok:false, close:true, reason:"╰・❌ Không có trong từ điển" };

        return { ok:true, value:word };

    }


    const phrase = raw.trim().replace(/\s+/g," ").toLowerCase();

    const parts = phrase.split(" ");

    if(parts.length !== 2)
        return { ok:false, close:false };

    const required = lastSyllableOf(game.current,"vi");

    if(parts[0] !== required)
        return { ok:false, close:false };

    if(game.lastUser === authorId)
        return { ok:false, close:true, reason:"╰・❌ Phải để người khác nối rồi mới được nối tiếp" };

    if(game.used.has(phrase))
        return { ok:false, close:true, reason:"╰・❌ Cụm này đã được dùng rồi" };

    if(!viPhraseSet.has(phrase))
        return { ok:false, close:true, reason:"╰・❌ Không có trong từ điển" };

    return { ok:true, value:phrase };

}




function notifyAndDelete(message,text){

    message.reply(text)
    .then(sent =>
        setTimeout(() => sent.delete().catch(()=>{}),5000)
    )
    .catch(()=>{});

}




async function handleMessage(message){

    if(message.author.bot)
        return false;


    const game = games.get(message.channel.id);

    if(!game)
        return false;

    const result = validateEntry(message.content,game,message.author.id);


    if(!result.ok){

        if(result.close)
            notifyAndDelete(message,result.reason);

        return result.close;

    }


    game.current = result.value;

    game.used.add(result.value);

    game.chainLength++;

    game.lastUser = message.author.id;

    game.scores.set(
        message.author.id,
        (game.scores.get(message.author.id) || 0) + 1
    );


    const isDeadEnd =
    !hasContinuation(game.current,game.lang,game.used);


    const user = getUser(message.author.id);


    if(!isDeadEnd){

        user.money += REWARD_NORMAL;

        save();

        await message.react("✅").catch(()=>{});

        return true;

    }


    user.money += REWARD_DEADEND;

    save();

    roundCount[game.lang]++;

    if(roundCount[game.lang] >= MAX_ROUND)
        roundCount[game.lang] = 0;


    const finishedChainLength = game.chainLength;

    const finishedEntry = game.current;


    const nextStarter = pickStarter(game.lang);

    startRound(game,nextStarter);


    await game.channel.send({

        embeds:[

            new EmbedBuilder()

            .setColor("Gold")

            .setTitle(
                game.lang === "en"
                ?
                "🏆 HẾT TỪ NỐI — WORD CHAIN"
                :
                "🏆 HẾT TỪ NỐI"
            )

            .setDescription(

`<@${message.author.id}> đã dùng từ cuối **${finishedEntry}** — không còn từ nào nối được tiếp!

💰 Thưởng: +${REWARD_DEADEND.toLocaleString()} xu
🔗 Chuỗi vừa xong: ${finishedChainLength} từ
📊 Round: ${roundCount[game.lang]}/${MAX_ROUND}

🆕 Từ bắt đầu round mới: **${nextStarter}**`

            )

        ]

    });


    return true;

}




module.exports = {

    createGame,
    getGame,
    stopGame,
    getRoundCount,
    pickStarter,
    handleMessage

};

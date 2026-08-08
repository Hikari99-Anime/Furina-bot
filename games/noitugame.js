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

// mỗi ngôn ngữ có 10 "ô" — 1 ô = 1 round. Ô của round hiện tại được
// xoá sạch khi bắt đầu round đó, nên 1 từ chỉ bị chặn trong đúng
// 10 round gần nhất, sau đó tự động được dùng lại.
const roundSlot = { vi:0, en:0 };

const usedHistory = {

    vi: Array.from({length:MAX_ROUND},() => new Set()),

    en: Array.from({length:MAX_ROUND},() => new Set())

};




function isUsedRecently(lang,entry){

    return usedHistory[lang].some(slot => slot.has(entry));

}




function roundsUntilFree(lang,entry){

    const idx =
    usedHistory[lang].findIndex(slot => slot.has(entry));

    if(idx === -1)
        return 0;

    return ((idx - roundSlot[lang] - 1 + MAX_ROUND) % MAX_ROUND) + 1;

}




function markUsed(lang,entry){

    usedHistory[lang][roundSlot[lang]].add(entry);

}




function pickStarter(lang){

    const pool = lang === "vi" ? viPhrases : enStarters;

    for(let i=0;i<10;i++){

        const pick = pool[Math.floor(Math.random() * pool.length)];

        if(!isUsedRecently(lang,pick))
            return pick;

    }

    return pool[Math.floor(Math.random() * pool.length)];

}




function getGame(channelId){

    return games.get(channelId);

}




function getRoundCount(lang){

    return roundSlot[lang];

}




function startRound(game,starter){

    game.current = starter;

    game.chainLength = 1;

    game.lastUser = null;

    markUsed(game.lang,starter);

}




function createGame(lang,channel,starter){

    const game = {

        lang,

        channel,

        scores: new Map()

    };

    usedHistory[lang][roundSlot[lang]] = new Set();

    startRound(game,starter);

    games.set(channel.id,game);

    return game;

}




function stopGame(channelId){

    const game = games.get(channelId);

    if(!game)
        return false;

    games.delete(channelId);

    roundSlot[game.lang] = 0;

    usedHistory[game.lang] =
    Array.from({length:MAX_ROUND},() => new Set());

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
            return { ok:false, close:true, reason:`╰・❌ Từ của bạn phải bắt đầu bằng chữ **${required}**` };

        if(game.lastUser === authorId)
            return { ok:false, close:true, reason:"╰・❌ Phải để người khác nối rồi mới được nối tiếp" };

        if(isUsedRecently("en",word))
            return { ok:false, close:true, reason:`╰・❌ Từ này đã được sử dụng trong 10 ván gần đây. Bạn có thể dùng lại sau ${roundsUntilFree("en",word)} ván nữa.` };

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
        return { ok:false, close:true, reason:`╰・❌ Từ của bạn phải bắt đầu bằng chữ **${required}**` };

    if(game.lastUser === authorId)
        return { ok:false, close:true, reason:"╰・❌ Phải để người khác nối rồi mới được nối tiếp" };

    if(isUsedRecently("vi",phrase))
        return { ok:false, close:true, reason:`╰・❌ Cụm này đã được sử dụng trong 10 ván gần đây. Bạn có thể dùng lại sau ${roundsUntilFree("vi",phrase)} ván nữa.` };

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

    markUsed(game.lang,result.value);

    game.chainLength++;

    game.lastUser = message.author.id;

    game.scores.set(
        message.author.id,
        (game.scores.get(message.author.id) || 0) + 1
    );


    const isDeadEnd =
    !hasContinuation(
        game.current,
        game.lang,
        word => isUsedRecently(game.lang,word)
    );


    const user = getUser(message.author.id);


    if(!isDeadEnd){

        user.money += REWARD_NORMAL;

        save();

        await message.react("✅").catch(()=>{});

        return true;

    }


    user.money += REWARD_DEADEND;

    save();


    const finishedChainLength = game.chainLength;

    const finishedEntry = game.current;


    roundSlot[game.lang] = (roundSlot[game.lang] + 1) % MAX_ROUND;

    usedHistory[game.lang][roundSlot[game.lang]] = new Set();


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
📊 Round: ${roundSlot[game.lang]}/${MAX_ROUND} (từ dùng quá 10 round trước sẽ được dùng lại)

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

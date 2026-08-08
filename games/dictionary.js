const fs = require("fs");
const path = require("path");


const enWords = require("an-array-of-english-words/index.json");

const enWordSet = new Set(enWords);


const viRaw = fs.readFileSync(

    path.join(
        __dirname,
        "..",
        "node_modules",
        "@vntk",
        "dictionary",
        "data",
        "Viet74K.txt"
    ),

    "utf8"

);


const viPhrases = [
    ...new Set(

        viRaw
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(l =>
            l
            &&
            !l.includes("-")
            &&
            l.split(/\s+/).length === 2
        )
        .map(l => l.toLowerCase())

    )
];

const viPhraseSet = new Set(viPhrases);


function groupBy(list,keyOf){

    const map = new Map();

    for(const item of list){

        const key = keyOf(item);

        if(!map.has(key))
            map.set(key,[]);

        map.get(key).push(item);

    }

    return map;

}


const enByFirstLetter = groupBy(enWords, w => w[0]);

const viByFirstWord = groupBy(viPhrases, p => p.split(" ")[0]);




function hasContinuation(entry,lang,isUsed){

    if(lang === "en"){

        const bucket =
        enByFirstLetter.get(entry[entry.length-1]) || [];

        return bucket.some(w => !isUsed(w));

    }


    const bucket =
    viByFirstWord.get(entry.split(" ")[1]) || [];

    return bucket.some(p => !isUsed(p));

}


module.exports = {

    enWords,
    enWordSet,

    viPhrases,
    viPhraseSet,

    hasContinuation

};

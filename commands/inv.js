const {
    EmbedBuilder
} = require("discord.js");


const {
    getUser
} = require("../database");


const {
    rods,
    baits,
    fishList,
    emoji
} = require("../config");



module.exports = {


name:"inv",



async execute(message){



const user =

getUser(
message.guild.id,
message.author.id
);





// ======================
// CẦN CÂU
// ======================

let rodText = "";



for(const id in user.can.danhSach){


const rod = rods[id];


if(!rod)
continue;



const active =

user.can.dangDung === id

? " ✅"

: "";



rodText +=

`${rod.emoji}${active} | 🎣 ${user.can.danhSach[id]} lượt | ⭐ ${rod.luck}\n`;



}



if(!rodText)

rodText = "❌ Chưa có cần câu";







// ======================
// MỒI
// ======================

let baitText = "";



for(const id in user.moi){



const bait = baits[id];


if(!bait)
continue;



if(user.moi[id] <= 0)
continue;



baitText +=

`${bait.emoji} x${user.moi[id]}\n`;



}



if(!baitText)

baitText = "❌ Không có mồi";







// ======================
// KHO CÁ
// ======================

let fishText = "";



for(const name in user.fish){



const list = user.fish[name];



if(!Array.isArray(list))
continue;



if(list.length <= 0)
continue;



const fishData =

fishList.find(

f => f.name === name

);



const fishEmoji =

fishData?.emoji || emoji.fish || "🐟";



fishText +=

`${fishEmoji} x${list.length}\n`;



}



if(!fishText)

fishText = "❌ Chưa có cá";







// ======================
// EMBED
// ======================

const embed =

new EmbedBuilder()


.setColor("#00ccff")


.setTitle(

`${emoji.bag || "🎒"} INVENTORY`
)



.setDescription(

`
${emoji.money || "💰"} **Tiền:** ${user.money.toLocaleString()} xu
━━━━━━━━━━━━━━
${emoji.rod || "🎣"} **Cần câu**
${rodText}
━━━━━━━━━━━━━━
${emoji.bait || "🪱"} **Mồi**
${baitText}
━━━━━━━━━━━━━━
${emoji.fish || "🐟"} **Kho cá**
${fishText}
`

)



.setThumbnail(

message.author.displayAvatarURL()

)



.setTimestamp();





message.reply({

embeds:[embed]

});



}


};
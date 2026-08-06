const {
EmbedBuilder
}=require("discord.js");


const {
fishList,
baits,
keys,
emoji,
formatMoney
}=require("../../config");


const {
getUser
}=require("../../data");



module.exports={


name:"bag",

aliases:[

"balo",
"inv",
"inventory"

],



async execute(message){



const user=
getUser(
message.guild.id,
message.author.id
);





// ======================
// CÁ
// ======================


let fishText="";

let totalFishMoney=0;



for(const id in user.fish){



const fish=
fishList.find(
x=>x.id===id
);



if(!fish)

continue;



const amount=
user.fish[id].length;



let weight=0;



for(const w of user.fish[id])

weight+=w;



const price=
Math.floor(
weight*fish.sell
);



totalFishMoney+=price;



fishText+=
`
${fish.emoji} ${fish.name}

　🐟 ${amount} con

　⚖️ ${weight.toFixed(2)} KG

　💰 ${formatMoney(price)} ${emoji.money}

`;



}



if(!fishText)

fishText=
"Chưa có cá nào";





// ======================
// MỒI
// ======================


let baitText="";



for(const id in user.moi){



if(user.moi[id]<=0)

continue;



const bait=
baits[id];



if(!bait)

continue;



baitText+=
`
${bait.emoji} ${bait.name}

　×${user.moi[id]}

`;



}



if(!baitText)

baitText=
"Không có mồi";





// ======================
// KEY
// ======================


let keyText="";



for(const id in user.keys){



if(user.keys[id]<=0)

continue;



const key=
keys[id];


if(!key)

continue;



keyText+=
`
${key.emoji} ${key.name}

　×${user.keys[id]}

`;



}



if(!keyText)

keyText=
"Không có chìa khóa";







message.reply({

embeds:[

new EmbedBuilder()

.setColor("#89ddff")

.setTitle(
"╭・🎒 Túi đồ"
)

.setDescription(
`
╭・🐟 **Kho cá**

${fishText}


╭・🪱 **Mồi**

${baitText}


╭・🗝️ **Chìa khóa**

${keyText}


╭・💰 Giá trị cá

${formatMoney(totalFishMoney)} ${emoji.money}


╰・🌊 Fishing Adventure
`
)

.setFooter({

text:
`👤 ${message.author.username}`

})

]

});



}

};
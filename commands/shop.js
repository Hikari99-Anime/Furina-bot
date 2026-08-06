const {
    EmbedBuilder
} = require("discord.js");


const {
    rods,
    baits,
    emoji
} = require("../config");



module.exports = {


name:"shop",



async execute(message,args,client){



let canText = "";

let moiText = "";




// ======================
// HIỂN THỊ CẦN CÂU
// ======================


for(
const id in rods
){


const can = rods[id];


canText +=

`
${can.emoji} **${id} - ${can.name}**
💰 Giá: \`${can.price.toLocaleString()} xu\`
\`${can.price.toLocaleString()} xu\`
🎣 Lượt: \`${can.uses}\`
⭐ May mắn: \`${can.luck}\`
Mua:
\`!buyrod ${id}\`

`;

}





// ======================
// HIỂN THỊ MỒI
// ======================


for(
const id in baits
){


const bait = baits[id];


moiText +=

`
${bait.emoji} **${id} - ${bait.name}**
💰 Giá: \`${bait.price.toLocaleString()} xu\`
Mua:
\`!buybait ${id}\`

`;

}






const embed =

new EmbedBuilder()


.setColor("#ffaa00")


.setTitle(
`${emoji.shop} SHOP CÂU CÁ`
)



.setDescription(

`

${emoji.rod} **🎣 CẦN CÂU**
${canText}
${emoji.bait} **🪱 MỒI CÂU**
${moiText}



📌 Cách dùng:
\`!buyrod can_1\`
\`!rod can_1\`
\`!buybait moivang\`
`

)



.setThumbnail(

message.client.user.displayAvatarURL()

)


.setTimestamp();





message.channel.send({

embeds:[
    embed
]

});



}


};
const {
EmbedBuilder,
ActionRowBuilder,
ButtonBuilder,
ButtonStyle
}=require("discord.js");

const {
rods,
baits,
keys,
formatMoney
}=require("../../config");


module.exports={

name:"shop",
aliases:["s"],


async execute(message){


const embed=new EmbedBuilder()

.setColor("#ffaa00")

.setTitle("🛒 CỬA HÀNG")

.setDescription(
`
Chọn danh mục muốn xem:

🎣 Cần câu
🪱 Mồi
🗝️ Chìa khóa

Dùng:
\`!buy <id> <số lượng>\`
`
);



const row=new ActionRowBuilder()
.addComponents(

new ButtonBuilder()
.setCustomId("shop_rod")
.setLabel("🎣 Cần câu")
.setStyle(ButtonStyle.Primary),


new ButtonBuilder()
.setCustomId("shop_bait")
.setLabel("🪱 Mồi")
.setStyle(ButtonStyle.Success),


new ButtonBuilder()
.setCustomId("shop_key")
.setLabel("🗝️ Chìa khóa")
.setStyle(ButtonStyle.Secondary)

);



const msg=await message.reply({

embeds:[embed],

components:[row]

});



const collector=
msg.createMessageComponentCollector({

time:60000

});



collector.on(
"collect",
async interaction=>{


if(
interaction.user.id!==message.author.id
)

return interaction.reply({

content:"❌ Đây không phải shop của bạn",

ephemeral:true

});



let text="";



if(
interaction.customId==="shop_rod"
){


text="🎣 **CẦN CÂU**\n\n";


for(const id in rods){

const x=rods[id];


text+=
`${x.emoji} \`${id}\`
${x.name}
⭐ ${x.star}
🎣 ${x.uses} lượt
💰 ${formatMoney(x.price)}

\n`;

}

}





if(
interaction.customId==="shop_bait"
){


text="🪱 **MỒI**\n\n";


for(const id in baits){

const x=baits[id];


text+=
`${x.emoji} \`${id}\`
${x.name}
💰 ${formatMoney(x.price)}

\n`;

}

}





if(
interaction.customId==="shop_key"
){


text="🗝️ **CHÌA KHÓA**\n\n";


for(const id in keys){

const x=keys[id];


text+=
`${x.emoji} \`${id}\`
${x.name}
💰 ${formatMoney(x.price)}

\n`;

}

}





interaction.update({

embeds:[

new EmbedBuilder()

.setColor("#ffaa00")

.setTitle("🛒 SHOP")

.setDescription(text)

]

});


}

);



}

};
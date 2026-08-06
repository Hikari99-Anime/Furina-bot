const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");


const {
    rods,
    baits,
    emoji
} = require("../config");




module.exports = {


name:"shop",



async execute(message){



const row = new ActionRowBuilder()

.addComponents(

new ButtonBuilder()

.setCustomId("shop_rod")

.setLabel("Cần câu")

.setEmoji("🎣")

.setStyle(ButtonStyle.Primary),



new ButtonBuilder()

.setCustomId("shop_bait")

.setLabel("Mồi câu")

.setEmoji("🪱")

.setStyle(ButtonStyle.Success)

);








async function getBanner(){


const app = await message.client.application.fetch();


if(!app.banner)

return null;


return `https://cdn.discordapp.com/banners/${app.id}/${app.banner}.png?size=1024`;

}





async function baseEmbed(embed){



embed.setThumbnail(

message.client.user.displayAvatarURL({

size:1024

})

);



const banner = await getBanner();



if(banner)

embed.setImage(banner);



embed.setTimestamp();


return embed;

}









async function createEmbed(type){



let text = "";







// ======================
// CẦN CÂU
// ======================


if(type === "rod"){



for(const id in rods){


const rod = rods[id];


text +=

`${rod.emoji} ${rod.name}
${emoji.money} ${rod.price.toLocaleString()} | 🎟️ ${rod.uses} lượt | ⭐ ${rod.luck}
🛒 \`!buyrod ${id}\`

`;



}




return await baseEmbed(

new EmbedBuilder()

.setColor("#00aaff")

.setTitle("🎣 SHOP CẦN CÂU")

.setDescription(text)

);



}








// ======================
// MỒI CÂU
// ======================


if(type === "bait"){



for(const id in baits){


const bait = baits[id];


text +=

`${bait.emoji} ${bait.name}
${emoji.money} ${bait.price.toLocaleString()}
🛒 \`!buybait ${id}\`

`;



}




return await baseEmbed(

new EmbedBuilder()

.setColor("#00ff99")

.setTitle("🪱 SHOP MỒI CÂU")

.setDescription(text)

);



}



}









// ======================
// MENU CHÍNH
// ======================


const main = await baseEmbed(

new EmbedBuilder()

.setColor("#ffaa00")

.setTitle(
`${emoji.shop || "🛒"} SHOP CÂU CÁ`
)

.setDescription(

`
Chọn danh mục:

🎣 Cần câu

🪱 Mồi câu

`

)

);







const msg = await message.reply({

embeds:[main],

components:[row]

});







const collector =

msg.createMessageComponentCollector({

time:60000

});







collector.on(

"collect",

async interaction=>{



if(
interaction.user.id !== message.author.id
)

return interaction.reply({

content:"❌ Đây không phải shop của bạn",

ephemeral:true

});







if(
interaction.customId === "shop_rod"
){


return interaction.update({

embeds:[

await createEmbed("rod")

],

components:[row]

});


}







if(
interaction.customId === "shop_bait"
){


return interaction.update({

embeds:[

await createEmbed("bait")

],

components:[row]

});


}



});



}



};
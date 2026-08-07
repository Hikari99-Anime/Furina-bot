const {
EmbedBuilder,
ActionRowBuilder,
ButtonBuilder,
ButtonStyle
}=require("discord.js");


const {
rods,
rodTitles
}=require("../../config");


const {
getUser,
save
}=require("../../data");



module.exports={


name:"rod",

aliases:[

"can",
"cancau"

],



async execute(message){



const user=
getUser(
message.guild.id,
message.author.id
);



const list=
Object.keys(
user.can.danhSach || {}
);



if(!list.length)

return message.reply({

content:
"╰・❌ Bạn chưa có cần câu"

});




let text="";



for(const id of list){



const base=
rods[id];


const rod=
user.rodData[id];



if(!rod)

continue;



let title="";


if(rodTitles[rod.level])

title=
`\n${rodTitles[rod.level]}`;



const active=

user.can.dangDung===id

?

" 🟢"

:

"";




text+=
`${base.emoji} **${base.name}**${active} · ⭐+${rod.level}${title} · 🍀 Luck ${rod.luck} · 🎯 ${rod.uses}/${rod.maxUses}
`;



}




const row=
new ActionRowBuilder();



for(const id of list.slice(0,5)){



row.addComponents(

new ButtonBuilder()

.setCustomId(
"equip_"+id
)

.setLabel(
rods[id].name
)

.setStyle(
ButtonStyle.Primary
)

);


}




const msg=
await message.reply({

embeds:[

new EmbedBuilder()

.setColor("#89ddff")

.setTitle(
"╭・🎣 Bộ sưu tập cần"
)

.setDescription(
`╭・🌊 Danh sách
${text}
╰・🟢 Đang dùng: ${rods[user.can.dangDung] ? rods[user.can.dangDung].name : "Chưa có"}`
)

.setFooter({

text:"✦ Fishing Adventure"

})

],

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
interaction.user.id !== message.author.id
)

return interaction.reply({

content:
"╰・❌ Đây không phải cần của bạn",

ephemeral:true

});




const id=
interaction.customId.replace(
"equip_",
""
);



if(!user.can.danhSach[id])

return interaction.reply({

content:
"╰・❌ Bạn chưa sở hữu cần này",

ephemeral:true

});




user.can.dangDung=id;


save();




const rod=
user.rodData[id];




interaction.update({

embeds:[

new EmbedBuilder()

.setColor("#a8ffb8")

.setTitle(
"╭・🎣 Đã đổi cần"
)

.setDescription(
`${rods[id].emoji} ${rods[id].name}

╭・✨ Thông số
⭐ Cường hóa: +${rod.level}
🍀 Luck: ${rod.luck}
🎯 Độ bền: ${rod.uses}/${rod.maxUses}

╰・🌊 Sẵn sàng câu cá`
)

.setFooter({

text:"Fishing Adventure"

})

]

});


});


}

};
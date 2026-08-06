const {
EmbedBuilder
}=require("discord.js");


const {
rods,
emoji,
rodTitles,
formatMoney
}=require("../../config");


const {
getUser
}=require("../../data");



module.exports={


name:"profile",

aliases:[

"pf",
"me"

],



async execute(message){



const user=
getUser(
message.guild.id,
message.author.id
);





// ======================
// CẦN HIỆN TẠI
// ======================


let rodText=
"Chưa trang bị";



if(user.can.dangDung){



const id=
user.can.dangDung;


const base=
rods[id];


const rod=
user.rodData[id];



let title="";


if(rodTitles[rod.level])

title=
`\n${rodTitles[rod.level]}`;



rodText=
`
${base.emoji} ${base.name}

⭐ +${rod.level}${title}

🍀 Luck ${rod.luck}

🎯 ${rod.uses}/${rod.maxUses}
`;



}





// ======================
// ĐẾM CÁ
// ======================


let totalFish=0;



for(const id in user.fish){



totalFish+=
user.fish[id].length;


}





message.reply({

embeds:[


new EmbedBuilder()

.setColor("#89ddff")

.setTitle(
`╭・👤 Hồ sơ ${message.author.username}`
)

.setThumbnail(
message.author.displayAvatarURL()
)

.setDescription(
`
╭・💰 Tài sản


${formatMoney(user.money)} ${emoji.money}



╭・🎣 Cần đang dùng


${rodText}



╭・🐟 Thành tích


🐟 Cá đã bắt:

${totalFish}



╭・🎒 Túi mồi


🪱 Mồi thường:

${user.moi.moithuong || 0}


🦐 Mồi bạc:

${user.moi.moibac || 0}


✨ Mồi vàng:

${user.moi.moivang || 0}



╰・🌊 Fishing Adventure
`
)

.setFooter({

text:
"✦ Hành trình ngư dân"

})



]

});



}

};
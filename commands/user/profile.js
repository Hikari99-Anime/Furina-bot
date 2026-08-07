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
` · ${rodTitles[rod.level]}`;



rodText=
`${base.emoji} ${base.name} · ⭐+${rod.level}${title}
🍀 Luck ${rod.luck} · 🎯 ${rod.uses}/${rod.maxUses}`;



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
`╭・💰 **Tài sản:** ${formatMoney(user.money)} ${emoji.money}

╭・🎣 **Cần đang dùng**
${rodText}

╭・🐟 **Cá đã bắt:** ${totalFish}

╭・🎒 **Túi mồi:** 🪱 ${user.moi.moithuong || 0} · 🦐 ${user.moi.moibac || 0} · ✨ ${user.moi.moivang || 0}

╰・🌊 Fishing Adventure`
)

.setFooter({

text:
"✦ Hành trình ngư dân"

})



]

});



}

};
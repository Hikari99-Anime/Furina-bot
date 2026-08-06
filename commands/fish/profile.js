const {EmbedBuilder}=require("discord.js");

const {
getUser
}=require("../../database");


const {
emoji,
formatMoney,
rods,
chests,
keys
}=require("../../config");



module.exports={


name:"profile",
aliases:["p"],



async execute(message){


const user=getUser(
message.guild.id,
message.author.id
);



let fishCount=0;

let totalKg=0;


for(const name in user.fish){


fishCount+=user.fish[name].length;


for(const kg of user.fish[name])

totalKg+=kg;


}



const rodID=
user.can.dangDung;


let rodText=
"Chưa trang bị";


if(rodID&&rods[rodID]){


rodText=
`${rods[rodID].emoji} ${rods[rodID].name}
🎣 ${user.can.danhSach[rodID]||0} lượt`;

}




let chestCount=0;


for(const id in user.chest){

chestCount+=user.chest[id];

}



let keyCount=0;


for(const id in user.keys){

keyCount+=user.keys[id];

}





const embed=new EmbedBuilder()


.setColor("#00ccff")


.setTitle(
`👤 Hồ sơ ${message.author.username}`
)


.setThumbnail(
message.author.displayAvatarURL()
)


.setDescription(

`
${emoji.money} **Tiền**
${formatMoney(user.money)} xu


🎣 **Cần đang dùng**

${rodText}


🐟 **Kho cá**

${fishCount} con

⚖️ ${totalKg.toFixed(1)} kg


🎁 **Rương**

${chestCount}


🗝️ **Chìa khóa**

${keyCount}

`

)


.setFooter({
text:"Fish Adventure"
})


.setTimestamp();



message.reply({
embeds:[embed]
});


}

};
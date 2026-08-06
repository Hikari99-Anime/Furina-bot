const {EmbedBuilder}=require("discord.js");
const {getUser}=require("../../database");
const {chests,keys}=require("../../config");


module.exports={

name:"chest",
aliases:["c"],


async execute(message){


const user=getUser(
message.guild.id,
message.author.id
);



let chestText="";



for(const id in chests){


const x=chests[id];


const amount=
user.chest[id]||0;


if(amount>0){

chestText+=
`${x.emoji} ${x.name} x${amount}\n`;

}

}



if(!chestText)
chestText="Không có rương";



let keyText="";



for(const id in keys){


const x=keys[id];


const amount=
user.keys[id]||0;


if(amount>0){

keyText+=
`${x.emoji} ${x.name} x${amount}\n`;

}

}



if(!keyText)
keyText="Không có chìa";




const embed=new EmbedBuilder()

.setColor("#ffaa00")

.setTitle("🎁 KHO RƯƠNG")

.setThumbnail(
message.author.displayAvatarURL()
)

.setDescription(

`
🎁 **Rương**

${chestText}


🗝️ **Chìa khóa**

${keyText}


💡 Mở:
\`!open chest_1\`
`

)

.setTimestamp();



message.reply({
embeds:[embed]
});


}

};
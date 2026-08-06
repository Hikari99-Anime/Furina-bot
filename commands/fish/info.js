const {EmbedBuilder}=require("discord.js");
const {getUser}=require("../../database");
const {fishList,formatMoney}=require("../../config");


module.exports={

name:"info",
aliases:["i"],


async execute(message,args){


const user=getUser(
message.guild.id,
message.author.id
);



const id=args[0];


if(!id)
return message.reply(
"❌ Ví dụ: `!info camap`"
);



const fish=fishList.find(x=>

x.id===id.toLowerCase() ||

x.name
.toLowerCase()
.includes(
id.toLowerCase()
)

);



if(!fish)
return message.reply(
"❌ Không tìm thấy cá"
);



const count=
user.fish[fish.name]?.length||0;



const embed=new EmbedBuilder()

.setColor("#00aaff")

.setTitle(
`${fish.emoji} ${fish.name}`
)

.setDescription(

`
${fish.color} **Độ hiếm:**
${fish.rarity}


🎣 **Tỉ lệ câu:**
${fish.rate}%


⚖️ **Cân nặng:**
${fish.min}kg - ${fish.max}kg


💰 **Giá bán:**
${formatMoney(fish.sell)} xu/kg


🎒 **Bạn đang có:**
x${count}

`

)

.setThumbnail(
message.client.user.displayAvatarURL()
)

.setTimestamp();



message.reply({
embeds:[embed]
});


}

};
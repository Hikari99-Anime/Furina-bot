const {EmbedBuilder}=require("discord.js");
const {getUser,save}=require("../../database");
const {fishList,emoji,formatMoney}=require("../../config");

module.exports={

name:"sell",
aliases:["sl"],

async execute(message,args){

const user=getUser(
message.guild.id,
message.author.id
);

const id=args[0];
const amount=Number(args[1]);

if(!id||!amount)
return message.reply(
"❌ Ví dụ: `!sell caro 5`"
);



const fish=fishList.find(x=>
x.id===id||
x.name.toLowerCase().includes(id.toLowerCase())
);


if(!fish)
return message.reply(
"❌ Không tìm thấy cá"
);



const list=user.fish[fish.name];


if(!list||list.length<amount)
return message.reply(
"❌ Không đủ cá"
);



list.sort((a,b)=>b-a);



let kg=0;

for(let i=0;i<amount;i++){

kg+=list.shift();

}



const money=Math.floor(
kg*fish.sell
);



user.money+=money;



if(list.length===0)
delete user.fish[fish.name];


save();



message.reply({

embeds:[

new EmbedBuilder()

.setColor("#ffd700")

.setTitle("💰 BÁN CÁ")

.setDescription(

`
${fish.emoji} **${fish.name}**

📦 Số lượng:
x${amount}

⚖️ Tổng cân:
${kg.toFixed(2)} kg


${emoji.money} Nhận:
${formatMoney(money)}


💰 Số dư:
${formatMoney(user.money)}
`

)

]

});


}

};
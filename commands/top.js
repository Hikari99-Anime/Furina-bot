const {
    EmbedBuilder
} = require("discord.js");


const {
    data
} = require("../database");



module.exports = {


name:"top",



async execute(message,args){



const type =
args[0] || "money";





const guildData =

data[message.guild.id];





if(!guildData){


return message.reply(
"❌ Chưa có dữ liệu"
);


}






let list=[];






for(
const id in guildData
){



const user =
guildData[id];



list.push({

id,

money:
user.money || 0,


fish:
Object.values(
user.fish || {}
)

.reduce(
(a,b)=>a+b.length,
0
)


});


}








// ======================
// TOP TIỀN
// ======================


if(
type==="money"
){



list.sort(

(a,b)=>

b.money-a.money

);



let text="";



list
.slice(0,10)
.forEach(

(u,i)=>{


text +=

`
**${i+1}.** <@${u.id}>

💰 ${u.money.toLocaleString()} xu

`;

}

);






const embed =

new EmbedBuilder()

.setColor("Gold")

.setTitle("🏆 TOP GIÀU CÓ")

.setDescription(
text || "Chưa có dữ liệu"
)

.setTimestamp();






return message.reply({

embeds:[
embed
]

});


}








// ======================
// TOP CÁ
// ======================


if(
type==="fish"
){



list.sort(

(a,b)=>

b.fish-a.fish

);





let text="";



list
.slice(0,10)
.forEach(

(u,i)=>{


text +=

`
**${i+1}.** <@${u.id}>

🐟 ${u.fish} con cá

`;

}

);






const embed =

new EmbedBuilder()

.setColor("Blue")

.setTitle("🏆 TOP NGƯ DÂN")

.setDescription(
text || "Chưa có dữ liệu"
)

.setTimestamp();






return message.reply({

embeds:[
embed
]

});


}








return message.reply(

`
❌ Loại top không hợp lệ

Dùng:

\`!top money\`

\`!top fish\`

`

);



}


};
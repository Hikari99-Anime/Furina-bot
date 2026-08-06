const {EmbedBuilder}=require("discord.js");

const {
data
}=require("../../database");


const {
formatMoney
}=require("../../config");



module.exports={

name:"top",
aliases:["rank"],



async execute(message){


const guild=
data[message.guild.id];


if(!guild)

return message.reply(
"❌ Chưa có dữ liệu"
);



let users=[];



for(const id in guild){


const user=guild[id];


let fish=0;

let kg=0;



for(const name in user.fish||{}){


fish+=
user.fish[name].length;



for(const w of user.fish[name])

kg+=w;


}



users.push({

id,

money:user.money||0,

fish,

kg

});


}




const moneyTop=
[...users]
.sort(
(a,b)=>b.money-a.money
)
.slice(0,5);



const fishTop=
[...users]
.sort(
(a,b)=>b.fish-a.fish
)
.slice(0,5);



let moneyText="";


for(
let i=0;
i<moneyTop.length;
i++
){


const u=
await message.client.users.fetch(
moneyTop[i].id
)
.catch(()=>null);



moneyText+=
`${i+1}. ${u?u.username:"Unknown"} - ${formatMoney(moneyTop[i].money)}\n`;

}



let fishText="";


for(
let i=0;
i<fishTop.length;
i++
){


const u=
await message.client.users.fetch(
fishTop[i].id
)
.catch(()=>null);



fishText+=
`${i+1}. ${u?u.username:"Unknown"} - 🐟 ${fishTop[i].fish} con\n`;

}



const embed=new EmbedBuilder()

.setColor("#ffd700")

.setTitle("🏆 BẢNG XẾP HẠNG")

.setDescription(

`
💰 **ĐẠI GIA**

${moneyText||"Chưa có"}


🐟 **NGƯ DÂN**

${fishText||"Chưa có"}

`

)

.setTimestamp();



message.reply({

embeds:[embed]

});



}

};
const {EmbedBuilder}=require("discord.js");

const {
getUser,
save
}=require("../../database");


const {
formatMoney,
emoji
}=require("../../config");



module.exports={

name:"daily",
aliases:["d"],



async execute(message){


const user=getUser(
message.guild.id,
message.author.id
);



const now=Date.now();


const cooldown=24*60*60*1000;



if(
user.daily &&
now-user.daily<cooldown
){


const time=
cooldown-(now-user.daily);



const hour=
Math.floor(
time/3600000
);



const min=
Math.floor(
(time%3600000)/60000
);



return message.reply(
`⏳ Đã nhận daily\nQuay lại sau **${hour}h ${min}p**`
);


}



const money=10000;


const bait=10;



user.money+=money;



if(!user.moi)
user.moi={};



user.moi.moithuong=
(user.moi.moithuong||0)+bait;



user.daily=now;



// 10% rương đồng

let chestText="";


if(Math.random()*100<=10){


if(!user.chest)
user.chest={};



user.chest.chest_1=
(user.chest.chest_1||0)+1;



chestText=
"\n🎁 Nhận thêm 🟫 Rương Đồng";

}



save();



const embed=new EmbedBuilder()

.setColor("#00ff88")

.setTitle("🎁 NHẬN DAILY")

.setDescription(

`
${emoji.money}
+${formatMoney(money)} xu


🪱 Mồi thường
+x${bait}


${chestText}


⏳ Hẹn gặp lại sau 24 giờ

`

)

.setTimestamp();



message.reply({
embeds:[embed]
});


}

};
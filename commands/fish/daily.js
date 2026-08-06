const {
EmbedBuilder
}=require("discord.js");


const {
emoji,
formatMoney
}=require("../../config");


const {
getUser,
save
}=require("../../data");



module.exports={


name:"daily",

aliases:[

"nhan",
"reward"

],



async execute(message){



const user=
getUser(
message.guild.id,
message.author.id
);



const now=
Date.now();




// tạo dữ liệu daily

if(!user.daily){


user.daily={

last:0,

streak:0

};


}




const cooldown=
24*60*60*1000;




const timeLeft=
cooldown-
(now-user.daily.last);





if(
now-user.daily.last < cooldown
){



const hour=
Math.floor(
timeLeft/(1000*60*60)
);



const minute=
Math.floor(
(timeLeft%(1000*60*60))
/(1000*60)
);



return message.reply({

embeds:[

new EmbedBuilder()

.setColor("#ffcc66")

.setTitle(
"╭・⏳ Chưa thể nhận"
)

.setDescription(
`
🎁 Bạn đã nhận Daily rồi!


⏰ Quay lại sau:

${hour} giờ ${minute} phút


╰・Đừng quên quay lại nhé
`
)

]

});



}





// streak

if(
now-user.daily.last
>
cooldown*2
){


user.daily.streak=0;


}



user.daily.streak++;





const reward=

5000+
(
user.daily.streak*1000
);



user.money+=reward;



user.daily.last=now;



save();





message.reply({

embeds:[

new EmbedBuilder()

.setColor("#8affb2")

.setTitle(
"╭・🎁 Nhận Daily"
)

.setDescription(
`
✨ Chúc mừng!


🔥 Chuỗi ngày:

${user.daily.streak} ngày


💰 Nhận được:

${formatMoney(reward)} ${emoji.money}


💳 Số dư:

${formatMoney(user.money)} ${emoji.money}


╰・🌊 Tiếp tục hành trình
`
)

.setFooter({

text:
"✦ Fishing Adventure"

})

]

});



}

};
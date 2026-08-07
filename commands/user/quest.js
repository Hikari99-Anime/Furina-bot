const {
EmbedBuilder
}=require("discord.js");


const {
emoji,
formatMoney,
prefix
}=require("../../config");


const {
getUser,
save
}=require("../../data");



module.exports={


name:"quest",

aliases:[

"nv",
"nhiemvu"

],



async execute(message,args){



const user=
getUser(
message.author.id
);



const now=
Date.now();




// tạo quest

if(!user.quest){


user.quest={


target:10,


progress:0,


reward:10000,


done:false,


time:now



};


}





// reset sau 24h

if(
now-user.quest.time
>
86400000
){



user.quest={


target:10,


progress:0,


reward:10000,


done:false,


time:now



};



save();


}





// nhận thưởng

if(
args[0]==="claim"
||
args[0]==="nhan"
){



if(user.quest.done)

return message.reply({

content:
"╰・❌ Bạn đã nhận thưởng rồi"

});



if(
user.quest.progress
<
user.quest.target
)

return message.reply({

content:

`╰・❌ Chưa hoàn thành: ${user.quest.progress}/${user.quest.target}`

});





user.money+=
user.quest.reward;



user.quest.done=true;



save();





return message.reply({

embeds:[

new EmbedBuilder()

.setColor("#8affb2")

.setTitle(
"╭・🎁 Nhận thưởng nhiệm vụ"
)

.setDescription(
`✨ Hoàn thành nhiệm vụ!

💰 Nhận: ${formatMoney(user.quest.reward)} ${emoji.money}

╰・🌊 Hẹn gặp lại ngày mai`
)

]

});



}






message.reply({

embeds:[

new EmbedBuilder()

.setColor("#89ddff")

.setTitle(
"╭・📜 Nhiệm vụ hôm nay"
)

.setDescription(
`🎣 Câu cá: ${user.quest.progress}/${user.quest.target}
🎁 Phần thưởng: ${formatMoney(user.quest.reward)} ${emoji.money}

${user.quest.done ? "✅ Đã nhận" : "⏳ Chưa nhận"}

╰・Dùng: \`${prefix}quest claim\``
)

]

});



}

};
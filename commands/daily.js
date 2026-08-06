const {
    EmbedBuilder
} = require("discord.js");


const {
    getUser,
    save
} = require("../database");



module.exports = {


name:"daily",



async execute(message){



const user =

getUser(
message.guild.id,
message.author.id
);






const now =
Date.now();




const cooldown =
24 * 60 * 60 * 1000;






if(
user.daily &&
now - user.daily < cooldown
){



const remain =

cooldown -
(now - user.daily);




const hour =

Math.floor(
remain / 3600000
);



const min =

Math.floor(
(remain % 3600000)
/60000
);





return message.reply(

`
⏳ Bạn đã nhận daily rồi!

Thử lại sau:

${hour} giờ ${min} phút

`

);


}







const reward = 5000;



user.money += reward;



user.daily = now;



save();







const embed =

new EmbedBuilder()

.setColor("Gold")

.setTitle("🎁 DAILY NHẬN THƯỞNG")

.setDescription(

`
💰 Nhận:

**${reward.toLocaleString()} xu**


💵 Số dư:

${user.money.toLocaleString()} xu


⏰ Hẹn gặp lại ngày mai!

`

)

.setTimestamp();






message.reply({

embeds:[
embed
]

});



}


};
const {
    EmbedBuilder
} = require("discord.js");


const {
    emoji,
    formatMoney
} = require("../../config");


const {
    getUser,
    save
} = require("../../data");



module.exports = {


name:"daily",


aliases:[

    "nhan",

    "reward"

],




async execute(message){



const user = getUser(

    message.guild.id,

    message.author.id

);




// =====================
// FIX DAILY DATA CŨ
// =====================


// data cũ:
// "daily":1785944117863

if(typeof user.daily === "number"){


    user.daily = {

        last:0,

        streak:0

    };


    save();


}





if(!user.daily){


    user.daily = {


        last:0,


        streak:0


    };


    save();


}





if(typeof user.daily.last !== "number")

user.daily.last = 0;



if(typeof user.daily.streak !== "number")

user.daily.streak = 0;







const now = Date.now();



const cooldown =

24 * 60 * 60 * 1000;







// =====================
// KIỂM TRA COOLDOWN
// =====================


if(

    user.daily.last > 0 &&

    now - user.daily.last < cooldown

){



const timeLeft =

cooldown -

(now - user.daily.last);





const hour =

Math.floor(

    timeLeft / 3600000

);





const minute =

Math.floor(

    (timeLeft % 3600000) / 60000

);






return message.reply({


embeds:[


new EmbedBuilder()


.setColor("#ffd166")


.setTitle(

"╭・⏳ DAILY"

)



.setDescription(

`
🎁 Bạn đã nhận thưởng hôm nay!


⏰ Còn lại:

**${hour} giờ ${minute} phút**


🔥 Chuỗi hiện tại:

**${user.daily.streak} ngày**


╰・🎣 Hẹn gặp lại!
`

)



.setFooter({

text:"✦ Fishing Adventure"

})


]


});


}









// =====================
// RESET CHUỖI NẾU BỎ QUÁ LÂU
// =====================


if(

    user.daily.last > 0 &&

    now - user.daily.last > cooldown * 2

){


    user.daily.streak = 0;


}







// =====================
// NHẬN THƯỞNG
// =====================



user.daily.streak =

Number(user.daily.streak) + 1;






const reward =

5000 +

(user.daily.streak * 1000);






user.money =

Number(user.money || 0)

+

reward;






user.daily.last = now;





save();







return message.reply({


embeds:[



new EmbedBuilder()



.setColor("#8affb2")



.setTitle(

"╭・🎁 DAILY REWARD"

)



.setDescription(

`
✨ Nhận thưởng thành công!


🔥 Chuỗi:

**${user.daily.streak} ngày**


💰 Nhận:

**${formatMoney(reward)} ${emoji.money}**


💳 Số dư:

**${formatMoney(user.money)} ${emoji.money}**


╰・🎣 Chúc bạn câu được cá hiếm!
`

)



.setFooter({

text:"✦ Fishing Adventure"

})



]


});



}


};
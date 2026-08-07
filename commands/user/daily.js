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
} = require("../../data.js");





module.exports = {


name:"daily",


aliases:[

    "nhan",

    "reward"

],






async execute(message){



const user = getUser(

    message.author.id

);





// ======================
// FIX DAILY DATA
// ======================


if(!user.daily){


    user.daily = {

        last:0,

        streak:0

    };


}





if(typeof user.daily.last !== "number"){


    user.daily.last = 0;


}





if(typeof user.daily.streak !== "number"){


    user.daily.streak = 0;


}








const now = Date.now();





const cooldown = 

24 * 60 * 60 * 1000;







// ======================
// CHECK COOLDOWN
// ======================


const passed = 

now - user.daily.last;





if(
passed < cooldown
){



const remain = 

cooldown - passed;



const hour = Math.floor(

remain /

(1000 * 60 * 60)

);



const minute = Math.floor(

(remain % 

(1000 * 60 * 60))

/

(1000 * 60)

);





return message.reply({


embeds:[



new EmbedBuilder()

.setColor("#FACC15")

.setTitle(

"╭・⏳ DAILY REWARD"

)

.setDescription(

`🎁 Bạn đã nhận thưởng hôm nay!

⏰ Còn lại: ${hour} giờ ${minute} phút
🔥 Chuỗi hiện tại: ${user.daily.streak} ngày

╰・🎣 Hẹn gặp lại!`

)

.setFooter({

text:

"✦ Fishing Adventure"

})


]

});



}









// ======================
// RESET STREAK
// ======================


if(

user.daily.last > 0 &&

passed > cooldown * 2

){


user.daily.streak = 0;


}







// ======================
// NHẬN DAILY
// ======================


user.daily.streak++;





const reward = 

5000 +

(user.daily.streak * 1000);





user.money += reward;





user.daily.last = now;





save();









return message.reply({



embeds:[



new EmbedBuilder()


.setColor("#86EFAC")


.setTitle(

"╭・🎁 DAILY REWARD"

)


.setDescription(

`✨ Nhận thưởng thành công!

🔥 Chuỗi: ${user.daily.streak} ngày
💰 Nhận: ${formatMoney(reward)} ${emoji.money}
💳 Số dư: ${formatMoney(user.money)} ${emoji.money}

╰・🎣 Chúc bạn câu được cá hiếm!`

)


.setFooter({

text:

"✦ Fishing Adventure"

})


.setTimestamp()



]


});





}



};
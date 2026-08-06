const {
    EmbedBuilder
} = require("discord.js");


const {
    getUser,
    save
} = require("../database");


const {
    chests
} = require("../config");



module.exports = {


name:"openchest",



async execute(message,args){



const id = args[0];



if(!chests[id])

return message.reply(
"❌ Không có loại rương này"
);




const user = getUser(

message.guild.id,

message.author.id

);





if(!user.chest)

user.chest={};



if(!user.keys)

user.keys={};







if(!user.chest[id] || user.chest[id] <= 0)

return message.reply(
"❌ Bạn không có rương này"
);





const chest = chests[id];




const key = chest.key;





if(!user.keys[key] || user.keys[key] <= 0)

return message.reply(

`
❌ Cần:

${key}

để mở rương
`

);






// trừ rương + chìa

user.chest[id]--;

user.keys[key]--;








// phần thưởng

const reward =

Math.floor(

Math.random() *

(
chest.reward[1]
-
chest.reward[0]
)

)

+

chest.reward[0];







user.money += reward;



save();







const embed = new EmbedBuilder()


.setColor("#ffd700")


.setTitle(

`${chest.emoji} MỞ ${chest.name}`

)


.setDescription(

`
⭐ Cấp rương:
${chest.star} sao


🎁 Nhận được:

💰 **${reward.toLocaleString()} xu**


💵 Số dư:

${user.money.toLocaleString()} xu

`

)


.setTimestamp();






message.reply({

embeds:[embed]

});



}


};
const {
    EmbedBuilder
} = require("discord.js");


const {
    getUser,
    save
} = require("../database");


const {
    chests,
    keys,
    rods,
    baits
} = require("../config");



module.exports = {


name:"open",



async execute(message,args){



const user = getUser(
    message.guild.id,
    message.author.id
);






const chestID = args[0];



const amount = Math.max(
    1,
    Number(args[1]) || 1
);






if(!chestID){


return message.reply(
"❌ Ví dụ: `!open chest_1 5`"
);


}







const chest = chests[chestID];



if(!chest){


return message.reply(
"❌ Rương không tồn tại"
);


}








if(
(user.chest[chestID] || 0) < amount
){


return message.reply(
"❌ Bạn không có đủ rương"
);


}







const keyID = chest.key;





if(
(user.keys[keyID] || 0) < amount
){


return message.reply(
"❌ Không đủ chìa khóa"
);


}








// trừ rương + key

user.chest[chestID]-=amount;

user.keys[keyID]-=amount;


save();







const loading = await message.reply({

embeds:[


new EmbedBuilder()

.setColor("#ffaa00")

.setTitle("🎁 ĐANG MỞ RƯƠNG")

.setDescription(

`
${chest.emoji} **${chest.name}**

🔑 Đang dùng chìa khóa...

🎰 Đang quay thưởng...

`

)

]

});









setTimeout(()=>{



let rewardText="";



let rewards={};






for(let i=0;i<amount;i++){



const roll = Math.random()*100;






let reward;







// =================
// GACHA TỈ LỆ
// =================



if(roll < 50){


let money =

Math.floor(
Math.random()*4000
)+1000;



user.money += money;


reward=`💰 +${money.toLocaleString()} xu`;



}





else if(roll < 75){



let baitID="moithuong";


if(!user.moi[baitID])

user.moi[baitID]=0;



user.moi[baitID]+=5;


reward="🪱 Mồi thường x5";



}





else if(roll < 90){



reward="🎣 Vật phẩm hiếm";





}






else if(roll < 99){



user.money += 50000;


reward="💎 +50,000 xu";



}





else{



user.money += 500000;


reward="🌈 JACKPOT +500,000 xu";



}






rewards[reward] =

(rewards[reward] || 0)+1;



}







save();







for(const r in rewards){


rewardText +=

`${r}\n`;

}




const result = new EmbedBuilder()

.setColor("#00ff00")

.setTitle("🎉 MỞ RƯƠNG THÀNH CÔNG")

.setDescription(

`
${chest.emoji} ${chest.name}

📦 Số lượng:
x${amount}


🎁 Phần thưởng:

${rewardText}


💰 Xu hiện tại:

${user.money.toLocaleString()}

`

)

.setTimestamp();







loading.edit({

embeds:[result]

});






},4000);



}



};
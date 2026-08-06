const {
    EmbedBuilder
} = require("discord.js");


const {
    getUser,
    save
} = require("../database");


const {
    rods,
    baits,
    fishList,
    chests
} = require("../config");



module.exports = {


name:"fish",



async execute(message,args){



const user = getUser(
    message.guild.id,
    message.author.id
);






const rodID = user.can.dangDung;



if(!rodID)

return message.reply(
"❌ Bạn chưa có cần câu"
);





const rod = rods[rodID];



if(!rod)

return message.reply(
"❌ Cần câu không tồn tại"
);







const baitID = args[0];


const amount = Math.max(
    1,
    Number(args[1]) || 1
);







if(!baitID)

return message.reply(
"❌ Ví dụ: `!fish moithuong 5`"
);







const bait = baits[baitID];



if(!bait)

return message.reply(
"❌ Mồi không tồn tại"
);







if(
(user.moi[baitID] || 0) < amount
)

return message.reply(
"❌ Không đủ mồi"
);







if(
(user.can.danhSach[rodID] || 0) < amount
)

return message.reply(
"❌ Không đủ lượt cần"
);









// trừ vật phẩm

user.moi[baitID] -= amount;


user.can.danhSach[rodID] -= amount;


save();








const msg = await message.reply({

embeds:[

new EmbedBuilder()

.setColor("#0099ff")

.setTitle(`🎣 ĐANG CÂU x${amount}`)

.setDescription(

`
${rod.emoji} ${rod.name}

${bait.emoji} ${bait.name}

⏳ Đang chờ cá...

`

)

]

});









setTimeout(()=>{





let fishCount = {};

let chestCount = {};







for(let i = 0; i < amount; i++){





// ======================
// RANDOM CÁ
// ======================


let chance = Math.random()*100;


chance -= rod.luck;



let total = 0;

let caught = null;






for(const fish of fishList){



total += fish.rate;



if(chance <= total){


caught = fish;


break;


}



}






if(!caught)

caught = fishList[0];









// cân nặng

const weight = Number(

(

Math.random()

*

(caught.max - caught.min)

+

caught.min

).toFixed(2)

);







if(!user.fish)

user.fish={};





if(!user.fish[caught.name])

user.fish[caught.name]=[];





user.fish[caught.name].push(weight);








// đếm cá

fishCount[caught.name] =

(fishCount[caught.name] || 0) + 1;











// ======================
// RANDOM RƯƠNG
// ======================


const r = Math.random()*100;



let chestID = null;




if(r <= 0.5)

chestID="chest_5";


else if(r <= 2)

chestID="chest_4";


else if(r <= 6)

chestID="chest_3";


else if(r <= 15)

chestID="chest_2";


else if(r <= 35)

chestID="chest_1";







if(chestID){



if(!user.chest)

user.chest={};




user.chest[chestID] =

(user.chest[chestID] || 0) + 1;





// đếm rương

chestCount[chestID] =

(chestCount[chestID] || 0) + 1;



}



}








save();







// ======================
// TEXT CÁ
// ======================


let fishText="";



for(const name in fishCount){



fishText +=

`🐟 ${name} x${fishCount[name]}\n`;



}









// ======================
// TEXT RƯƠNG
// ======================


let chestText="";



for(const id in chestCount){



const chest = chests[id];



chestText +=

`${chest.emoji} ${chest.name} x${chestCount[id]}\n`;



}



if(!chestText)

chestText="Không có";









const result = new EmbedBuilder()

.setColor("#00ff00")

.setTitle(`🎣 CÂU XONG x${amount}`)

.setDescription(

`
🐟 **Cá bắt được**

${fishText}


🎁 **Rương nhận được**

${chestText}


🎣 ${rod.emoji} ${rod.name}

🪱 ${bait.emoji} ${bait.name}


📦 Đã lưu kho

`

)

.setTimestamp();







msg.edit({

embeds:[result]

});






},5000);



}



};
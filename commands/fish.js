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



const user =

getUser(
message.guild.id,
message.author.id
);





// ======================
// KIỂM TRA CẦN
// ======================


const rodID = user.can.dangDung;



if(!rodID){


return message.reply(
"❌ Bạn chưa có cần câu\nDùng: `!rod can_1`"
);


}




const rod = rods[rodID];



if(!rod){


return message.reply(
"❌ Cần câu không tồn tại"
);


}





if(
user.can.danhSach[rodID] <= 0
){


user.can.dangDung=null;

save();


return message.reply(
"❌ Cần câu đã hết lượt"
);


}







// ======================
// KIỂM TRA MỒI
// ======================


const baitID = args[0];



if(!baitID){


return message.reply(

`
❌ Chọn mồi

Ví dụ:

!fish moithuong

`

);


}




const bait = baits[baitID];



if(!bait){


return message.reply(
"❌ Mồi không tồn tại"
);


}





if(
(user.moi[baitID] || 0) <= 0
){


return message.reply(
"❌ Bạn hết loại mồi này"
);


}







// ======================
// TRỪ VẬT PHẨM
// ======================


user.can.danhSach[rodID]--;

user.moi[baitID]--;


save();







// ======================
// LOADING
// ======================


const loading = new EmbedBuilder()

.setColor("#0099ff")

.setTitle("🎣 ĐANG CÂU CÁ")

.setDescription(

`
${rod.emoji} **${rod.name}**

🪱 ${bait.emoji} **${bait.name}**

⏳ Đang chờ cá...

`

);






const msg = await message.reply({

embeds:[
loading
]

});









setTimeout(()=>{






// ======================
// CHỌN CÁ
// ======================


let chance =

Math.random()*100;



// tăng luck cần

chance -= rod.luck;



let total = 0;

let caught = null;





for(
const fish of fishList
){


total += fish.rate;



if(chance <= total){


caught = fish;

break;


}


}





if(!caught)

caught = fishList[0];









// ======================
// CÂN NẶNG
// ======================


const weight =

Number(

(

Math.random()

*

(
caught.max-caught.min
)

+

caught.min

).toFixed(2)

);









// ======================
// LƯU CÁ
// ======================


if(!user.fish)

user.fish={};




if(!user.fish[caught.name])

user.fish[caught.name]=[];




user.fish[caught.name].push(weight);









// ======================
// RƠI RƯƠNG
// ======================


let chestID = null;


const chestChance =

Math.random()*100;





if(chestChance <= 0.5){


chestID="chest_5";


}
else if(chestChance <= 2){


chestID="chest_4";


}
else if(chestChance <= 6){


chestID="chest_3";


}
else if(chestChance <= 15){


chestID="chest_2";


}
else if(chestChance <= 35){


chestID="chest_1";


}







if(chestID){



if(!user.chest)

user.chest={};





user.chest[chestID] =

(user.chest[chestID] || 0) + 1;



}







save();









// ======================
// HIỂN THỊ RƯƠNG
// ======================


let chestText = "";



if(chestID){



const chest = chests[chestID];



chestText =

`
🎁 Nhặt được:

${chest.emoji} **${chest.name}**
⭐ ${chest.star} sao

`;



}









// ======================
// KẾT QUẢ
// ======================


const result =

new EmbedBuilder()


.setColor("#00ff00")


.setTitle("🎣 CÂU ĐƯỢC CÁ")


.setDescription(

`
${caught.emoji} **${caught.name}**


⚖️ Cân nặng:

${weight} kg


🎣 Cần:

${rod.emoji} ${rod.name}


🪱 Mồi:

${bait.emoji} ${bait.name}



${chestText}


📦 Đã lưu vào kho

`

);



msg.edit({

embeds:[
result
]

});





},5000);





}


};
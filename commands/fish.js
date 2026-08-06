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
    fishList
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


const rodID =
user.can.dangDung;



if(!rodID){


return message.reply(
"❌ Bạn chưa có cần câu\nDùng: `!rod can_1`"
);


}



const rod =
rods[rodID];



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


const baitID =
args[0];



if(!baitID){


return message.reply(

`
❌ Chọn mồi

Ví dụ:

!fish moithuong

`

);


}




const bait =
baits[baitID];



if(!bait){


return message.reply(
"❌ Mồi không tồn tại"
);


}





if(
(user.moi[baitID]||0)<=0
){


return message.reply(
"❌ Bạn hết loại mồi này"
);


}







// TRỪ CẦN + MỒI

user.can.danhSach[rodID]--;

user.moi[baitID]--;


save();








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





const msg =
await message.reply({

embeds:[
loading
]

});








setTimeout(()=>{



// ======================
// TÍNH TỈ LỆ
// ======================


let chance =
Math.random()*100;



// cần xịn tăng may mắn

chance -= rod.luck;



let total=0;

let caught=null;



for(
const fish of fishList
){



total += fish.rate;



if(
chance <= total
){


caught=fish;

break;


}



}







if(!caught)

caught=fishList[0];







// cân nặng

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








// lưu cá

if(!user.fish)

user.fish={};



if(
!user.fish[caught.name]
)

user.fish[caught.name]=[];




user.fish[caught.name].push(weight);



save();







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
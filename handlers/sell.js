const {
    EmbedBuilder
} = require("discord.js");


const {
    getUser,
    save
} = require("../database");


const {
    fishList
} = require("../config");



module.exports = {


name:"sell",



async execute(message,args){



const user =
getUser(
message.guild.id,
message.author.id
);





const fishID =
args[0];



const amount =
Number(args[1]);





if(!fishID || !amount){


return message.reply(

`
❌ Cách dùng:

\`!sell <id cá> <số lượng>\`

Ví dụ:

\`!sell caro 5\`

`

);


}







if(
!Number.isInteger(amount)
||
amount<=0
){


return message.reply(
"❌ Số lượng không hợp lệ"
);


}







// tìm cá theo ID

const fishData =

fishList.find(

f =>

f.name
.toLowerCase()
.replaceAll(" ","")
.includes(
fishID.toLowerCase()
)

);






if(!fishData){


return message.reply(
"❌ Không tìm thấy loại cá này"
);


}







const fishName =
fishData.name;







if(
!user.fish[fishName]
){


return message.reply(
"❌ Bạn chưa có cá này"
);


}







const fish =

user.fish[fishName];






if(
fish.length < amount
){


return message.reply(

`
❌ Không đủ cá

Hiện có:
x${fish.length}

`

);


}







// bán cá nặng nhất trước

fish.sort(
(a,b)=>b-a
);






let totalWeight=0;



for(
let i=0;
i<amount;
i++
){


totalWeight += fish.shift();


}








// giá 100 xu / kg

const money =

Math.floor(
totalWeight * 100
);






user.money += money;







if(
fish.length===0
){

delete user.fish[fishName];

}







save();








const embed =

new EmbedBuilder()

.setColor("#ffd700")

.setTitle(
"💰 BÁN CÁ THÀNH CÔNG"
)

.setDescription(

`
${fishData.emoji} **${fishName}**


📦 Số lượng:

x${amount}


⚖️ Tổng cân:

${totalWeight.toFixed(2)} kg


💰 Nhận:

${money.toLocaleString()} xu


💵 Số dư:

${user.money.toLocaleString()} xu

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
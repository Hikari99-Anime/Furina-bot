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
    emoji
} = require("../config");



module.exports = {


name:"buy",


aliases:[
    "b"
],



async execute(message,args){



const user = getUser(
    message.guild.id,
    message.author.id
);




const id = args[0];


const amount = Math.max(
    1,
    Number(args[1]) || 1
);





if(!id){

return message.reply(
`
❌ Nhập vật phẩm

Ví dụ:

\`!buy can_1\`

\`!buy moithuong 5\`

`
);

}









// ======================
// MUA CẦN
// ======================


if(rods[id]){



const item = rods[id];


const price = item.price * amount;

const uses = item.uses * amount;





if(user.money < price){

return message.reply(
"❌ Không đủ tiền"
);

}






user.money -= price;





if(!user.can)

user.can={

dangDung:null,

danhSach:{}

};






if(!user.can.danhSach[id])

user.can.danhSach[id]=0;



user.can.danhSach[id]+=uses;






if(!user.can.dangDung)

user.can.dangDung=id;





save();






return message.reply({

embeds:[

new EmbedBuilder()

.setColor("Green")

.setTitle("🎣 MUA CẦN CÂU")

.setDescription(

`
${item.emoji} **${item.name}**

📦 Số lượng: x${amount}
🎟️ Lượt: +${uses}
⭐ Luck: ${item.luck}
${emoji.money} Giá: ${price.toLocaleString()} xu
💵 Còn lại: ${user.money.toLocaleString()} xu
`

)

.setTimestamp()

]

});


}









// ======================
// MUA MỒI
// ======================


if(baits[id]){



const item = baits[id];


const price = item.price * amount;



if(user.money < price){

return message.reply(
"❌ Không đủ tiền"
);

}







user.money -= price;





if(!user.moi)

user.moi={};






if(!user.moi[id])

user.moi[id]=0;






// mỗi lần mua +10 mồi

user.moi[id] += 10 * amount;






save();






return message.reply({

embeds:[


new EmbedBuilder()

.setColor("Green")

.setTitle("🪱 MUA MỒI")

.setDescription(

`
${item.emoji} **${item.name}**

📦 Số lượng: x${amount}

🪱 Nhận: +${10 * amount}
${emoji.money} Giá: ${price.toLocaleString()} xu
💵 Còn lại: ${user.money.toLocaleString()} xu

`

)

.setTimestamp()

]


});


}







return message.reply(
"❌ Không tìm thấy vật phẩm"
);



}



};
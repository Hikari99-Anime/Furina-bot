const {
    EmbedBuilder
} = require("discord.js");


const {
    getUser,
    save
} = require("../database");


const {
    rods,
    baits
} = require("../config");



module.exports = {


name:"buy",



async execute(message,args){



const user =
getUser(
message.guild.id,
message.author.id
);





const id =
args[0];





if(!id){


return message.reply(

`
❌ Nhập ID vật phẩm

Ví dụ:

\`!buy can_1\`

\`!buy moithuong\`

`

);


}






// ======================
// MUA CẦN
// ======================


if(
rods[id]
){



const item =
rods[id];





if(
user.money < item.price
){


return message.reply(
"❌ Không đủ tiền"
);


}







user.money -= item.price;





if(
!user.can
)

user.can={

dangDung:null,

danhSach:{}

};






if(
!user.can.danhSach[id]
)

user.can.danhSach[id]=0;






user.can.danhSach[id]
+= item.uses;





save();






return message.reply({

embeds:[


new EmbedBuilder()

.setColor("Green")

.setTitle("🎣 MUA CẦN CÂU")

.setDescription(

`
${item.emoji} **${item.name}**

🎣 Lượt:
+${item.uses}


💰 Giá:
${item.price.toLocaleString()} xu


💵 Còn lại:
${user.money.toLocaleString()} xu

`

)

]

});



}








// ======================
// MUA MỒI
// ======================


if(
baits[id]
){



const item =
baits[id];





if(
user.money < item.price
){


return message.reply(
"❌ Không đủ tiền"
);


}







user.money -= item.price;







if(
!user.moi
)

user.moi={};







if(
!user.moi[id]
)

user.moi[id]=0;







// mỗi lần mua +10 mồi

user.moi[id]+=10;






save();






return message.reply({

embeds:[


new EmbedBuilder()

.setColor("Green")

.setTitle("🪱 MUA MỒI")

.setDescription(

`
${item.emoji} **${item.name}**

🪱 Nhận:
x10


💰 Giá:
${item.price.toLocaleString()} xu


💵 Còn lại:
${user.money.toLocaleString()} xu

`

)

]

});



}








return message.reply(
"❌ Không tìm thấy vật phẩm này"
);



}


};
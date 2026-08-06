const {
    EmbedBuilder
}=require("discord.js");


const {
    shop
}=require("../config");


const {
    getUser,
    save
}=require("../database");





module.exports={


name:"buy",





async execute(message,args){



const id =
args[0];



const amount =
Number(args[1]) || 1;





if(!id || !shop[id]){


return message.reply({

content:
"❌ Không tìm thấy vật phẩm!"

});


}






if(
amount<=0 ||
!Number.isInteger(amount)
){


return message.reply({

content:
"❌ Số lượng không hợp lệ!"

});


}






const user =
getUser(
message.guild.id,
message.author.id
);





const item =
shop[id];





const total =
item.price * amount;






if(
user.money < total
){


return message.reply({

embeds:[

new EmbedBuilder()

.setColor("Red")

.setTitle(
"❌ KHÔNG ĐỦ TIỀN"
)

.setDescription(
`
💰 Cần:

${total} xu


💵 Bạn có:

${user.money} xu
`
)

]

});


}






// trừ tiền

user.money -= total;






// =======================
// MUA CẦN
// =======================


if(item.uses){



if(!user.can)
user.can={};



if(!user.can.danhSach)
user.can.danhSach={};




if(!user.can.danhSach[id])
user.can.danhSach[id]=0;




user.can.danhSach[id] +=

item.uses * amount;



}







// =======================
// MUA MỒI
// =======================


if(item.amount){



if(!user.moi)
user.moi={};



if(!user.moi[id])
user.moi[id]=0;



user.moi[id] +=

item.amount * amount;



}





save();







const embed =

new EmbedBuilder()

.setColor("Green")

.setTitle(
"🛒 MUA THÀNH CÔNG"
)

.setDescription(
`
👤 ${message.author}


📦 Vật phẩm:

${item.name}


🔢 Số lượng:

x${amount}


💰 Đã trả:

${total} xu


💵 Còn lại:

${user.money} xu
`
)

.setTimestamp();






message.channel.send({

embeds:[
embed
]

});




}


};
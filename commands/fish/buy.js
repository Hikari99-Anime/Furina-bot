const {EmbedBuilder}=require("discord.js");

const {
getUser,
save
}=require("../../database");


const {
rods,
baits,
keys,
formatMoney
}=require("../../config");



module.exports={


name:"buy",
aliases:["b"],



async execute(message,args){


const user=getUser(
message.guild.id,
message.author.id
);



const id=args[0];


const amount=
Math.max(
1,
Number(args[1])||1
);



if(!id)

return message.reply(
"❌ Ví dụ:\n`!buy can_1 1`"
);



let item;
let type;



if(rods[id]){

item=rods[id];
type="rod";

}


else if(baits[id]){

item=baits[id];
type="bait";

}


else if(keys[id]){

item=keys[id];
type="key";

}



if(!item)

return message.reply(
"❌ Không tìm thấy vật phẩm"
);



const price=
item.price*amount;



if(user.money<price)

return message.reply(
"❌ Không đủ tiền"
);



user.money-=price;



// CẦN

if(type==="rod"){


if(!user.can.danhSach[id])

user.can.danhSach[id]=0;


user.can.danhSach[id]+=
item.uses*amount;



}



// MỒI

if(type==="bait"){


if(!user.moi[id])

user.moi[id]=0;


user.moi[id]+=amount;



}



// KEY

if(type==="key"){


if(!user.keys[id])

user.keys[id]=0;


user.keys[id]+=amount;


}



save();



let icon=
item.emoji;



const embed=new EmbedBuilder()

.setColor("#00ff99")

.setTitle("🛒 MUA THÀNH CÔNG")

.setDescription(

`
${icon} **${item.name}**

📦 Số lượng:
x${amount}


💰 Giá:
${formatMoney(price)} xu


💵 Còn lại:
${formatMoney(user.money)} xu

`

);



message.reply({
embeds:[embed]
});



}

};
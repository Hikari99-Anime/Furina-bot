const {
EmbedBuilder
}=require("discord.js");


const {
rods,
baits,
keys,
emoji,
formatMoney
}=require("../../config");


const {
getUser,
save
}=require("../../data");



module.exports={


name:"buy",

aliases:["b"],



async execute(message,args){



const user=
getUser(
message.guild.id,
message.author.id
);



const id=args[0];


const amount=
Number(args[1] || 1);



if(!id)

return message.reply({

content:
"╰・❌ Dùng: !buy <id> <số lượng>"

});



if(amount<=0)

return message.reply(
"╰・❌ Số lượng không hợp lệ"
);



let item;

let type;



// tìm vật phẩm

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


else{


return message.reply(
"╰・❌ Không tìm thấy vật phẩm"
);


}




const price=
item.price * amount;



if(user.money < price){


return message.reply({

embeds:[

new EmbedBuilder()

.setColor("#ff8b8b")

.setTitle(
"╭・💰 Không đủ xu"
)

.setDescription(
`
Bạn cần:

${formatMoney(price)} ${emoji.money}


╰・Hãy kiếm thêm xu nhé
`
)

]

});


}



// trừ tiền

user.money-=price;




// =================
// 🎣 CẦN CÂU
// =================


if(type==="rod"){



if(!user.can)

user.can={

dangDung:null,

danhSach:{}

};



if(!user.rodData)

user.rodData={};




user.can.danhSach[id]=1;




// tạo dữ liệu cần

if(!user.rodData[id]){


user.rodData[id]={


level:0,


luck:item.luck,


uses:item.uses,


maxUses:item.uses,


destroyed:false



};


}




// tự trang bị nếu chưa có

if(!user.can.dangDung)

user.can.dangDung=id;



}




// =================
// 🪱 MỒI
// =================


if(type==="bait"){



if(!user.moi)

user.moi={};



user.moi[id]=

(user.moi[id] || 0)

+

amount;


}





// =================
// 🗝️ CHÌA KHÓA
// =================


if(type==="key"){



if(!user.keys)

user.keys={};



user.keys[id]=

(user.keys[id] || 0)

+

amount;


}





save();





const embed=

new EmbedBuilder()

.setColor("#9affb0")

.setTitle(
"╭・🛒 Mua thành công"
)

.setDescription(
`
${item.emoji} ${item.name}


╭・📦 Số lượng

x${amount}


╭・💸 Đã trả

${formatMoney(price)} ${emoji.money}


╰・💰 Số dư

${formatMoney(user.money)} ${emoji.money}
`
)

.setFooter({

text:"✦ Fishing Adventure"

});




message.reply({

embeds:[embed]

});



}

};
const {
EmbedBuilder
}=require("discord.js");


const {
rods,
emoji,
formatMoney
}=require("../../config");


const {
getUser,
save
}=require("../../data");



module.exports={


name:"repair",

aliases:[

"fix",
"sua"

],



async execute(message){



const user=
getUser(
message.guild.id,
message.author.id
);





const id=
user.can.dangDung;



if(!id)

return message.reply({

content:
"╰・❌ Bạn chưa trang bị cần"

});





const base=
rods[id];


const rod=
user.rodData[id];





if(!rod)

return message.reply(
"╰・❌ Không tìm thấy dữ liệu cần"
);





if(
rod.uses===rod.maxUses &&
!rod.destroyed
)

return message.reply({

embeds:[

new EmbedBuilder()

.setColor("#8affb2")

.setTitle(
"╭・✨ Cần vẫn tốt"
)

.setDescription(
`${base.emoji} ${base.name}

🎯 Độ bền: ${rod.uses}/${rod.maxUses}

╰・Chưa cần sửa chữa`
)

]

});







// giá sửa
// độ bền càng ít (hao càng nhiều) thì sửa càng đắt,
// nhưng gãy hẳn vẫn phải RẺ HƠN mua cần mới
// (nếu không thà mua mới còn hơn)

const DESTROYED_RATIO=0.7;


const destroyedPrice=
Math.floor(
base.price * DESTROYED_RATIO
);


let price;



if(rod.destroyed){


price=
destroyedPrice;


}

else{


const lost=
rod.maxUses-rod.uses;


const ratio=
lost/rod.maxUses;


price=
Math.floor(
destroyedPrice * ratio * ratio
);


}






if(price<1000)

price=1000;







if(user.money<price)

return message.reply({

content:

`╰・❌ Cần ${formatMoney(price)} ${emoji.money} để sửa`

});







user.money-=price;



rod.uses=
rod.maxUses;



rod.destroyed=false;



save();







message.reply({

embeds:[

new EmbedBuilder()

.setColor("#8affb2")

.setTitle(
"╭・🔧 Sửa cần thành công"
)

.setDescription(
`${base.emoji} ${base.name}

🎯 Độ bền: ${rod.uses}/${rod.maxUses}
💸 Chi phí: ${formatMoney(price)} ${emoji.money}
💰 Số dư: ${formatMoney(user.money)} ${emoji.money}

╰・🎣 Cần đã sẵn sàng`
)

.setFooter({

text:
"✦ Fishing Adventure"

})

]

});



}

};
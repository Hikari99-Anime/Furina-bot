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

let price;



if(rod.destroyed){


price=
base.price*2;


}

else{


const lost=

rod.maxUses-rod.uses;


price=
Math.floor(
lost*base.price/base.uses
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
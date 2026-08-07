const {
EmbedBuilder
}=require("discord.js");


const {
fishList,
emoji,
formatMoney,
prefix
}=require("../../config");


const {
getUser,
save
}=require("../../data");



module.exports={


name:"sell",

aliases:[

"ban",
"sellfish"

],



async execute(message,args){



const user=
getUser(
message.author.id
);





let total=0;

let soldText="";





// ======================
// BÁN TẤT CẢ
// !sell all
// ======================


if(
args[0]==="all"
||
args[0]==="allfish"
){


for(const id in user.fish){



const fish=
fishList.find(
x=>x.id===id
);



if(!fish)

continue;



let weight=0;



for(const w of user.fish[id])

weight+=w;



if(weight<=0)

continue;



const money=
Math.floor(
weight*fish.sell
);



total+=money;



soldText+=
`${fish.emoji} ${fish.name} · ⚖️ ${weight.toFixed(2)} KG · 💰 ${formatMoney(money)} ${emoji.money}
`;



user.fish[id]=[];



}


}




// ======================
// BÁN 1 LOẠI CÁ
// !sell caro
// ======================


else if(args[0]){



const id=args[0].toLowerCase();



const fish=
fishList.find(
x=>x.id===id
);



if(!fish)

return message.reply(
"╰・❌ Không tìm thấy cá"
);



if(
!user.fish[id] ||
user.fish[id].length===0
)

return message.reply(
"╰・❌ Bạn không có cá này"
);



let weight=0;



for(const w of user.fish[id])

weight+=w;



total=
Math.floor(
weight*fish.sell
);



user.fish[id]=[];




soldText=
`${fish.emoji} ${fish.name} · ⚖️ ${weight.toFixed(2)} KG · 💰 ${formatMoney(total)} ${emoji.money}`;



}


else{


return message.reply({

content:

`╰・❌ Cách dùng: \`${prefix}sell <tên cá>\` hoặc \`${prefix}sell all\``

});



}





if(total<=0)

return message.reply(
"╰・❌ Không có cá để bán"
);





user.money+=total;


save();





message.reply({

embeds:[

new EmbedBuilder()

.setColor("#8affb2")

.setTitle(
"╭・💰 Bán cá thành công"
)

.setDescription(
`${soldText}
╭・💵 Nhận được: ${formatMoney(total)} ${emoji.money}
╭・💰 Số dư mới: ${formatMoney(user.money)} ${emoji.money}

╰・🌊 Chúc bạn câu được nhiều cá hơn`
)

.setFooter({

text:
"✦ Fishing Adventure"

})

]

});



}

};

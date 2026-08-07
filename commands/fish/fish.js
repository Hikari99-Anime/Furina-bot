const {
EmbedBuilder
}=require("discord.js");


const {
fishList,
rods,
baits,
emoji
}=require("../../config");


const {
getUser,
save
}=require("../../data");



module.exports={


name:"fish",

aliases:[

"f",
"cau"

],



async execute(message,args){



const user=
getUser(
message.guild.id,
message.author.id
);




// ======================
// SỐ LẦN CÂU
// ======================


const MAX_AMOUNT=50;


let amount=1;


if(args && args[0] !== undefined){


amount=Number(args[0]);


if(
!Number.isInteger(amount) ||
amount<=0
)

return message.reply(
"╰・❌ Số lần câu không hợp lệ. Ví dụ: `!fish 10`"
);


if(amount>MAX_AMOUNT)

return message.reply(
`╰・❌ Tối đa ${MAX_AMOUNT} lần/lượt`
);


}




// ======================
// KIỂM TRA CẦN
// ======================


const rodID=
user.can.dangDung;



if(!rodID)

return message.reply({

content:
"╰・❌ Bạn chưa trang bị cần câu"

});



const baseRod=
rods[rodID];


const rod=
user.rodData[rodID];



if(!rod)

return message.reply(
"╰・❌ Dữ liệu cần bị lỗi"
);



if(rod.destroyed)

return message.reply({

embeds:[

new EmbedBuilder()

.setColor("#ff5555")

.setTitle(
"╭・💥 Cần đã phá hủy"
)

.setDescription(
`${baseRod.emoji} ${baseRod.name}

☠️ Không thể câu cá

╰・Hãy sửa hoặc mua cần mới`
)

]

});




if(rod.uses<amount)

return message.reply({

embeds:[

new EmbedBuilder()

.setColor("#ffcc66")

.setTitle(
"╭・🎣 Không đủ độ bền"
)

.setDescription(
`${baseRod.emoji} ${baseRod.name}

🎯 Còn ${rod.uses}/${rod.maxUses}, cần ${amount}

╰・Hãy sửa chữa cần hoặc câu ít lại`
)

]

});




// ======================
// KIỂM TRA MỒI
// ======================


const totalBait=

(user.moi.moithuong||0)+
(user.moi.moibac||0)+
(user.moi.moivang||0);



if(totalBait<amount)

return message.reply(

`╰・❌ Không đủ mồi (còn ${totalBait}, cần ${amount})`

);




// ======================
// THỜI GIAN CÂU
// càng nhiều lần càng lâu, cần càng vip càng nhanh
// ======================


const perCatchMs=

Math.max(
200,
1200 - baseRod.star*150
);


const totalMs=

Math.min(
amount*perCatchMs,
30000
);



const etaSec=
(totalMs/1000).toFixed(1);




// ======================
// ANIMATION
// ======================


const msg=
await message.reply({

embeds:[

new EmbedBuilder()

.setColor("#7ddcff")

.setTitle(
"╭・🌊 Đang câu cá..."
)

.setDescription(
`🎣 Đang thả câu ${amount} lần với ${baseRod.name}

⏳ Khoảng ${etaSec} giây

╰・Chờ cá cắn câu...`
)

]

});



await new Promise(

r=>setTimeout(r,totalMs)

);




// ======================
// CÂU NHIỀU LẦN
// ======================


const luckBonus=
rod.level * 0.5;


const caughtSummary={};

const baitUsed={
moithuong:0,
moibac:0,
moivang:0
};



for(let i=0;i<amount;i++){


let baitID="moithuong";


if(user.moi.moivang>0)

baitID="moivang";

else if(user.moi.moibac>0)

baitID="moibac";



user.moi[baitID]--;

baitUsed[baitID]++;


rod.uses--;




let total=0;


for(const fish of fishList)

total+=fish.rate+luckBonus;



let random=
Math.random()*total;


let catchFish;


for(const fish of fishList){

random-=fish.rate+luckBonus;

if(random<=0){

catchFish=fish;

break;

}

}


if(!catchFish)

catchFish=fishList[0];




const weight=

Number(

(
Math.random()*
(catchFish.max-catchFish.min)
+
catchFish.min
)
.toFixed(2)

);




if(!user.fish[catchFish.id])

user.fish[catchFish.id]=[];


user.fish[catchFish.id].push(weight);




if(!caughtSummary[catchFish.id])

caughtSummary[catchFish.id]={

fish:catchFish,

count:0,

weight:0

};


caughtSummary[catchFish.id].count++;

caughtSummary[catchFish.id].weight+=weight;


}



save();




// ======================
// KẾT QUẢ
// ======================


const summaryList=
Object.values(caughtSummary)

.sort((a,b)=>b.count-a.count);



const catchText=
summaryList

.map(s=>

`${s.fish.emoji} ${s.fish.name} x${s.count} · ⚖️ ${s.weight.toFixed(2)} KG`

)

.join("\n") || "Không câu được gì";



const totalWeight=

summaryList.reduce(

(sum,s)=>sum+s.weight,

0

);



const baitText=

Object.keys(baitUsed)

.filter(id=>baitUsed[id]>0)

.map(id=>`${baits[id].emoji} x${baitUsed[id]}`)

.join(" · ") || "-";



msg.edit({

embeds:[

new EmbedBuilder()

.setColor("#8affb2")

.setTitle(
"╭・🎣 Câu cá thành công"
)

.setDescription(
`${catchText}

╭・⚖️ Tổng cân nặng: ${totalWeight.toFixed(2)} KG
╭・🎣 Cần sử dụng: ${baseRod.name} · ⭐+${rod.level} · 🍀 Luck ${rod.luck}
╭・🪱 Mồi đã dùng: ${baitText}
╭・🎯 Độ bền: ${rod.uses}/${rod.maxUses}

╰・🌊 Chúc bạn may mắn`
)

.setFooter({

text:"✦ Fishing Adventure"

})

]

});



}

};

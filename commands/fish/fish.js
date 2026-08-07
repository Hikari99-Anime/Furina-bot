const {
EmbedBuilder
}=require("discord.js");

const {
fishList,
rods,
baits,
fishingZones
}=require("../../config");

const {
getUser,
save
}=require("../../data");


// ======================
// LẤY VÙNG HIỆN TẠI
// ======================

function getCurrentZone(){

const now = new Date();

if(now.getDay() === 0){

return fishingZones.volcano;

}

const zones = [

fishingZones.tropical,
fishingZones.cold,
fishingZones.swamp,
fishingZones.deep

];

const index =
Math.floor(now.getHours()/6);

return zones[index % zones.length];

}



module.exports={

name:"fish",

aliases:[

"f",
"cau"

],



async execute(message,args){



const user =
getUser(
message.guild.id,
message.author.id
);



// ======================
// SỐ LẦN CÂU
// ======================

const MAX_AMOUNT = 50;

let amount = 1;



if(args && args[0] !== undefined){

amount = Number(args[0]);



if(
!Number.isInteger(amount)
||
amount <= 0
)

return message.reply(
"╰・❌ Số lần câu không hợp lệ. Ví dụ: `!fish 10`"
);



if(amount > MAX_AMOUNT)

return message.reply(
`╰・❌ Tối đa ${MAX_AMOUNT} lần/lượt`
);

}



// ======================
// LẤY VÙNG
// ======================

const zone =
getCurrentZone();



// ======================
// KIỂM TRA CẦN
// ======================

const rodID =
user.can.dangDung;



if(!rodID)

return message.reply(
"╰・❌ Bạn chưa trang bị cần câu"
);



const baseRod =
rods[rodID];

const rod =
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

╰・Hãy mua cần mới`

)

]

});



if(rod.uses < amount)

return message.reply({

embeds:[

new EmbedBuilder()

.setColor("#ffcc66")

.setTitle(
"╭・🎣 Không đủ độ bền"
)

.setDescription(

`${baseRod.emoji} ${baseRod.name}

🎯 Còn ${rod.uses}/${rod.maxUses}

╰・Cần ${amount} độ bền`

)

]

});



// ======================
// KIỂM TRA MỒI
// ======================

const totalBait =

(user.moi.moithuong || 0)

-
(user.moi.moibac || 0)

-
(user.moi.moivang || 0);



if(totalBait < amount)

return message.reply(

`╰・❌ Không đủ mồi (còn ${totalBait})`

);



// ======================
// THỜI GIAN
// ======================

const perCatchMs =

Math.max(

200,

1200 - baseRod.star * 150

);



const totalMs =

Math.min(

amount * perCatchMs,

30000

);



const etaSec =

(totalMs/1000)
.toFixed(1);



// ======================
// EMBED ĐANG CÂU (GỘP ẢNH)
// ======================

const msg =

await message.reply({

embeds:[

new EmbedBuilder()

.setColor("#7ddcff")

.setImage(zone.image)

.setDescription(

`｡･:*˚:✧* ***Fishing Adventure*** *✧:˚*:･｡


🌍 Khu vực: ${zone.name}

📖 ${zone.description}


🎣 **Đang thả câu...**

₊ Cần sử dụng: ${baseRod.emoji} ${baseRod.name}

⋆ Số lần câu: ${amount} lần

⋆ Thời gian: ${etaSec} giây ⏳

⋆｡° Chờ cá cắn câu... ✨`

)

]

});



await new Promise(

r=>setTimeout(r,totalMs)

);



// ======================
// CÂU NHIỀU LẦN
// ======================

const luckBonus =
(rod.level || 0) * 0.5;



const caughtSummary = {};



const baitUsed = {

moithuong:0,

moibac:0,

moivang:0

};



for(let i = 0; i < amount; i++){



let baitID = "moithuong";



if(user.moi.moivang > 0)

baitID = "moivang";

else if(user.moi.moibac > 0)

baitID = "moibac";



user.moi[baitID]--;

baitUsed[baitID]++;

rod.uses--;



const zoneFish =

fishList.filter(f =>

zone.fish.includes(f.id)

);



if(zoneFish.length === 0){

continue;

}



let totalRate = 0;



for(const fish of zoneFish){

totalRate += fish.rate + luckBonus;

}



let random =

Math.random() * totalRate;



let catchFish;



for(const fish of zoneFish){

random -= fish.rate + luckBonus;


if(random <= 0){

catchFish = fish;

break;

}

}



if(!catchFish)

catchFish = zoneFish[0];



// ======================
// CÂN NẶNG
// ======================

const weight =

Number(

(

Math.random()

*

(catchFish.max - catchFish.min)

+

catchFish.min

)

.toFixed(2)

);



if(!user.fish[catchFish.id])

user.fish[catchFish.id] = [];



user.fish[catchFish.id].push(weight);



if(!caughtSummary[catchFish.id])

caughtSummary[catchFish.id]={

fish:catchFish,

count:0,

weight:0

};



caughtSummary[catchFish.id].count++;

caughtSummary[catchFish.id].weight += weight;


}
 
// ======================
// HẾT ĐỘ BỀN
// ======================

if(rod.uses <= 0)

rod.destroyed = true;



save();



// ======================
// HIỂN THỊ KẾT QUẢ
// ======================

const summaryList =

Object.values(caughtSummary)

.sort((a,b)=>

b.count - a.count

);



const catchText =

summaryList

.map(s =>

`${s.fish.emoji} **${s.fish.name}** x${s.count} · ⚖️ ${s.weight.toFixed(2)} KG`

)

.join("\n")

||

"Không câu được gì";



const totalWeight =

summaryList.reduce(

(sum,s)=>

sum + s.weight,

0

);



const baitText =

Object.keys(baitUsed)

.filter(id => baitUsed[id] > 0)

.map(id =>

`${baits[id].emoji} x${baitUsed[id]}`

)

.join(" · ")

||

"-";



// ======================
// EDIT KẾT QUẢ (GỘP ẢNH)
// ======================

msg.edit({

embeds:[

new EmbedBuilder()

.setColor("#A0E7E5")

.setImage(zone.image)

.setTitle(

"✧₊˚ 🎣 Câu Cá Thành Công ˚₊✧"

)

.setDescription(

`｡･:*˚:✧* ***Fishing Adventure*** *✧:˚*:･｡


🌍 Khu vực: ${zone.name}


🐚 Chiến lợi phẩm:

${catchText}


⋆｡˚⚖️ Tổng cân nặng:

${totalWeight.toFixed(2)} KG


🎣 Cần sử dụng:

${baseRod.emoji} ${baseRod.name}

⭐ Cấp: ${rod.level || 0}

🍀 May mắn: ${rod.luck || 0}


🪱 Mồi đã dùng:

${baitText}


🛠️ Độ bền:

${rod.uses}/${rod.maxUses}



⋆｡˚ ✨ *Chúc bạn câu được cá hiếm* ✨ ˚｡⋆`

)

.setFooter({

text:

"୨୧ ✦ Fishing Adventure • Ocean Diary ✦ ୨୧"

})

.setTimestamp()

]

});



}

};
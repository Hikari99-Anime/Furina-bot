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



async execute(message){



const user=
getUser(
message.guild.id,
message.author.id
);




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
`
${baseRod.emoji} ${baseRod.name}


☠️ Không thể câu cá


╰・Hãy sửa hoặc mua cần mới
`
)

]

});




if(rod.uses<=0)

return message.reply({

embeds:[

new EmbedBuilder()

.setColor("#ffcc66")

.setTitle(
"╭・🎣 Hết độ bền"
)

.setDescription(
`
${baseRod.emoji} ${baseRod.name}


🎯 0/${rod.maxUses}


╰・Hãy sửa chữa cần
`
)

]

});





// ======================
// KIỂM TRA MỒI
// ======================



let baitID="moithuong";


if(
user.moi.moivang>0
)

baitID="moivang";


else if(
user.moi.moibac>0
)

baitID="moibac";



if(
!user.moi[baitID] ||
user.moi[baitID]<=0
)

return message.reply(
"╰・❌ Bạn hết mồi"
);





const bait=
baits[baitID];




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
`
🎣 Đang thả câu


${bait.emoji} ${bait.name}


╰・Chờ cá cắn câu...
`
)

]

});



await new Promise(

r=>setTimeout(r,3000)

);




// ======================
// TRỪ TÀI NGUYÊN
// ======================


user.moi[baitID]--;

rod.uses--;





// ======================
// RANDOM CÁ
// ======================


let luckBonus=
rod.level * 0.5;



let total=0;


for(const fish of fishList){

total+=
fish.rate + luckBonus;

}



let random=
Math.random()*total;


let catchFish;



for(const fish of fishList){


random-=

fish.rate + luckBonus;



if(random<=0){

catchFish=fish;

break;

}


}



if(!catchFish)

catchFish=fishList[0];





// ======================
// CÂN NẶNG
// ======================


const weight=

Number(

(

Math.random()

*

(catchFish.max-catchFish.min)

+

catchFish.min

)

.toFixed(2)

);





// ======================
// LƯU CÁ
// ======================


if(!user.fish[catchFish.id])

user.fish[catchFish.id]=[];



user.fish[catchFish.id].push(weight);



save();





// ======================
// KẾT QUẢ
// ======================


msg.edit({

embeds:[

new EmbedBuilder()

.setColor("#8affb2")

.setTitle(
"╭・🎣 Câu cá thành công"
)

.setDescription(
`
${catchFish.emoji} ${catchFish.name}


╭・⚖️ Cân nặng

${weight} KG


╭・🎣 Cần sử dụng

${baseRod.name}

⭐ +${rod.level}

🍀 Luck ${rod.luck}


╭・🪱 Mồi

${bait.name}


╭・🎯 Độ bền

${rod.uses}/${rod.maxUses}


╰・🌊 Chúc bạn may mắn
`
)

.setFooter({

text:"✦ Fishing Adventure"

})

]

});



}

};
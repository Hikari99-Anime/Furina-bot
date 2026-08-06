const {EmbedBuilder}=require("discord.js");

const {
getUser,
save
}=require("../../database");


const {
chests,
keys,
fishList,
baits,
rods,
formatMoney
}=require("../../config");



function random(min,max){

return Math.floor(
Math.random()*(max-min+1)+min
);

}



module.exports={


name:"open",
aliases:["op"],



async execute(message,args){



const user=getUser(
message.guild.id,
message.author.id
);



let id=args[0];



if(!id)
return message.reply(
"❌ Ví dụ: `!open chest_1`"
);



let chestID=id.toLowerCase();



const chest=chests[chestID];



if(!chest){

return message.reply(
"❌ Không có rương này"
);

}



if(
!user.chest[chestID] ||
user.chest[chestID]<=0
)

return message.reply(
"❌ Bạn không có rương"
);



const keyID=chest.key;



if(
!user.keys[keyID] ||
user.keys[keyID]<=0
)

return message.reply(
`❌ Cần ${keys[keyID].name}`
);



user.chest[chestID]--;

user.keys[keyID]--;



let reward;



const roll=Math.random()*100;



// 70% tiền

if(roll<=70){


reward={
type:"money",
amount:
random(
chest.drop[0].min,
chest.drop[0].max
)
};


user.money+=reward.amount;


}



// 20% mồi

else if(roll<=90){


const bait=
Object.keys(baits)
[
random(
0,
Object.keys(baits).length-1
)
];


const amount=random(5,20);


if(!user.moi[bait])
user.moi[bait]=0;


user.moi[bait]+=amount;


reward={
type:"bait",
name:baits[bait].name,
emoji:baits[bait].emoji,
amount
};



}



// 9% cá

else if(roll<=99){


const fish=
fishList[
random(
0,
fishList.length-1
)
];


const kg=
Number(
(
Math.random()
*
(fish.max-fish.min)
+
fish.min
)
.toFixed(2)
);



if(!user.fish[fish.name])
user.fish[fish.name]=[];


user.fish[fish.name].push(kg);



reward={
type:"fish",
name:fish.name,
emoji:fish.emoji,
kg,
rarity:fish.rarity
};



}



// 1% cần

else{


const rod=
Object.keys(rods)
[
random(
0,
Object.keys(rods).length-1
)
];



if(!user.can.danhSach[rod])
user.can.danhSach[rod]=0;



user.can.danhSach[rod]+=rods[rod].uses;



reward={
type:"rod",
name:rods[rod].name,
emoji:rods[rod].emoji
};


}



save();



let text="";



if(reward.type==="money")

text=
`💰 Nhận:
${formatMoney(reward.amount)} xu`;



if(reward.type==="bait")

text=
`${reward.emoji} ${reward.name}
x${reward.amount}`;



if(reward.type==="fish")

text=
`${reward.emoji} ${reward.name}

⭐ ${reward.rarity}

⚖️ ${reward.kg}kg`;



if(reward.type==="rod")

text=
`${reward.emoji} ${reward.name}`;




const embed=new EmbedBuilder()

.setColor("#ffcc00")

.setTitle(
`🎁 MỞ ${chest.emoji} ${chest.name}`
)

.setDescription(

`
🔑 Đã dùng:
${keys[keyID].emoji} ${keys[keyID].name}


✨ KẾT QUẢ GACHA

${text}

`

)

.setTimestamp();



message.reply({
embeds:[embed]
});



}

};
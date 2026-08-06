const {EmbedBuilder}=require("discord.js");
const {getUser,save}=require("../../database");
const {
rods,
baits,
fishList,
chests
}=require("../../config");


module.exports={

name:"fish",
aliases:["f"],


async execute(message,args){

const user=getUser(
message.guild.id,
message.author.id
);


const amount=Math.min(
Number(args[0])||1,
50
);


if(!user.can.dangDung)
return message.reply(
"❌ Chưa trang bị cần\n`!rod can_1`"
);



const rod=rods[user.can.dangDung];

const rodID=user.can.dangDung;


if(user.can.danhSach[rodID]<amount)
return message.reply(
`❌ Cần không đủ lượt (${user.can.danhSach[rodID]})`
);



const baitID="moithuong";


if(
!user.moi[baitID] ||
user.moi[baitID]<amount
)
return message.reply(
"❌ Không đủ mồi thường"
);



user.can.danhSach[rodID]-=amount;
user.moi[baitID]-=amount;



let result={};

let chestGet={};



for(let i=0;i<amount;i++){


let luck=Math.random()*100;

luck-=rod.luck;


let total=0;
let catchFish;



for(const fish of fishList){

total+=fish.rate;


if(luck<=total){

catchFish=fish;
break;

}

}


if(!catchFish)
catchFish=fishList[0];



let kg=
Number(
(
Math.random()*
(catchFish.max-catchFish.min)
+
catchFish.min
).toFixed(2)
);



if(!user.fish[catchFish.name])
user.fish[catchFish.name]=[];


user.fish[catchFish.name].push(kg);



if(!result[catchFish.name])
result[catchFish.name]={
count:0,
kg:0,
emoji:catchFish.emoji
};


result[catchFish.name].count++;
result[catchFish.name].kg+=kg;



// rơi rương

const chance=Math.random()*100;


let chest=null;


if(chance<=0.2)
chest="chest_5";

else if(chance<=1)
chest="chest_4";

else if(chance<=3)
chest="chest_3";

else if(chance<=10)
chest="chest_2";

else if(chance<=25)
chest="chest_1";



if(chest){

user.chest[chest]=
(user.chest[chest]||0)+1;


chestGet[chest]=
(chestGet[chest]||0)+1;

}


}



// quest

if(user.quest){

let q=user.quest.list.find(
x=>x.type==="fish"
);


if(q&&!q.done){

q.now+=amount;

if(q.now>=q.need)
q.done=true;

}

}



save();



let fishText="";


for(const name in result){

const x=result[name];


fishText+=
`${x.emoji} ${name} x${x.count} (${x.kg.toFixed(1)}kg)\n`;

}



let chestText="";


for(const id in chestGet){

chestText+=
`${chests[id].emoji} ${chests[id].name} x${chestGet[id]}\n`;

}



const embed=new EmbedBuilder()

.setColor("#00aaff")

.setTitle("🎣 KẾT QUẢ CÂU CÁ")

.setDescription(

`
🎣 Cần:
${rod.emoji} ${rod.name}


🐟 Cá bắt được:

${fishText}


${chestText?
"🎁 Rơi rương:\n"+chestText:
""}


⚡ Còn:
${user.can.danhSach[rodID]} lượt

`

)

.setTimestamp();



message.reply({
embeds:[embed]
});


}

};
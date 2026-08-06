const {

EmbedBuilder,

ActionRowBuilder,

ButtonBuilder,

ButtonStyle

}=require("discord.js");


const {

getUser,

save

}=require("../database");




function taoBoBai(){


const ranks=[
"2","3","4","5","6","7","8","9","10","J","Q","K","A"
];


const suits=["♠","♥","♦","♣"];


const deck=[];


for(const suit of suits){

for(const rank of ranks){

deck.push({rank,suit});

}

}


for(let i=deck.length-1;i>0;i--){

const j=Math.floor(Math.random()*(i+1));

[deck[i],deck[j]]=[deck[j],deck[i]];

}


return deck;


}




function giaTri(rank){


if(rank==="A")
return 1;


if(rank==="J"||rank==="Q"||rank==="K")
return 10;


return Number(rank);


}




function tongDiem(hand){


return hand.reduce(
(sum,c)=>sum+giaTri(c.rank),
0
);


}




function hienThi(hand){


return hand.map(
c=>`${c.rank}${c.suit}`
).join(" ");


}




function laXiDach(hand){


if(hand.length!==2)
return false;


const ranks=hand.map(c=>c.rank);


return (
ranks.includes("A")
&&
ranks.some(r=>giaTri(r)===10)
);


}




module.exports = {


name:"xidach",


aliases:[
    "xd"
],



async execute(message,args){


const bet=Number(args[0]);


if(
!Number.isInteger(bet)
||
bet<=0
){

return message.reply(
"❌ Ví dụ: `!xidach 1000`"
);

}



const user=getUser(
message.guild.id,
message.author.id
);



if(user.money<bet){

return message.reply(
"❌ Không đủ tiền"
);

}



const deck=taoBoBai();


const playerHand=[
deck.pop(),
deck.pop()
];


const dealerHand=[
deck.pop(),
deck.pop()
];



function ketThuc(msg,ketQua,heSo){


let text="";


if(ketQua==="win"){

user.money+=bet*heSo;

text=`✅ Bạn thắng +${(bet*heSo).toLocaleString()} xu`;

}else if(ketQua==="lose"){

user.money-=bet;

text=`❌ Bạn thua -${bet.toLocaleString()} xu`;

}else{

text="🤝 Hoà, hoàn tiền cược";

}


save();


msg.edit({

embeds:[

new EmbedBuilder()

.setColor(
ketQua==="win"?"Green":
ketQua==="lose"?"Red":"Grey"
)

.setTitle("🃏 KẾT QUẢ XÌ DÁCH")

.setDescription(

`
👤 Bài của bạn:
${hienThi(playerHand)} (${tongDiem(playerHand)} điểm)


🤖 Bài nhà cái:
${hienThi(dealerHand)} (${tongDiem(dealerHand)} điểm)


${text}


💰 Số dư: ${user.money.toLocaleString()} xu
`

)

],

components:[]

});


}



function nhaCaiChoi(msg){


while(
tongDiem(dealerHand)<17
&&
dealerHand.length<5
){

dealerHand.push(deck.pop());

}


const dTong=tongDiem(dealerHand);

const pTong=tongDiem(playerHand);


const dXiDach=laXiDach(dealerHand);


if(dXiDach){

return ketThuc(
msg,
"lose",
0
);

}


if(dTong>21){

return ketThuc(msg,"win",1);

}


if(pTong>dTong){

return ketThuc(msg,"win",1);

}


if(pTong<dTong){

return ketThuc(msg,"lose",0);

}


return ketThuc(msg,"push",0);


}



const row=new ActionRowBuilder()

.addComponents(

new ButtonBuilder()

.setCustomId("xd_hit")

.setLabel("🃏 Rút bài")

.setStyle(ButtonStyle.Primary),


new ButtonBuilder()

.setCustomId("xd_stand")

.setLabel("✋ Dừng")

.setStyle(ButtonStyle.Secondary)

);



if(laXiDach(playerHand)){


user.money+=Math.floor(bet*2);


save();


return message.channel.send({

embeds:[

new EmbedBuilder()

.setColor("Gold")

.setTitle("🃏 XÌ DÁCH!")

.setDescription(

`
👤 Bài của bạn:
${hienThi(playerHand)} (21 điểm - XÌ DÁCH)


✅ Thắng +${(bet*2).toLocaleString()} xu


💰 Số dư: ${user.money.toLocaleString()} xu
`

)

]

});


}



const msg=await message.channel.send({

embeds:[

new EmbedBuilder()

.setColor("Gold")

.setTitle("🃏 XÌ DÁCH")

.setDescription(

`
👤 Bài của bạn:
${hienThi(playerHand)} (${tongDiem(playerHand)} điểm)


🤖 Nhà cái:
${dealerHand[0].rank}${dealerHand[0].suit} 🂠


💰 Cược: ${bet.toLocaleString()} xu

⏳ 30 giây để rút bài hoặc dừng
`

)

],

components:[row]

});



const collector=msg.createMessageComponentCollector({

filter:i=>i.user.id===message.author.id,

time:30000

});



collector.on(

"collect",

async interaction=>{


if(interaction.customId==="xd_hit"){


playerHand.push(deck.pop());


const tong=tongDiem(playerHand);



if(tong>21){


collector.stop("resolved");


await interaction.update({

components:[]

});


return ketThuc(msg,"lose",0);


}



if(playerHand.length>=5){


collector.stop("resolved");


await interaction.update({

components:[]

});


return ketThuc(msg,"win",2);


}



return interaction.update({

embeds:[

new EmbedBuilder()

.setColor("Gold")

.setTitle("🃏 XÌ DÁCH")

.setDescription(

`
👤 Bài của bạn:
${hienThi(playerHand)} (${tong} điểm)


🤖 Nhà cái:
${dealerHand[0].rank}${dealerHand[0].suit} 🂠


💰 Cược: ${bet.toLocaleString()} xu

⏳ Rút thêm hoặc dừng
`

)

],

components:[row]

});


}



if(interaction.customId==="xd_stand"){


collector.stop("resolved");


await interaction.update({

components:[]

});


return nhaCaiChoi(msg);


}


}

);



collector.on(

"end",

(collected,reason)=>{


if(reason==="time"){

nhaCaiChoi(msg);

}


}

);



}


};

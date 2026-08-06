const {EmbedBuilder}=require("discord.js");
const {getUser,save}=require("../../database");
const {formatMoney,emoji}=require("../../config");


module.exports={

name:"quest",
aliases:["q"],


async execute(message){


const user=getUser(
message.guild.id,
message.author.id
);



if(!user.quest){

user.quest={

date:"",
list:[]

};

}



const today=
new Date()
.toDateString();



if(user.quest.date!==today){


user.quest={

date:today,

list:[

{
type:"fish",
need:20,
now:0,
done:false
},

{
type:"sell",
need:10,
now:0,
done:false
}

]

};


save();

}



let text="";


for(
const q of user.quest.list
){


const icon=
q.type==="fish"?
"🎣":
"💰";


const name=
q.type==="fish"?
"Câu cá":
"Bán cá";


text+=
`${q.done?"✅":"⬜"} ${icon} ${name}\n${q.now}/${q.need}\n\n`;


}



const done=
user.quest.list.every(
x=>x.done
);



if(done &&
!user.quest.reward){


const reward=20000;


user.money+=reward;

user.quest.reward=true;


save();



text+=
`\n🎁 Đã nhận:
${emoji.money} ${formatMoney(reward)}`;

}



const embed=new EmbedBuilder()

.setColor("#ffaa00")

.setTitle("📜 NHIỆM VỤ NGÀY")

.setDescription(text)

.setTimestamp();



message.reply({

embeds:[embed]

});


}

};
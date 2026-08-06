const {EmbedBuilder}=require("discord.js");

const {
getUser,
save
}=require("../../database");

const {
rods
}=require("../../config");


module.exports={

name:"rod",
aliases:["r"],


async execute(message,args){


const user=getUser(
message.guild.id,
message.author.id
);



const id=args[0];



// TRANG BỊ

if(id){


const rod=rods[id];


if(!rod)

return message.reply(
"❌ Không tìm thấy cần"
);



const amount=
user.can.danhSach[id]||0;



if(amount<=0)

return message.reply(
"❌ Bạn chưa có cần này"
);



user.can.dangDung=id;


save();



return message.reply({

embeds:[

new EmbedBuilder()

.setColor("#00ff99")

.setTitle("🎣 TRANG BỊ CẦN")

.setDescription(

`
${rod.emoji} **${rod.name}**

⭐ Cấp:
${rod.star}

🎣 Lượt:
${amount}

`

)

]

});


}




// XEM CẦN



let text="";


for(const id in rods){


const rod=rods[id];


const amount=
user.can.danhSach[id]||0;



if(amount>0){


text+=
`${rod.emoji} ${rod.name}

⭐ ${rod.star}
🎣 ${amount} lượt

`;


}


}



if(!text)

text="Bạn chưa có cần";




const current=
user.can.dangDung;



const embed=new EmbedBuilder()


.setColor("#00aaff")

.setTitle("🎣 KHO CẦN CÂU")


.setDescription(

`
${text}


Đang dùng:

${
current&&rods[current]
?
rods[current].emoji+" "+rods[current].name
:
"Chưa có"
}

`

)


.setTimestamp();



message.reply({
embeds:[embed]
});



}

};
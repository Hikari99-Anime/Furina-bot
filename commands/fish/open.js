const {
EmbedBuilder
}=require("discord.js");


const {
chests,
keys,
emoji,
formatMoney
}=require("../../config");


const {
getUser,
save
}=require("../../data");



module.exports={


name:"open",

aliases:[

"chest",
"ruong",
"openchest",
"mo"

],



async execute(message,args){



const user=
getUser(
message.guild.id,
message.author.id
);





const id=
args[0];



if(!id)

return message.reply({

embeds:[

new EmbedBuilder()

.setColor("#ffaa00")

.setTitle(
"╭・🎁 RƯƠNG BÁU"
)

.setDescription(
`
${Object.keys(chests)
.map(x=>{

const c=chests[x];

return `${c.emoji} ${c.name} ┆ ⭐${c.star}`;

})
.join("\n\n")}


Dùng:

\`!open <tên rương>\`
`
)

]

});





const chest=
chests[id];



if(!chest)

return message.reply(
"╰・❌ Không tìm thấy rương"
);





const keyID=
chest.key;



if(
!user.keys[keyID] ||
user.keys[keyID]<=0
)

return message.reply({

embeds:[

new EmbedBuilder()

.setColor("#ff8888")

.setTitle(
"╭・🔑 Thiếu chìa khóa"
)

.setDescription(
`
${chest.emoji} ${chest.name}


Cần:

${keys[keyID].emoji} ${keys[keyID].name}


╰・Hãy mua thêm chìa khóa
`
)

]

});






// trừ key

user.keys[keyID]--;





const drop=
chest.drop[
Math.floor(
Math.random()*chest.drop.length
)
];





let rewardText="";





// tiền

if(
drop.type==="money"
){



const money=
Math.floor(

Math.random()

*
(drop.max-drop.min+1)

+

drop.min

);



user.money+=money;



rewardText=
`
💰 Nhận được:

${formatMoney(money)} ${emoji.money}
`;



}





save();






message.reply({

embeds:[

new EmbedBuilder()

.setColor("#ffd86b")

.setTitle(
"╭・🎁 Mở rương thành công"
)

.setDescription(
`
${chest.emoji} ${chest.name}


✨ Rương đã mở!


${rewardText}


🔑 Còn lại:

${user.keys[keyID]}


╰・🌊 Chúc bạn may mắn
`
)

.setFooter({

text:
"✦ Fishing Adventure"

})

]

});



}

};
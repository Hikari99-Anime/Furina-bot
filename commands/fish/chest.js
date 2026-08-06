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

name:"chest",

aliases:[
"ruong",
"open"
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

\`!chest <tên rương>\`
`
)

]

});





const chest=
chests[id];



if(!chest)

return message.reply(
"❌ Không tìm thấy rương"
);



const key=
chest.key;



if(!user.keys[key])

return message.reply({

content:
"❌ Bạn không có chìa khóa"

});



user.keys[key]--;





const reward=
Math.floor(

Math.random()*
(
chest.drop[0].max-
chest.drop[0].min
)

+
chest.drop[0].min

);



user.money+=reward;


save();





const embed=
new EmbedBuilder()

.setColor("#ffd43b")

.setTitle(
"╭・🎁 MỞ RƯƠNG"
)

.setDescription(
`
${chest.emoji} ${chest.name}


╭・✨ Phần thưởng


${emoji.money} ${formatMoney(reward)} xu


╰・Chúc mừng bạn 🎉
`
)

.setFooter({
text:"🎣 Fish System"
});



message.reply({

embeds:[embed]

});


}

};
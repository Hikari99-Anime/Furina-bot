const {
EmbedBuilder
}=require("discord.js");


const {
rods,
rodTitles,
upgrade,
emoji,
formatMoney
}=require("../../config");


const {
getUser,
save
}=require("../../data");



function upgradeCost(base,level){


return Math.floor(
base.price * (level+1) * 0.5
);


}



module.exports={


name:"upgrade",

aliases:[

"cuonghoa",
"nangcap"

],



async execute(message){



const user=
getUser(
message.guild.id,
message.author.id
);



const id=
user.can.dangDung;



if(!id)

return message.reply({
content:
"╰・❌ Bạn chưa trang bị cần câu"
});



const base=
rods[id];


const rod=
user.rodData[id];



if(!rod)

return message.reply(
"╰・❌ Không tìm thấy dữ liệu cần"
);



if(rod.destroyed)

return message.reply({
content:
"╰・❌ Cần đã bị phá hủy, hãy sửa chữa trước"
});



if(rod.level>=15)

return message.reply({

embeds:[

new EmbedBuilder()

.setColor("#ffd43b")

.setTitle(
"╭・✨ Cường hóa tối đa"
)

.setDescription(
`
${base.emoji} ${base.name}

⭐ +${rod.level}

╰・Cần đã đạt cấp cao nhất
`
)

]

});



const price=
upgradeCost(base,rod.level);



if(user.money<price)

return message.reply({
content:
`╰・❌ Cần ${formatMoney(price)} ${emoji.money} để cường hóa`
});



user.money-=price;



const successRate=
upgrade.success[rod.level];


const roll=
Math.random()*100;



let resultText;

let color;



if(roll<successRate){


rod.level++;

rod.luck+=upgrade.luckPerLevel;


color="#8affb2";


let title="";

if(rodTitles[rod.level])

title=
`\n${rodTitles[rod.level]}`;


resultText=
`
✅ Cường hóa thành công!

⭐ +${rod.level}${title}

🍀 Luck ${rod.luck}
`;


}

else{


const destroyChance=
upgrade.destroy[rod.level+1] || 0;


const destroyRoll=
Math.random()*100;



if(destroyRoll<destroyChance){


rod.destroyed=true;

rod.uses=0;


color="#ff5555";


resultText=
`
💥 Cường hóa thất bại, cần đã bị phá hủy!

╰・Hãy sửa chữa để dùng lại
`;


}

else{


color="#ffcc66";


resultText=
`
❌ Cường hóa thất bại

⭐ Vẫn +${rod.level}

╰・Xu đã bị mất, thử lại nhé
`;


}


}



save();



message.reply({

embeds:[

new EmbedBuilder()

.setColor(color)

.setTitle(
"╭・✨ Cường Hóa Cần Câu"
)

.setDescription(
`
${base.emoji} ${base.name}


╭・🎲 Tỉ lệ thành công

${successRate}%


╭・💸 Chi phí

${formatMoney(price)} ${emoji.money}


${resultText}

╰・💰 Số dư: ${formatMoney(user.money)} ${emoji.money}
`
)

.setFooter({
text:"✦ Fishing Adventure"
})

]

});



}

};

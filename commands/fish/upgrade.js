const {
EmbedBuilder,
ActionRowBuilder,
ButtonBuilder,
ButtonStyle
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



const DOWNGRADE_LEVEL=5;

const DESTROY_DURABILITY_LEVEL=10;


// tỉ lệ giảm cấp khi thất bại, ở mức độ bền còn đầy (base)
// độ bền càng hao thì tỉ lệ càng tăng dần lên 100% khi độ bền = 0

const DOWNGRADE_BASE_CHANCE=0.9;

const DOWNGRADE_BASE_CHANCE_LV10=0.5;


const DESTROY_DURABILITY_CHANCE=0.5;




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
`${base.emoji} ${base.name} · ⭐ +${rod.level}

╰・Cần đã đạt cấp cao nhất`
)

]

});



const price=
upgradeCost(base,rod.level);



if(user.money<price)

return message.reply({
content:
`╰・❌ ${base.emoji} ${base.name} +${rod.level} cần ${formatMoney(price)} ${emoji.money} để cường hóa`
});




// ======================
// HỎI DÙNG VÉ BẢO HIỂM
// (chỉ hỏi khi có rủi ro giảm cấp/gãy cần
// và user đang sở hữu vé)
// ======================


const coRuiRo=
rod.level>=DOWNGRADE_LEVEL;


let dungBaoHiem=false;

let msg=null;


if(coRuiRo && (user.insurance||0)>0){


const row=new ActionRowBuilder()

.addComponents(

new ButtonBuilder()

.setCustomId("ins_yes")

.setLabel(`🎫 Dùng vé bảo hiểm (còn ${user.insurance})`)

.setStyle(ButtonStyle.Success),


new ButtonBuilder()

.setCustomId("ins_no")

.setLabel("❌ Không dùng")

.setStyle(ButtonStyle.Secondary)

);



const canhBao=

rod.level>=DESTROY_DURABILITY_LEVEL

?

"⚠️ Thất bại: tối thiểu 50% giảm cấp (càng ít độ bền càng cao, hết độ bền là 100%), thêm 50% độc lập gãy cần luôn nếu còn độ bền."

:

"⚠️ Thất bại: 90% giảm cấp.";



const askMsg=

await message.reply({

embeds:[

new EmbedBuilder()

.setColor("#ffcc66")

.setTitle("╭・🎫 Dùng vé bảo hiểm?")

.setDescription(

`${base.emoji} ${base.name} · ⭐ +${rod.level}

${canhBao}

Vé chỉ bị tiêu hao nếu nó thực sự cứu bạn khỏi hình phạt khi thất bại.

╰・Bạn có 20 giây để chọn`

)

],

components:[row]

});



dungBaoHiem=

await new Promise(resolve=>{


const collector=

askMsg.createMessageComponentCollector({

filter:i=>i.user.id===message.author.id,

time:20000,

max:1

});



collector.on("collect",async interaction=>{

await interaction.deferUpdate();

resolve(interaction.customId==="ins_yes");

});



collector.on("end",collected=>{

if(collected.size===0)

resolve(false);

});


});



msg=askMsg;


}




// ======================
// HỒI HỘP CHỜ KẾT QUẢ
// ======================


const suspenseEmbed=

new EmbedBuilder()

.setColor("#7ddcff")

.setTitle("╭・🎲 Đang cường hóa...")

.setDescription(

`${base.emoji} ${base.name} · ⭐ +${rod.level}

🎲 Tỉ lệ thành công: ${upgrade.success[rod.level]}%

╰・Hồi hộp chờ kết quả...`

);



if(msg)

await msg.edit({

embeds:[suspenseEmbed],

components:[]

});

else

msg=

await message.reply({

embeds:[suspenseEmbed]

});



await new Promise(

r=>setTimeout(r,5000)

);




// ======================
// TIẾN HÀNH CƯỜNG HÓA
// ======================


const startLevel=
rod.level;


user.money-=price;



const successRate=
upgrade.success[rod.level];


const roll=
Math.random()*100;



let resultText;

let color;

let insuranceUsed=false;



if(roll<successRate){


rod.level++;

rod.luck+=upgrade.luckPerLevel;


color="#8affb2";


let title="";

if(rodTitles[rod.level])

title=
` · ${rodTitles[rod.level]}`;


resultText=
`✅ Cường hóa thành công!
⭐ +${rod.level}${title} · 🍀 Luck ${rod.luck}`;


}

else{


let bGiamCap=false;

let bMatDoBen=false;


if(rod.level>=DESTROY_DURABILITY_LEVEL){


// level 10+: độ bền càng hao thì tỉ lệ giảm cấp càng tăng,
// hết sạch độ bền (0) thì 100% giảm cấp luôn

const wearRatio=

1 - (rod.uses/rod.maxUses);


const downgradeChance=

DOWNGRADE_BASE_CHANCE_LV10 +

(1-DOWNGRADE_BASE_CHANCE_LV10)*wearRatio;


bGiamCap=Math.random()<downgradeChance;



// còn độ bền thì mới có gì để "mất về 0" (độc lập)

if(rod.uses>0)

bMatDoBen=Math.random()<DESTROY_DURABILITY_CHANCE;


}

else if(rod.level>=DOWNGRADE_LEVEL){


// level 5-9: không tính độ bền, chỉ tỉ lệ cố định

bGiamCap=Math.random()<DOWNGRADE_BASE_CHANCE;


}



if(
dungBaoHiem &&
(bGiamCap || bMatDoBen)
){


user.insurance--;

insuranceUsed=true;


color="#66ccff";


resultText=
`🎫 Cường hóa thất bại nhưng vé bảo hiểm đã bảo vệ cần!
⭐ Vẫn +${rod.level}
╰・Vé bảo hiểm còn: ${user.insurance}`;


}

else if(bMatDoBen){


rod.destroyed=true;

rod.uses=0;


color="#ff5555";


resultText=
`💥 Cường hóa thất bại, cần bị giảm cấp và phá hủy!
⭐ Còn +${Math.max(0,rod.level-1)}
╰・Hãy sửa chữa để dùng lại`;


rod.level=Math.max(0,rod.level-1);


}

else if(bGiamCap){


rod.level=Math.max(0,rod.level-1);


color="#ff8888";


resultText=
`⬇️ Cường hóa thất bại, cần bị giảm cấp!
⭐ Còn +${rod.level}
╰・Xu đã bị mất, thử lại nhé`;


}

else{


color="#ffcc66";


resultText=
`❌ Cường hóa thất bại
⭐ Vẫn +${rod.level}
╰・Xu đã bị mất, thử lại nhé`;


}


}



save();



msg.edit({

embeds:[

new EmbedBuilder()

.setColor(color)

.setTitle(
"╭・✨ Cường Hóa Cần Câu"
)

.setDescription(
`${base.emoji} ${base.name} · Đang ⭐ +${startLevel}

╭・🎲 Tỉ lệ thành công: ${successRate}%
╭・💸 Chi phí: ${formatMoney(price)} ${emoji.money}

${resultText}

╰・💰 Số dư: ${formatMoney(user.money)} ${emoji.money}`
)

.setFooter({
text:"✦ Fishing Adventure"
})

],

components:[]

});



}

};

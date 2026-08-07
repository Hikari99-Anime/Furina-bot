const {

EmbedBuilder,

ActionRowBuilder,

ButtonBuilder,

ButtonStyle,

ModalBuilder,

TextInputBuilder,

TextInputStyle

}=require("discord.js");


const {

createGame,

getGame

}=require("../games/taixiugame");




const {

getUser,

save

}=require("../database");




const SO_PAYOUT = {

3:180, 4:60, 5:30, 6:17, 7:12, 8:8, 9:6, 10:6,

11:6, 12:6, 13:8, 14:12, 15:17, 16:30, 17:60, 18:180

};




function nhanCua(p){


if(p.type==="tai")
return "🔴 TÀI";


if(p.type==="xiu")
return "🔵 XỈU";


if(p.type==="chan")
return "⚫ CHẴN";


if(p.type==="le")
return "⚪ LẺ";


return `🔢 SỐ ${p.number}`;


}




module.exports = {


name:"taixiu",




async execute(message){



if(getGame()){


return message.reply(
"❌ Đang có ván tài xỉu!"
);


}




let game=createGame();



let time=30;





const row =
new ActionRowBuilder()

.addComponents(

new ButtonBuilder()

.setCustomId("tx_tai")

.setLabel("🔴 TÀI")

.setStyle(ButtonStyle.Danger),


new ButtonBuilder()

.setCustomId("tx_xiu")

.setLabel("🔵 XỈU")

.setStyle(ButtonStyle.Primary),


new ButtonBuilder()

.setCustomId("tx_chan")

.setLabel("⚫ CHẴN")

.setStyle(ButtonStyle.Secondary),


new ButtonBuilder()

.setCustomId("tx_le")

.setLabel("⚪ LẺ")

.setStyle(ButtonStyle.Secondary),


new ButtonBuilder()

.setCustomId("tx_so")

.setLabel("🔢 CHỌN SỐ")

.setStyle(ButtonStyle.Success)

);






const msg =
await message.channel.send({

embeds:[

new EmbedBuilder()

.setColor("Gold")

.setTitle("🎲 TÀI XỈU")

.setDescription(

`
⏳ Thời gian: **30 giây**

Chọn cửa (có thể cược nhiều cửa cùng lúc):

🔴 TÀI · 🔵 XỈU · ⚫ CHẴN · ⚪ LẺ · 🔢 CHỌN SỐ (3-18)


Chưa có cược

`

)

],

components:[row]

});






const timer=setInterval(async()=>{


time--;



let list =
game.players.length

?

game.players.map(

p=>

`<@${p.id}> | ${nhanCua(p)} | ${p.money.toLocaleString()} xu`

).join("\n")

:

"Chưa có ai";





await msg.edit({

embeds:[

new EmbedBuilder()

.setColor("Gold")

.setTitle("🎲 TÀI XỈU")

.setDescription(

`
⏳ Còn:

${time} giây


👥 Cược:

${list}

`

)

]

});






if(time<=0){


clearInterval(timer);


endGame(msg,message);

}



},1000);







const collector =
msg.createMessageComponentCollector({

time:30000

});





collector.on(
"collect",
async interaction=>{


if(!interaction.isButton())
return;



if(interaction.customId==="tx_so"){


const modal =
new ModalBuilder()

.setCustomId("txbet_so")

.setTitle("🔢 Chọn số + tiền cược");


const numberInput =
new TextInputBuilder()

.setCustomId("sonum")

.setLabel("Số dự đoán (tổng 3 xúc xắc, 3-18)")

.setPlaceholder("Ví dụ: 12")

.setStyle(TextInputStyle.Short);


const moneyInput =
new TextInputBuilder()

.setCustomId("money")

.setLabel("Số tiền cược")

.setPlaceholder("Ví dụ: 1000")

.setStyle(TextInputStyle.Short);


modal.addComponents(

new ActionRowBuilder().addComponents(numberInput),

new ActionRowBuilder().addComponents(moneyInput)

);


return interaction.showModal(modal);


}




let type =

interaction.customId==="tx_tai" ? "tai" :

interaction.customId==="tx_xiu" ? "xiu" :

interaction.customId==="tx_chan" ? "chan" :

"le";





const modal =
new ModalBuilder()

.setCustomId(
"txbet_"+type
)

.setTitle(
"💰 Nhập tiền cược"
);





const input =
new TextInputBuilder()

.setCustomId("money")

.setLabel("Số tiền cược")

.setPlaceholder(
"Ví dụ: 1000"
)

.setStyle(
TextInputStyle.Short
);




modal.addComponents(

new ActionRowBuilder()

.addComponents(input)

);





await interaction.showModal(modal);



});




}


};







async function endGame(msg,message){


const {

closeGame

}=require("../games/taixiugame");



const game=closeGame();



if(!game)
return;




const dice=[

Math.floor(Math.random()*6)+1,

Math.floor(Math.random()*6)+1,

Math.floor(Math.random()*6)+1

];



const total =
dice[0]+dice[1]+dice[2];



const isTai = total>=11;

const isChan = total%2===0;



let text="";

const resultsByUser = new Map();



for(const p of game.players){


const user =
getUser(

p.id

);




let win=false;

let payout=1;



if(p.type==="tai")
win = isTai;

else if(p.type==="xiu")
win = !isTai;

else if(p.type==="chan")
win = isChan;

else if(p.type==="le")
win = !isChan;

else if(p.type==="so"){

win = p.number===total;

payout = SO_PAYOUT[p.number] || 1;

}




if(!resultsByUser.has(p.id))

resultsByUser.set(p.id,{

lines:[],

net:0

});


const entry = resultsByUser.get(p.id);


if(win){


const thang = p.money*payout;


user.money += thang;

entry.net += thang;

entry.lines.push(
`[${nhanCua(p)}] +${thang.toLocaleString()} xu`
);



}else{


user.money -= p.money;

entry.net -= p.money;

entry.lines.push(
`[${nhanCua(p)}] -${p.money.toLocaleString()} xu`
);



}


}



for(const [id,entry] of resultsByUser){


const ketQua =

entry.net > 0
?
`✅ Lời ${entry.net.toLocaleString()} xu`
:
entry.net < 0
?
`❌ Lỗ ${Math.abs(entry.net).toLocaleString()} xu`
:
"➖ Huề vốn";


text +=
`<@${id}> ${entry.lines.join(" ")} ${ketQua}\n`;


}



save();


const mentions =
[...resultsByUser.keys()]
.map(id => `<@${id}>`)
.join(" ");



msg.edit({

content: mentions || undefined,

embeds:[

new EmbedBuilder()

.setColor("Green")

.setTitle("🎲 KẾT QUẢ TÀI XỈU")

.setDescription(

`
🎲 Xúc xắc:

${dice.join(" | ")}


🔢 Tổng:

${total} (${isTai?"TÀI":"XỈU"} · ${isChan?"CHẴN":"LẺ"})


👥 Kết quả cược:


${text || "Không ai cược"}

`

)

],

components:[]

});



}

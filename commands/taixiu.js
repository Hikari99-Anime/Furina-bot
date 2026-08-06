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

getGame,

playerBet

}=require("../games/taixiugame");




const {

getUser,

save

}=require("../database");





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

.setStyle(ButtonStyle.Primary)

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

Chọn cửa:

🔴 TÀI
🔵 XỈU


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

`<@${p.id}> | ${p.choice.toUpperCase()} | ${p.money} xu`

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


👥 Người chơi:

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



let choice =
interaction.customId==="tx_tai"
?
"tai"
:
"xiu";





const modal =
new ModalBuilder()

.setCustomId(
"txbet_"+choice
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



const result =
total>=11
?
"tai"
:
"xiu";



let text="";



for(const p of game.players){


const user =
getUser(

message.guild.id,

p.id

);




if(p.choice===result){


user.money += p.money;


text +=
`✅ <@${p.id}> +${p.money} xu\n`;



}else{


user.money -= p.money;


text +=
`❌ <@${p.id}> -${p.money} xu\n`;



}


}



save();





msg.edit({

embeds:[

new EmbedBuilder()

.setColor("Green")

.setTitle("🎲 KẾT QUẢ TÀI XỈU")

.setDescription(

`
🎲 Xúc xắc:

${dice.join(" | ")}


🔢 Tổng:

${total}


📌 Kết quả:

${result.toUpperCase()}


👥 Người chơi:


${text || "Không ai cược"}

`

)

],

components:[]

});



}
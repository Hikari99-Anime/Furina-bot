const {
Client,
GatewayIntentBits,
Collection,
ModalBuilder,
ActionRowBuilder,
TextInputBuilder,
TextInputStyle,
EmbedBuilder
}=require("discord.js");


const fs=require("fs");

require("dotenv").config();



const client=new Client({

intents:[

GatewayIntentBits.Guilds,

GatewayIntentBits.GuildMessages,

GatewayIntentBits.MessageContent

]

});



client.commands=new Collection();




// =======================
// LOAD COMMAND
// =======================


const files=
fs.readdirSync("./commands")
.filter(
f=>f.endsWith(".js")
);



for(const file of files){


const cmd=require("./commands/"+file);



client.commands.set(
cmd.name,
cmd
);



console.log(
"LOAD:",
cmd.name
);


}






// =======================
// PREFIX COMMAND
// =======================


client.on(
"messageCreate",
async message=>{


if(message.author.bot)
return;



if(!message.content.startsWith("!"))
return;




const args=
message.content
.slice(1)
.trim()
.split(/\s+/);




const name=
args.shift()
.toLowerCase();




const cmd=
client.commands.get(name);




if(!cmd)
return;




try{


await cmd.execute(
message,
args,
client
);



}catch(err){


console.log(
"COMMAND ERROR:",
err
);


}



});







// =======================
// ALL INTERACTION
// =======================


client.on(
"interactionCreate",
async interaction=>{


try{


// PHẦN 2 DÁN TIẾP Ở ĐÂY
// =======================
// CÂU CÁ
// =======================


if(interaction.isButton()){


if(
!interaction.customId.startsWith("bait_")
)
return;



const bait =
interaction.customId.replace(
"bait_",
""
);





const modal =

new ModalBuilder()

.setCustomId(
"fish_"+bait
)

.setTitle(
"🎣 Nhập số lần câu"
);





const input =

new TextInputBuilder()

.setCustomId(
"amount"
)

.setLabel(
"Số lần câu (1-100)"
)

.setPlaceholder(
"Ví dụ: 10"
)

.setStyle(
TextInputStyle.Short
)

.setRequired(true);





modal.addComponents(

new ActionRowBuilder()

.addComponents(input)

);





return interaction.showModal(modal);


}







if(interaction.isModalSubmit()){



if(
interaction.customId.startsWith("fish_")
){



const {
getUser,
save
}=require("./database");






const bait =

interaction.customId.replace(
"fish_",
""
);






const amount =

Number(

interaction.fields

.getTextInputValue(
"amount"
)

);






if(
!Number.isInteger(amount)
||
amount<=0
||
amount>100
){


return interaction.reply({

content:
"❌ Số lần câu từ 1-100",

flags:64

});


}






const user =

getUser(

interaction.guild.id,

interaction.user.id

);







if(!user.can.dangDung){


return interaction.reply({

content:
"❌ Chưa trang bị cần câu",

flags:64

});


}






if(
(user.can.danhSach[user.can.dangDung]||0)
<
amount
){


return interaction.reply({

content:
"❌ Cần không đủ lượt",

flags:64

});


}






if(
(user.moi[bait]||0)
<
amount
){


return interaction.reply({

content:
"❌ Không đủ mồi",

flags:64

});


}







user.can.danhSach[user.can.dangDung]
-=amount;



user.moi[bait]
-=amount;



save();







await interaction.reply({

embeds:[

new EmbedBuilder()

.setColor("Blue")

.setTitle(
"🎣 ĐANG CÂU CÁ"
)

.setDescription(
`
🪱 Mồi:
${bait}


🎯 Số lần:
${amount}


⏳ Thời gian:
10 giây


🎣 Đang chờ cá...
`
)

]

});








setTimeout(async()=>{



const fishList=[


{
name:"🐟 Cá rô",
rate:45,
min:0.2,
max:2
},



{
name:"🐠 Cá chép",
rate:30,
min:1,
max:10
},



{
name:"🦑 Mực",
rate:15,
min:0.5,
max:5
},



{
name:"🐡 Cá nóc",
rate:7,
min:1,
max:15
},



{
name:"🦈 Cá mập",
rate:2.8,
min:20,
max:200
},



{
name:"👑 Cá thần thoại",
rate:0.2,
min:300,
max:1000
}


];






let result={};

let miss=0;







for(
let i=0;
i<amount;
i++
){



// 5% dính ủng

if(
Math.random()<0.05
){

miss++;

continue;

}





let rand =
Math.random()*100;



let total=0;

let caught=null;






for(
const fish of fishList
){


total+=fish.rate;



if(rand<=total){


caught=fish;

break;


}


}





if(!caught)
continue;







const weight =

Number(

(
Math.random()
*
(
caught.max-caught.min
)
+
caught.min

).toFixed(2)

);







if(!result[caught.name])

result[caught.name]=[];





result[caught.name].push(weight);



}






if(!user.fish)

user.fish={};






let text="";






for(
const name in result
){



if(!user.fish[name])

user.fish[name]=[];





user.fish[name].push(
...result[name]
);





text+=
`${name} x${result[name].length}\n`;



}






save();







await interaction.editReply({

embeds:[

new EmbedBuilder()

.setColor("Green")

.setTitle(
"🎣 KẾT QUẢ CÂU CÁ"
)

.setDescription(
`
🎯 Số lần:
${amount}


🐟 Cá bắt được:

${text || "Không câu được cá"}


👢 Xịt:
${miss}


✅ Đã lưu kho
`
)

]

});





},10000);



}



}
// =======================
// BÁN CÁ SELECT MENU
// =======================


if(interaction.isStringSelectMenu()){



if(
interaction.customId !== "sell_fish"
)
return;





const fishName =
interaction.values[0];






const modal =

new ModalBuilder()

.setCustomId(
"sell_amount_"+fishName
)

.setTitle(
"💰 Nhập số lượng bán"
);






const input =

new TextInputBuilder()

.setCustomId(
"amount"
)

.setLabel(
"Số lượng muốn bán"
)

.setPlaceholder(
"Ví dụ: 5"
)

.setStyle(
TextInputStyle.Short
)

.setRequired(true);







modal.addComponents(

new ActionRowBuilder()

.addComponents(input)

);






return interaction.showModal(modal);


}








// =======================
// BÁN CÁ MODAL
// =======================


if(interaction.isModalSubmit()){



if(
interaction.customId.startsWith(
"sell_amount_"
)
){



const {
getUser,
save
}=require("./database");






const fishName =

interaction.customId.replace(
"sell_amount_",
""
);







const amount =

Number(

interaction.fields

.getTextInputValue(
"amount"
)

);







if(
!Number.isInteger(amount)
||
amount<=0
){


return interaction.reply({

content:
"❌ Số lượng không hợp lệ",

flags:64

});


}







const user =

getUser(

interaction.guild.id,

interaction.user.id

);







if(!user.fish){


return interaction.reply({

content:
"❌ Kho cá trống",

flags:64

});


}







let fish =
user.fish[fishName];


// chuyển dữ liệu cũ sang dạng mới
if(
!Array.isArray(fish)
){

    fish=[];

    user.fish[fishName]=fish;

}






if(
!fish ||
fish.length < amount
){


return interaction.reply({

content:
"❌ Không đủ cá",

flags:64

});


}








// bán cá nặng nhất trước


fish.sort(
(a,b)=>b-a
);







let totalWeight=0;






for(
let i=0;
i<amount;
i++
){


totalWeight += fish.shift();


}







const money =

Math.floor(
totalWeight*100
);






user.money += money;







if(
fish.length===0
){

delete user.fish[fishName];

}







save();








return interaction.reply({

embeds:[

new EmbedBuilder()

.setColor("Gold")

.setTitle(
"💰 BÁN CÁ THÀNH CÔNG"
)

.setDescription(
`
👤 ${interaction.user}


🐟 Cá:

${fishName}


📦 Số lượng:

x${amount}


⚖️ Tổng cân nặng:

${totalWeight.toFixed(2)} kg


💵 Nhận:

${money.toLocaleString()} xu


💰 Số dư:

${user.money.toLocaleString()} xu
`
)

.setTimestamp()

]

});



}


}







}catch(err){


console.log(
"INTERACTION ERROR:",
err
);


}


});







// =======================
// READY
// =======================


client.once(
"ready",
()=>{

console.log(
"✅ Bot online:",
client.user.tag
);

});







// =======================
// LOGIN
// =======================


client.login(
process.env.TOKEN
);
require("dotenv").config();


const {
    chests,
    keys,
    insurance,
    rods,
    baits,
    emoji,
    formatMoney,
    prefix
} = require("./config");


const PREFIX = "!" + prefix;


const {
    getUser
} = require("./data");


const {
    purchase
} = require("./commands/fish/buy");


const {
    Client,
    GatewayIntentBits,
    Collection,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require("discord.js");


const fs = require("fs");



const client = new Client({


    intents:[

        GatewayIntentBits.Guilds,

        GatewayIntentBits.GuildMessages,

        GatewayIntentBits.MessageContent

    ]


});




// ======================
// COMMAND LOADER
// ======================


client.commands = new Collection();



function loadCommands(folder){


    if(!fs.existsSync(folder))

        return;



    const files = fs.readdirSync(folder);



    for(const file of files){



        const path = `${folder}/${file}`;



        try{


            if(fs.statSync(path).isDirectory()){


                loadCommands(path);

                continue;

            }



            if(!file.endsWith(".js"))

                continue;



            const command = require(`./${path}`);



            if(!command.name || !command.execute)

                continue;



            client.commands.set(

                command.name,

                command

            );



            if(command.aliases){


                for(const alias of command.aliases){


                    client.commands.set(

                        alias,

                        command

                    );


                }


            }



            console.log(

                "✅ Loaded:",

                command.name

            );



        }

        catch(err){


            console.log(

                "❌ Load lỗi:",

                path

            );


            console.error(err);


        }


    }


}



loadCommands("commands");









// ======================
// READY
// ======================


client.once(

"ready",

()=>{


console.log("================");

console.log(

`🤖 ${client.user.tag} ONLINE`

);


console.log(

`📁 Commands: ${client.commands.size}`

);



console.log(

`🎁 Chest: ${Object.keys(chests).length}`

);



console.log(

`🔑 Key: ${Object.keys(keys).length}`

);



console.log("================");


}

);









// ======================
// PREFIX COMMAND
// ======================


client.on(

"messageCreate",

async message=>{


if(message.author.bot)

return;



if(!message.content.toLowerCase().startsWith(PREFIX))

return;




const args = message.content

.slice(PREFIX.length)

.trim()

.split(/\s+/);




const cmd = args.shift().toLowerCase();



const command = client.commands.get(cmd);



if(!command)

return;



try{


await command.execute(

message,

args,

client

);



}

catch(err){


console.log(

"COMMAND ERROR:",

err

);



message.reply(

"❌ Lệnh lỗi."

);


}



}

);











// ======================
// SHOP INTERACTION
// ======================


client.on(

"interactionCreate",

async interaction=>{


try{



// ======================
// BUTTON
// ======================


if(interaction.isButton()){



// ROD SHOP

if(interaction.customId === "shop_rod"){



const rodIds=
Object.keys(rods);



const embed = new EmbedBuilder()


.setColor("#60A5FA")


.setTitle(

"╭・🎣 ROD COLLECTION"

)


.setDescription(

rodIds.map(rid=>{

const r=rods[rid];

return `${r.emoji} **${r.name}**\n💰 ${formatMoney(r.price)} ${emoji.money} · 🍀 Luck ${r.luck}`;

}).join("\n\n━━━━━━━━━━━━\n\n")

);



const row = new ActionRowBuilder()


.addComponents(

rodIds.map(rid=>

new ButtonBuilder()

.setCustomId("buy_"+rid)

.setLabel(rods[rid].name)

.setStyle(ButtonStyle.Primary)

)

);



return interaction.reply({

embeds:[embed],

components:[row],

ephemeral:true

});


}






// BUY BUTTON

if(interaction.customId.startsWith("buy_")){


const item = interaction.customId.replace(

"buy_",

""

);



const modal = new ModalBuilder()


.setCustomId(

"modal_"+item

)


.setTitle(

"🛒 Nhập số lượng mua"

);




const input = new TextInputBuilder()


.setCustomId(

"amount"

)


.setLabel(

"Số lượng"

)


.setStyle(

TextInputStyle.Short

)


.setPlaceholder(

"Ví dụ: 1"

)


.setRequired(true);




modal.addComponents(

new ActionRowBuilder()

.addComponents(input)

);



return interaction.showModal(modal);


}




// BAIT

if(interaction.customId === "shop_bait"){



const baitIds=
Object.keys(baits);



const embed = new EmbedBuilder()


.setColor("#86EFAC")


.setTitle(

"╭・🪱 BAIT MARKET"

)


.setDescription(

baitIds.map(bid=>{

const b=baits[bid];

return `${b.emoji} **${b.name}**\n💰 ${formatMoney(b.price)} ${emoji.money}`;

}).join("\n\n━━━━━━━━━━━━\n\n")

);



const row = new ActionRowBuilder()


.addComponents(

baitIds.map(bid=>

new ButtonBuilder()

.setCustomId("buy_"+bid)

.setLabel(baits[bid].name)

.setStyle(ButtonStyle.Success)

)

);



return interaction.reply({

embeds:[embed],

components:[row],

ephemeral:true

});


}





// KEY


if(interaction.customId === "shop_key"){



const keyIds=
Object.keys(keys);


const insuranceIds=
Object.keys(insurance);


const allIds=
[...keyIds, ...insuranceIds];



const embed = new EmbedBuilder()


.setColor("#FACC15")


.setTitle(

"╭・🎟️ TREASURE & INSURANCE MARKET"

)


.setDescription(

keyIds.map(kid=>{

const k=keys[kid];

return `${k.emoji} **${k.name}**\n💰 ${formatMoney(k.price)} ${emoji.money}`;

}).concat(

insuranceIds.map(iid=>{

const it=insurance[iid];

return `${it.emoji} **${it.name}**\n💰 ${formatMoney(it.price)} ${emoji.money}`;

})

).join("\n\n━━━━━━━━━━━━\n\n")

);



const rows=[];


for(let i=0;i<allIds.length;i+=5){


const chunk=
allIds.slice(i,i+5);


rows.push(

new ActionRowBuilder()

.addComponents(

chunk.map(id=>{

const item=
keys[id] || insurance[id];


return new ButtonBuilder()

.setCustomId("buy_"+id)

.setLabel(item.name)

.setStyle(
keys[id] ? ButtonStyle.Secondary : ButtonStyle.Success
);

})

)

);


}



return interaction.reply({

embeds:[embed],

components:rows,

ephemeral:true

});


}




}









// ======================
// MODAL
// ======================


if(interaction.isModalSubmit()){



if(interaction.customId.startsWith("modal_")){



const itemID = interaction.customId.replace(

"modal_",

""

);



const amount = Number(

interaction.fields.getTextInputValue(

"amount"

)

);



const user=
getUser(
interaction.guild.id,
interaction.user.id
);



const result=
purchase(user,itemID,amount);



if(!result.ok)

return interaction.reply({

content:
result.reason,

ephemeral:true

});



return interaction.reply({

content:

`
✅ Mua thành công

${result.item.emoji} ${result.item.name} x${amount}

💸 Đã trả: ${formatMoney(result.price)} ${emoji.money}

💰 Số dư: ${formatMoney(user.money)} ${emoji.money}
`,

ephemeral:true

});


}



}



}

catch(err){


console.log(

"INTERACTION ERROR:",

err

);


}



}

);











// ======================
// INTERACTION (SLASH COMMAND + TÀI XỈU BET MODAL)
// ======================

client.on(
"interactionCreate",
async interaction=>{


try{


if(
interaction.isChatInputCommand() &&
interaction.commandName === "ping"
){

return interaction.reply(
"🏓 Pong! Bot đang online."
);

}



if(
interaction.isModalSubmit() &&
interaction.customId.startsWith("txbet_")
){


const {
addBet,
getGame,
hasBetType,
totalBetOf
} = require("./games/taixiugame");


const {
getUser
} = require("./database");


const type =
interaction.customId.replace(
"txbet_",
""
);


const amount =
Number(
interaction.fields
.getTextInputValue("money")
);


if(
!Number.isInteger(amount)
||
amount<=0
){

return interaction.reply({
content:
"❌ Số tiền cược không hợp lệ",
flags:64
});

}


let number = null;


if(type==="so"){


number =
Number(
interaction.fields
.getTextInputValue("sonum")
);


if(
!Number.isInteger(number)
||
number<3
||
number>18
){

return interaction.reply({
content:
"❌ Số dự đoán phải từ 3 đến 18",
flags:64
});

}


}


if(!getGame()){

return interaction.reply({
content:
"❌ Ván tài xỉu đã kết thúc",
flags:64
});

}


if(
hasBetType(interaction.user.id,type)
){

return interaction.reply({
content:
"❌ Bạn đã cược cửa này rồi",
flags:64
});

}


const user =
getUser(
interaction.guild.id,
interaction.user.id
);


const daCuoc =
totalBetOf(interaction.user.id);


if(user.money < daCuoc+amount){

return interaction.reply({
content:
"❌ Không đủ tiền",
flags:64
});

}


const label =

type==="tai" ? "🔴 TÀI" :

type==="xiu" ? "🔵 XỈU" :

type==="chan" ? "⚫ CHẴN" :

type==="le" ? "⚪ LẺ" :

`🔢 SỐ ${number}`;


addBet({
id:interaction.user.id,
type,
number,
money:amount
});


return interaction.reply({
content:
`✅ Đã đặt cược **${amount.toLocaleString()} xu** vào **${label}**`,
flags:64
});


}


}catch(err){

console.log(
"INTERACTION ERROR:",
err
);

}


}

);




// ======================
// LOGIN
// ======================


client.login(

process.env.TOKEN

);
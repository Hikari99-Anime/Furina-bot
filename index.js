require("dotenv").config();


const {
    chests,
    keys
} = require("./config");



const {
    Client,
    GatewayIntentBits,
    Collection
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
// LOAD COMMAND
// ======================


client.commands = new Collection();



const commandFiles = fs.readdirSync("./commands")
.filter(file => file.endsWith(".js"));



for(const file of commandFiles){


    const command =
    require(`./commands/${file}`);



    client.commands.set(
        command.name,
        command
    );


}








// ======================
// BOT READY
// ======================


client.once("ready",()=>{


    console.log(
        `✅ ${client.user.tag} online`
    );


    console.log(
        "🎁 Chest:",
        Object.keys(chests).length
    );


    console.log(
        "🔑 Key:",
        Object.keys(keys).length
    );


});









// ======================
// MESSAGE COMMAND
// ======================


client.on(
"messageCreate",
async message=>{


    if(message.author.bot)
        return;



    if(!message.content.startsWith("!"))
        return;





    const args =

    message.content
    .slice(1)
    .trim()
    .split(/\s+/);





    const cmd =

    args
    .shift()
    .toLowerCase();





    const command =

    client.commands.get(cmd);





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


        console.error(err);



        message.reply(
            "❌ Có lỗi xảy ra khi chạy lệnh."
        );


    }



});







<<<<<<< HEAD
=======
// INTERACTION (SLASH COMMAND + TÀI XỈU BET MODAL)

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


});




client.once(
"ready",
()=>{


console.log(
`✅ Bot online: ${client.user.tag}`
);


});


>>>>>>> 418111c2b25b627f983d4cbb419a284e8a087174


// ======================
// LOGIN
// ======================


client.login(
    process.env.TOKEN
);
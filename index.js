const {
    Client,
    GatewayIntentBits,
    Collection
} = require("discord.js");


const fs = require("fs");

require("dotenv").config();



if(!process.env.TOKEN){

    console.log(
        "❌ Thiếu TOKEN trong .env"
    );

    process.exit();

}



const client = new Client({

    intents:[

        GatewayIntentBits.Guilds,

        GatewayIntentBits.GuildMessages,

        GatewayIntentBits.MessageContent

    ]

});



client.commands = new Collection();





// LOAD COMMAND

const files =

fs.readdirSync("./commands")
.filter(
f=>f.endsWith(".js")
);



for(const file of files){


    const cmd =
    require("./commands/"+file);



    client.commands.set(
        cmd.name,
        cmd
    );


    console.log(
        "LOAD:",
        cmd.name
    );


}






// PREFIX COMMAND

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



const name =
args.shift()
.toLowerCase();



const cmd =
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
playerBet
} = require("./games/taixiugame");


const {
getUser
} = require("./database");


const choice =
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


if(!getGame()){

return interaction.reply({
content:
"❌ Ván tài xỉu đã kết thúc",
flags:64
});

}


if(
playerBet(interaction.user.id)
){

return interaction.reply({
content:
"❌ Bạn đã đặt cược ván này rồi",
flags:64
});

}


const user =
getUser(
interaction.guild.id,
interaction.user.id
);


if(user.money<amount){

return interaction.reply({
content:
"❌ Không đủ tiền",
flags:64
});

}


addBet({
id:interaction.user.id,
choice,
money:amount
});


return interaction.reply({
content:
`✅ Đã đặt cược **${amount.toLocaleString()} xu** vào **${choice==="tai"?"🔴 TÀI":"🔵 XỈU"}**`,
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






client.login(
process.env.TOKEN
);
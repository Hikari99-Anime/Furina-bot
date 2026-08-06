require("dotenv").config();

const {
chests,
keys
}=require("./config");


const {
Client,
GatewayIntentBits,
Collection
}=require("discord.js");


const fs=require("fs");



const client=new Client({

intents:[

GatewayIntentBits.Guilds,

GatewayIntentBits.GuildMessages,

GatewayIntentBits.MessageContent

]

});





// LOAD COMMAND

client.commands=new Collection();



function loadCommands(folder){


for(const file of fs.readdirSync(folder)){


const path=`${folder}/${file}`;


if(fs.statSync(path).isDirectory()){

loadCommands(path);

continue;

}


if(!file.endsWith(".js"))

continue;



try{


const command=require(`./${path}`);



if(!command.name)

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







// READY


client.once("ready",()=>{


console.log(
`🤖 ${client.user.tag} online`
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








// MESSAGE


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



const cmd=
args.shift()
.toLowerCase();



const command=
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


console.error(
"COMMAND ERROR:",
err
);


message.reply(
"❌ Lệnh bị lỗi."
);


}



});







client.login(
process.env.TOKEN
);
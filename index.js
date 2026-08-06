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
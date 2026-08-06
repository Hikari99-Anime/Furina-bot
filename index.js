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









// ======================
// LOGIN
// ======================


client.login(
    process.env.TOKEN
);
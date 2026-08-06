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
// COMMAND LOADER
// ======================


client.commands = new Collection();



function loadCommands(folder){


    if(!fs.existsSync(folder))
        return;



    const files = fs.readdirSync(folder);



    for(const file of files){


        const path = `${folder}/${file}`;



        const stat = fs.statSync(path);



        // nếu là folder con

        if(stat.isDirectory()){


            loadCommands(path);

            continue;

        }



        // chỉ load js

        if(!file.endsWith(".js"))

            continue;



        try{


            delete require.cache[
                require.resolve(`./${path}`)
            ];



            const command =
            require(`./${path}`);



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
                `✅ Loaded: ${command.name}`
            );


        }

        catch(err){


            console.log(
                `❌ Load lỗi: ${path}`
            );


            console.error(err);


        }


    }


}



loadCommands("commands");








// ======================
// BOT READY
// ======================


client.once(
"ready",
()=>{


    console.log("");

    console.log(
        "===================="
    );


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


    console.log(
        "===================="
    );


});








// ======================
// PREFIX COMMAND
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

    args.shift()

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


        console.error(

            `❌ COMMAND ERROR (${cmd})`

        );


        console.error(err);



        await message.reply({

            content:
            "❌ Có lỗi xảy ra khi chạy lệnh."

        });



    }


});








// ======================
// ERROR HANDLER
// ======================


process.on(
"unhandledRejection",
err=>{

    console.error(
        "Unhandled Error:",
        err
    );

});



process.on(
"uncaughtException",
err=>{

    console.error(
        "Crash Error:",
        err
    );

});








// ======================
// LOGIN
// ======================


client.login(
process.env.TOKEN
);
require("dotenv").config();


const {
    chests,
    keys
} = require("./config");


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



if(!message.content.startsWith("!"))

return;




const args = message.content

.slice(1)

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



const embed = new EmbedBuilder()


.setColor("#60A5FA")


.setTitle(

"╭・🎣 ROD COLLECTION"

)


.setDescription(

`
🌱 **Beginner Rod**

💰 5,000 Fcoin

> Cần câu cơ bản


━━━━━━━━━━━━


🌊 **Ocean Rod**

💰 20,000 Fcoin

> Tăng cơ hội cá hiếm


━━━━━━━━━━━━


✨ **Legend Rod**

💰 50,000 Fcoin

> Cần câu huyền thoại
`

);



const row = new ActionRowBuilder()


.addComponents(


new ButtonBuilder()

.setCustomId("buy_canthuong")

.setLabel("🌱 Beginner")

.setStyle(ButtonStyle.Primary),



new ButtonBuilder()

.setCustomId("buy_can3")

.setLabel("🌊 Ocean")

.setStyle(ButtonStyle.Primary),



new ButtonBuilder()

.setCustomId("buy_can5")

.setLabel("✨ Legend")

.setStyle(ButtonStyle.Primary)


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



const embed = new EmbedBuilder()


.setColor("#86EFAC")


.setTitle(

"╭・🪱 BAIT MARKET"

)


.setDescription(

`
🪱 Common Bait

💰 100 Fcoin


━━━━━━━━━━━━


✨ Silver Bait

💰 500 Fcoin


━━━━━━━━━━━━


🌟 Golden Bait

💰 1000 Fcoin
`

);



return interaction.reply({

embeds:[embed],

ephemeral:true

});


}





// KEY


if(interaction.customId === "shop_key"){



const embed = new EmbedBuilder()


.setColor("#FACC15")


.setTitle(

"╭・🗝️ TREASURE MARKET"

)


.setDescription(

`
🗝️ Bronze Key

💰 5,000 Fcoin


━━━━━━━━━━━━


🔷 Silver Key

💰 20,000 Fcoin


━━━━━━━━━━━━


👑 Golden Key

💰 50,000 Fcoin
`

);



return interaction.reply({

embeds:[embed],

ephemeral:true

});


}




}









// ======================
// MODAL
// ======================


if(interaction.isModalSubmit()){



if(interaction.customId.startsWith("modal_")){



const item = interaction.customId.replace(

"modal_",

""

);



const amount = Number(

interaction.fields.getTextInputValue(

"amount"

)

);





if(!Number.isInteger(amount) || amount<=0){


return interaction.reply({

content:

"❌ Số lượng không hợp lệ",

ephemeral:true

});


}





return interaction.reply({

content:

`
✅ Đã chọn mua

🎣 Vật phẩm:
\`${item}\`

📦 Số lượng:
\`${amount}\`

💰 Đang xử lý...
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
// LOGIN
// ======================


client.login(

process.env.TOKEN

);
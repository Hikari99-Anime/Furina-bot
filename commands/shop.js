const {EmbedBuilder}=require("discord.js");
const {shop}=require("../config");


module.exports={


name:"shop",



async execute(message,args,client){



let canText="";

let moiText="";



// Cần câu

for(const id in shop){


const item=shop[id];


if(item.uses){


canText+=
`\`🎣\` ${id} | ${item.name} | ${item.price} xu | ${item.uses} lượt\n`;

}


}





// Mồi

for(const id in shop){


const item=shop[id];


if(item.amount){


moiText+=
`\`🪱\` ${id} | ${item.name} | ${item.price} xu | x${item.amount}\n`;

}


}




const embed=new EmbedBuilder()


.setColor("#ffaa00")


.setTitle("🏪 SHOP CÂU CÁ")


.setDescription(

`

🎣 **CẦN CÂU**

${canText}

🪱 **MỒI CÂU**

${moiText}

━━━━━━━━━━━━━━

Dùng: \`!buy <id>\`
Ví dụ:
\`!buy canruby\`
\`!buy moivang\`

`

)



.setThumbnail(

message.client.user.displayAvatarURL()

)


.setTimestamp();




message.channel.send({

embeds:[embed]

});



}



};
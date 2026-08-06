const {EmbedBuilder}=require("discord.js");

const {
getUser
}=require("../../database");


const {
baits,
chests,
keys,
fishList
}=require("../../config");



module.exports={


name:"bag",
aliases:["b"],



async execute(message){


const user=getUser(
message.guild.id,
message.author.id
);



let fishText="";


for(const fish of fishList){


const amount=
user.fish[fish.name]?.length||0;


if(amount>0){


let kg=0;


for(const x of user.fish[fish.name])
kg+=x;


fishText+=
`${fish.emoji} ${fish.name} x${amount} (${kg.toFixed(1)}kg)\n`;

}


}



if(!fishText)
fishText="Không có cá";




let baitText="";


for(const id in baits){


const amount=
user.moi[id]||0;


if(amount>0){


baitText+=
`${baits[id].emoji} ${baits[id].name} x${amount}\n`;

}


}


if(!baitText)
baitText="Không có mồi";





let chestText="";


for(const id in chests){


const amount=
user.chest[id]||0;


if(amount>0){


chestText+=
`${chests[id].emoji} ${chests[id].name} x${amount}\n`;

}


}



if(!chestText)
chestText="Không có rương";





let keyText="";


for(const id in keys){


const amount=
user.keys[id]||0;


if(amount>0){


keyText+=
`${keys[id].emoji} ${keys[id].name} x${amount}\n`;

}


}



if(!keyText)
keyText="Không có chìa";





const embed=new EmbedBuilder()


.setColor("#33ff99")


.setTitle(
`🎒 Túi đồ ${message.author.username}`
)


.setDescription(

`
🐟 **CÁ**

${fishText}


🪱 **MỒI**

${baitText}


🎁 **RƯƠNG**

${chestText}


🗝️ **CHÌA KHÓA**

${keyText}

`

)


.setThumbnail(
message.author.displayAvatarURL()
)


.setTimestamp();



message.reply({
embeds:[embed]
});



}

};
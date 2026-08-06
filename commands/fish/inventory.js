const {
EmbedBuilder
}=require("discord.js");


const {
baits,
keys,
emoji
}=require("../../config");


const {
getUser
}=require("../../data");



module.exports={

name:"inventory",

aliases:[
"inv",
"kho"
],



async execute(message){


const user=
getUser(
message.guild.id,
message.author.id
);



let bait="";

let key="";



for(const id in baits){


const x=baits[id];


bait+=
`${x.emoji} ${x.name} x${user.moi[id]||0}\n`;

}



for(const id in keys){


const x=keys[id];


key+=
`${x.emoji} ${x.name} x${user.keys[id]||0}\n`;

}




const embed=
new EmbedBuilder()

.setColor("#9b59ff")

.setTitle(
"╭・🎒 KHO ĐỒ"
)

.setDescription(
`
╭・🪱 MỒI

${bait}


╭・🗝️ CHÌA KHÓA

${key}


╰・🎣 Fish System
`
)

.setFooter({

text:"Quản lý vật phẩm"

});



message.reply({

embeds:[embed]

});


}

};
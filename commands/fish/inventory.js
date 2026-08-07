const {
EmbedBuilder
}=require("discord.js");


const {
baits,
keys,
insurance,
fishList,
emoji,
formatMoney
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



for(const id in insurance){


const x=insurance[id];


key+=
`${x.emoji} ${x.name} x${user.insurance||0}\n`;

}




let fishText="";

let fishValue=0;



for(const fish of fishList){


const list=
user.fish[fish.id];


if(!list || list.length===0)

continue;


let weight=0;


for(const w of list)

weight+=w;


const value=
Math.floor(weight*fish.sell);


fishValue+=value;


fishText+=
`${fish.emoji} ${fish.name} x${list.length} ┆ ${weight.toFixed(2)}KG ┆ ${formatMoney(value)} ${emoji.money}\n`;


}



if(!fishText)

fishText=
"Chưa có cá nào\n";




const embed=
new EmbedBuilder()

.setColor("#9b59ff")

.setTitle(
"╭・🎒 KHO ĐỒ"
)

.setDescription(
`╭・🐟 CÁ (bán được ${formatMoney(fishValue)} ${emoji.money})
${fishText}
╭・🪱 MỒI
${bait}
╭・🎟️ CHÌA KHÓA & BẢO HIỂM
${key}
╰・🎣 Fish System`
)

.setFooter({

text:"Quản lý vật phẩm"

});



message.reply({

embeds:[embed]

});


}

};
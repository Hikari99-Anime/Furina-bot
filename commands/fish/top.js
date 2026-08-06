const {
EmbedBuilder
}=require("discord.js");


const {
emoji,
formatMoney
}=require("../../config");


const {
data
}=require("../../data");



module.exports={

name:"top",

aliases:[
"leaderboard",
"bxh"
],



async execute(message,args){


const type=
args[0] || "money";



let list=[];



for(const guild in data){


for(const id in data[guild]){


const user=
data[guild][id];


let value=0;



if(type==="fish"){

for(const x in user.fish){

value+=
user.fish[x].length;

}

}


else if(type==="kg"){


for(const x in user.fish){

value+=
user.fish[x]
.reduce(
(a,b)=>a+b,
0
);

}

}


else{


value=user.money || 0;


}



list.push({

id,

value

});


}

}



list.sort(
(a,b)=>
b.value-a.value
);



list=
list
.slice(0,10);



let text="";



let rank=1;



for(const x of list){


const member=
await message.guild.members
.fetch(x.id)
.catch(()=>null);



const name=
member
?
member.user.username
:
"Người chơi";



let value="";



if(type==="kg")

value=
`${x.value.toFixed(2)} KG`;


else if(type==="fish")

value=
`${x.value} con`;


else

value=
`${emoji.money} ${formatMoney(x.value)}`;



text+=
`${rank}. ${name}\n┆ ${value}\n\n`;



rank++;


}



const title=

type==="fish"
?
"🐟 BXH CÂU CÁ"

:

type==="kg"
?
"⚖️ BXH CÂN NẶNG"

:

"💰 BXH GIÀU CÓ";





const embed=
new EmbedBuilder()

.setColor("#ffd43b")

.setTitle(
`╭・${title}`
)

.setDescription(
text ||
"Chưa có dữ liệu"
)

.setFooter({

text:"🎣 Fish System"

});



message.reply({

embeds:[embed]

});


}

};
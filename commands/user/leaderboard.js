const {EmbedBuilder}=require("discord.js");
const fs=require("fs");


module.exports={


name:"leaderboard",



async execute(message,args,client){



const data=JSON.parse(

fs.readFileSync(

"data.json",

"utf8"

)

);





let users=[];




for(const id in data){


users.push({

id:id,

money:data[id].money || 0,

fish:Object.values(

data[id].fish || {}

).reduce(

(a,b)=>a+b.length,

0

)

});


}




users.sort(

(a,b)=>b.money-a.money

);





let text="";



const top=users.slice(0,10);



for(
let i=0;
i<top.length;
i++
){



let member;



try{


member=await message.guild.members.fetch(

top[i].id

);


}catch{


continue;


}




let medal="";



if(i===0) medal="🥇";

else if(i===1) medal="🥈";

else if(i===2) medal="🥉";

else medal=`${i+1}.`;




text+=

`${medal} ${member.user.username} | 💰 ${top[i].money} xu | 🐟 ${top[i].fish} cá\n`;



}





if(!text){

text="Chưa có dữ liệu";

}




const embed=new EmbedBuilder()


.setColor("#ffd700")


.setTitle("🏆 BẢNG XẾP HẠNG NGƯỜI CHƠI")


.setDescription(

`

${text}

`

)



.setFooter({

text:"Top 10 Fishing Players"

})


.setTimestamp();




message.channel.send({

embeds:[embed]

});



}



};
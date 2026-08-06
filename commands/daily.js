const {EmbedBuilder}=require("discord.js");
const {getUser,save}=require("../database");


module.exports={


name:"daily",



async execute(message,args,client){



const user=getUser(

message.guild.id,

message.author.id

);




const now=Date.now();



const time=24*60*60*1000;




if(user.daily && now-user.daily<time){



const remain=time-(now-user.daily);



const hour=Math.floor(
remain/(1000*60*60)
);



const minute=Math.floor(
(remain%(1000*60*60))/
(1000*60)
);



return message.channel.send({


embeds:[



new EmbedBuilder()


.setColor("Red")


.setTitle("❌ CHƯA THỂ NHẬN DAILY")


.setDescription(

`

\`👤\` ${message.author}


Bạn đã nhận tiền hôm nay.


⏰ Còn:

${hour} giờ ${minute} phút

`

)


]



});



}





user.money+=5000;


user.daily=now;


save();




const embed=new EmbedBuilder()



.setColor("Green")



.setTitle("🎁 NHẬN DAILY THÀNH CÔNG")



.setThumbnail(

message.author.displayAvatarURL({

dynamic:true

})

)



.setDescription(

`

\`👤\` ${message.author}

💰 Nhận: +5.000 xu
💵 Số dư: ${user.money} xu


`

)



.setTimestamp();




message.channel.send({

embeds:[embed]

});



}



};
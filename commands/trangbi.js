const {
    EmbedBuilder
}=require("discord.js");


const {
    getUser,
    save
}=require("../database");





module.exports={


name:"trangbi",





async execute(message,args){



const id =
args[0];





if(!id){


return message.reply({

content:
"❌ Ví dụ: !trangbi canruby"

});


}





const user =
getUser(
message.guild.id,
message.author.id
);






if(
!user.can ||
!user.can.danhSach[id]
){


return message.reply({

content:
"❌ Bạn chưa mua cần này!"

});


}






user.can.dangDung = id;





save();







const embed =

new EmbedBuilder()

.setColor("Green")

.setTitle(
"🎣 TRANG BỊ CẦN THÀNH CÔNG"
)

.setDescription(
`
👤 ${message.author}


🎣 Cần đang dùng:

${id}


🔋 Số lượt còn:

${user.can.danhSach[id]}
`
)

.setTimestamp();






message.channel.send({

embeds:[
embed
]

});



}


};
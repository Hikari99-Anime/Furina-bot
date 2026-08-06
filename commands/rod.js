const {
    EmbedBuilder
} = require("discord.js");


const {
    getUser,
    save
} = require("../database");


const {
    rods
} = require("../config");



module.exports = {


name:"rod",



async execute(message,args){



const user =
getUser(
message.guild.id,
message.author.id
);






const id =
args[0];





if(!id){


return message.reply(

`
❌ Nhập ID cần câu

Ví dụ:

\`!rod can_1\`

`

);


}






const rod =
rods[id];





if(!rod){


return message.reply(
"❌ Cần câu không tồn tại"
);


}







if(
!user.can ||
!user.can.danhSach[id]
||
user.can.danhSach[id] <= 0
){


return message.reply(

`
❌ Bạn chưa sở hữu cần này

Mua tại:
\`!buy ${id}\`

`

);


}







user.can.dangDung=id;



save();







const embed =

new EmbedBuilder()

.setColor("#00ccff")

.setTitle("🎣 TRANG BỊ CẦN CÂU")

.setDescription(

`
${rod.emoji} **${rod.name}**

✅ Đã trang bị


🎣 Lượt còn:

${user.can.danhSach[id]}


⭐ May mắn:

${rod.luck}

`

)

.setTimestamp();







message.reply({

embeds:[
embed
]

});



}


};
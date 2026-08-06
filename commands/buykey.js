const {
    EmbedBuilder
} = require("discord.js");


const {
    getUser,
    save
} = require("../database");


const {
    keys,
    emoji
} = require("../config");



module.exports = {


name:"buykey",


aliases:[
    "bk"
],



async execute(message,args){



const user = getUser(
    message.guild.id,
    message.author.id
);





const id = args[0];


const amount = Math.max(
    1,
    Number(args[1]) || 1
);







if(!id){


return message.reply(
`
❌ Nhập loại chìa khóa

Ví dụ:

\`!buykey key_1\`

\`!bk key_3 5\`

`
);


}







const key = keys[id];



if(!key){


return message.reply(
"❌ Chìa khóa không tồn tại"
);


}







const price = key.price * amount;






if(user.money < price){


return message.reply(

`
❌ Không đủ xu

Cần:
${price.toLocaleString()} xu

`

);


}







// trừ tiền

user.money -= price;







// tạo kho key

if(!user.keys)

user.keys={};







if(!user.keys[id])

user.keys[id]=0;






// cộng key

user.keys[id]+=amount;







save();








const embed = new EmbedBuilder()

.setColor("#00ff00")

.setTitle("🔑 MUA CHÌA KHÓA")

.setDescription(

`
${key.emoji} **${key.name}**

📦 Số lượng:
x${amount}


${emoji.money} Giá:

${price.toLocaleString()} xu


💵 Còn lại:

${user.money.toLocaleString()} xu

`

)

.setTimestamp();







message.reply({

embeds:[embed]

});



}



};
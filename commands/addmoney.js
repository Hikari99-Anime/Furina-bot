const {EmbedBuilder}=require("discord.js");
const {getUser,save}=require("../database");
const {isAdmin}=require("../admin");


module.exports={

name:"addmoney",

async execute(message,args){


if(!isAdmin(message.author.id)){

return message.reply("❌ Bạn không có quyền!");

}


const target=message.mentions.users.first();

const amount=Number(args[1]);


if(!target||!amount){

return message.reply(
"❌ Ví dụ: !addmoney @user 10000"
);

}


const user=getUser(
message.guild.id,
target.id
);


user.money+=amount;


save();



const embed=new EmbedBuilder()

.setColor("Green")

.setTitle("💰 CỘNG TIỀN")

.setDescription(`

👑 Admin:
${message.author}


👤 Người nhận:
${target}


💵 Cộng:
${amount} xu


💰 Tổng:
${user.money} xu

`);


message.channel.send({
embeds:[embed]
});


}

};
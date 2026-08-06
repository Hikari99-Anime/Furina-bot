const {getUser,save}=require("../database");
const {isAdmin}=require("../admin");


module.exports={

name:"removemoney",


async execute(message,args){


if(!isAdmin(message.author.id))
return message.reply("❌ Không có quyền!");



const target=message.mentions.users.first();

const amount=Number(args[1]);



if(!target||!amount)
return message.reply(
"❌ !removemoney @user số tiền"
);



const user=getUser(
message.guild.id,
target.id
);



user.money=Math.max(
0,
user.money-amount
);



save();


message.reply(
`✅ Đã trừ ${amount} xu của ${target}`
);


}

};
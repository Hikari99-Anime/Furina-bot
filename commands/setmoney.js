const {getUser,save}=require("../database");
const {isAdmin}=require("../admin");


module.exports={

name:"setmoney",


async execute(message,args){


if(!isAdmin(message.author.id))
return message.reply("❌ Không có quyền!");



const target=message.mentions.users.first();

const amount=Number(args[1]);



if(!target||!amount)
return message.reply(
"❌ !setmoney @user số tiền"
);



const user=getUser(
message.guild.id,
target.id
);



user.money=amount;


save();


message.reply(
`✅ Đã đặt tiền ${target} thành ${amount} xu`
);


}

};
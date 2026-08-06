const {getUser,save}=require("../database");


module.exports={

name:"equip",


async execute(message,args){


const user=getUser(
message.guild.id,
message.author.id
);



const name=args.join(" ");



if(!user.can.danhSach[name]){

return message.reply(
"❌ Bạn không có cần này!"
);

}



user.can.dangDung=name;



save();



message.reply(
`🎣 Đã trang bị ${name}`
);


}

};
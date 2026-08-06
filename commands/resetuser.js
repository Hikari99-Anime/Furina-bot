const {getUser,save}=require("../database");
const {isAdmin}=require("../admin");


module.exports={

name:"resetuser",


async execute(message,args){


if(!isAdmin(message.author.id))
return message.reply("❌ Không có quyền!");



const target=message.mentions.users.first();


if(!target)
return message.reply(
"❌ !resetuser @user"
);



const user=getUser(
message.guild.id,
target.id
);



user.money=5000;

user.khoCa={};

user.moi={

moithuong:0,
moibac:0,
moivang:0

};


user.can={

dangDung:null,

danhSach:{}

};



save();



message.reply(
`✅ Đã reset dữ liệu ${target}`
);


}

};
const {
EmbedBuilder
}=require("discord.js");


const {
emoji,
formatMoney,
baits,
keys,
fishList,
rods,
prefix
}=require("../../config");


const {
getUser,
save
}=require("../../data");



module.exports={


name:"admin",



async execute(message,args){



const OWNER_ID=
process.env.OWNER_ID;



if(!OWNER_ID)

return message.reply(
"╰・❌ Chưa cấu hình OWNER_ID trong .env"
);



if(message.author.id!==OWNER_ID)

return message.reply(
"╰・❌ Bạn không có quyền"
);



const type=
args[0];



const target=
message.mentions.users.first();



if(!type)

return message.reply({

content:

`
╰・🛠️ Admin

\`${prefix}admin addmoney @user 10000\`

\`${prefix}admin addbait @user moivang 10\`

\`${prefix}admin addkey @user key_5 1\`

\`${prefix}admin addfish @user camap 5\`

\`${prefix}admin reset @user\`
`

});





if(!target)

return message.reply(
"╰・❌ Hãy tag người chơi"
);



const user=
getUser(
target.id
);





// ======================
// CỘNG XU
// ======================


if(type==="addmoney"){



const amount=
Number(args[2]);



if(!amount)

return message.reply(
"╰・❌ Nhập số xu"
);



user.money+=amount;


save();



return message.reply({

content:

`
✅ Đã cộng

${formatMoney(amount)} ${emoji.money}

cho ${target}
`

});



}






// ======================
// THÊM MỒI
// ======================


if(type==="addbait"){



const id=args[2];

const amount=
Number(args[3]);



if(!baits[id])

return message.reply(
"╰・❌ Sai ID mồi"
);



user.moi[id]=

(user.moi[id]||0)

+

amount;



save();



return message.reply({

content:

`
✅ Thêm ${amount}

${baits[id].emoji} ${baits[id].name}

cho ${target}
`

});



}







// ======================
// THÊM KEY
// ======================


if(type==="addkey"){



const id=args[2];

const amount=
Number(args[3]);



if(!keys[id])

return message.reply(
"╰・❌ Sai ID key"
);



user.keys[id]=

(user.keys[id]||0)

+

amount;



save();



return message.reply({

content:

`
✅ Thêm ${amount}

${keys[id].emoji} ${keys[id].name}

cho ${target}
`

});



}







// ======================
// THÊM CÁ
// ======================


if(type==="addfish"){



const id=args[2];

const amount=
Number(args[3]);



const fish=
fishList.find(
x=>x.id===id
);



if(!fish)

return message.reply(
"╰・❌ Sai ID cá"
);



if(!user.fish[id])

user.fish[id]=[];




for(let i=0;i<amount;i++){


user.fish[id].push(10);


}




save();



return message.reply({

content:

`
✅ Thêm

🐟 ${fish.name}

x${amount}

cho ${target}
`

});



}






// ======================
// RESET
// ======================


if(type==="reset"){



const fresh={


money:5000,


can:{

dangDung:null,

danhSach:{}

},


rodData:{},


moi:{


moithuong:10,


moibac:0,


moivang:0


},


fish:{},


keys:{}


};



require("../../data")
.data[target.id]=fresh;



save();



return message.reply({

content:

`
♻️ Đã reset dữ liệu

${target}
`

});



}





}

};

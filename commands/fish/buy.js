const {
EmbedBuilder
}=require("discord.js");


const {
rods,
baits,
keys,
insurance,
emoji,
formatMoney
}=require("../../config");


const {
getUser,
save
}=require("../../data");



// mua vật phẩm, dùng chung cho lệnh !buy và shop UI (button/modal)

function purchase(user,id,amount){


if(!Number.isInteger(amount) || amount<=0)

return {
ok:false,
reason:"╰・❌ Số lượng không hợp lệ"
};



let item;

let type;


if(rods[id]){

item=rods[id];

type="rod";

}

else if(baits[id]){

item=baits[id];

type="bait";

}

else if(keys[id]){

item=keys[id];

type="key";

}

else if(insurance[id]){

item=insurance[id];

type="insurance";

}

else{

return {
ok:false,
reason:"╰・❌ Không tìm thấy vật phẩm"
};

}



if(type==="rod"){


if(amount!==1)

return {
ok:false,
reason:"╰・❌ Cần câu chỉ mua được 1 cái mỗi lần"
};


const daSoHuu=

user.can && user.can.danhSach[id];


const daGay=

daSoHuu &&
user.rodData &&
user.rodData[id] &&
user.rodData[id].destroyed;



if(daSoHuu && !daGay)

return {
ok:false,
reason:"╰・❌ Bạn đã sở hữu cần này rồi"
};


}



const price=
item.price * amount;



if(user.money < price)

return {
ok:false,
reason:
`╰・❌ Bạn cần ${formatMoney(price)} ${emoji.money} để mua`,
price
};



user.money-=price;




if(type==="rod"){


if(!user.can)

user.can={

dangDung:null,

danhSach:{}

};



if(!user.rodData)

user.rodData={};



user.can.danhSach[id]=1;



user.rodData[id]={

level:0,

luck:item.luck,

uses:item.uses,

maxUses:item.uses,

destroyed:false

};



if(!user.can.dangDung)

user.can.dangDung=id;


}



if(type==="bait"){


if(!user.moi)

user.moi={};



user.moi[id]=

(user.moi[id] || 0)

+

amount;


}



if(type==="key"){


if(!user.keys)

user.keys={};



user.keys[id]=

(user.keys[id] || 0)

+

amount;


}



if(type==="insurance"){


user.insurance=

(user.insurance || 0)

+

amount;


}



save();



return {
ok:true,
item,
type,
price
};


}



module.exports={


name:"buy",

aliases:["b"],


purchase,



async execute(message,args){



const user=
getUser(
message.guild.id,
message.author.id
);



const id=args[0];


const amount=
Number(args[1] || 1);



if(!id)

return message.reply({

content:
"╰・❌ Dùng: !buy <id> <số lượng>"

});



const result=
purchase(user,id,amount);



if(!result.ok)

return message.reply(
result.reason
);



const {item,price}=result;



const embed=

new EmbedBuilder()

.setColor("#9affb0")

.setTitle(
"╭・🛒 Mua thành công"
)

.setDescription(
`${item.emoji} ${item.name}

╭・📦 Số lượng: x${amount}
╭・💸 Đã trả: ${formatMoney(price)} ${emoji.money}
╰・💰 Số dư: ${formatMoney(user.money)} ${emoji.money}`
)

.setFooter({

text:"✦ Fishing Adventure"

});




message.reply({

embeds:[embed]

});



}

};

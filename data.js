const fs = require("fs");


const path="./data.json";


let data={};



if(fs.existsSync(path)){


try{


data=
JSON.parse(
fs.readFileSync(path,"utf8")
);


}

catch{

data={};

}


}



function save(){


fs.writeFileSync(

path,

JSON.stringify(
data,
null,
2
)

);


}





function getUser(guildID,userID){



if(!data[guildID])

data[guildID]={};



if(!data[guildID][userID]){


data[guildID][userID]={



money:5000,



level:1,


exp:0,




// 🎣 CẦN

can:{


dangDung:null,


danhSach:{}


},



// dữ liệu nâng cấp cần

rodData:{},




// 🪱 MỒI

moi:{


moithuong:10,


moibac:0,


moivang:0


},



// 🐟 CÁ

fish:{},




// 🗝️ KEY

keys:{},




// 🎁 RƯƠNG

chests:{},




// 📜 QUEST

quest:{


fish:0,


done:false


}



};



save();


}





const user=
data[guildID][userID];



// fix user cũ

if(!user.can)

user.can={

dangDung:null,

danhSach:{}

};



if(!user.rodData)

user.rodData={};



if(!user.fish)

user.fish={};



if(!user.moi)

user.moi={

moithuong:0,

moibac:0,

moivang:0

};



if(!user.keys)

user.keys={};



return user;


}





module.exports={

getUser,

save,

data

};
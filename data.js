const fs = require("fs");
const path = require("path");


// luôn lưu cùng thư mục data.js
const filePath = path.join(
    __dirname,
    "data.json"
);



let data = {};




// =====================
// LOAD DATA
// =====================

if(fs.existsSync(filePath)){


try{


data = JSON.parse(

fs.readFileSync(
filePath,
"utf8"
)

);


}

catch(err){


console.log(
"⚠️ Data lỗi, tạo mới"
);


data={};


}


}








// =====================
// SAVE
// =====================


function save(){


try{


fs.writeFileSync(

filePath,

JSON.stringify(
data,
null,
2
)

);



}

catch(err){


console.log(
"❌ Lỗi lưu data:",
err
);


}


}









// =====================
// CREATE USER
// =====================


function createUser(){


return {


money:5000,


level:1,


exp:0,




// 🎣 CẦN

can:{


dangDung:null,


danhSach:{}


},




// ⭐ UPGRADE CẦN

rodData:{},






// 🪱 MỒI

moi:{


moithuong:10,


moibac:0,


moivang:0


},





// 🐟 CÁ

fish:{},






// 🔑 KEY

keys:{},





// 🎁 RƯƠNG

chests:{},





// 📜 QUEST

quest:{


date:"",


list:[],


claim:false


},





// 🎁 DAILY

daily:{


last:0,


streak:0


},





// 📊 STATS

stats:{


catch:0,


sell:0,


kg:0


}



};


}









// =====================
// GET USER
// =====================


function getUser(guildID,userID){



if(!data[guildID]){


data[guildID]={};


}






if(!data[guildID][userID]){


data[guildID][userID]=createUser();


save();


}






const user =
data[guildID][userID];









// =====================
// FIX MONEY
// =====================


if(typeof user.money !== "number"){


user.money=5000;


}








// =====================
// FIX DAILY
// =====================



// data cũ:
// "daily":1785944117863


if(typeof user.daily === "number"){


user.daily={


last:0,


streak:0


};


}






if(!user.daily){


user.daily={


last:0,


streak:0


};


}






if(typeof user.daily.last !== "number"){


user.daily.last=0;


}






if(typeof user.daily.streak !== "number"){


user.daily.streak=0;


}









// =====================
// FIX CẦN
// =====================


if(!user.can){


user.can={


dangDung:null,


danhSach:{}


};


}






// =====================
// FIX ROD DATA
// =====================


if(!user.rodData){


user.rodData={};


}






// =====================
// FIX MỒI
// =====================


if(!user.moi){


user.moi={


moithuong:10,


moibac:0,


moivang:0


};


}






// =====================
// FIX FISH
// =====================


if(!user.fish){


user.fish={};


}






// =====================
// FIX KEY
// =====================


if(!user.keys){


user.keys={};


}






// =====================
// FIX CHEST
// =====================


if(!user.chests){


user.chests={};


}






// =====================
// FIX QUEST
// =====================


if(!user.quest){


user.quest={


date:"",


list:[],


claim:false


};


}






// =====================
// FIX STATS
// =====================


if(!user.stats){


user.stats={


catch:0,


sell:0,


kg:0


};


}







save();



return user;


}








module.exports={


getUser,


save,


data


};
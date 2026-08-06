const fs=require("fs");

const file="data.json";

let data={};


if(fs.existsSync(file)){

try{

data=JSON.parse(
fs.readFileSync(file,"utf8")
);

}

catch{

data={};

}

}



function save(){

fs.writeFileSync(
file,
JSON.stringify(data,null,2)
);

}



function getUser(guildID,userID){


if(!data[guildID])

data[guildID]={};



if(!data[guildID][userID]){


data[guildID][userID]={


money:5000,

daily:0,


fish:{},


can:{

dangDung:null,

danhSach:{}

},


moi:{

moithuong:10,

moibac:0,

moivang:0

},


chest:{},


keys:{},


stats:{

catch:0,

sell:0,

kg:0

},


quest:{

date:"",

list:[],

claim:false

}


};



save();


}



const user=
data[guildID][userID];




// FIX DATA CŨ


if(user.money===undefined)

user.money=5000;


if(!user.fish)

user.fish={};


if(!user.can)

user.can={

dangDung:null,

danhSach:{}

};


if(!user.can.danhSach)

user.can.danhSach={};



if(!user.moi)

user.moi={

moithuong:10,

moibac:0,

moivang:0

};



if(!user.chest)

user.chest={};



if(!user.keys)

user.keys={};



if(!user.stats)

user.stats={

catch:0,

sell:0,

kg:0

};



if(!user.quest)

user.quest={

date:"",

list:[],

claim:false

};



return user;


}



module.exports={

getUser,

save,

data

};
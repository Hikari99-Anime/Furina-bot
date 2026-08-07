const fs = require("fs");
const path = require("path");


const { rods } = require("./config");


// luôn lưu đúng thư mục chứa data.js
const filePath = path.join(
    __dirname,
    "data.json"
);



let data = {};



// ======================
// LOAD DATA
// ======================

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








// ======================
// SAVE DATA
// ======================

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


        console.log(
            "💾 DATA SAVED"
        );


    }

    catch(err){


        console.log(
            "❌ SAVE ERROR:",
            err
        );


    }


}









// ======================
// CREATE USER
// ======================

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




    // 🎫 VÉ BẢO HIỂM

    insurance:0,




    // 🎒 INVENTORY

    inv:{},






    // 🎁 DAILY

    daily:{


        last:0,


        streak:0


    },






    // 📜 QUEST

    quest:{


        date:"",


        list:[],


        claim:false


    },






    // ⭐ CẦN DATA

    rodData:{},






    // 📊 STATS

    stats:{


        catch:0,


        sell:0,


        kg:0


    }


};


}












// ======================
// GET USER
// ======================

function getUser(guildID,userID){



    if(!data[guildID]){


        data[guildID]={};


    }






    if(!data[guildID][userID]){


        data[guildID][userID] =
        createUser();


        save();


    }






    const user =
    data[guildID][userID];








    // ======================
    // FIX DATA
    // ======================



    if(typeof user.money !== "number")

        user.money=5000;




    if(!user.can)

        user.can={

            dangDung:null,

            danhSach:{}

        };





    if(!user.moi)

        user.moi={

            moithuong:10,

            moibac:0,

            moivang:0

        };





    if(!user.fish)

        user.fish={};





    if(!user.keys)

        user.keys={};





    if(!user.chests)

        user.chests={};




    if(typeof user.insurance !== "number")

        user.insurance=0;





    if(!user.inv)

        user.inv={};





    if(!user.rodData)

        user.rodData={};




    // cần đang trang bị nhưng thiếu rodData
    // (dữ liệu cũ trước khi có rodData)

    if(
        user.can.dangDung
        &&
        !user.rodData[user.can.dangDung]
    ){

        const base=
        rods[user.can.dangDung];


        if(base){

            user.rodData[user.can.dangDung]={

                level:0,

                luck:base.luck,

                uses:base.uses,

                maxUses:base.uses,

                destroyed:false

            };

        }
        else{

            user.can.dangDung=null;

        }


        save();

    }





    if(!user.stats)

        user.stats={

            catch:0,

            sell:0,

            kg:0

        };









    // ======================
    // DAILY FIX
    // ======================



    // data cũ:
    // "daily":1785944117863

    if(typeof user.daily === "number"){


        user.daily={


            last:user.daily,


            streak:0


        };


    }






    if(!user.daily){


        user.daily={


            last:0,


            streak:0


        };


    }






    if(typeof user.daily.last !== "number")

        user.daily.last=0;





    if(typeof user.daily.streak !== "number")

        user.daily.streak=0;







    if(!user.quest)


        user.quest={


            date:"",


            list:[],


            claim:false


        };






    return user;


}









// ======================
// EXPORT
// ======================


module.exports={


    getUser,

    save,

    data


};
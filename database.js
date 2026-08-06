const fs = require("fs");
const path = require("path");


const file = path.join(__dirname, "data.json");


let data = {};



// LOAD DATA

if(fs.existsSync(file)){

    try{

        data = JSON.parse(
            fs.readFileSync(file,"utf8")
        );


    }catch(err){

        console.log(
            "LỖI ĐỌC DATA:",
            err
        );

        data = {};

    }

}




function save(){


    fs.writeFileSync(

        file,

        JSON.stringify(
            data,
            null,
            2
        )

    );


}





function getUser(guildID,userID){


    if(!data[guildID]){

        data[guildID] = {};

    }



    if(!data[guildID][userID]){


        data[guildID][userID] = {


            money:5000,


            daily:0,


            fish:{},


            can:{


                dangDung:null,


                danhSach:{}


            },


            moi:{


                moithuong:0,


                moibac:0,


                moivang:0


            }



        };


        save();

    }



    const user =
    data[guildID][userID];



    // FIX USER CŨ

    if(!user.fish)
        user.fish = {};



    if(!user.can){

        user.can = {

            dangDung:null,

            danhSach:{}

        };

    }



    if(!user.can.danhSach)
        user.can.danhSach = {};



    if(!user.moi){

        user.moi = {

            moithuong:0,

            moibac:0,

            moivang:0

        };

    }



    save();


    return user;

}





module.exports = {

    getUser,

    save,

    data

};
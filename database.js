const fs = require("fs");


const file = "data.json";


let data = {};




// =======================
// LOAD DATA
// =======================

if(fs.existsSync(file)){


    try{


        data = JSON.parse(
            fs.readFileSync(file,"utf8")
        );


    }
    catch(err){


        data = {};


    }


}







// =======================
// SAVE DATA
// =======================

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









// =======================
// GET USER
// =======================

function getUser(guildID,userID){



    if(!data[guildID])

        data[guildID]={};







    if(!data[guildID][userID]){



        data[guildID][userID]={



            // tiền

            money:5000,



            // daily

            daily:0,





            // kho cá

            fish:{},





            // cần câu

            can:{


                dangDung:null,


                danhSach:{}


            },







            // mồi

            moi:{


                moithuong:10,


                moibac:0,


                moivang:0


            },








            // =================
            // RƯƠNG
            // =================

            chest:{},






            // =================
            // CHÌA KHÓA
            // =================

            keys:{},






            // =================
            // GACHA PITY
            // =================

            pity:{}





        };




        save();



    }








    const user =

    data[guildID][userID];









    // =====================
    // FIX DATA CŨ
    // =====================



    if(user.money === undefined)

        user.money = 0;







    if(user.daily === undefined)

        user.daily = 0;








    if(!user.fish)

        user.fish = {};








    if(!user.can){


        user.can={


            dangDung:null,


            danhSach:{}


        };


    }








    if(!user.can.danhSach)

        user.can.danhSach={};









    if(!user.moi){


        user.moi={


            moithuong:10,


            moibac:0,


            moivang:0


        };


    }








    // =====================
    // FIX RƯƠNG
    // =====================


    if(!user.chest)

        user.chest={};








    // =====================
    // FIX CHÌA KHÓA
    // =====================


    if(!user.keys)

        user.keys={};








    // =====================
    // FIX PITY GACHA
    // =====================


    if(!user.pity)

        user.pity={};









    // =========================
    // CHUYỂN KHO CÁ CŨ
    // =========================


    if(user.khoCa){



        for(
            const name in user.khoCa
        ){



            const old =

            user.khoCa[name];





            if(!user.fish[name])

                user.fish[name]=[];








            if(
                old.count &&
                old.weight
            ){



                const avg =

                old.weight /

                old.count;








                for(
                    let i=0;
                    i<old.count;
                    i++
                ){



                    user.fish[name].push(

                        Number(
                            avg.toFixed(2)
                        )

                    );


                }



            }



        }







        delete user.khoCa;



        save();



    }








    return user;



}









module.exports={


    getUser,


    save,


    data


};
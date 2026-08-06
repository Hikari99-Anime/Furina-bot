const {
    getUser
} = require("../database");


module.exports={


name:"money",



async execute(message){


const user =
getUser(
message.guild.id,
message.author.id
);



message.reply(

`💰 Bạn có **${user.money.toLocaleString()} xu**`

);



}


};
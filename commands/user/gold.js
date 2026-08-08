const {
    getUser
} = require("../../data");


const {
    emoji
} = require("../../config");




module.exports = {

    name:"gold",

    aliases:["xu"],

    async execute(message){

        const user = getUser(message.author.id);

        return message.reply(
            `${message.author}, bạn hiện có ${user.money.toLocaleString("en-US")} ${emoji.money} trong tài khoản của mình.`
        );

    }

};

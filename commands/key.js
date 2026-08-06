const {
    EmbedBuilder
} = require("discord.js");


const {
    getUser
} = require("../database");


const {
    keys
} = require("../config");



module.exports = {


name:"key",


aliases:[
    "keys"
],



async execute(message){



const user = getUser(
message.guild.id,
message.author.id
);





let text="";






for(const id in user.keys){



const amount = user.keys[id];



if(amount <= 0)
continue;



const key = keys[id];



if(!key)
continue;






text +=

`${key.emoji} ${key.name} x${amount}\n`;



}







if(!text)

text="❌ Bạn chưa có chìa khóa";








const embed = new EmbedBuilder()

.setColor("#00aaff")

.setTitle("🔑 KHO CHÌA KHÓA")

.setDescription(text)

.setThumbnail(
message.client.user.displayAvatarURL({
size:1024
})
)

.setTimestamp();







message.reply({

embeds:[embed]

});



}



};
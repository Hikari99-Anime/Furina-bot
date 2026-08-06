const {
    EmbedBuilder
} = require("discord.js");


const {
    getUser
} = require("../database");


const {
    chests
} = require("../config");



module.exports = {


name:"chest",


aliases:[
    "ruong"
],



async execute(message){



const user = getUser(
    message.guild.id,
    message.author.id
);





let text="";





for(const id in user.chest){



const amount = user.chest[id];



if(amount <= 0)
continue;



const chest = chests[id];



if(!chest)
continue;





text +=

`${chest.emoji} ${chest.name} x${amount}\n`;



}






if(!text)

text="❌ Bạn chưa có rương nào";









const embed = new EmbedBuilder()

.setColor("#ffaa00")

.setTitle("🎁 KHO RƯƠNG")

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
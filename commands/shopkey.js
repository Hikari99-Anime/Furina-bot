const {
    EmbedBuilder
} = require("discord.js");


const {
    keys,
    emoji
} = require("../config");



module.exports = {


name:"shopkey",


aliases:[
    "sk"
],



async execute(message){



let text="";



for(const id in keys){


const key = keys[id];


text +=
`
${key.emoji} **${key.name}**

${emoji.money} ${key.price.toLocaleString()} xu

🛒 \`!buykey ${id}\`

`;

}




const embed = new EmbedBuilder()

.setColor("#ffaa00")

.setTitle("🔑 SHOP CHÌA KHÓA")

.setDescription(text)

.setThumbnail(
message.client.user.displayAvatarURL({
size:1024
})
)

.setTimestamp();





message.reply({

embeds:[
embed
]

});



}



};
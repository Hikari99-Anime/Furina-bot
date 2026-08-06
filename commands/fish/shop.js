const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");


const {
    emoji
} = require("../../config");




// ======================
// SHOP EMBED
// ======================


const firstEmbed = new EmbedBuilder()

.setColor("#f5b942")

.setTitle(
"╭・🛒 SHOP CÂU CÁ"
)


.setDescription(
`
╭・🌊 **Chào mừng ngư dân**

Nơi mua sắm trang bị cho hành trình chinh phục đại dương 🎣


╭・🎣 **Cần câu**

> Nâng cấp cần để câu được nhiều cá hơn


╭・🪱 **Mồi câu**

> Tăng cơ hội gặp cá hiếm


╭・🗝️ **Chìa khóa**

> Mở rương nhận phần thưởng


╭・💰 **Tiền tệ**

${emoji.money} Xu


╰・✨ Chọn danh mục bên dưới để xem vật phẩm
`
)


.setFooter({

text:"🎣 Fish System"

});







// ======================
// BUTTON
// ======================


const row = new ActionRowBuilder()

.addComponents(


new ButtonBuilder()

.setCustomId("shop_rod")

.setLabel("🎣 Cần câu")

.setStyle(ButtonStyle.Primary),




new ButtonBuilder()

.setCustomId("shop_bait")

.setLabel("🪱 Mồi câu")

.setStyle(ButtonStyle.Success),




new ButtonBuilder()

.setCustomId("shop_key")

.setLabel("🗝️ Chìa khóa")

.setStyle(ButtonStyle.Secondary)


);








// ======================
// COMMAND
// ======================


module.exports = {


name:"shop",



aliases:[

"cuahang",

"shopca"

],





async execute(message){



return message.reply({


embeds:[

firstEmbed

],


components:[

row

]


});



}



};
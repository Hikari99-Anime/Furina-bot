const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");


const {
    emoji
} = require("../../config");



module.exports = {


name:"shop",


aliases:[

"cuahang",
"shopca"

],



async execute(message){


const embed = new EmbedBuilder()

.setColor("#7DD3FC")

.setTitle(
"╭・🌊 FISHING MARKET"
)

.setDescription(
`
> Chào mừng ngư dân đến với đại dương ✨


╭・🎣 **Cần câu**
╰・Tăng sức mạnh câu cá


╭・🪱 **Mồi câu**
╰・Tăng cơ hội cá hiếm


╭・🗝️ **Chìa khóa**
╰・Mở rương kho báu


━━━━━━━━━━━━

📖 **Cách mua**

1️⃣ Chọn danh mục
2️⃣ Chọn vật phẩm
3️⃣ Nhập số lượng
4️⃣ Xác nhận mua


💰 Tiền:
${emoji.money} Fcoin
`
)

.setFooter({

text:
"✦ Ocean Adventure"

});



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



message.reply({

embeds:[embed],

components:[row]

});


}

};
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
// SHOP MAIN EMBED
// ======================

const firstEmbed = new EmbedBuilder()

.setColor("#f5b942")

.setTitle("╭・🛒 SHOP CÂU CÁ")

.setDescription(
`
╭・🌊 **Chào mừng ngư dân**

Nơi nâng cấp hành trình chinh phục đại dương 🎣


╭・🎣 Cần câu

> Tăng sức mạnh câu cá  
> Mở khóa những vùng biển mới


╭・🪱 Mồi câu

> Tăng tỷ lệ gặp cá hiếm  
> Hỗ trợ săn cá huyền thoại


╭・🗝️ Chìa khóa

> Mở rương bí ẩn  
> Nhận phần thưởng giá trị


╭・💰 Tiền tệ

${emoji.money} Xu


╰・✨ Chọn danh mục bên dưới để xem vật phẩm
`
)


.setFooter({

text:
"🎣 Fish System • Adventure"

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



module.exports = {

firstEmbed,

row

};
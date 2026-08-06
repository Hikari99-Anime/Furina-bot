const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");



module.exports = {


name:"help",


aliases:[
    "h"
],



async execute(message){



const pages=[



// =====================
// PAGE 1
// =====================

new EmbedBuilder()

.setColor("#00aaff")

.setTitle("📖 GENERAL USAGE")

.setDescription(`

🎣 **START**

\`!fish\`
Bắt đầu câu cá


💰 **DAILY**

\`!daily\`
Nhận xu mỗi 24 giờ


👤 **PROFILE**

\`!profile\`
Xem thông tin người chơi


🎒 **INVENTORY**

\`!bag\`
Xem túi đồ


🪙 **MONEY**

\`!balance\`
Xem số xu


`),





// =====================
// PAGE 2
// =====================


new EmbedBuilder()

.setColor("#00ff99")

.setTitle("🎣 FISHING")

.setDescription(`

🎣 **Câu cá**

\`!fish <mồi>\`

Ví dụ:

\`!fish moithuong\`


🪱 **Mồi**

\`!bait\`

Xem số mồi đang có


🎣 **Cần câu**

\`!rod\`

Xem cần đang dùng


⚙️ **Đổi cần**

\`!rod can_1\`

<<<<<<< HEAD
`),
=======


💵 **BÁN CÁ**

\`!sell <cá> <số lượng>\`

Ví dụ:

\`!sell caro 5\`



━━━━━━━━━━━━━━



🎁 **NHẬN DAILY**

\`!daily\`

Nhận xu mỗi ngày.



━━━━━━━━━━━━━━



🏆 **XẾP HẠNG**

\`!top money\`

Top giàu.


\`!top fish\`

Top nhiều cá.



━━━━━━━━━━━━━━



🃏 **XÌ DÁCH**

\`!xidach <số tiền>\`

Ví dụ:

\`!xidach 1000\`

Rút bài hoặc dừng, so điểm với nhà cái.



━━━━━━━━━━━━━━



🎲 **TÀI XỈU**

\`!taixiu\`

Mở ván cược. Bấm nút để chọn cửa rồi nhập tiền cược:

🔴 TÀI · 🔵 XỈU · ⚫ CHẴN · ⚪ LẺ (1:1)

🔢 CHỌN SỐ (đoán đúng tổng 3 xúc xắc, ăn cao hơn)

Có thể cược nhiều cửa cùng lúc.



━━━━━━━━━━━━━━



🎣 Chúc bạn câu được cá hiếm!

`

)

.setFooter({

text:
"Fishing Bot"

})

.setTimestamp();
>>>>>>> 418111c2b25b627f983d4cbb419a284e8a087174





// =====================
// PAGE 3
// =====================


new EmbedBuilder()

.setColor("#ffaa00")

.setTitle("🎒 INVENTORY")

.setDescription(`

🐟 **Kho cá**

\`!fishbag\`


🎁 **Kho rương**

\`!chest\`


🔑 **Kho chìa khóa**

\`!key\`


💰 **Bán cá**

\`!sell\`


`),







// =====================
// PAGE 4
// =====================


new EmbedBuilder()

.setColor("#ff55ff")

.setTitle("🛒 SHOP & GACHA")

.setDescription(`

🛒 **Shop**

\`!shop\`


🎣 **Mua cần**

\`!buy can_1\`


🪱 **Mua mồi**

\`!buy moithuong\`


🔑 **Shop chìa khóa**

\`!shopkey\`


🔑 **Mua chìa khóa**

\`!buykey key_1\`


🎁 **Mở rương**

\`!open chest_1\`


🎰 **Mở nhiều**

\`!open chest_1 10\`

`),







// =====================
// PAGE 5
// =====================


new EmbedBuilder()

.setColor("#ff0000")

.setTitle("ℹ️ INFORMATION")

.setDescription(`

📌 Prefix:

\`!\`


📖 Help:

\`!help\`


🐟 Fish RPG Bot


🎰 Gacha - Chest System


✨ Chúc bạn câu được cá hiếm!

`)


];







let page=0;





const row = new ActionRowBuilder()

.addComponents(


new ButtonBuilder()

.setCustomId("prev")

.setEmoji("⬅️")

.setStyle(ButtonStyle.Secondary),




new ButtonBuilder()

.setCustomId("next")

.setEmoji("➡️")

.setStyle(ButtonStyle.Secondary)



);









const msg = await message.reply({

embeds:[
pages[page]
],

components:[
row
]

});









const collector = msg.createMessageComponentCollector({

time:120000

});








collector.on("collect",async i=>{



if(i.user.id !== message.author.id)

return i.reply({

content:"❌ Không phải help của bạn",

ephemeral:true

});





if(i.customId==="next"){


page++;


if(page>=pages.length)

page=0;


}






if(i.customId==="prev"){


page--;


if(page<0)

page=pages.length-1;


}






await i.update({

embeds:[
pages[page]
],

components:[
row
]

});



});



}



};
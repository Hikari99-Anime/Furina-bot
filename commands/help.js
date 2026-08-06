const {
    EmbedBuilder
} = require("discord.js");



module.exports = {


name:"help",



async execute(message){



const embed =

new EmbedBuilder()

.setColor("#00ccff")

.setTitle("🎣 HƯỚNG DẪN BOT CÂU CÁ")

.setDescription(

`
🏪 **SHOP**

\`!shop\`

Xem cần câu và mồi đang bán.



━━━━━━━━━━━━━━



💰 **MUA ĐỒ**

\`!buy <id>\`

Ví dụ:

\`!buy can_1\`

\`!buy moithuong\`



━━━━━━━━━━━━━━



🎣 **TRANG BỊ CẦN**

\`!rod <id>\`

Ví dụ:

\`!rod can_1\`



━━━━━━━━━━━━━━



🐟 **CÂU CÁ**

\`!fish <mồi>\`

Ví dụ:

\`!fish moithuong\`



━━━━━━━━━━━━━━



🎒 **KHO ĐỒ**

\`!inv\`

Xem tiền, cần, mồi, cá.



━━━━━━━━━━━━━━



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





message.reply({

embeds:[embed]

});



}


};
const {
EmbedBuilder
}=require("discord.js");


module.exports={


name:"help",

aliases:["h","cmd"],



async execute(message){



const embed=new EmbedBuilder()

.setColor("#00aaff")

.setTitle("🎣 FISH BOT - COMMAND")

.setDescription(

`
🎣 **CÂU CÁ**

\`!fish [số lượng] [mồi]\`
→ Câu cá

\`!sell <cá> <sl>\`
→ Bán cá

\`!bag\`
→ Kho cá


🎒 **NGƯ DÂN**

\`!profile\`
→ Hồ sơ

\`!stats\`
→ Thống kê

\`!collection\`
→ Bộ sưu tập


🛒 **SHOP**

\`!shop\`
→ Cửa hàng

\`!buy <id> <sl>\`
→ Mua đồ


🎁 **RƯƠNG**

\`!chest\`
→ Xem rương

\`!open <rương>\`
→ Mở rương


🎣 **TRANG BỊ**

\`!rod\`
→ Xem cần câu


💰 **KHÁC**

\`!daily\`
→ Nhận quà mỗi ngày

\`!quest\`
→ Nhiệm vụ

\`!top\`
→ Bảng xếp hạng


📌 Ví dụ:

\`!fish 10 moivang\`

\`!buy can_2 1\`

`

)

.setFooter({

text:"Fish Bot"

})

.setTimestamp();



message.reply({

embeds:[embed]

});


}

};
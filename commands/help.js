const {EmbedBuilder}=require("discord.js");


module.exports={


name:"help",



async execute(message,args,client){



const embed=new EmbedBuilder()


.setColor("#00bfff")


.setTitle("📖 HƯỚNG DẪN CÂU CÁ")


.setThumbnail(

message.author.displayAvatarURL({

dynamic:true

})

)


.setDescription(

`

\`👤\` Người chơi:

${message.author}

🎣 **CÂU CÁ**

\`!cauca\` → Mở chọn loại mồi và số lần câu

🛒 **SHOP**

\`!shop\` → Xem vật phẩm bán
\`!buy <id>\` → Mua đồ

Ví dụ: \`!buy canruby\` | \`!buy moivang\`

🎣 **CẦN CÂU**

\`!trangbi <id>\` → Trang bị cần

Ví dụ: \`!trangbi canruby\`

🎒 **KHO ĐỒ**

\`!khodo\` → Xem cá, cần, mồi, tiền

💰 **BÁN CÁ**

\`!sell <tên cá>\` → Bán một loại cát
\`!sellall\` → Bán toàn bộ cá

🎁 **NHẬN TIỀN**

\`!daily\`
→ Nhận 10.000 xu mỗi ngày

━━━━━━━━━━━━━━

🤖 Bot:

${client.user.username}

`

)


.setFooter({

text:"Fishing Bot"

})


.setTimestamp();



message.channel.send({

embeds:[embed]

});



}



};
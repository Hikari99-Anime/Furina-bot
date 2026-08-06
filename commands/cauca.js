const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
}=require("discord.js");


const {
    getUser
}=require("../database");



module.exports={


name:"cauca",



async execute(message){



const user =
getUser(
message.guild.id,
message.author.id
);




// kiểm tra cần

if(
!user.can ||
!user.can.dangDung
){


return message.reply({

embeds:[

new EmbedBuilder()

.setColor("Red")

.setTitle("❌ CHƯA CÓ CẦN")

.setDescription(
`
Bạn chưa trang bị cần câu.

Ví dụ:

!buy canruby

!trangbi canruby
`
)

]

});


}





const rod =
user.can.dangDung;



const uses =
user.can.danhSach[rod] || 0;




if(uses<=0){


return message.reply({

content:
"❌ Cần câu đã hết lượt!"

});


}







const row =

new ActionRowBuilder()

.addComponents(


new ButtonBuilder()

.setCustomId(
"bait_moithuong"
)

.setLabel(
"🪱 Thường"
)

.setStyle(
ButtonStyle.Primary
),



new ButtonBuilder()

.setCustomId(
"bait_moibac"
)

.setLabel(
"✨ Bạc"
)

.setStyle(
ButtonStyle.Success
),



new ButtonBuilder()

.setCustomId(
"bait_moivang"
)

.setLabel(
"🌟 Vàng"
)

.setStyle(
ButtonStyle.Danger
)

);







const embed =

new EmbedBuilder()

.setColor("#00BFFF")

.setTitle("🎣 CÂU CÁ")

.setDescription(
`
🎣 Cần:
${rod}


🔋 Lượt:
${uses}


Chọn loại mồi để câu.
`
);



message.channel.send({

embeds:[
embed
],

components:[
row
]

});



}


};
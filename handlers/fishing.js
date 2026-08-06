const {
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
    EmbedBuilder
} = require("discord.js");


const {
    getUser,
    save
} = require("../database");



// =======================
// EMOJI CÁ
// =======================

const fishEmoji = {

    "🐟 Cá rô":
    "<:caro:ID_EMOJI_CARO>",


    "🐠 Cá chép":
    "<:cachep:ID_EMOJI_CACHEP>",


    "🦑 Mực":
    "<:muc:ID_EMOJI_MUC>",


    "🐡 Cá nóc":
    "<:canoc:ID_EMOJI_CANOC>",


    "🦈 Cá mập":
    "<:camap:ID_EMOJI_CAMAP>",


    "👑 Cá thần thoại":
    "<:thanthoai:ID_EMOJI_THANTHOAI>"

};




// =======================
// DANH SÁCH CÁ
// =======================

const fishList=[


{
    name:"🐟 Cá rô",
    rate:45,
    min:0.2,
    max:2
},


{
    name:"🐠 Cá chép",
    rate:30,
    min:1,
    max:10
},


{
    name:"🦑 Mực",
    rate:15,
    min:0.5,
    max:5
},


{
    name:"🐡 Cá nóc",
    rate:7,
    min:1,
    max:15
},


{
    name:"🦈 Cá mập",
    rate:2.8,
    min:20,
    max:200
},


{
    name:"👑 Cá thần thoại",
    rate:0.2,
    min:300,
    max:1000
}


];





module.exports = async function(interaction){



// =======================
// BUTTON CÂU
// =======================

if(interaction.isButton()){


    if(
        !interaction.customId.startsWith("bait_")
    )
    return;



    const bait =
    interaction.customId.replace(
        "bait_",
        ""
    );



    const modal =
    new ModalBuilder()

    .setCustomId(
        "fish_"+bait
    )

    .setTitle(
        "🎣 Nhập số lần câu"
    );



    const input =
    new TextInputBuilder()

    .setCustomId(
        "amount"
    )

    .setLabel(
        "Số lần câu (1-100)"
    )

    .setPlaceholder(
        "Ví dụ: 10"
    )

    .setStyle(
        TextInputStyle.Short
    )

    .setRequired(true);



    modal.addComponents(

        new ActionRowBuilder()
        .addComponents(input)

    );


    return interaction.showModal(modal);

}





// =======================
// XỬ LÝ CÂU CÁ
// =======================

if(interaction.isModalSubmit()){


if(
!interaction.customId.startsWith("fish_")
)
return;



const bait =
interaction.customId.replace(
"fish_",
""
);



const amount =
Number(
interaction.fields
.getTextInputValue("amount")
);



if(
!Number.isInteger(amount)
||
amount<=0
||
amount>100
){

return interaction.reply({

content:
"❌ Số lần câu từ 1-100",

flags:64

});

}



const user =
getUser(
interaction.guild.id,
interaction.user.id
);



if(!user.can.dangDung){

return interaction.reply({

content:
"❌ Chưa trang bị cần câu",

flags:64

});

}



if(
(user.can.danhSach[user.can.dangDung]||0)
< amount
){

return interaction.reply({

content:
"❌ Cần không đủ lượt",

flags:64

});

}



if(
(user.moi[bait]||0)
< amount
){

return interaction.reply({

content:
"❌ Không đủ mồi",

flags:64

});

}



user.can.danhSach[user.can.dangDung]
-=amount;


user.moi[bait]
-=amount;


save();




await interaction.reply({

embeds:[

new EmbedBuilder()

.setColor("Blue")

.setTitle(
"🎣 ĐANG CÂU CÁ"
)

.setDescription(`

🪱 Mồi:
\`${bait}\`

🎯 Số lần:
\`${amount}\`

⏳ Đợi:
\`10 giây\`

`)

]

});





setTimeout(async()=>{


let result={};

let miss=0;



for(
let i=0;
i<amount;
i++
){



if(
Math.random()<0.05
){

miss++;

continue;

}



let rand =
Math.random()*100;


let total=0;

let caught;



for(
const fish of fishList
){


total+=fish.rate;


if(rand<=total){

caught=fish;

break;

}


}



if(!caught)
continue;



let weight =
Number(
(
Math.random()
*
(
caught.max-caught.min
)
+
caught.min
)
.toFixed(2)
);



if(!result[caught.name])

result[caught.name]=[];



result[caught.name]
.push(weight);



}




if(!user.fish)

user.fish={};



let text="";



for(
const name in result
){



if(!user.fish[name])

user.fish[name]=[];



user.fish[name]
.push(
...result[name]
);



text +=
`${fishEmoji[name]} ${name} x${result[name].length}\n`;



}



save();





await interaction.editReply({

embeds:[

new EmbedBuilder()

.setColor("Green")

.setTitle(
"🎣 KẾT QUẢ CÂU CÁ"
)

.setDescription(`

🎯 Số lần: \`${amount}\
🐟 Cá bắt được: ${text || "❌ Không câu được cá"}
👢 Xịt: \`${miss}\`

✅ Đã lưu kho

`)
]
});
},10000);
}
};
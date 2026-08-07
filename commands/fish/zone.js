const {
    EmbedBuilder
} = require("discord.js");

const {
    fishingZones
} = require("../../config");


// ======================
// LẤY VÙNG HIỆN TẠI
// ======================

function getCurrentZone(){

    const now = new Date();


    // Chủ nhật mở núi lửa

    if(now.getDay() === 0){

        return fishingZones.volcano;

    }



    // Đổi vùng mỗi 6 tiếng

    const zones = [

        fishingZones.tropical,

        fishingZones.cold,

        fishingZones.swamp,

        fishingZones.deep

    ];



    const index =

    Math.floor(now.getHours() / 6);



    return zones[index % zones.length];

}



module.exports = {

    name:"zone",

    aliases:[

        "vung",

        "khu"

    ],



    async execute(message){


        const zone = getCurrentZone();



        const now = new Date();



        const nextHour =

        (Math.floor(now.getHours() / 6) + 1) * 6;



        const remain =

        nextHour - now.getHours();



        message.reply({

            embeds:[

                new EmbedBuilder()

                .setColor("#7ddcff")

                .setImage(zone.image)

                .setTitle(

                    "🌍 Khu vực câu cá hiện tại"

                )

                .setDescription(

`｡･:*˚:✧* ***Fishing Adventure*** *✧:˚*:･｡


🌊 Vùng:

${zone.name}


📖 Mô tả:

${zone.description}


🐟 Cá có thể câu:

${zone.fish.length} loại


⏰ Đổi vùng sau:

${remain} giờ


📅 Thời gian:

<t:${Math.floor(Date.now()/1000)}:R>


⋆｡˚ ✨ Chúc bạn câu may mắn ✨ ˚｡⋆`

                )

                .setFooter({

                    text:

                    "୨୧ ✦ Fishing Adventure • Ocean Diary ✦ ୨୧"

                })

                .setTimestamp()

            ]

        });


    }

};
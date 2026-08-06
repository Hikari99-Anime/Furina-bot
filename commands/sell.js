const {
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require("discord.js");


const {
    getUser
} = require("../database");



module.exports = {

    name: "sell",


    async execute(message){


        const user = getUser(
            message.guild.id,
            message.author.id
        );



        if(
            !user.fish ||
            Object.keys(user.fish).length === 0
        ){

            return message.reply({
                content:
                "❌ Kho cá đang trống!"
            });

        }




        const options = [];



        for(
            const fishName in user.fish
        ){


            const amount =
            user.fish[fishName].length;



            options.push({

                label:
                fishName.substring(0,100),

                description:
                `Đang có x${amount} con`,

                value:
                fishName.substring(0,100)

            });


        }




        const menu =

        new StringSelectMenuBuilder()

        .setCustomId(
            "sell_fish"
        )

        .setPlaceholder(
            "🐟 Chọn cá muốn bán"
        )

        .addOptions(
            options.slice(0,25)
        );





        const row =

        new ActionRowBuilder()

        .addComponents(
            menu
        );






        const totalFish = Object.values(user.fish)
        .reduce(
            (sum, fish)=>
            sum + fish.length,
            0
        );






        const embed =

        new EmbedBuilder()

        .setColor("Gold")

        .setTitle(
            "💰 BẢNG BÁN CÁ"
        )

        .setDescription(
`
👤 Người bán:
${message.author}


🐟 Tổng số cá:
${totalFish} con


⚖️ Hệ thống:
Cá có cân nặng riêng từng con


📌 Cách bán:

1️⃣ Chọn loại cá

2️⃣ Nhập số lượng

3️⃣ Cá nặng nhất sẽ được bán trước


⚠️ Lưu ý:

🦈 Cá mập
👑 Cá thần thoại

Hãy kiểm tra trước khi bán.
`
        )

        .setFooter({

            text:
            "Chọn cá bên dưới"

        })

        .setTimestamp();







        await message.channel.send({

            embeds:[
                embed
            ],

            components:[
                row
            ]

        });



    }

};
const { EmbedBuilder } = require("discord.js");
const { getUser } = require("../database");


module.exports = {

    name:"khodo",


    async execute(message){


        const user = getUser(
            message.guild.id,
            message.author.id
        );


        let fishText = "";


        for(const name in user.fish){


            const list = user.fish[name];


            if(
                !Array.isArray(list) ||
                list.length === 0
            )
            continue;



            fishText +=
`${name} x${list.length}\n`;

        }



        if(!fishText)
            fishText = "Không có cá\n";




        let canText =
        "Chưa có cần câu";


        if(
            user.can &&
            user.can.dangDung
        ){

            const uses =
            user.can.danhSach[user.can.dangDung] || 0;


            canText =
`🎣 ${user.can.dangDung} | ${uses} lượt`;

        }





        const moiText =
`
🪱 Mồi thường x${user.moi.moithuong || 0}

✨ Mồi bạc x${user.moi.moibac || 0}

🌟 Mồi vàng x${user.moi.moivang || 0}
`;





        const embed = new EmbedBuilder()

        .setColor("#00bfff")

        .setTitle(
            "🎒 KHO ĐỒ"
        )

        .setDescription(
`
👤 ${message.author}


🐟 **CÁ**
${fishText}
━━━━━━━━━━━━━━

🎣 **CẦN CÂU**: ${canText}

🪱 **MỒI**: ${moiText}

━━━━━━━━━━━━━━


💰 **TIỀN**: ${user.money.toLocaleString()} xu

${user.money.toLocaleString()} xu
`
        )

        .setThumbnail(
            message.author.displayAvatarURL()
        )

        .setTimestamp();



        message.channel.send({

            embeds:[
                embed
            ]

        });


    }

};
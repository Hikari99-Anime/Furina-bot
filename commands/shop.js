const { EmbedBuilder } = require("discord.js");

const { rods, baits, emoji } = require("../config");


module.exports = {

    name:"shop",

    async execute(message){


        let canText = "";
        let moiText = "";



        // CẦN CÂU

        for(const id in rods){

            const can = rods[id];

            canText +=
`
${can.emoji} **${can.name}**
💰 ${can.price.toLocaleString()} xu
🎣 ${can.uses} lượt
⭐ Luck: ${can.luck}
🛒 \`!buyrod ${id}\`

`;

        }




        // MỒI

        for(const id in baits){

            const bait = baits[id];

            moiText +=
`
${bait.emoji} **${bait.name}**
💰 ${bait.price.toLocaleString()} xu
🛒 \`!buybait ${id}\`

`;

        }




        const embed = new EmbedBuilder()

        .setColor("#ffaa00")

        .setTitle(
            `${emoji.shop} SHOP CÂU CÁ`
        )

        .setDescription(
`
${emoji.rod} **CẦN CÂU**

${canText}

━━━━━━━━━━━━━━

${emoji.bait} **MỒI CÂU**

${moiText}


📌 **Cách dùng**

\`!buyrod can_1\`

\`!rod can_1\`

\`!buybait moivang\`
`
        )

        .setThumbnail(
            message.client.user.displayAvatarURL()
        )

        .setTimestamp();



        message.reply({
            embeds:[embed]
        });


    }

};
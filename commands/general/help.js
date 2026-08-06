const {
    EmbedBuilder
} = require("discord.js");

module.exports = {

    name: "help",
    aliases: ["h", "menu"],

    async execute(message) {

        const embed = new EmbedBuilder()
            .setColor("#7cc7ff")
            .setTitle("🌊 Fishing Adventure")
            .setDescription(
`Chào mừng đến với hệ thống câu cá!

🎣 **Câu cá**
\`!fish\` • \`!rod\` • \`!upgrade\` • \`!repair\`

🛒 **Cửa hàng**
\`!shop\` • \`!buy\`

🎒 **Kho đồ**
\`!bag\` • \`!sell\`

🎁 **Hoạt động**
\`!daily\` • \`!quest\` • \`!open\`

👤 **Người chơi**
\`!profile\` • \`!top\`

💡 Dùng \`!shop\` để bắt đầu hành trình câu cá.
`)
            .setFooter({
                text: "Fishing Adventure • Version 1.0"
            });

        message.reply({
            embeds: [embed]
        });

    }

};
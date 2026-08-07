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
\`!fish [số lần]\` • \`!rod\` • \`!upgrade\` • \`!repair\`
Ví dụ: \`!fish 10\` (câu 10 lần, tốn 10 độ bền, cần càng vip câu càng nhanh)
Sửa cần (\`!repair\`) càng ít độ bền càng đắt, gãy hẳn thì rất đắt
Cường hóa (\`!upgrade\`) từ +5 thất bại có thể bị giảm cấp, từ +10 thất bại còn có thể gãy cần luôn — dùng vé bảo hiểm để tránh

🛒 **Cửa hàng**
\`!shop\` • \`!buy\`
Có bán cả vé bảo hiểm (bảo vệ cần khi cường hóa thất bại)

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
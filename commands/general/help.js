const {
    EmbedBuilder
} = require("discord.js");

const {
    prefix
} = require("../../config");

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
\`${prefix}fish [số lần]\` • \`${prefix}rod\` • \`${prefix}upgrade\` • \`${prefix}repair\`
Ví dụ: \`${prefix}fish 10\` (câu 10 lần, tốn 10 độ bền, cần càng vip câu càng nhanh)
Sửa cần (\`${prefix}repair\`) càng ít độ bền càng đắt, gãy hẳn thì rất đắt
Cường hóa (\`${prefix}upgrade\`) từ +5 thất bại có thể bị giảm cấp, từ +10 thất bại còn có thể gãy cần luôn — dùng vé bảo hiểm để tránh

🛒 **Cửa hàng**
\`${prefix}shop\` • \`${prefix}buy\`
Có bán cả vé bảo hiểm (bảo vệ cần khi cường hóa thất bại)

🎒 **Kho đồ**
\`${prefix}bag\` • \`${prefix}sell\`

🎁 **Hoạt động**
\`${prefix}daily\` • \`${prefix}quest\` • \`${prefix}open\`

👤 **Người chơi**
\`${prefix}profile\` • \`${prefix}top\` • \`${prefix}givemoney @user <số tiền>\`

💡 Dùng \`${prefix}shop\` để bắt đầu hành trình câu cá.
`)
            .setFooter({
                text: "Fishing Adventure • Version 1.0"
            });

        message.reply({
            embeds: [embed]
        });

    }

};
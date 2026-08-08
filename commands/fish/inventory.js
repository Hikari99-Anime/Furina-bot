const {
    EmbedBuilder
} = require("discord.js");

const {
    baits,
    keys,
    insurance,
    fishList,
    emoji,
    formatMoney
} = require("../../config");

const {
    getUser
} = require("../../data");

module.exports = {
    name: "inventory",

    aliases: [
        "inv",
        "kho"
    ],

    async execute(message) {

        const user =
            getUser(
                message.author.id
            );

        let bait = "";
        let key = "";

        for (const id in baits) {

            const x = baits[id];

            bait +=
                `${x.emoji} ${x.name} x${user.moi[id] || 0}\n`;
        }

        for (const id in keys) {

            const x = keys[id];

            key +=
                `${x.emoji} ${x.name} x${user.keys[id] || 0}\n`;
        }

        for (const id in insurance) {

            const x = insurance[id];

            key +=
                `${x.emoji} ${x.name} x${user.insurance || 0}\n`;
        }

        // ==========================================
        // CÁ
        // ==========================================

        let fishText = "";
        let fishValue = 0;

        for (const fish of fishList) {

            const list =
                user.fish[fish.id];

            if (!list || list.length === 0)
                continue;

            let weight = 0;

            for (const w of list)
                weight += w;

            const value =
                Math.floor(
                    weight * fish.sell
                );

            fishValue += value;

            // Chỉ hiện emoji + số lượng
            // Ví dụ: 🐟 x001
            fishText +=
                `${fish.emoji} x${String(list.length).padStart(3, "0")} | `;
        }

        // Xóa dấu | cuối cùng
        if (fishText) {
            fishText =
                fishText.slice(0, -3);
        }

        if (!fishText)
            fishText =
                "Chưa có cá nào";

        // ==========================================
        // EMBED USER
        // ==========================================

        const userEmbed =
            new EmbedBuilder()
                .setColor("#9b59ff")
                .setAuthor({
                    name: message.author.username,
                    iconURL:
                        message.author.displayAvatarURL({
                            dynamic: true,
                            size: 256
                        })
                });

        // ==========================================
        // EMBED KHO
        // ==========================================

        const inventoryEmbed =
            new EmbedBuilder()
                .setColor("#9b59ff")
                .setTitle(
                    "╭・🎒 KHO ĐỒ"
                )
                .setDescription(
                    `╭・🐟 CÁ
${fishText}

╭・💰 GIÁ TRỊ CÁ
${formatMoney(fishValue)} ${emoji.money}

╭・🪱 MỒI
${bait}

╭・🎟️ CHÌA KHÓA & BẢO HIỂM
${key}

╰・🎣 Fish System`
                )
                .setFooter({
                    text: "Quản lý vật phẩm"
                });

        // ==========================================
        // GỬI 2 EMBED
        // ==========================================

        message.reply({
            embeds: [
                userEmbed,
                inventoryEmbed
            ]
        });
    }
};

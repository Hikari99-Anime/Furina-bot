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

        // ==========================================
        // MỒI
        // ==========================================

        let baitText = "";

        for (const id in baits) {

            const x =
                baits[id];

            const amount =
                user.moi?.[id] || 0;

            if (amount <= 0)
                continue;

            baitText +=
                `${x.emoji} ${x.name} x${amount}\n`;
        }

        if (!baitText)
            baitText = "Không có mồi";


        // ==========================================
        // CHÌA KHÓA
        // ==========================================

        let keyText = "";

        for (const id in keys) {

            const x =
                keys[id];

            const amount =
                user.keys?.[id] || 0;

            if (amount <= 0)
                continue;

            keyText +=
                `${x.emoji} ${x.name} x${amount}\n`;
        }

        if (!keyText)
            keyText = "Không có chìa khóa";


        // ==========================================
        // BẢO HIỂM
        // ==========================================

        let insuranceText = "";

        for (const id in insurance) {

            const x =
                insurance[id];

            const amount =
                user.insurance?.[id] || 0;

            if (amount <= 0)
                continue;

            insuranceText +=
                `${x.emoji} ${x.name} x${amount}\n`;
        }

        if (!insuranceText)
            insuranceText = "Không có bảo hiểm";


        // ==========================================
        // CÁ
        // ==========================================

        let fishText = "";
        let fishValue = 0;
        let fishCount = 0;

        for (const fish of fishList) {

            const list =
                user.fish?.[fish.id];

            if (
                !list ||
                list.length === 0
            )
                continue;

            let weight = 0;

            for (const w of list)
                weight += w;

            fishValue +=
                Math.floor(
                    weight * fish.sell
                );

            fishCount +=
                list.length;

            fishText +=
                `${fish.emoji} x${String(
                    list.length
                ).padStart(3, "0")} · `;

        }

        if (fishText) {

            fishText =
                fishText.slice(
                    0,
                    -3
                );

        } else {

            fishText =
                "Chưa có cá nào";

        }


        // ==========================================
        // EMBED
        // ==========================================

        const embed =
            new EmbedBuilder()

                .setColor("#9b59ff")

                .setAuthor({

                    name:
                        `${message.author.username} · Inventory`,

                    iconURL:
                        message.author.displayAvatarURL({
                            extension: "png",
                            size: 128
                        })

                })

                .setTitle(
                    "🎒 `INVENTORY`"
                )

                .setDescription(

                    `*Kho đồ hiện tại của bạn.*\n\n` +

                    `🐟 Cá\n` +
                    `${fishText}\n\n` +

                    `> 🐟 Số lượng cá: ${fishCount}\n` +
                    `> 💰 Giá trị cá: ${formatMoney(fishValue)} ${emoji.money}\n\n` +

                    `🪱 Mồi\n` +
                    `${baitText}\n\n` +

                    `🎟️ Chìa khóa\n` +
                    `${keyText}\n\n` +

                    `🛡️ Bảo hiểm\n` +
                    `${insuranceText}`

                )

                .setFooter({

                    text:
                        "✦ Fishing Adventure · Inventory"

                });

        message.reply({

            embeds: [
                embed
            ]

        });

    }

};
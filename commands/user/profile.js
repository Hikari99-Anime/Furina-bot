const {
    EmbedBuilder
} = require("discord.js");

const {
    rods,
    emoji,
    rodTitles,
    formatMoney
} = require("../../config");

const {
    getUser
} = require("../../data");

module.exports = {
    name: "profile",

    aliases: [
        "pf",
        "me"
    ],

    async execute(message) {

        const user =
            getUser(
                message.author.id
            );

        // ======================
        // CẦN HIỆN TẠI
        // ======================

        let rodText =
            "Chưa trang bị";

        const rodId =
            user.can?.dangDung;

        if (rodId) {

            const base =
                rods[rodId];

            const rod =
                user.rodData?.[rodId];

            if (base && rod) {

                const title =
                    rodTitles[rod.level]
                        ? ` · ${rodTitles[rod.level]}`
                        : "";

                rodText =
                    `${base.emoji} ${base.name} +${rod.level}${title} ` +
                    `· 🍀 ${rod.luck} · 🛠️ ${rod.uses}/${rod.maxUses}`;
            }
        }

        // ======================
        // ĐẾM CÁ
        // ======================

        let totalFish = 0;

        for (const id in user.fish || []) {

            totalFish +=
                user.fish[id]?.length || 0;
        }

        // ======================
        // EMBED
        // ======================

        const embed =
            new EmbedBuilder()
                .setColor("#89ddff")
                .setTitle(
                    `╭・👤 Hồ sơ ${message.author.username}`
                )
                .setThumbnail(
                    message.author.displayAvatarURL({
                        dynamic: true,
                        size: 256
                    })
                )
                .setDescription(
                    `💰 Tài sản: ${formatMoney(user.money)} ${emoji.money}\n\n` +

                    `🎣 Cần đang dùng\n` +
                    `${rodText}\n\n` +

                    `🐟 Cá đã bắt: ${totalFish}\n` +

                    `🎒 Mồi: ` +
                    `🪱 ${user.moi?.moithuong || 0} · ` +
                    `🦐 ${user.moi?.moibac || 0} · ` +
                    `✨ ${user.moi?.moivang || 0}`
                )
                .setFooter({
                    text: "✦ Fishing Adventure"
                });

        return message.reply({
            embeds: [
                embed
            ]
        });
    }
};

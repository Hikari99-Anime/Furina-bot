const {
    EmbedBuilder
} = require("discord.js");

const {
    rods,
    baits,
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
        "me",
        "info"
    ],

    async execute(message) {

        // ======================================================
        // USER
        // ======================================================

        const target =
            message.mentions.users.first() ||
            message.author;

        const user =
            getUser(target.id);

        if (!user) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor("#EF4444")

                        .setTitle(
                            "୨୧ ───────── ୨୧\n" +
                            "❌ KHÔNG TÌM THẤY\n" +
                            "୨୧ ───────── ୨୧"
                        )

                        .setDescription(
                            "Không tìm thấy dữ liệu người chơi này."
                        )

                        .setFooter({
                            text: "✦ Fishing Adventure"
                        })

                        .setTimestamp()

                ]

            });

        }

        // ======================================================
        // FIX DATA
        // ======================================================

        user.money =
            Number(user.money || 0);

        user.fish ??= {};
        user.moi ??= {};
        user.rodData ??= {};
        user.can ??= {};

        user.daily ??= {
            last: 0,
            streak: 0
        };

        // ======================================================
        // CẦN ĐANG DÙNG
        // ======================================================

        let rodText =
            "Chưa trang bị";

        let rodLevel = 0;
        let rodLuck = 0;
        let rodUses = 0;
        let rodMaxUses = 0;

        const rodId =
            user.can.dangDung;

        if (rodId) {

            const base =
                rods?.[rodId];

            const rod =
                user.rodData?.[rodId];

            if (base && rod) {

                rodLevel =
                    Number(rod.level || 0);

                rodLuck =
                    Number(rod.luck || 0);

                rodUses =
                    Number(rod.uses || 0);

                rodMaxUses =
                    Number(rod.maxUses || 0);

                const title =
                    rodTitles?.[rodLevel]
                        ? ` · ${rodTitles[rodLevel]}`
                        : "";

                rodText =
                    `${base.emoji || "🎣"} ${base.name} +${rodLevel}${title}\n` +
                    `🍀 May mắn: \`${rodLuck}\`\n` +
                    `🛠️ Độ bền: \`${rodUses}/${rodMaxUses}\``;

            }

        }

        // ======================================================
        // THỐNG KÊ CÁ
        // ======================================================

        let totalFish = 0;
        let totalWeight = 0;
        let biggestFish = 0;
        let fishSpecies = 0;

        for (const id in user.fish) {

            const fishList =
                user.fish[id];

            if (!Array.isArray(fishList)) {
                continue;
            }

            if (fishList.length > 0) {
                fishSpecies++;
            }

            totalFish +=
                fishList.length;

            for (const value of fishList) {

                const weight =
                    Number(value);

                if (
                    Number.isFinite(weight) &&
                    weight > 0
                ) {

                    totalWeight += weight;

                    if (
                        weight >
                        biggestFish
                    ) {

                        biggestFish =
                            weight;

                    }

                }

            }

        }

        // ======================================================
        // DAILY
        // ======================================================

        const dailyStreak =
            Number(
                user.daily?.streak || 0
            );

        // ======================================================
        // TỔNG MỒI
        // ======================================================

        let totalBait = 0;

        for (const id in user.moi) {

            totalBait +=
                Number(
                    user.moi[id] || 0
                );

        }

        // ======================================================
        // HIỂN THỊ MỒI
        // ======================================================

        const baitText =
            Object.keys(baits || {})
                .map(id => {

                    const bait =
                        baits[id];

                    const amount =
                        Number(
                            user.moi?.[id] || 0
                        );

                    return (
                        `${bait?.emoji || "🪱"} ${amount}`
                    );

                })
                .join(" · ") ||
            "Chưa có mồi";

        // ======================================================
        // ĐỘ BỀN
        // ======================================================

        let durabilityBar =
            "Chưa trang bị";

        let rodStatus =
            "⚪ Chưa trang bị";

        if (
            rodMaxUses > 0
        ) {

            const percent =
                Math.max(
                    0,
                    Math.min(
                        100,
                        Math.floor(
                            (rodUses /
                                rodMaxUses) *
                            100
                        )
                    )
                );

            const filled =
                Math.round(
                    percent / 10
                );

            durabilityBar =
                "▰".repeat(filled) +
                "▱".repeat(10 - filled) +
                ` ${percent}%`;

            if (rodUses <= 0) {

                rodStatus =
                    "🔴 Cần đã gãy";

            } else if (
                percent <= 20
            ) {

                rodStatus =
                    "🟠 Độ bền thấp";

            } else if (
                percent <= 50
            ) {

                rodStatus =
                    "🟡 Độ bền trung bình";

            } else {

                rodStatus =
                    "🟢 Độ bền tốt";

            }

        }

        // ======================================================
        // DANH HIỆU NGƯ DÂN
        // ======================================================

        let fishermanTitle =
            "🎣 Tân Ngư Dân";

        if (totalFish >= 1000) {

            fishermanTitle =
                "👑 Ngư Vương";

        } else if (totalFish >= 500) {

            fishermanTitle =
                "🏆 Cao Thủ Câu Cá";

        } else if (totalFish >= 100) {

            fishermanTitle =
                "🎣 Ngư Dân Chuyên Nghiệp";

        } else if (totalFish >= 25) {

            fishermanTitle =
                "🐟 Ngư Dân Tập Sự";

        }

        // ======================================================
        // DANH HIỆU CƯỜNG HÓA
        // ======================================================

        let upgradeTitle =
            "⚪ Chưa cường hóa";

        if (rodLevel >= 15) {

            upgradeTitle =
                "💎 Bậc Thầy Cường Hóa";

        } else if (rodLevel >= 10) {

            upgradeTitle =
                "🔥 Cường Hóa Cao Cấp";

        } else if (rodLevel >= 5) {

            upgradeTitle =
                "✨ Cường Hóa Khá";

        } else if (rodLevel > 0) {

            upgradeTitle =
                "🔨 Đã Cường Hóa";

        }

        // ======================================================
        // PROFILE EMBED
        // ======================================================

        const embed =
            new EmbedBuilder()

                .setColor("#89DDFF")

                .setTitle(
                    "୨୧ ───────── ୨୧\n" +
                    `👤 HỒ SƠ ${target.username}\n` +
                    "୨୧ ───────── ୨୧"
                )

                .setThumbnail(
                    target.displayAvatarURL({
                        dynamic: true,
                        size: 256
                    })
                )

                .setDescription(

                    `✦ ${fishermanTitle}\n\n` +

                    `💰 **TÀI SẢN**\n` +
                    `${formatMoney(user.money)} ${emoji.money}\n\n` +

                    `୨୧ ───────── ୨୧\n\n` +

                    `🎣 **CẦN ĐANG DÙNG**\n` +
                    `${rodText}\n\n` +
                    `${rodStatus}\n` +
                    `${durabilityBar}\n\n` +

                    `୨୧ ───────── ୨୧\n\n` +

                    `🐟 **THỐNG KÊ CÂU CÁ**\n` +
                    `🐟 Cá đã bắt: \`${totalFish.toLocaleString()}\` con\n` +
                    `📚 Loài đã bắt: \`${fishSpecies}\`\n` +
                    `⚖️ Tổng cân nặng: \`${totalWeight.toFixed(2)} KG\`\n` +
                    `🏋️ Cá lớn nhất: \`${biggestFish.toFixed(2)} KG\`\n\n` +

                    `୨୧ ───────── ୨୧\n\n` +

                    `🎁 **HOẠT ĐỘNG**\n` +
                    `🔥 Daily streak: \`${dailyStreak}\` ngày\n` +
                    `🪱 Tổng mồi: \`${totalBait.toLocaleString()}\`\n\n` +

                    `୨୧ ───────── ୨୧\n\n` +

                    `🏅 **THÀNH TÍCH**\n` +
                    `${fishermanTitle}\n` +
                    `${upgradeTitle}\n\n` +

                    `୨୧ ───────── ୨୧\n\n` +

                    `🪱 **MỒI ĐANG CÓ**\n` +
                    `${baitText}`

                )

                .setFooter({
                    text:
                        "✦ Fishing Adventure · Profile"
                })

                .setTimestamp();

        return message.reply({

            embeds: [
                embed
            ]

        });

    }

};
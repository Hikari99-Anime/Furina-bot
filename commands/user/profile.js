const {
    EmbedBuilder
} = require("discord.js");

const {
    rods,
    baits,
    emoji,
    rodTitles,
    formatMoney,
    fishList
} = require("../../config");

const {
    getUser
} = require("../../data");


// ======================================================
// PROFILE COMMAND
// ======================================================

module.exports = {

    name: "profile",

    aliases: [
        "pf",
        "me",
        "info"
    ],

    async execute(message) {

        // ==================================================
        // USER
        // ==================================================

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
                            text:
                                "✦ Fishing Adventure"
                        })

                        .setTimestamp()

                ]

            });

        }


        // ==================================================
        // FIX DATA
        // ==================================================

        user.money =
            Number(
                user.money || 0
            );

        user.fish ??= {};

        user.collection ??= {};

        user.moi ??= {};

        user.rodData ??= {};

        user.can ??= {};

        user.daily ??= {

            last: 0,

            streak: 0

        };


        // ==================================================
        // STATS LỊCH SỬ
        // ==================================================

        user.stats ??= {};


        user.stats.totalFishCaught =
            Number(
                user.stats.totalFishCaught || 0
            );


        user.stats.totalWeightCaught =
            Number(
                user.stats.totalWeightCaught || 0
            );


        user.stats.biggestFish =
            Number(
                user.stats.biggestFish || 0
            );


        // ==================================================
        // MIGRATE COLLECTION CŨ
        // ==================================================
        //
        // Nếu user chưa có collection,
        // lấy những loài hiện còn trong túi làm collection.
        //
        // Sau này bán cá:
        //
        // user.fish       -> bị xóa
        // user.collection -> KHÔNG bị xóa
        //
        // ==================================================

        for (
            const id in user.fish
        ) {

            const fishInventory =
                user.fish[id];


            if (
                !Array.isArray(
                    fishInventory
                )
            ) {

                continue;

            }


            if (
                fishInventory.length > 0
            ) {

                user.collection[id] = true;

            }

        }


        // ==================================================
        // STATS MIGRATION
        // ==================================================
        //
        // User cũ chưa có thống kê:
        // lấy số cá hiện còn trong túi làm dữ liệu ban đầu.
        //
        // Không thể khôi phục những con cá đã bán
        // trước khi hệ thống stats tồn tại.
        //
        // ==================================================

        if (
            user.stats.totalFishCaught <= 0
        ) {

            let oldTotalFish = 0;

            let oldTotalWeight = 0;

            let oldBiggestFish = 0;


            for (
                const id in user.fish
            ) {

                const fishInventory =
                    user.fish[id];


                if (
                    !Array.isArray(
                        fishInventory
                    )
                ) {

                    continue;

                }


                oldTotalFish +=
                    fishInventory.length;


                for (
                    const value
                    of fishInventory
                ) {

                    const weight =
                        Number(value);


                    if (
                        Number.isFinite(weight) &&
                        weight > 0
                    ) {

                        oldTotalWeight +=
                            weight;


                        if (
                            weight >
                            oldBiggestFish
                        ) {

                            oldBiggestFish =
                                weight;

                        }

                    }

                }

            }


            user.stats.totalFishCaught =
                oldTotalFish;


            user.stats.totalWeightCaught =
                oldTotalWeight;


            user.stats.biggestFish =
                oldBiggestFish;

        }


        // ==================================================
        // CẦN ĐANG DÙNG
        // ==================================================

        let rodText =
            "🎣 Chưa trang bị";

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


            if (
                base &&
                rod
            ) {

                rodLevel =
                    Number(
                        rod.level || 0
                    );


                rodLuck =
                    Number(
                        rod.luck || 0
                    );


                rodUses =
                    Number(
                        rod.uses || 0
                    );


                rodMaxUses =
                    Number(
                        rod.maxUses || 0
                    );


                const title =
                    rodTitles?.[rodLevel]
                        ? ` · ${rodTitles[rodLevel]}`
                        : "";


                rodText =
                    `${base.emoji || "🎣"} ${base.name} +${rodLevel}${title}`;

            }

        }


        // ==================================================
        // BỘ SƯU TẬP
        // ==================================================
        //
        // QUAN TRỌNG:
        //
        // Đếm từ user.collection
        // KHÔNG đếm từ user.fish.
        //
        // Vì vậy bán hết cá vẫn không mất loài.
        //
        // ==================================================

        let fishSpecies = 0;


        for (
            const id in user.collection
        ) {

            if (
                user.collection[id] === true
            ) {

                fishSpecies++;

            }

        }


        // ==================================================
        // GIỚI HẠN TỐI ĐA BỘ SƯU TẬP
        // ==================================================

        const totalFishTypes =
            Array.isArray(fishList)
                ? fishList.length
                : 150;


        // ==================================================
        // LỊCH SỬ CÂU CÁ
        // ==================================================

        const totalFish =
            Math.max(
                0,
                Math.floor(
                    Number(
                        user.stats.totalFishCaught
                    ) || 0
                )
            );


        const totalWeight =
            Math.max(
                0,
                Number(
                    user.stats.totalWeightCaught
                ) || 0
            );


        const biggestFish =
            Math.max(
                0,
                Number(
                    user.stats.biggestFish
                ) || 0
            );


        // ==================================================
        // DAILY
        // ==================================================

        const dailyStreak =
            Number(
                user.daily?.streak || 0
            );


        // ==================================================
        // MỒI
        // ==================================================

        const baitText =
            Object.keys(
                baits || {}
            )
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


        // ==================================================
        // ĐỘ BỀN
        // ==================================================

        let durability =
            "Chưa trang bị";


        if (
            rodMaxUses > 0
        ) {

            const percent =
                Math.max(

                    0,

                    Math.min(

                        100,

                        Math.floor(

                            (
                                rodUses /
                                rodMaxUses
                            ) * 100

                        )

                    )

                );


            durability =
                `${percent}%`;

        }


        // ==================================================
        // DANH HIỆU NGƯ DÂN
        // ==================================================

        let fishermanTitle =
            "🎣 Tân Ngư Dân";


        if (
            totalFish >= 1000
        ) {

            fishermanTitle =
                "👑 Ngư Vương";

        }

        else if (
            totalFish >= 500
        ) {

            fishermanTitle =
                "🏆 Cao Thủ Câu Cá";

        }

        else if (
            totalFish >= 100
        ) {

            fishermanTitle =
                "🎣 Ngư Dân Chuyên Nghiệp";

        }

        else if (
            totalFish >= 25
        ) {

            fishermanTitle =
                "🐟 Ngư Dân Tập Sự";

        }


        // ==================================================
        // COLLECTION TITLE
        // ==================================================

        let collectionTitle =
            "🗃️ Người mới khám phá";


        if (
            fishSpecies >= totalFishTypes
        ) {

            collectionTitle =
                "👑 Bậc thầy sưu tầm";

        }

        else if (
            fishSpecies >= 100
        ) {

            collectionTitle =
                "🏆 Nhà sưu tầm huyền thoại";

        }

        else if (
            fishSpecies >= 50
        ) {

            collectionTitle =
                "💎 Nhà sưu tầm chuyên nghiệp";

        }

        else if (
            fishSpecies >= 25
        ) {

            collectionTitle =
                "🐠 Nhà sưu tầm tập sự";

        }


        // ==================================================
        // COLLECTION PROGRESS
        // ==================================================

        const collectionPercent =
            totalFishTypes > 0

                ? Math.min(
                    100,
                    Math.floor(
                        (
                            fishSpecies /
                            totalFishTypes
                        ) * 100
                    )
                )

                : 0;


        // ==================================================
        // PROFILE EMBED
        // ==================================================

        const embed =
            new EmbedBuilder()

                .setColor(
                    "#89DDFF"
                )

                .setThumbnail(
                    target.displayAvatarURL({
                        dynamic: true,
                        size: 256
                    })
                )

                .setDescription(

                    `୨୧ ───────────── ୨୧\n` +

                    `👤 **HỒ SƠ ${target.username}**\n` +

                    `✦ ${fishermanTitle}\n` +

                    `✦ ${collectionTitle}\n\n` +

                    `💰 ${formatMoney(user.money)} ${emoji.money}\n\n` +

                    `🎣 ${rodText}\n` +

                    `🍀 Luck: ${rodLuck}  ·  🛠️ Độ bền: ${durability}\n\n` +

                    `🐟 **${totalFish.toLocaleString()}** cá đã câu\n` +

                    `📚 **${fishSpecies}/${totalFishTypes}** loài đã khám phá (${collectionPercent}%)\n\n` +

                    `⚖️ **${totalWeight.toFixed(2)} KG** tổng đã câu\n` +

                    `🏆 **${biggestFish.toFixed(2)} KG** kỷ lục lớn nhất\n\n` +

                    `🪱 ${baitText}\n\n` +

                    `🔥 Daily ${dailyStreak} ngày\n\n` +

                    `୨୧ ───────────── ୨୧`

                )

                .setFooter({

                    text:
                        "✦ Fishing Adventure · Profile"

                });


        // ==================================================
        // SEND
        // ==================================================

        return message.reply({

            embeds: [
                embed
            ]

        });

    }

};
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
        user.moi ??= {};
        user.rodData ??= {};
        user.can ??= {};

        user.daily ??= {

            last: 0,

            streak: 0

        };


        // ==================================================
        // STATS LỊCH SỬ CÂU CÁ
        // ==================================================
        //
        // QUAN TRỌNG:
        //
        // user.fish
        // = cá hiện đang còn trong túi
        //
        // user.stats
        // = thống kê từ trước tới nay
        //
        // Vì vậy bán hết cá cũng không làm mất
        // tổng số cá đã câu.
        //
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
        // MIGRATE DATA CŨ
        // ==================================================
        //
        // Nếu trước đây bot chưa có stats,
        // profile sẽ lấy dữ liệu cá đang còn trong túi
        // làm số liệu ban đầu.
        //
        // Chỉ chạy khi totalFishCaught = 0.
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
        // THỐNG KÊ CÁ HIỆN CÓ
        // ==================================================
        //
        // Chỉ dùng để đếm số loài hiện đang sở hữu.
        //
        // KHÔNG dùng để tính tổng cá đã câu.
        //
        // ==================================================

        let fishSpecies = 0;


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

                fishSpecies++;

            }

        }


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

                    `✦ ${fishermanTitle}\n\n` +

                    `💰 ${formatMoney(user.money)} ${emoji.money}\n` +

                    `🎣 ${rodText}  ·  🍀 ${rodLuck}  ·  🛠️ ${durability}\n\n` +

                    `🐟 **${totalFish.toLocaleString()}** cá đã câu  ·  📚 ${fishSpecies} loài đang có\n` +

                    `⚖️ **${totalWeight.toFixed(2)} KG** tổng đã câu\n` +

                    `🏆 **${biggestFish.toFixed(2)} KG** kỷ lục lớn nhất\n\n` +

                    `🪱 ${baitText}\n` +

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
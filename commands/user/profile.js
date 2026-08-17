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
    getUser,
    save
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

        let needSave = false;


        user.money =
            Number(
                user.money || 0
            );


        // --------------------------------------------------
        // INVENTORY
        // --------------------------------------------------

        if (
            !user.fish ||
            typeof user.fish !== "object"
        ) {

            user.fish = {};

            needSave = true;

        }


        // --------------------------------------------------
        // COLLECTION
        // --------------------------------------------------

        if (
            !user.collection ||
            typeof user.collection !== "object"
        ) {

            user.collection = {};

            needSave = true;

        }


        // --------------------------------------------------
        // OTHER DATA
        // --------------------------------------------------

        if (
            !user.moi ||
            typeof user.moi !== "object"
        ) {

            user.moi = {};

            needSave = true;

        }


        if (
            !user.rodData ||
            typeof user.rodData !== "object"
        ) {

            user.rodData = {};

            needSave = true;

        }


        if (
            !user.can ||
            typeof user.can !== "object"
        ) {

            user.can = {};

            needSave = true;

        }


        if (
            !user.daily ||
            typeof user.daily !== "object"
        ) {

            user.daily = {

                last: 0,
                streak: 0

            };

            needSave = true;

        }


        // ==================================================
        // STATS
        // ==================================================
        //
        // CỰC KỲ QUAN TRỌNG
        //
        // stats là lịch sử câu cá.
        //
        // user.fish
        // = cá hiện đang có trong túi
        //
        // user.stats
        // = tổng số cá đã từng câu
        //
        // Khi SELL:
        //
        // user.fish bị xóa
        //
        // nhưng:
        //
        // user.stats KHÔNG ĐƯỢC XÓA
        //
        // ==================================================

        if (
            !user.stats ||
            typeof user.stats !== "object"
        ) {

            user.stats = {};

            needSave = true;

        }


        const oldStatsExist =
            Object.prototype.hasOwnProperty.call(
                user.stats,
                "totalFishCaught"
            );


        if (!oldStatsExist) {

            user.stats.totalFishCaught = 0;

            needSave = true;

        }


        if (
            !Object.prototype.hasOwnProperty.call(
                user.stats,
                "totalWeightCaught"
            )
        ) {

            user.stats.totalWeightCaught = 0;

            needSave = true;

        }


        if (
            !Object.prototype.hasOwnProperty.call(
                user.stats,
                "biggestFish"
            )
        ) {

            user.stats.biggestFish = 0;

            needSave = true;

        }


        user.stats.totalFishCaught =
            Math.max(
                0,
                Math.floor(
                    Number(
                        user.stats.totalFishCaught
                    ) || 0
                )
            );


        user.stats.totalWeightCaught =
            Math.max(
                0,
                Number(
                    user.stats.totalWeightCaught
                ) || 0
            );


        user.stats.biggestFish =
            Math.max(
                0,
                Number(
                    user.stats.biggestFish
                ) || 0
            );


        // ==================================================
        // MIGRATE COLLECTION
        // ==================================================
        //
        // Nếu user cũ chưa có collection,
        // lấy những loài đang có trong túi làm collection.
        //
        // Sau khi đã có collection:
        //
        // SELL KHÔNG ĐƯỢC XÓA collection.
        //
        // ==================================================

        let collectionChanged = false;


        for (
            const fishId in user.fish
        ) {

            const fishes =
                user.fish[fishId];


            if (
                !Array.isArray(fishes)
            ) {

                continue;

            }


            if (
                fishes.length <= 0
            ) {

                continue;

            }


            if (
                user.collection[fishId] !== true
            ) {

                user.collection[fishId] = true;

                collectionChanged = true;

            }

        }


        if (
            collectionChanged
        ) {

            needSave = true;

        }


        // ==================================================
        // MIGRATE STATS CŨ
        // ==================================================
        //
        // CHỈ migrate khi user chưa từng có stats.
        //
        // Nếu stats đã tồn tại thì TUYỆT ĐỐI
        // không lấy user.fish để ghi đè.
        //
        // Điều này giúp:
        //
        // Câu 10 con
        // Sell 10 con
        // Profile vẫn hiện 10 con đã câu.
        //
        // ==================================================

        if (
            !oldStatsExist
        ) {

            let oldTotalFish = 0;

            let oldTotalWeight = 0;

            let oldBiggestFish = 0;


            for (
                const fishId in user.fish
            ) {

                const fishes =
                    user.fish[fishId];


                if (
                    !Array.isArray(fishes)
                ) {

                    continue;

                }


                oldTotalFish +=
                    fishes.length;


                for (
                    const weightValue of fishes
                ) {

                    const weight =
                        Number(
                            weightValue
                        );


                    if (
                        !Number.isFinite(weight) ||
                        weight <= 0
                    ) {

                        continue;

                    }


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


            user.stats.totalFishCaught =
                oldTotalFish;


            user.stats.totalWeightCaught =
                oldTotalWeight;


            user.stats.biggestFish =
                oldBiggestFish;


            needSave = true;

        }


        // ==================================================
        // SAVE DATA MIGRATION
        // ==================================================

        if (
            needSave
        ) {

            save();

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


        if (
            rodId
        ) {

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
        // KHÔNG đếm user.fish.
        //
        // Chỉ đếm user.collection.
        //
        // Vì vậy:
        //
        // Câu Cá Mập
        // collection["12"] = true
        //
        // Sell Cá Mập
        // fish["12"] = []
        //
        // collection["12"] vẫn = true
        //
        // Profile vẫn tính Cá Mập đã khám phá.
        //
        // ==================================================

        let fishSpecies = 0;


        for (
            const fishId in user.collection
        ) {

            if (
                user.collection[fishId] === true
            ) {

                fishSpecies++;

            }

        }


        // ==================================================
        // TỔNG SỐ LOÀI CÁ
        // ==================================================

        const totalFishTypes =
            Array.isArray(fishList)
                ? fishList.filter(
                    fish =>
                        fish &&
                        fish.isFish !== false
                ).length
                : 150;


        // ==================================================
        // LỊCH SỬ CÂU CÁ
        // ==================================================
        //
        // CHỈ ĐỌC stats.
        //
        // KHÔNG đọc user.fish.
        //
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
        // ĐỘ BỀN CẦN
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
        // DANH HIỆU SƯU TẦM
        // ==================================================

        let collectionTitle =
            "🗃️ Người mới khám phá";


        if (
            totalFishTypes > 0 &&
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

                    `🐟 Tổng đã câu: **${user.stats.totalFishCaught.toLocaleString()}**`+

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
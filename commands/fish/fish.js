const {
    EmbedBuilder
} = require("discord.js");

const {
    fishList,
    rods,
    baits,
    fishingZones,
    prefix
} = require("../../config");

const {
    getUser,
    save
} = require("../../data");


// ======================================================
// LẤY KHU VỰC HIỆN TẠI
// ======================================================

function getCurrentZone() {

    const now =
        new Date();

    if (
        now.getDay() === 0
    ) {

        return fishingZones.volcano;

    }

    const zones = [

        fishingZones.tropical,
        fishingZones.cold,
        fishingZones.swamp,
        fishingZones.deep

    ];

    const index =
        Math.floor(
            now.getHours() / 6
        );

    return zones[
        index % zones.length
    ];
}


// ======================================================
// MODULE
// ======================================================

module.exports = {

    name: "fish",

    aliases: [
        "f",
        "cau"
    ],

    async execute(message, args) {

        const user =
            getUser(
                message.author.id
            );


        // ==================================================
        // SỐ LẦN CÂU
        // ==================================================

        const MAX_AMOUNT = 50;

        let amount = 1;

        if (
            args?.[0] !== undefined
        ) {

            amount =
                Number(
                    args[0]
                );

            if (
                !Number.isInteger(amount) ||
                amount <= 0
            ) {

                return message.reply(
                    `╰・❌ Số lần câu không hợp lệ. Ví dụ: \`${prefix}fish 10\``
                );

            }

            if (
                amount > MAX_AMOUNT
            ) {

                return message.reply(
                    `╰・❌ Tối đa ${MAX_AMOUNT} lần/lượt`
                );

            }
        }


        // ==================================================
        // KHU VỰC
        // ==================================================

        const zone =
            getCurrentZone();


        // ==================================================
        // CẦN ĐANG DÙNG
        // ==================================================

        const rodID =
            user.can?.dangDung;

        if (!rodID) {

            return message.reply(
                "╰・❌ Bạn chưa trang bị cần câu"
            );

        }

        const baseRod =
            rods[rodID];

        const rod =
            user.rodData?.[rodID];

        if (
            !baseRod ||
            !rod
        ) {

            return message.reply(
                "╰・❌ Dữ liệu cần bị lỗi"
            );

        }

        rod.maxUses =
            rod.maxUses ||
            baseRod.uses ||
            1;


        // ==================================================
        // CẦN GÃY
        // ==================================================

        if (
            rod.destroyed ||
            rod.uses <= 0
        ) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor("#ff4d67")

                        .setTitle(
                            "💥 `ROD BROKEN`"
                        )

                        .setDescription(

                            `${baseRod.emoji} ${baseRod.name}\n\n` +

                            `> 🎯 Độ bền: 0/${rod.maxUses}\n` +
                            `> 🔧 Trạng thái: Đã gãy\n\n` +

                            `Cần câu đã hỏng hoàn toàn.\n` +
                            `💡 Hãy mua cần mới để tiếp tục câu cá.`

                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure"
                        })

                ]

            });

        }


        // ==================================================
        // KIỂM TRA ĐỘ BỀN
        // ==================================================

        if (
            rod.uses < amount
        ) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor("#ffd166")

                        .setTitle(
                            "🎣 `NOT ENOUGH DURABILITY`"
                        )

                        .setDescription(

                            `${baseRod.emoji} ${baseRod.name}\n\n` +

                            `> 🎯 Độ bền: ${rod.uses}/${rod.maxUses}\n` +
                            `> 🎣 Số lần câu: ${amount}\n\n` +

                            `💡 Cần ít nhất ${amount} độ bền để câu.`

                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure"
                        })

                ]

            });

        }


        // ==================================================
        // KIỂM TRA MỒI
        // ==================================================

        user.moi =
            user.moi || {};

        const totalBait =

            (user.moi.moithuong || 0) +
            (user.moi.moibac || 0) +
            (user.moi.moivang || 0);

        if (
            totalBait < amount
        ) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor("#ff6b81")

                        .setTitle(
                            "🪱 `NOT ENOUGH BAIT`"
                        )

                        .setDescription(

                            `Bạn không đủ mồi để câu.\n\n` +

                            `> 🪱 Cần dùng: ${amount}\n` +
                            `> 🪱 Hiện có: ${totalBait}\n\n` +

                            `💡 Hãy mua thêm mồi rồi thử lại.`

                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure"
                        })

                ]

            });

        }


        // ==================================================
        // THỜI GIAN CÂU
        // ==================================================

        const star =
            baseRod.star || 1;

        const perCatchMs =
            Math.max(
                200,
                1200 -
                star * 150
            );

        const totalMs =
            Math.min(
                amount * perCatchMs,
                30000
            );

        const etaSec =
            (totalMs / 1000)
                .toFixed(1);


        // ==================================================
        // THÔNG TIN CẦN
        // ==================================================

        const rodInfo =
            `${baseRod.emoji} ${baseRod.name} · +${rod.luck || 0} 🍀 · 🎯 ${rod.uses}/${rod.maxUses}`;


        // ==================================================
        // EMBED ĐANG CÂU
        // ==================================================

        const msg =
            await message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor("#7ddcff")

                        .setImage(
                            zone.image
                        )

                        .setTitle(
                            "🎣 `FISHING`"
                        )

                        .setDescription(

                            `${zone.name}\n` +
                            `${zone.description}\n\n` +

                            `> 🎣 Cần: ${rodInfo}\n` +
                            `> 🎯 Số lần câu: ${amount}\n` +
                            `> ⏳ Thời gian: ${etaSec} giây\n` +
                            `> 🪱 Mồi: ${amount}\n\n` +

                            `✦ *Đang chờ cá cắn câu...*`

                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure"
                        })

                ]

            });


        // ==================================================
        // CHỜ CÂU
        // ==================================================

        await new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    totalMs
                )
        );


        // ==================================================
        // LẤY CÁ TRONG KHU VỰC
        // ==================================================

        const zoneFish =
            fishList.filter(
                fish =>
                    zone.fish.includes(
                        fish.id
                    )
            );

        if (
            zoneFish.length === 0
        ) {

            return msg.edit({

                embeds: [

                    new EmbedBuilder()

                        .setColor("#ff6b81")

                        .setTitle(
                            "❌ `NO FISH`"
                        )

                        .setDescription(

                            `${zone.name}\n\n` +

                            `Khu vực này hiện không có cá để câu.`

                        )

                ]

            });

        }


        // ==================================================
        // LUCK
        // ==================================================

        const luckBonus =
            Math.max(
                0,
                (rod.level || 0) * 0.5
            );


        const caughtSummary = {};

        const baitUsed = {

            moithuong: 0,
            moibac: 0,
            moivang: 0

        };


        // ==================================================
        // CÂU CÁ
        // ==================================================

        for (
            let i = 0;
            i < amount;
            i++
        ) {

            let baitID =
                "moithuong";

            if (
                (user.moi.moivang || 0) > 0
            ) {

                baitID =
                    "moivang";

            } else if (
                (user.moi.moibac || 0) > 0
            ) {

                baitID =
                    "moibac";

            }


            if (
                (user.moi[baitID] || 0) <= 0
            ) {

                break;

            }


            user.moi[baitID]--;

            baitUsed[baitID]++;

            rod.uses--;


            // ==========================================
            // RANDOM CÁ
            // ==========================================

            let totalRate = 0;

            for (
                const fish of zoneFish
            ) {

                totalRate +=
                    fish.rate +
                    luckBonus;

            }


            let random =
                Math.random() *
                totalRate;

            let catchFish;


            for (
                const fish of zoneFish
            ) {

                random -=
                    fish.rate +
                    luckBonus;

                if (
                    random <= 0
                ) {

                    catchFish =
                        fish;

                    break;

                }

            }


            if (!catchFish)
                catchFish =
                    zoneFish[0];


            // ==========================================
            // CÂN NẶNG
            // ==========================================

            const weight =
                Number(

                    (
                        Math.random() *
                        (
                            catchFish.max -
                            catchFish.min
                        ) +
                        catchFish.min

                    ).toFixed(2)

                );


            user.fish =
                user.fish || {};


            if (
                !user.fish[
                    catchFish.id
                ]
            ) {

                user.fish[
                    catchFish.id
                ] = [];

            }


            user.fish[
                catchFish.id
            ].push(weight);


            // ==========================================
            // SUMMARY
            // ==========================================

            if (
                !caughtSummary[
                    catchFish.id
                ]
            ) {

                caughtSummary[
                    catchFish.id
                ] = {

                    fish:
                        catchFish,

                    count:
                        0,

                    weight:
                        0

                };

            }


            caughtSummary[
                catchFish.id
            ].count++;

            caughtSummary[
                catchFish.id
            ].weight +=
                weight;

        }


        // ==================================================
        // CẦN HẾT ĐỘ BỀN
        // ==================================================

        if (
            rod.uses <= 0
        ) {

            rod.uses =
                0;

            rod.destroyed =
                true;

        }


        save();


        // ==================================================
        // KẾT QUẢ
        // ==================================================

        const summaryList =
            Object.values(
                caughtSummary
            ).sort(
                (a, b) =>
                    b.count -
                    a.count
            );


        const catchText =
            summaryList
                .map(
                    item =>
                        `${item.fish.emoji} ${item.fish.name} x${item.count} · ⚖️ ${item.weight.toFixed(2)} KG`
                )
                .join("\n") ||
            "Không câu được gì";


        const totalWeight =
            summaryList.reduce(
                (sum, item) =>
                    sum + item.weight,
                0
            );


        const baitText =
            Object.keys(
                baitUsed
            )
                .filter(
                    id =>
                        baitUsed[id] > 0
                )
                .map(
                    id =>
                        `${baits[id].emoji} x${baitUsed[id]}`
                )
                .join(" · ") ||
            "-";


        // ==================================================
        // EMBED KẾT QUẢ
        // ==================================================

        await msg.edit({

            embeds: [

                new EmbedBuilder()

                    .setColor("#A0E7E5")

                    .setImage(
                        zone.image
                    )

                    .setTitle(
                        "🎣 `FISHING COMPLETE`"
                    )

                    .setDescription(

                        `${zone.name}\n\n` +

                        `🐟 Chiến lợi phẩm\n` +
                        `${catchText}\n\n` +

                        `> ⚖️ Tổng cân nặng: ${totalWeight.toFixed(2)} KG\n` +
                        `> 🪱 Mồi đã dùng: ${baitText}\n` +
                        `> 🎣 Cần: ${rodInfo}\n\n` +

                        `✦ *Chúc bạn câu được cá hiếm.*`

                    )

                    .setFooter({
                        text:
                            "✦ Fishing Adventure · Ocean Diary"
                    })

                    .setTimestamp()

            ]

        });

    }

};
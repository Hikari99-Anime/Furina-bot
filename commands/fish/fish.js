const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const {
    fishList,
    rods,
    baits,
    fishingZones,
    fishingConfig,
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

    if (!fishingZones) {
        return null;
    }

    const now = new Date();

    // Chủ nhật -> Núi Lửa
    if (
        now.getDay() === 0 &&
        fishingZones.volcano
    ) {
        return fishingZones.volcano;
    }

    const zones = [
        fishingZones.tropical,
        fishingZones.cold,
        fishingZones.swamp,
        fishingZones.deep
    ].filter(Boolean);

    if (!zones.length) {
        return null;
    }

    // 00-05  -> Tropical
    // 06-11  -> Cold
    // 12-17  -> Swamp
    // 18-23  -> Deep

    const index =
        Math.floor(
            now.getHours() / 6
        );

    return zones[
        index % zones.length
    ];
}

// ======================================================
// LÀM TRÒN SỐ
// ======================================================

function roundNumber(
    value,
    decimals = 2
) {

    const number =
        Number(value);

    if (
        !Number.isFinite(number)
    ) {
        return 0;
    }

    return Number(
        number.toFixed(decimals)
    );
}

// ======================================================
// FORMAT LUCK
// ======================================================

function formatLuck(value) {

    const luck =
        Math.max(
            0,
            Number(value) || 0
        );

    return roundNumber(
        luck,
        2
    );
}

// ======================================================
// FORMAT CẦN
// ======================================================

function formatRod(
    baseRod,
    rod
) {

    const level =
        Number(
            rod.level || 0
        );

    const luck =
        formatLuck(
            rod.luck ??
            baseRod.luck ??
            0
        );

    const uses =
        Math.max(
            0,
            Number(
                rod.uses ?? 0
            )
        );

    const maxUses =
        Math.max(
            1,
            Number(
                baseRod.uses
            ) || 1
        );

    return (
        `${baseRod.emoji || "🎣"} ${baseRod.name} ` +
        `\`+${level}\` · ` +
        `🍀 Luck ${luck} · ` +
        `🎯 ${uses}/${maxUses}`
    );
}

// ======================================================
// RATE CÁ
// ======================================================

function getFishRate(
    fish
) {

    const rate =
        Number(
            fish.catchRate ??
            fish.rate ??
            0
        );

    return Math.max(
        0,
        rate
    );
}

// ======================================================
// CÂN NẶNG
// ======================================================

function getFishWeight(
    fish
) {

    const fishMin =
        Number(
            fish.min
        );

    const fishMax =
        Number(
            fish.max
        );

    // Cá có cân riêng
    if (
        Number.isFinite(fishMin) &&
        Number.isFinite(fishMax) &&
        fishMax > fishMin
    ) {

        return Number(
            (
                Math.random() *
                (
                    fishMax -
                    fishMin
                ) +
                fishMin
            ).toFixed(2)
        );
    }

    // Cân mặc định
    const min =
        Number(
            fishingConfig?.minWeight
        ) || 0.5;

    const max =
        Number(
            fishingConfig?.maxWeight
        ) || 20;

    return Number(
        (
            Math.random() *
            (
                max -
                min
            ) +
            min
        ).toFixed(2)
    );
}

// ======================================================
// RARITY MULTIPLIER
// ======================================================

function getRarityMultiplier(
    fish,
    luck
) {

    const rarity =
        fish.rarity ||
        "common";

    const safeLuck =
        Math.max(
            0,
            Number(luck) || 0
        );

    switch (rarity) {

        case "rare":

            return (
                1 +
                safeLuck * 0.05
            );

        case "epic":

            return (
                1 +
                safeLuck * 0.08
            );

        case "legendary":

            return (
                1 +
                safeLuck * 0.12
            );

        case "mythical":

            return (
                1 +
                safeLuck * 0.18
            );

        default:

            return 1;
    }
}

// ======================================================
// CHỌN CÁ
// ======================================================

function randomFish(
    zoneFish,
    luck
) {

    const weightedFish =
        zoneFish
            .map(
                fish => {

                    const baseRate =
                        getFishRate(
                            fish
                        );

                    const rarityMultiplier =
                        getRarityMultiplier(
                            fish,
                            luck
                        );

                    return {

                        fish,

                        rate:
                            baseRate *
                            rarityMultiplier
                    };
                }
            )
            .filter(
                item =>
                    item.rate > 0
            );

    if (
        !weightedFish.length
    ) {
        return null;
    }

    let totalRate = 0;

    for (
        const item
        of weightedFish
    ) {

        totalRate +=
            item.rate;
    }

    let random =
        Math.random() *
        totalRate;

    for (
        const item
        of weightedFish
    ) {

        random -=
            item.rate;

        if (
            random <= 0
        ) {

            return item.fish;
        }
    }

    return (
        weightedFish[
            weightedFish.length - 1
        ].fish
    );
}

// ======================================================
// TÊN MỒI
// ======================================================

function getBaitName(
    baitID
) {

    const info =
        baits?.[baitID];

    if (!info)
        return "🪱 Mồi";

    return (
        `${info.emoji || "🪱"} ${info.name}`
    );
}

// ======================================================
// EMOJI MỒI
// ======================================================

function getBaitEmoji(
    baitID
) {

    return (
        baits?.[baitID]?.emoji ||
        "🪱"
    );
}

// ======================================================
// LẤY SỐ LƯỢNG MỒI
// ======================================================

function getBaitCount(
    user,
    baitID
) {

    return Math.max(
        0,
        Number(
            user.moi?.[baitID] || 0
        )
    );
}

// ======================================================
// TẠO NÚT CHỌN MỒI
// ======================================================

function createBaitButtons(
    user,
    ownerID
) {

    const row =
        new ActionRowBuilder();

    const baitIds =
        Object.keys(baits || {});

    for (
        const baitID of baitIds
    ) {

        const info =
            baits[baitID];

        const count =
            getBaitCount(
                user,
                baitID
            );

        row.addComponents(

            new ButtonBuilder()

                .setCustomId(
                    `fishbait_${ownerID}_${baitID}`
                )

                .setLabel(
                    `${info.name} (${count})`
                )

                .setEmoji(
                    info.emoji ||
                    "🪱"
                )

                .setStyle(
                    ButtonStyle.Primary
                )

                .setDisabled(
                    count <= 0
                )

        );

    }

    return row;
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

    async execute(
        message,
        args
    ) {

        // ==================================================
        // USER
        // ==================================================

        const user =
            getUser(
                message.author.id
            );

        if (!user) {

            return message.reply(
                "❌ Không tìm thấy dữ liệu người chơi."
            );
        }

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
                !Number.isInteger(
                    amount
                ) ||
                amount <= 0
            ) {

                return message.reply({

                    embeds: [

                        new EmbedBuilder()

                            .setColor(
                                "#ff6b81"
                            )

                            .setTitle(
                                "❌ `INVALID AMOUNT`"
                            )

                            .setDescription(
                                `Số lần câu không hợp lệ.\n\n` +
                                `Ví dụ: \`${prefix}fish 10\``
                            )

                            .setFooter({
                                text:
                                    "✦ Fishing Adventure"
                            })
                    ]
                });
            }

            if (
                amount > MAX_AMOUNT
            ) {

                return message.reply({

                    embeds: [

                        new EmbedBuilder()

                            .setColor(
                                "#ff6b81"
                            )

                            .setTitle(
                                "❌ `TOO MANY CASTS`"
                            )

                            .setDescription(
                                `Mỗi lượt chỉ được câu tối đa **${MAX_AMOUNT} lần**.`
                            )

                            .setFooter({
                                text:
                                    "✦ Fishing Adventure"
                            })
                    ]
                });
            }
        }

        // ==================================================
        // KHU VỰC
        // ==================================================

        const zone =
            getCurrentZone();

        if (!zone) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor(
                            "#ff6b81"
                        )

                        .setTitle(
                            "🌊 `NO FISHING ZONE`"
                        )

                        .setDescription(
                            "Hiện chưa có khu vực câu cá."
                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure"
                        })
                ]
            });
        }

        // ==================================================
        // CẦN ĐANG DÙNG
        // ==================================================

        const rodID =
            user.can?.dangDung;

        if (!rodID) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor(
                            "#ff6b81"
                        )

                        .setTitle(
                            "🎣 `NO ROD EQUIPPED`"
                        )

                        .setDescription(
                            `Bạn chưa trang bị cần câu.\n\n` +
                            `Dùng \`${prefix}rod\` để kiểm tra cần.`
                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure"
                        })
                ]
            });
        }

        // ==================================================
        // DATA CẦN
        // ==================================================

        const baseRod =
            rods?.[rodID];

        const rod =
            user.rodData?.[rodID];

        if (
            !baseRod ||
            !rod
        ) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor(
                            "#ff6b81"
                        )

                        .setTitle(
                            "❌ `ROD DATA ERROR`"
                        )

                        .setDescription(
                            "Dữ liệu cần câu không hợp lệ."
                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure"
                        })
                ]
            });
        }

        // ==================================================
        // CHUẨN HÓA CẦN
        // ==================================================

        rod.level =
            Number(
                rod.level || 0
            );

        rod.luck =
            formatLuck(
                rod.luck ??
                baseRod.luck ??
                0
            );

        // ==================================================
        // ĐỘ BỀN
        // ==================================================

        const configMaxUses =
            Math.max(
                1,
                Number(
                    baseRod.uses
                ) || 1
            );

        const oldMaxUses =
            Number(
                rod.maxUses
            ) || 0;

        let currentUses =
            Number(
                rod.uses
            );

        // DATA CŨ KHÔNG CÓ uses
        if (
            !Number.isFinite(
                currentUses
            )
        ) {

            currentUses =
                configMaxUses;
        }

        // MIGRATE DATA CŨ
        if (
            oldMaxUses > 0 &&
            oldMaxUses !== configMaxUses
        ) {

            if (
                currentUses >= oldMaxUses
            ) {

                currentUses =
                    configMaxUses;

            } else {

                currentUses =
                    Math.min(
                        currentUses,
                        configMaxUses
                    );
            }
        }

        rod.uses =
            Math.max(
                0,
                Math.min(
                    currentUses,
                    configMaxUses
                )
            );

        rod.maxUses =
            configMaxUses;

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

                        .setColor(
                            "#ff4d67"
                        )

                        .setTitle(
                            "💥 `ROD BROKEN`"
                        )

                        .setDescription(

                            `${formatRod(
                                baseRod,
                                {
                                    ...rod,
                                    uses: 0
                                }
                            )}\n\n` +

                            `🔧 Trạng thái: **Đã gãy**\n\n` +

                            `💡 Hãy sửa hoặc mua cần mới trước khi tiếp tục.`
                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure"
                        })
                ]
            });
        }

        // ==================================================
        // ĐỦ ĐỘ BỀN
        // ==================================================

        if (
            rod.uses < amount
        ) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor(
                            "#ffd166"
                        )

                        .setTitle(
                            "🎯 `NOT ENOUGH DURABILITY`"
                        )

                        .setDescription(

                            `${formatRod(
                                baseRod,
                                rod
                            )}\n\n` +

                            `🎣 Muốn câu: **${amount} lần**\n` +
                            `🎯 Độ bền: **${rod.uses}/${configMaxUses}**\n\n` +

                            `💡 Cần ít nhất **${amount}** độ bền.`
                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure"
                        })
                ]
            });
        }

        // ==================================================
        // MỒI
        // ==================================================

        user.moi =
            user.moi || {};

        const baitIds =
            Object.keys(baits || {});

        const baitCounts = {};

        let totalBait = 0;

        for (
            const id of baitIds
        ) {

            const count =
                getBaitCount(
                    user,
                    id
                );

            baitCounts[id] =
                count;

            totalBait +=
                count;
        }

        // ==================================================
        // KHÔNG CÓ MỒI
        // ==================================================

        if (
            totalBait <= 0
        ) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor(
                            "#ff6b81"
                        )

                        .setTitle(
                            "🪱 `NO BAIT`"
                        )

                        .setDescription(

                            `${formatRod(
                                baseRod,
                                rod
                            )}\n\n` +

                            `Bạn không còn mồi.\n\n` +

                            baitIds
                                .map(
                                    id =>
                                        `${getBaitEmoji(id)} ${baits[id].name}: **0**`
                                )
                                .join("\n") +

                            `\n\n💡 Hãy mua thêm mồi rồi thử lại.`
                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure"
                        })
                ]
            });
        }

        // ==================================================
        // CÁ CỦA KHU VỰC
        // ==================================================

        const zoneFish =
            fishList.filter(
                fish => {

                    if (
                        !Array.isArray(
                            zone.fish
                        )
                    ) {
                        return false;
                    }

                    return zone.fish.includes(
                        fish.id
                    );
                }
            );

        // ==================================================
        // KIỂM TRA ID CÁ
        // ==================================================

        if (
            zoneFish.length === 0
        ) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor(
                            "#ff6b81"
                        )

                        .setTitle(
                            "❌ `ZONE FISH ERROR`"
                        )

                        .setDescription(

                            `${zone.name}\n\n` +

                            `Khu vực đang có ID cá:\n` +

                            `\`${zone.fish?.join(
                                ", "
                            ) || "Không có"}\`\n\n` +

                            `Nhưng các ID này không tồn tại trong \`fishList\`.`
                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure"
                        })
                ]
            });
        }

        // ==================================================
        // CHỌN MỒI
        // ==================================================

        const ownerID =
            message.author.id;

        const baitSelectEmbed =
            new EmbedBuilder()

                .setColor(
                    "#7ddcff"
                )

                .setTitle(
                    "🪱 `CHỌN MỒI`"
                )

                .setDescription(

                    `${zone.name}\n\n` +

                    `${formatRod(
                        baseRod,
                        rod
                    )}\n\n` +

                    `🎣 Số lần câu: **${amount}**\n\n` +

                    baitIds
                        .map(
                            id =>
                                `${getBaitEmoji(id)} ${baits[id].name}: **${baitCounts[id]}**`
                        )
                        .join("\n") +

                    `\n\n👇 **Chọn loại mồi muốn sử dụng:**`
                )

                .setFooter({
                    text:
                        "✦ Fishing Adventure · Bấm nút để chọn mồi"
                });

        const baitMessage =
            await message.reply({

                embeds: [
                    baitSelectEmbed
                ],

                components: [
                    createBaitButtons(
                        user,
                        ownerID
                    )
                ]
            });

        // ==================================================
        // CHỜ BẤM NÚT
        // ==================================================

        let baitID = null;

        try {

            const interaction =
                await baitMessage.awaitMessageComponent({

                    filter:
                        buttonInteraction =>
                            buttonInteraction.user.id ===
                            ownerID &&
                            buttonInteraction.customId.startsWith(
                                `fishbait_${ownerID}_`
                            ),

                    time:
                        30000
                });

            baitID =
                interaction.customId
                    .split("_")
                    .pop();

            // ==================================================
            // KIỂM TRA MỒI SAU KHI BẤM
            // ==================================================

            const selectedBaitCount =
                getBaitCount(
                    user,
                    baitID
                );

            if (
                selectedBaitCount < amount
            ) {

                await interaction.update({

                    embeds: [

                        new EmbedBuilder()

                            .setColor(
                                "#ff6b81"
                            )

                            .setTitle(
                                "❌ `NOT ENOUGH BAIT`"
                            )

                            .setDescription(

                                `${getBaitName(
                                    baitID
                                )}\n\n` +

                                `🎣 Cần: **${amount}**\n` +
                                `🪱 Hiện có: **${selectedBaitCount}**\n\n` +

                                `💡 Bạn không đủ loại mồi này để câu ${amount} lần.`
                            )

                            .setFooter({
                                text:
                                    "✦ Fishing Adventure"
                            })
                    ],

                    components: []
                });

                return;
            }

            // ==================================================
            // UPDATE THÀNH ĐANG CÂU
            // ==================================================

            await interaction.update({

                embeds: [

                    new EmbedBuilder()

                        .setColor(
                            "#7ddcff"
                        )

                        .setTitle(
                            "🎣 `FISHING`"
                        )

                        .setDescription(

                            `${zone.name}\n` +
                            `${zone.description || ""}\n\n` +

                            `${formatRod(
                                baseRod,
                                rod
                            )}\n\n` +

                            `🎣 Số lần câu: **${amount}**\n` +
                            `🪱 Mồi sử dụng: **${getBaitName(
                                baitID
                            )}**\n` +
                            `🪱 Số lượng: **${selectedBaitCount}**\n\n` +

                            `✦ *Đang chuẩn bị câu...*`
                        )

                        .setImage(
                            zone.image || null
                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure"
                        })
                ],

                components: []
            });

        } catch (error) {

            // ==================================================
            // HẾT THỜI GIAN CHỌN MỒI
            // ==================================================

            return baitMessage.edit({

                embeds: [

                    new EmbedBuilder()

                        .setColor(
                            "#ffd166"
                        )

                        .setTitle(
                            "⏰ `BAIT SELECTION TIMEOUT`"
                        )

                        .setDescription(
                            `Bạn đã không chọn mồi trong **30 giây**.\n\n` +
                            `Hãy dùng lại \`${prefix}fish ${amount}\` để câu cá.`
                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure"
                        })
                ],

                components: []
            });
        }

        // ==================================================
        // THỜI GIAN CÂU
        // ==================================================

        const star =
            Math.max(
                1,
                Number(
                    baseRod.star || 1
                )
            );

        const perCatchMs =
            Math.max(
                200,
                1200 -
                star * 150
            );

        const totalMs =
            Math.min(
                amount *
                perCatchMs,
                30000
            );

        const etaSec =
            (
                totalMs / 1000
            ).toFixed(1);

        // ==================================================
        // UPDATE ĐANG CHỜ
        // ==================================================

        await baitMessage.edit({

            embeds: [

                new EmbedBuilder()

                    .setColor(
                        "#7ddcff"
                    )

                    .setTitle(
                        "🎣 `FISHING`"
                    )

                    .setDescription(

                        `${zone.name}\n` +
                        `${zone.description || ""}\n\n` +

                        `${formatRod(
                            baseRod,
                            rod
                        )}\n\n` +

                        `🎣 Số lần câu: **${amount}**\n` +
                        `⏳ Thời gian: **${etaSec} giây**\n` +
                        `🪱 Mồi: **${getBaitName(
                            baitID
                        )}**\n\n` +

                        `✦ *Đang chờ cá cắn câu...*`
                    )

                    .setImage(
                        zone.image || null
                    )

                    .setFooter({
                        text:
                            "✦ Fishing Adventure"
                    })
            ],

            components: []
        });

        // ==================================================
        // CHỜ
        // ==================================================

        await new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    totalMs
                )
        );

        // ==================================================
        // KIỂM TRA MỒI LẠI
        // ==================================================

        const finalBaitCount =
            getBaitCount(
                user,
                baitID
            );

        if (
            finalBaitCount < amount
        ) {

            return baitMessage.edit({

                embeds: [

                    new EmbedBuilder()

                        .setColor(
                            "#ff6b81"
                        )

                        .setTitle(
                            "❌ `BAIT ERROR`"
                        )

                        .setDescription(
                            `Không đủ ${getBaitName(
                                baitID
                            )} để hoàn thành lượt câu.`
                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure"
                        })
                ],

                components: []
            });
        }

        // ==================================================
        // LUCK
        // ==================================================

        const luck =
            formatLuck(
                rod.luck
            );

        // ==================================================
        // SUMMARY
        // ==================================================

        const caughtSummary = {};

        const baitUsed = {};

        for (
            const id of baitIds
        ) {

            baitUsed[id] = 0;
        }

        let actualCaught = 0;

        // ==================================================
        // CÂU CÁ
        // ==================================================

        for (
            let i = 0;
            i < amount;
            i++
        ) {

            // ==================================================
            // DÙNG ĐÚNG MỒI ĐÃ CHỌN
            // ==================================================

            if (
                Number(
                    user.moi[baitID] || 0
                ) <= 0
            ) {
                break;
            }

            // ==================================================
            // TRỪ MỒI
            // ==================================================

            user.moi[baitID]--;

            user.moi[baitID] =
                Math.max(
                    0,
                    user.moi[baitID]
                );

            baitUsed[baitID]++;

            // ==================================================
            // TRỪ ĐỘ BỀN
            // ==================================================

            rod.uses--;

            rod.uses =
                Math.max(
                    0,
                    rod.uses
                );

            // ==================================================
            // CHỌN CÁ
            // ==================================================

            const catchFish =
                randomFish(
                    zoneFish,
                    luck
                );

            if (!catchFish) {
                continue;
            }

            actualCaught++;

            // ==================================================
            // CÂN
            // ==================================================

            const weight =
                getFishWeight(
                    catchFish
                );

            // ==================================================
            // LƯU CÁ
            // ==================================================

            user.fish =
                user.fish || {};

            if (
                !Array.isArray(
                    user.fish[
                        catchFish.id
                    ]
                )
            ) {

                user.fish[
                    catchFish.id
                ] = [];
            }

            user.fish[
                catchFish.id
            ].push(
                weight
            );

            // ==================================================
            // SUMMARY
            // ==================================================

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
        // CẦN GÃY
        // ==================================================

        if (
            rod.uses <= 0
        ) {

            rod.uses =
                0;

            rod.destroyed =
                true;
        }

        // ==================================================
        // SAVE
        // ==================================================

        save();

        // ==================================================
        // TỔNG KẾT
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
                        `${item.fish.emoji || "🐟"} ${item.fish.name} x${item.count} · ⚖️ ${item.weight.toFixed(2)} KG`
                )
                .join("\n") ||
            "Không câu được gì";

        const totalWeight =
            summaryList.reduce(
                (
                    sum,
                    item
                ) =>
                    sum +
                    item.weight,
                0
            );

        // ==================================================
        // MỒI
        // ==================================================

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
                        `${getBaitEmoji(
                            id
                        )} x${baitUsed[id]}`
                )
                .join(" · ") ||
            "-";

        // ==================================================
        // TRẠNG THÁI
        // ==================================================

        const rodStatus =
            rod.destroyed ||
            rod.uses <= 0

                ? "💥 Đã gãy"

                : "✅ Sẵn sàng";

        // ==================================================
        // RESULT EMBED
        // ==================================================

        await baitMessage.edit({

            embeds: [

                new EmbedBuilder()

                    .setColor(
                        rod.destroyed
                            ? "#ff6b81"
                            : "#A0E7E5"
                    )

                    .setTitle(
                        "🎣 `FISHING COMPLETE`"
                    )

                    .setDescription(

                        `${zone.name}\n\n` +

                        `🐟 **Chiến lợi phẩm**\n` +
                        `${catchText}\n\n` +

                        `🎣 Số lần câu: **${actualCaught}/${amount}**\n` +

                        `⚖️ Tổng cân nặng: **${totalWeight.toFixed(2)} KG**\n` +

                        // CHỈ HIỆN 1 DÒNG MỒI
                        `🪱 Mồi đã dùng: ${baitText}\n\n` +

                        `${formatRod(
                            baseRod,
                            rod
                        )}\n` +

                        `🔧 Trạng thái: ${rodStatus}\n\n` +

                        (
                            rod.destroyed
                                ? `💥 **Cần đã hết độ bền!** Hãy sửa cần trước khi câu tiếp.\n\n`
                                : ""
                        ) +

                        `✦ *Chúc bạn câu được cá hiếm.*`
                    )

                    .setImage(
                        zone.image || null
                    )

                    .setFooter({
                        text:
                            "✦ Fishing Adventure · Ocean Diary"
                    })

                    .setTimestamp()

            ],

            components: []
        });
    }
};
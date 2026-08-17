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
// CONFIG
// ======================================================

const COLORS = {
    primary: "#9b59ff",
    info: "#7ddcff",
    success: "#A0E7E5",
    warning: "#ffd166",
    error: "#ff6b81",
    danger: "#ff4d67",
    legendary: "#f1c40f",
    mythical: "#e056fd"
};

const RARITY_ORDER = {
    common: 1,
    rare: 2,
    epic: 3,
    legendary: 4,
    mythical: 5
};

const fishingLocks = new Set();

const FOOTER = {
    text: "✦ Fishing Adventure · Fishing"
};

// ======================================================
// UTILS
// ======================================================

function num(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
}

function round(value, decimal = 2) {
    return Number(num(value).toFixed(decimal));
}

function luck(value) {
    return Math.max(0, round(value));
}

// ======================================================
// EMBED
// ======================================================

function createEmbed({
    message,
    color = COLORS.primary,
    title,
    description,
    image = null
}) {
    const embed = new EmbedBuilder()
        .setColor(color)
        .setAuthor({
            name: `${message.author.username} · Fishing`,
            iconURL: message.author.displayAvatarURL({
                extension: "png",
                size: 128
            })
        })
        .setTitle(`୨୧ ───────── ୨୧\n${title}`)
        .setDescription(description)
        .setFooter(FOOTER)
        .setTimestamp();

    if (image) {
        embed.setImage(image);
    }

    return embed;
}

// ======================================================
// ZONE
// ======================================================

function getCurrentZone() {
    if (!fishingZones) return null;

    const now = new Date();

    if (now.getDay() === 0 && fishingZones.volcano) {
        return fishingZones.volcano;
    }

    const zones = [
        fishingZones.tropical,
        fishingZones.cold,
        fishingZones.swamp,
        fishingZones.deep
    ].filter(Boolean);

    if (!zones.length) return null;

    return zones[
        Math.floor(now.getHours() / 6) % zones.length
    ];
}

// ======================================================
// ROD
// ======================================================

function formatRod(base, rod) {
    return (
        `${base.emoji || "🎣"} ${base.name} +${num(rod.level)} · ` +
        `🍀 ${luck(rod.luck ?? base.luck)}`
    );
}

function durabilityBar(current, max) {
    current = Math.max(0, num(current));
    max = Math.max(1, num(max, 1));

    const percent = Math.max(
        0,
        Math.min(100, current / max * 100)
    );

    const filled = Math.round(percent / 10);

    let emoji = "🟩";

    if (percent <= 50) emoji = "🟨";
    if (percent <= 25) emoji = "🟥";

    return (
        `${emoji.repeat(filled)}` +
        `${"⬛".repeat(10 - filled)} ` +
        `**${percent.toFixed(0)}%**`
    );
}

// ======================================================
// FISH
// ======================================================

function fishRate(fish) {
    return Math.max(
        0,
        num(fish.catchRate ?? fish.rate)
    );
}

function fishWeight(fish) {
    const min = num(fish.min);
    const max = num(fish.max);

    if (
        Number.isFinite(min) &&
        Number.isFinite(max) &&
        max > min
    ) {
        return round(
            Math.random() * (max - min) + min
        );
    }

    const fallbackMin =
        num(fishingConfig?.minWeight, 0.5);

    const fallbackMax =
        num(fishingConfig?.maxWeight, 20);

    return round(
        Math.random() *
        (fallbackMax - fallbackMin) +
        fallbackMin
    );
}

// ======================================================
// LUCK / RARITY
// ======================================================

function rarityMultiplier(fish, luckValue) {
    const rarity = String(
        fish.rarity || "common"
    ).toLowerCase();

    const multipliers = {
        rare: 0.05,
        epic: 0.08,
        legendary: 0.12,
        mythical: 0.18
    };

    return (
        1 +
        Math.max(0, num(luckValue)) *
        (multipliers[rarity] || 0)
    );
}

function randomFish(zoneFish, luckValue) {
    const weighted = zoneFish
        .map(fish => ({
            fish,
            rate:
                fishRate(fish) *
                rarityMultiplier(
                    fish,
                    luckValue
                )
        }))
        .filter(x => x.rate > 0);

    if (!weighted.length) return null;

    const total = weighted.reduce(
        (sum, x) => sum + x.rate,
        0
    );

    let random = Math.random() * total;

    for (const item of weighted) {
        random -= item.rate;

        if (random <= 0) {
            return item.fish;
        }
    }

    return weighted[weighted.length - 1].fish;
}

function rarityDisplay(fish) {
    const rarity = String(
        fish?.rarity || "common"
    ).toLowerCase();

    const map = {
        common: {
            name: "COMMON",
            emoji: "⚪",
            color: COLORS.success
        },
        rare: {
            name: "RARE",
            emoji: "🔵",
            color: COLORS.info
        },
        epic: {
            name: "EPIC",
            emoji: "🟣",
            color: COLORS.primary
        },
        legendary: {
            name: "LEGENDARY",
            emoji: "🌟",
            color: COLORS.legendary
        },
        mythical: {
            name: "MYTHICAL",
            emoji: "💜",
            color: COLORS.mythical
        }
    };

    return map[rarity] || map.common;
}

function bestRarity(list) {
    let best = null;
    let value = 0;

    for (const item of list) {
        const rarity = String(
            item.fish?.rarity || "common"
        ).toLowerCase();

        const current =
            RARITY_ORDER[rarity] || 1;

        if (current > value) {
            value = current;
            best = rarity;
        }
    }

    return best;
}

// ======================================================
// BAIT
// ======================================================

function baitName(id) {
    const bait = baits?.[id];

    return bait
        ? `${bait.emoji || "🪱"} ${bait.name}`
        : "🪱 Mồi";
}

function baitEmoji(id) {
    return baits?.[id]?.emoji || "🪱";
}

function baitCount(user, id) {
    return Math.max(
        0,
        num(user.moi?.[id])
    );
}

function createBaitButtons(user, ownerID) {
    const ids = Object.keys(baits || {});
    const rows = [];

    for (let i = 0; i < ids.length; i += 5) {
        const row = new ActionRowBuilder();

        for (const id of ids.slice(i, i + 5)) {
            const bait = baits[id];
            const count = baitCount(user, id);

            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(
                        `fishbait_${ownerID}_${id}`
                    )
                    .setLabel(
                        `${bait.name} (${count})`
                    )
                    .setEmoji(
                        bait.emoji || "🪱"
                    )
                    .setStyle(
                        count > 0
                            ? ButtonStyle.Primary
                            : ButtonStyle.Secondary
                    )
                    .setDisabled(count <= 0)
            );
        }

        rows.push(row);
    }

    return rows;
}

// ======================================================
// COLLECTION
// ======================================================

function saveCollection(user, fishID) {
    user.collection ??= {};
    user.collection[fishID] = true;
}

// ======================================================
// COUNTDOWN
// ======================================================

function countdownBar(remaining, total) {
    const percent = Math.max(
        0,
        Math.min(
            100,
            100 - remaining / total * 100
        )
    );

    const filled = Math.round(
        percent / 10
    );

    return (
        "🟦".repeat(filled) +
        "⬛".repeat(10 - filled)
    );
}

async function fishingCountdown({
    baitMessage,
    message,
    zone,
    amount,
    baitID,
    totalMs
}) {
    const start = Date.now();
    let lastSecond = -1;

    while (true) {
        const remaining = Math.max(
            0,
            totalMs - (Date.now() - start)
        );

        const second = Math.ceil(
            remaining / 1000
        );

        if (
            second !== lastSecond ||
            remaining <= 0
        ) {
            lastSecond = second;

            try {
                await baitMessage.edit({
                    embeds: [
                        createEmbed({
                            message,
                            color: COLORS.info,
                            title: "🎣 `ĐANG CÂU`",
                            description:
                                `🌊 **${zone.name}**\n\n` +
                                `${countdownBar(
                                    remaining,
                                    totalMs
                                )}\n` +
                                (
                                    remaining <= 0
                                        ? "🎣 **Cá đã cắn câu!**"
                                        : `⏳ **${(
                                            remaining / 1000
                                        ).toFixed(1)}s**`
                                ) +
                                `\n\n🎯 **${amount} lần câu** · ` +
                                `${baitName(baitID)}`
                        })
                    ],
                    components: []
                });
            } catch {}
        }

        if (remaining <= 0) break;

        await new Promise(resolve =>
            setTimeout(
                resolve,
                Math.min(500, remaining)
            )
        );
    }
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
        const userID = message.author.id;

        // ==================================================
        // ANTI SPAM
        // ==================================================

        if (fishingLocks.has(userID)) {
            try {
                const warning = await message.reply(
                    "⏳ Bạn đang câu cá, hãy đợi lượt hiện tại hoàn tất."
                );

                setTimeout(
                    () => warning.delete().catch(() => {}),
                    3000
                );
            } catch {}

            return;
        }

        fishingLocks.add(userID);

        try {
            // ==================================================
            // USER
            // ==================================================

            const user = getUser(userID);

            if (!user) {
                return message.reply({
                    embeds: [
                        createEmbed({
                            message,
                            color: COLORS.error,
                            title: "❌ `NO PLAYER DATA`",
                            description:
                                "Không thể tải dữ liệu người chơi."
                        })
                    ]
                });
            }

            user.moi ??= {};
            user.fish ??= {};
            user.can ??= {};
            user.rodData ??= {};
            user.collection ??= {};

            // ==================================================
            // AMOUNT
            // ==================================================

            const MAX_AMOUNT = 50;
            let amount = 1;

            if (args?.[0] !== undefined) {
                amount = Number(args[0]);

                if (
                    !Number.isInteger(amount) ||
                    amount <= 0
                ) {
                    return message.reply({
                        embeds: [
                            createEmbed({
                                message,
                                color: COLORS.error,
                                title: "❌ `SỐ LẦN CÂU KHÔNG HỢP LỆ`",
                                description:
                                    `Số lần câu phải là số nguyên dương.\n\n` +
                                    `💡 Ví dụ: \`${prefix}fish 10\``
                            })
                        ]
                    });
                }

                if (amount > MAX_AMOUNT) {
                    return message.reply({
                        embeds: [
                            createEmbed({
                                message,
                                color: COLORS.error,
                                title: "❌ `VƯỢT QUÁ GIỚI HẠN`",
                                description:
                                    `Mỗi lượt chỉ được câu tối đa **${MAX_AMOUNT} lần**.`
                            })
                        ]
                    });
                }
            }

            // ==================================================
            // ZONE
            // ==================================================

            const zone = getCurrentZone();

            if (!zone) {
                return message.reply({
                    embeds: [
                        createEmbed({
                            message,
                            color: COLORS.error,
                            title: "🌊 `KHÔNG CÓ KHU VỰC`",
                            description:
                                "Hiện chưa có khu vực câu cá khả dụng."
                        })
                    ]
                });
            }

            // ==================================================
            // ROD
            // ==================================================

            const rodID = user.can.dangDung;

            if (!rodID) {
                return message.reply({
                    embeds: [
                        createEmbed({
                            message,
                            color: COLORS.error,
                            title: "🎣 `CHƯA TRANG BỊ CẦN`",
                            description:
                                `Bạn chưa trang bị cần câu.\n\n` +
                                `💡 Dùng \`${prefix}rod\` để trang bị.`
                        })
                    ]
                });
            }

            const baseRod = rods?.[rodID];
            const rod = user.rodData?.[rodID];

            if (!baseRod || !rod) {
                return message.reply({
                    embeds: [
                        createEmbed({
                            message,
                            color: COLORS.error,
                            title: "❌ `DỮ LIỆU CẦN LỖI`",
                            description:
                                "Không tìm thấy dữ liệu cần câu."
                        })
                    ]
                });
            }

            // ==================================================
            // ROD DATA
            // ==================================================

            rod.level = num(rod.level);
            rod.luck = luck(
                rod.luck ?? baseRod.luck
            );

            const maxUses = Math.max(
                1,
                num(baseRod.uses, 1)
            );

            rod.uses = Number.isFinite(
                Number(rod.uses)
            )
                ? Math.max(
                    0,
                    Math.min(
                        num(rod.uses),
                        maxUses
                    )
                )
                : maxUses;

            rod.maxUses = maxUses;

            // ==================================================
            // BROKEN
            // ==================================================

            if (
                rod.destroyed ||
                rod.uses <= 0
            ) {
                return message.reply({
                    embeds: [
                        createEmbed({
                            message,
                            color: COLORS.danger,
                            title: "💥 `CẦN CÂU ĐÃ GÃY`",
                            description:
                                `🎣 **${formatRod(baseRod, rod)}**\n` +
                                `${durabilityBar(0, maxUses)}\n\n` +
                                `🔧 Trạng thái: **💥 Đã gãy**\n\n` +
                                `💡 Hãy sửa hoặc mua cần mới.`
                        })
                    ]
                });
            }

            // ==================================================
            // DURABILITY
            // ==================================================

            if (rod.uses < amount) {
                return message.reply({
                    embeds: [
                        createEmbed({
                            message,
                            color: COLORS.warning,
                            title: "🎯 `ĐỘ BỀN KHÔNG ĐỦ`",
                            description:
                                `🎣 **${formatRod(baseRod, rod)}**\n` +
                                `${durabilityBar(
                                    rod.uses,
                                    maxUses
                                )}\n\n` +
                                `🎣 Muốn câu: **${amount} lần**\n` +
                                `🛠️ Độ bền: **${rod.uses}/${maxUses}**`
                        })
                    ]
                });
            }

            // ==================================================
            // BAIT DATA
            // ==================================================

            const baitIDs = Object.keys(baits || {});

            let totalBait = 0;

            for (const id of baitIDs) {
                totalBait += baitCount(user, id);
            }

            if (totalBait <= 0) {
                const text = baitIDs
                    .map(
                        id =>
                            `${baitEmoji(id)} ${baits[id].name}: **0**`
                    )
                    .join("\n");

                return message.reply({
                    embeds: [
                        createEmbed({
                            message,
                            color: COLORS.error,
                            title: "🪱 `KHÔNG CÓ MỒI`",
                            description:
                                `🎣 **${formatRod(
                                    baseRod,
                                    rod
                                )}**\n` +
                                `${durabilityBar(
                                    rod.uses,
                                    maxUses
                                )}\n\n` +
                                `🪱 **MỒI HIỆN CÓ**\n${text}\n\n` +
                                `💡 Hãy mua thêm mồi rồi thử lại.`
                        })
                    ]
                });
            }

            // ==================================================
            // ZONE FISH
            // ==================================================

            const zoneFish = Array.isArray(fishList)
                ? fishList.filter(
                    fish =>
                        Array.isArray(zone.fish) &&
                        zone.fish.includes(fish.id)
                )
                : [];

            if (!zoneFish.length) {
                return message.reply({
                    embeds: [
                        createEmbed({
                            message,
                            color: COLORS.error,
                            title: "❌ `KHÔNG CÓ DỮ LIỆU CÁ`",
                            description:
                                `🌊 **${zone.name}**\n\n` +
                                "Không tìm thấy cá trong khu vực này."
                        })
                    ]
                });
            }

            // ==================================================
            // CHOOSE BAIT
            // ==================================================

            const ownerID = message.author.id;

            const baitText = baitIDs
                .map(
                    id =>
                        `${baitEmoji(id)} ${baits[id].name} x${baitCount(
                            user,
                            id
                        )}`
                )
                .join("\n");

            const baitMessage = await message.reply({
                embeds: [
                    createEmbed({
                        message,
                        color: COLORS.info,
                        title: "🪱 `CHỌN MỒI`",
                        description:
                            `🌊 **${zone.name}**\n` +
                            `${zone.description || "*Một vùng nước bí ẩn...*"}\n\n` +
                            `🎣 ${formatRod(baseRod, rod)}\n` +
                            `${durabilityBar(
                                rod.uses,
                                maxUses
                            )}\n\n` +
                            `🎯 Số lần câu: **${amount}**\n` +
                            `🍀 Luck: **${rod.luck}**\n\n` +
                            `🪱 **MỒI HIỆN CÓ**\n${baitText}\n\n` +
                            `👇 Chọn loại mồi:`,
                        image: zone.image
                    })
                ],
                components: createBaitButtons(
                    user,
                    ownerID
                )
            });

            // ==================================================
            // WAIT BAIT
            // ==================================================

            let baitID;

            try {
                const interaction =
                    await baitMessage.awaitMessageComponent({
                        filter: i =>
                            i.user.id === ownerID &&
                            i.customId.startsWith(
                                `fishbait_${ownerID}_`
                            ),
                        time: 30000
                    });

                baitID = interaction.customId
                    .split("_")
                    .pop();

                const count = baitCount(
                    user,
                    baitID
                );

                if (count < amount) {
                    await interaction.update({
                        embeds: [
                            createEmbed({
                                message,
                                color: COLORS.error,
                                title: "❌ `KHÔNG ĐỦ MỒI`",
                                description:
                                    `${baitName(baitID)}\n\n` +
                                    `🎣 Cần: **${amount}**\n` +
                                    `🪱 Hiện có: **${count}**`
                            })
                        ],
                        components: []
                    });

                    return;
                }

                await interaction.update({
                    embeds: [
                        createEmbed({
                            message,
                            color: COLORS.info,
                            title: "⚡ `CHUẨN BỊ CÂU`",
                            description:
                                `🌊 **${zone.name}**\n\n` +
                                `🎣 ${formatRod(
                                    baseRod,
                                    rod
                                )}\n` +
                                `🎯 **${amount} lần câu**\n` +
                                `🪱 ${baitName(
                                    baitID
                                )} x${amount}\n\n` +
                                `*Đang chuẩn bị...*`
                        })
                    ],
                    components: []
                });
            } catch {
                return baitMessage.edit({
                    embeds: [
                        createEmbed({
                            message,
                            color: COLORS.warning,
                            title: "⏰ `HẾT THỜI GIAN`",
                            description:
                                `Bạn không chọn mồi trong **30 giây**.\n\n` +
                                `💡 Dùng lại \`${prefix}fish ${amount}\`.`
                        })
                    ],
                    components: []
                });
            }

            // ==================================================
            // FISHING TIME
            // ==================================================

            const star = Math.max(
                1,
                num(baseRod.star, 1)
            );

            const perCatchMs = Math.max(
                200,
                1200 - star * 150
            );

            const totalMs = Math.min(
                amount * perCatchMs,
                30000
            );

            await fishingCountdown({
                baitMessage,
                message,
                zone,
                amount,
                baitID,
                totalMs
            });

            // ==================================================
            // FINAL BAIT CHECK
            // ==================================================

            if (
                baitCount(user, baitID) <
                amount
            ) {
                return baitMessage.edit({
                    embeds: [
                        createEmbed({
                            message,
                            color: COLORS.error,
                            title: "❌ `KHÔNG ĐỦ MỒI`",
                            description:
                                `Không đủ ${baitName(
                                    baitID
                                )} để hoàn thành lượt câu.`
                        })
                    ],
                    components: []
                });
            }

            // ==================================================
            // CATCH
            // ==================================================

            const caught = {};
            const baitUsed = {};

            let actualCaught = 0;

            for (let i = 0; i < amount; i++) {
                if (
                    baitCount(user, baitID) <= 0 ||
                    rod.uses <= 0
                ) {
                    break;
                }

                user.moi[baitID]--;
                baitUsed[baitID] =
                    (baitUsed[baitID] || 0) + 1;

                rod.uses = Math.max(
                    0,
                    rod.uses - 1
                );

                const fish = randomFish(
                    zoneFish,
                    rod.luck
                );

                if (!fish) continue;

                actualCaught++;

                const weight =
                    fishWeight(fish);

                user.fish[fish.id] ??= [];
                user.fish[fish.id].push(weight);

                saveCollection(
                    user,
                    fish.id
                );

                if (!caught[fish.id]) {
                    caught[fish.id] = {
                        fish,
                        count: 0,
                        weight: 0
                    };
                }

                caught[fish.id].count++;
                caught[fish.id].weight += weight;
            }

            // ==================================================
            // ROD
            // ==================================================

            if (rod.uses <= 0) {
                rod.uses = 0;
                rod.destroyed = true;
            }

            save();

            // ==================================================
            // SUMMARY
            // ==================================================

            const summary = Object.values(caught)
                .sort((a, b) => {
                    const rarityA =
                        RARITY_ORDER[
                            String(
                                a.fish?.rarity ||
                                "common"
                            ).toLowerCase()
                        ] || 1;

                    const rarityB =
                        RARITY_ORDER[
                            String(
                                b.fish?.rarity ||
                                "common"
                            ).toLowerCase()
                        ] || 1;

                    if (rarityA !== rarityB) {
                        return rarityB - rarityA;
                    }

                    if (a.count !== b.count) {
                        return b.count - a.count;
                    }

                    return b.weight - a.weight;
                });

            const catchText =
                summary
                    .map(item => {
                        const rarity =
                            rarityDisplay(
                                item.fish
                            );

                        const rarityText =
                            rarity.name === "COMMON"
                                ? ""
                                : ` · ${rarity.emoji} ${rarity.name}`;

                        return (
                            `${item.fish.emoji || "🐟"} ` +
                            `**${item.fish.name}** x${item.count} · ` +
                            `⚖️ ${item.weight.toFixed(2)} KG` +
                            rarityText
                        );
                    })
                    .join("\n") ||
                "*Không câu được gì.*";

            const totalWeight =
                summary.reduce(
                    (sum, item) =>
                        sum + item.weight,
                    0
                );

            const usedText =
                Object.keys(baitUsed)
                    .map(
                        id =>
                            `${baitEmoji(id)} x${baitUsed[id]}`
                    )
                    .join(" · ") || "-";

            const remaining =
                baitCount(
                    user,
                    baitID
                );

            const catchRate =
                amount > 0
                    ? (
                        actualCaught /
                        amount *
                        100
                    ).toFixed(0)
                    : "0";

            const best =
                bestRarity(summary);

            let resultColor =
                rod.destroyed
                    ? COLORS.danger
                    : COLORS.success;

            if (best === "legendary") {
                resultColor = COLORS.legendary;
            }

            if (best === "mythical") {
                resultColor = COLORS.mythical;
            }

            // ==================================================
            // RESULT
            // ==================================================

            return baitMessage.edit({
                embeds: [
                    createEmbed({
                        message,
                        color: resultColor,
                        title: "🎣 `FISHING COMPLETE`",
                        description:
                            `🌊 **${zone.name}**\n\n` +

                            `🐟 **CHIẾN LỢI PHẨM**\n` +
                            `${catchText}\n\n` +

                            `📊 **THỐNG KÊ**\n` +
                            `🎯 Thành công: **${actualCaught}/${amount}** · ` +
                            `📈 **${catchRate}%**\n` +
                            `⚖️ Tổng cân nặng: **${totalWeight.toFixed(
                                2
                            )} KG**\n` +
                            `🪱 Đã dùng: **${usedText}** · ` +
                            `Còn: **${remaining}**\n\n` +

                            `🎣 **CẦN CÂU**\n` +
                            `${formatRod(baseRod, rod)}\n` +
                            `${durabilityBar(
                                rod.uses,
                                maxUses
                            )}\n` +
                            `${rod.destroyed
                                ? "💥 Cần đã gãy"
                                : "🟢 Cần vẫn hoạt động"
                            }`
                    })
                ],
                components: []
            });
        }

        // ==================================================
        // ERROR
        // ==================================================

        catch (error) {
            console.error(
                "❌ FISH COMMAND ERROR:",
                error
            );

            try {
                await message.reply({
                    embeds: [
                        createEmbed({
                            message,
                            color: COLORS.error,
                            title: "❌ `FISHING ERROR`",
                            description:
                                "Đã xảy ra lỗi trong lúc câu cá.\n\n" +
                                "💡 Vui lòng thử lại sau."
                        })
                    ]
                });
            } catch {}
        }

        finally {
            fishingLocks.delete(userID);
        }
    }
};
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
// COLORS
// ======================================================

const COLORS = {
    primary: "#9b59ff",
    info: "#7ddcff",
    success: "#57f287",
    warning: "#ffd166",
    error: "#ff6b81",
    danger: "#ff4d67",

    common: "#95a5a6",
    uncommon: "#2ecc71",
    rare: "#3498db",
    epic: "#9b59b6",
    legendary: "#f1c40f",
    mythical: "#e056fd",
    celestial: "#7ddcff",
    divine: "#00ffff"
};

// ======================================================
// RARITY ORDER
// ======================================================

const RARITY_ORDER = {
    common: 1,
    uncommon: 2,
    rare: 3,
    epic: 4,
    legendary: 5,
    mythical: 6,
    celestial: 7,
    divine: 8
};

// ======================================================
// RARITY MAP
// ======================================================

const RARITY_MAP = {
    common: {
        name: "COMMON",
        emoji: "<:Common:1539120229630738472>",
        color: COLORS.common
    },

    uncommon: {
        name: "UNCOMMON",
        emoji: "<:Uncommon:1539120225331576832>",
        color: COLORS.uncommon
    },

    rare: {
        name: "RARE",
        emoji: "<:Race:1539120227919339600>",
        color: COLORS.rare
    },

    epic: {
        name: "EPIC",
        emoji: "<:Epic:1539120231732088912>",
        color: COLORS.epic
    },

    legendary: {
        name: "LEGENDARY",
        emoji: "<:Legendary:1539120233883766834>",
        color: COLORS.legendary
    },

    mythical: {
        name: "MYTHICAL",
        emoji: "<:Mythic:1539120235922325544>",
        color: COLORS.mythical
    },

    celestial: {
        name: "CELESTIAL",
        emoji: "<:Celestial:1539120238065623161>",
        color: COLORS.celestial
    },

    divine: {
        name: "DIVINE",
        emoji: "<:Divine:1539120240053456937>",
        color: COLORS.divine
    }
};

// ======================================================
// LOCK
// ======================================================

const fishingLocks = new Set();

// ======================================================
// FOOTER
// ======================================================

const FOOTER = {
    text: "✦ Fishing Adventure · Fishing"
};

// ======================================================
// UTILS
// ======================================================

function num(value, fallback = 0) {
    const n = Number(value);

    return Number.isFinite(n)
        ? n
        : fallback;
}

function round(value, decimal = 2) {
    return Number(
        num(value).toFixed(decimal)
    );
}

function luck(value) {
    return Math.max(
        0,
        round(value)
    );
}

// ======================================================
// RARITY
// ======================================================

function normalizeRarity(value) {
    return String(
        value || "common"
    )
        .trim()
        .toLowerCase()
        .replace(/-/g, "_");
}

function getRarityOrder(rarity) {
    const key = normalizeRarity(rarity);

    return RARITY_ORDER[key] ?? 1;
}

function rarityDisplay(fish) {
    const rarity = normalizeRarity(
        fish?.rarity
    );

    const base = RARITY_MAP[rarity];

    if (base) {
        return {
            key: rarity,
            name: base.name,
            emoji: base.emoji,
            color: base.color,
            order: RARITY_ORDER[rarity]
        };
    }

    return {
        key: "common",
        name: "COMMON",
        emoji: RARITY_MAP.common.emoji,
        color: RARITY_MAP.common.color,
        order: 1
    };
}

// ======================================================
// STATS
// ======================================================

function ensureStats(user) {
    user.stats ??= {};

    user.stats.totalFishCaught = Math.max(
        0,
        Math.floor(
            num(
                user.stats.totalFishCaught
            )
        )
    );

    user.stats.totalWeightCaught = Math.max(
        0,
        num(
            user.stats.totalWeightCaught
        )
    );

    user.stats.biggestFish = Math.max(
        0,
        num(
            user.stats.biggestFish
        )
    );
}

function addFishStats(user, weight) {
    ensureStats(user);

    const safeWeight = Math.max(
        0,
        num(weight)
    );

    user.stats.totalFishCaught++;

    user.stats.totalWeightCaught += safeWeight;

    if (
        safeWeight >
        user.stats.biggestFish
    ) {
        user.stats.biggestFish = safeWeight;
    }

    user.stats.totalWeightCaught = round(
        user.stats.totalWeightCaught,
        2
    );

    user.stats.biggestFish = round(
        user.stats.biggestFish,
        2
    );
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
        .setTitle(title)
        .setDescription(description)
        .setFooter(FOOTER)
        .setTimestamp();

    if (image) {
        embed.setImage(image);
    }

    return embed;
}

// ======================================================
// CURRENT ZONE
// Dùng đúng vùng hiện tại giống fzone
// ======================================================

function getCurrentZone(user) {

    if (!fishingZones) {
        return null;
    }

    /*
     * fzone nên lưu ID vùng hiện tại vào một trong
     * các field dưới đây. Ưu tiên currentZone.
     */
    const zoneID =
        user?.currentZone ||
        user?.fzone ||
        user?.zone ||
        user?.fishingZone;

    if (zoneID && fishingZones[zoneID]) {
        return fishingZones[zoneID];
    }

    /*
     * Nếu user chưa có zone thì fallback về tropical.
     * Không tự đổi zone theo thời gian nữa.
     */
    return (
        fishingZones.tropical ||
        Object.values(fishingZones)[0] ||
        null
    );
}
// ======================================================
// ROD
// ======================================================

function formatRod(base, rod) {
    return (
        `${base.emoji || "🎣"} ` +
        `${base.name} +${num(rod.level)} · ` +
        `🍀 ${luck(
            rod.luck ??
            base.luck
        )}`
    );
}

// ======================================================
// DURABILITY
// ======================================================

function durabilityBar(current, max) {
    current = Math.max(
        0,
        num(current)
    );

    max = Math.max(
        1,
        num(max, 1)
    );

    const percent = Math.max(
        0,
        Math.min(
            100,
            current / max * 100
        )
    );

    const filled = Math.round(
        percent / 10
    );

    let emoji = "🟩";

    if (percent <= 50) {
        emoji = "🟨";
    }

    if (percent <= 25) {
        emoji = "🟥";
    }

    return (
        emoji.repeat(filled) +
        "⬛".repeat(10 - filled) +
        ` ${percent.toFixed(0)}% · ` +
        `${Math.floor(current)}/${Math.floor(max)}`
    );
}

// ======================================================
// FISH
// ======================================================

function fishRate(fish) {
    return Math.max(
        0,
        num(
            fish.catchRate ??
            fish.rate
        )
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
            Math.random() *
            (max - min) +
            min
        );
    }

    const fallbackMin = num(
        fishingConfig?.minWeight,
        0.5
    );

    const fallbackMax = num(
        fishingConfig?.maxWeight,
        20
    );

    return round(
        Math.random() *
        (
            fallbackMax -
            fallbackMin
        ) +
        fallbackMin
    );
}

// ======================================================
// LUCK
// ======================================================

function rarityMultiplier(fish, luckValue) {
    const rarity = normalizeRarity(
        fish.rarity
    );

    const multipliers = {
        uncommon: 0.03,
        rare: 0.05,
        epic: 0.08,
        legendary: 0.12,
        mythical: 0.18,
        celestial: 0.30,
        divine: 0.35
    };

    const custom =
        fishingConfig
            ?.rarities
            ?.[rarity]
            ?.luckMultiplier;

    const multiplier =
        custom !== undefined
            ? num(custom)
            : (
                multipliers[rarity] ||
                0
            );

    return (
        1 +
        Math.max(
            0,
            num(luckValue)
        ) *
        multiplier
    );
}

// ======================================================
// RANDOM FISH
// ======================================================

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
        .filter(
            x => x.rate > 0
        );

    if (!weighted.length) {
        return null;
    }

    const total = weighted.reduce(
        (sum, x) =>
            sum + x.rate,
        0
    );

    let random =
        Math.random() *
        total;

    for (const item of weighted) {
        random -= item.rate;

        if (random <= 0) {
            return item.fish;
        }
    }

    return weighted[
        weighted.length - 1
    ].fish;
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
    return (
        baits?.[id]?.emoji ||
        "🪱"
    );
}

function baitCount(user, id) {
    return Math.max(
        0,
        num(
            user.moi?.[id]
        )
    );
}

// ======================================================
// BAIT BUTTONS
// ======================================================

function createBaitButtons(user, ownerID) {
    const ids = Object.keys(
        baits || {}
    );

    const rows = [];

    for (
        let i = 0;
        i < ids.length;
        i += 5
    ) {
        const row =
            new ActionRowBuilder();

        for (
            const id of ids.slice(
                i,
                i + 5
            )
        ) {
            const bait = baits[id];
            const count = baitCount(
                user,
                id
            );

            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(
                        `fishbait_${ownerID}_${id}`
                    )
                    .setLabel(
                        `${bait.name} (${count})`
                    )
                    .setEmoji(
                        bait.emoji ||
                        "🪱"
                    )
                    .setStyle(
                        count > 0
                            ? ButtonStyle.Primary
                            : ButtonStyle.Secondary
                    )
                    .setDisabled(
                        count <= 0
                    )
            );
        }

        if (row.components.length) {
            rows.push(row);
        }
    }

    return rows;
}

// ======================================================
// RETRY
// ======================================================

function createRetryButton(
    ownerID,
    amount
) {
    return [
        new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(
                        `fishretry_${ownerID}_${amount}`
                    )
                    .setLabel(
                        `Câu lại ${amount} lần`
                    )
                    .setEmoji("🔄")
                    .setStyle(
                        ButtonStyle.Success
                    )
            )
    ];
}

// ======================================================
// COLLECTION
// ======================================================

function saveCollection(user, fishID) {
    user.collection ??= {};

    user.collection[fishID] = true;
}

// ======================================================
// COUNTDOWN BAR
// ======================================================

function countdownBar(
    remaining,
    total
) {
    const percent = Math.max(
        0,
        Math.min(
            100,
            100 -
            remaining /
            total *
            100
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

// ======================================================
// COUNTDOWN
// ======================================================

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
            totalMs -
            (
                Date.now() -
                start
            )
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
                                `🌊 ${zone.name}\n\n` +
                                `${countdownBar(
                                    remaining,
                                    totalMs
                                )}\n` +
                                (
                                    remaining <= 0
                                        ? "🎣 Cá đã cắn câu!"
                                        : `⏳ ${(remaining / 1000).toFixed(1)}s`
                                ) +
                                `\n\n` +
                                `🎯 ${amount} lần · ` +
                                `${baitName(baitID)}`
                        })
                    ],
                    components: []
                });
            } catch {}
        }

        if (remaining <= 0) {
            break;
        }

        await new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    Math.min(
                        500,
                        remaining
                    )
                )
        );
    }
}

// ======================================================
// BEST RARITY
// ======================================================

function bestRarity(summary) {
    let best = null;

    for (const item of summary) {
        const rarity =
            rarityDisplay(
                item.fish
            );

        if (
            !best ||
            rarity.order >
            best.order
        ) {
            best = rarity;
        }
    }

    return best;
}

// ======================================================
// RESULT COLOR
// ======================================================

function getResultColor(
    summary,
    rod
) {
    if (rod.destroyed) {
        return COLORS.danger;
    }

    const best =
        bestRarity(summary);

    return (
        best?.color ||
        COLORS.success
    );
}

// ======================================================
// FISH LINE
// ======================================================

function formatFishLine(item) {
    const rarity =
        rarityDisplay(
            item.fish
        );

    return (
        `${item.fish.emoji || "🐟"} ` +
        `${item.fish.name} ` +
        `${rarity.emoji} ` +
        `×${item.count} · ` +
        `${item.weight.toFixed(2)}kg`
    );
}

// ======================================================
// FISH SUMMARY
// ======================================================

function createFishSummary(summary) {
    if (!summary.length) {
        return "🌊 *Không câu được gì.*";
    }

    const visible =
        summary.slice(0, 5);

    const lines =
        visible.map(
            formatFishLine
        );

    const hidden =
        summary.length -
        visible.length;

    if (hidden > 0) {
        lines.push(
            `*… và ${hidden} loài khác*`
        );
    }

    return lines.join("\n");
}

// ======================================================
// RETRY MESSAGE
// ======================================================

function makeRetryMessage(
    interaction,
    amount
) {
    return {
        ...interaction.message,

        author:
            interaction.user,

        channel:
            interaction.channel,

        guild:
            interaction.guild,

        client:
            interaction.client,

        reply:
            async data => {
                return interaction.message.edit(
                    data
                );
            }
    };
}

// ======================================================
// RETRY HANDLER
// ======================================================

async function processRetry(
    interaction,
    command
) {
    const customID =
        interaction.customId;

    if (
        !customID.startsWith(
            "fishretry_"
        )
    ) {
        return false;
    }

    const parts =
        customID.split("_");

    const ownerID = parts[1];
    const amount = Number(parts[2]);

    if (
        interaction.user.id !==
        ownerID
    ) {
        try {
            await interaction.reply({
                content:
                    "❌ Đây không phải nút câu cá của bạn.",
                ephemeral: true
            });
        } catch {}

        return true;
    }

    if (
        !Number.isInteger(amount) ||
        amount <= 0 ||
        amount > 50
    ) {
        try {
            await interaction.reply({
                content:
                    "❌ Số lần câu không hợp lệ.",
                ephemeral: true
            });
        } catch {}

        return true;
    }

    if (
        fishingLocks.has(
            ownerID
        )
    ) {
        try {
            await interaction.reply({
                content:
                    "⏳ Bạn đang câu cá, hãy đợi lượt hiện tại hoàn tất.",
                ephemeral: true
            });
        } catch {}

        return true;
    }

    try {
        await interaction.deferUpdate();
    } catch {
        return true;
    }

    try {
        await interaction.message.edit({
            components: []
        });
    } catch {}

    const fakeMessage =
        makeRetryMessage(
            interaction,
            amount
        );

    try {
        await command.execute(
            fakeMessage,
            [String(amount)]
        );
    } catch (error) {
        console.error(
            "❌ RETRY EXECUTE ERROR:",
            error
        );

        try {
            await interaction.message.edit({
                content:
                    "❌ Đã xảy ra lỗi khi câu lại.",
                embeds: [],
                components: []
            });
        } catch {}
    }

    return true;
}

// ======================================================
// COMMAND
// ======================================================

const command = {

    name: "fish",

    aliases: [
        "f",
        "cau"
    ],

    // ==================================================
    // BUTTON HANDLER
    // ==================================================

    async handleInteraction(
        interaction
    ) {
        if (!interaction.isButton()) {
            return false;
        }

        if (
            !interaction.customId.startsWith(
                "fishretry_"
            )
        ) {
            return false;
        }

        return processRetry(
            interaction,
            this
        );
    },

    // ==================================================
    // EXECUTE
    // ==================================================

    async execute(
        message,
        args
    ) {
        const userID =
            message.author.id;

        if (
            fishingLocks.has(
                userID
            )
        ) {
            try {
                const warning =
                    await message.reply(
                        "⏳ Bạn đang câu cá, hãy đợi lượt hiện tại hoàn tất."
                    );

                setTimeout(
                    () =>
                        warning
                            ?.delete()
                            .catch(
                                () => {}
                            ),
                    3000
                );
            } catch {}

            return;
        }

        fishingLocks.add(
            userID
        );

        try {

            // ==========================================
            // USER
            // ==========================================

            const user =
                getUser(userID);

            if (!user) {
                return message.reply({
                    embeds: [
                        createEmbed({
                            message,
                            color: COLORS.error,
                            title:
                                "❌ `NO PLAYER DATA`",
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

            ensureStats(user);

            // ==========================================
            // AMOUNT
            // ==========================================

            const MAX_AMOUNT = 50;
            let amount = 1;

            if (
                args?.[0] !==
                undefined
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
                            createEmbed({
                                message,
                                color: COLORS.error,
                                title:
                                    "❌ `SỐ LẦN CÂU KHÔNG HỢP LỆ`",
                                description:
                                    `Số lần câu phải là số nguyên dương.\n\n` +
                                    `💡 Ví dụ: \`${prefix}fish 10\``
                            })
                        ]
                    });
                }

                if (
                    amount >
                    MAX_AMOUNT
                ) {
                    return message.reply({
                        embeds: [
                            createEmbed({
                                message,
                                color: COLORS.error,
                                title:
                                    "❌ `VƯỢT QUÁ GIỚI HẠN`",
                                description:
                                    `Mỗi lượt chỉ được câu tối đa ${MAX_AMOUNT} lần.`
                            })
                        ]
                    });
                }
            }

            // ==========================================
            // ZONE
            // ==========================================

            const zone =
                getCurrentZone();

            if (!zone) {
                return message.reply({
                    embeds: [
                        createEmbed({
                            message,
                            color: COLORS.error,
                            title:
                                "🌊 `KHÔNG CÓ KHU VỰC`",
                            description:
                                "Hiện chưa có khu vực câu cá khả dụng."
                        })
                    ]
                });
            }

            // ==========================================
            // ROD
            // ==========================================

            const rodID =
                user.can.dangDung;

            if (!rodID) {
                return message.reply({
                    embeds: [
                        createEmbed({
                            message,
                            color: COLORS.error,
                            title:
                                "🎣 `CHƯA TRANG BỊ CẦN`",
                            description:
                                `Bạn chưa trang bị cần câu.\n\n` +
                                `💡 Dùng \`${prefix}rod\` để trang bị.`
                        })
                    ]
                });
            }

            const baseRod =
                rods?.[rodID];

            const rod =
                user.rodData?.[
                    rodID
                ];

            if (
                !baseRod ||
                !rod
            ) {
                return message.reply({
                    embeds: [
                        createEmbed({
                            message,
                            color: COLORS.error,
                            title:
                                "❌ `DỮ LIỆU CẦN LỖI`",
                            description:
                                "Không tìm thấy dữ liệu cần câu."
                        })
                    ]
                });
            }

            // ==========================================
            // ROD DATA
            // ==========================================

            rod.level =
                num(
                    rod.level
                );

            rod.luck =
                luck(
                    rod.luck ??
                    baseRod.luck
                );

            const maxUses =
                Math.max(
                    1,
                    num(
                        baseRod.uses,
                        1
                    )
                );

            rod.uses =
                Number.isFinite(
                    Number(
                        rod.uses
                    )
                )
                    ? Math.max(
                        0,
                        Math.min(
                            num(
                                rod.uses
                            ),
                            maxUses
                        )
                    )
                    : maxUses;

            rod.maxUses =
                maxUses;

            // ==========================================
            // BROKEN
            // ==========================================

            if (
                rod.destroyed ||
                rod.uses <= 0
            ) {
                return message.reply({
                    embeds: [
                        createEmbed({
                            message,
                            color: COLORS.danger,
                            title:
                                "💥 `CẦN CÂU ĐÃ GÃY`",
                            description:
                                `🎣 ${formatRod(
                                    baseRod,
                                    rod
                                )}\n\n` +
                                `${durabilityBar(
                                    0,
                                    maxUses
                                )}\n\n` +
                                `🔧 Trạng thái: Đã gãy`
                        })
                    ]
                });
            }

            // ==========================================
            // DURABILITY
            // ==========================================

            if (
                rod.uses <
                amount
            ) {
                return message.reply({
                    embeds: [
                        createEmbed({
                            message,
                            color: COLORS.warning,
                            title:
                                "🎯 `ĐỘ BỀN KHÔNG ĐỦ`",
                            description:
                                `🎣 ${formatRod(
                                    baseRod,
                                    rod
                                )}\n\n` +
                                `${durabilityBar(
                                    rod.uses,
                                    maxUses
                                )}\n\n` +
                                `🎣 Cần: ${amount} lần`
                        })
                    ]
                });
            }

            // ==========================================
            // BAIT DATA
            // ==========================================

            const baitIDs =
                Object.keys(
                    baits || {}
                );

            let totalBait = 0;

            for (
                const id of baitIDs
            ) {
                totalBait +=
                    baitCount(
                        user,
                        id
                    );
            }

            if (
                totalBait <= 0
            ) {
                const text =
                    baitIDs
                        .map(
                            id =>
                                `${baitEmoji(
                                    id
                                )} ${baits[id].name}: 0`
                        )
                        .join("\n");

                return message.reply({
                    embeds: [
                        createEmbed({
                            message,
                            color: COLORS.error,
                            title:
                                "🪱 `KHÔNG CÓ MỒI`",
                            description:
                                `🎣 ${formatRod(
                                    baseRod,
                                    rod
                                )}\n\n` +
                                `${durabilityBar(
                                    rod.uses,
                                    maxUses
                                )}\n\n` +
                                `🪱 \`MỒI HIỆN CÓ\`\n` +
                                text
                        })
                    ]
                });
            }

            // ==========================================
            // ZONE FISH
            // ==========================================

            const zoneFish =
                Array.isArray(
                    fishList
                )
                    ? fishList.filter(
                        fish =>
                            Array.isArray(
                                zone.fish
                            ) &&
                            zone.fish.includes(
                                fish.id
                            )
                    )
                    : [];

            if (
                !zoneFish.length
            ) {
                return message.reply({
                    embeds: [
                        createEmbed({
                            message,
                            color: COLORS.error,
                            title:
                                "❌ `KHÔNG CÓ DỮ LIỆU CÁ`",
                            description:
                                `🌊 ${zone.name}\n\n` +
                                "Không tìm thấy cá trong khu vực này."
                        })
                    ]
                });
            }

            // ==========================================
            // BAIT MESSAGE
            // ==========================================

            const ownerID =
                message.author.id;

            const baitText =
                baitIDs
                    .map(
                        id =>
                            `${baitEmoji(
                                id
                            )} ${baits[id].name} ×${baitCount(
                                user,
                                id
                            )}`
                    )
                    .join("\n");

            const baitMessage =
                await message.reply({
                    embeds: [
                        createEmbed({
                            message,
                            color: COLORS.info,
                            title:
                                "🪱 `CHỌN MỒI`",
                            description:
                                `🌊 ${zone.name}\n` +
                                `${zone.description || "*Một vùng nước bí ẩn...*"}\n\n` +
                                `🎣 ${formatRod(
                                    baseRod,
                                    rod
                                )}\n` +
                                `${durabilityBar(
                                    rod.uses,
                                    maxUses
                                )}\n\n` +
                                `🎯 ${amount} lần · Chọn mồi\n\n` +
                                baitText,
                            image:
                                zone.image
                        })
                    ],
                    components:
                        createBaitButtons(
                            user,
                            ownerID
                        )
                });

            // ==========================================
            // WAIT BAIT
            // ==========================================

            let baitID;

            try {
                const interaction =
                    await baitMessage
                        .awaitMessageComponent({
                            filter: i =>
                                i.user.id ===
                                    ownerID &&
                                i.customId.startsWith(
                                    `fishbait_${ownerID}_`
                                ),
                            time: 30000
                        });

                baitID =
                    interaction.customId
                        .split("_")
                        .pop();

                const count =
                    baitCount(
                        user,
                        baitID
                    );

                if (
                    count <
                    amount
                ) {
                    await interaction.update({
                        embeds: [
                            createEmbed({
                                message,
                                color: COLORS.error,
                                title:
                                    "❌ `KHÔNG ĐỦ MỒI`",
                                description:
                                    `${baitName(
                                        baitID
                                    )}\n\n` +
                                    `🎣 Cần: ${amount}\n` +
                                    `🪱 Có: ${count}`
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
                            title:
                                "⚡ `CHUẨN BỊ CÂU`",
                            description:
                                `🌊 ${zone.name}\n\n` +
                                `🎣 ${formatRod(
                                    baseRod,
                                    rod
                                )}\n` +
                                `${durabilityBar(
                                    rod.uses,
                                    maxUses
                                )}\n\n` +
                                `🎯 ${amount} lần · ` +
                                `${baitName(
                                    baitID
                                )} ×${amount}\n\n` +
                                "*Đang chuẩn bị..."
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
                            title:
                                "⏰ `HẾT THỜI GIAN`",
                            description:
                                `Bạn không chọn mồi trong 30 giây.\n\n` +
                                `💡 Dùng lại \`${prefix}fish ${amount}\`.`
                        })
                    ],
                    components: []
                });
            }

            // ==========================================
            // FISHING TIME
            // ==========================================

            const star =
                Math.max(
                    1,
                    num(
                        baseRod.star,
                        1
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

            await fishingCountdown({
                baitMessage,
                message,
                zone,
                amount,
                baitID,
                totalMs
            });

            // ==========================================
            // FINAL BAIT CHECK
            // ==========================================

            if (
                baitCount(
                    user,
                    baitID
                ) < amount
            ) {
                return baitMessage.edit({
                    embeds: [
                        createEmbed({
                            message,
                            color: COLORS.error,
                            title:
                                "❌ `KHÔNG ĐỦ MỒI`",
                            description:
                                `Không đủ ${baitName(
                                    baitID
                                )} để hoàn thành lượt câu.`
                        })
                    ],
                    components: []
                });
            }

            // ==========================================
            // CATCH
            // ==========================================

            const caught = {};
            const baitUsed = {};

            let actualCaught = 0;

            for (
                let i = 0;
                i < amount;
                i++
            ) {
                if (
                    baitCount(
                        user,
                        baitID
                    ) <= 0 ||
                    rod.uses <= 0
                ) {
                    break;
                }

                user.moi[baitID]--;

                baitUsed[baitID] =
                    (
                        baitUsed[baitID] ||
                        0
                    ) + 1;

                rod.uses =
                    Math.max(
                        0,
                        rod.uses - 1
                    );

                const fish =
                    randomFish(
                        zoneFish,
                        rod.luck
                    );

                if (!fish) {
                    continue;
                }

                actualCaught++;

                const weight =
                    fishWeight(
                        fish
                    );

                user.fish[
                    fish.id
                ] ??= [];

                user.fish[
                    fish.id
                ].push(weight);

                saveCollection(
                    user,
                    fish.id
                );

                addFishStats(
                    user,
                    weight
                );

                if (
                    !caught[
                        fish.id
                    ]
                ) {
                    caught[
                        fish.id
                    ] = {
                        fish,
                        count: 0,
                        weight: 0
                    };
                }

                caught[
                    fish.id
                ].count++;

                caught[
                    fish.id
                ].weight += weight;
            }

            // ==========================================
            // ROD
            // ==========================================

            if (
                rod.uses <= 0
            ) {
                rod.uses = 0;
                rod.destroyed = true;
            }

            // ==========================================
            // SAVE
            // ==========================================

            save();

            // ==========================================
            // SUMMARY SORT
            // ==========================================

            const summary =
                Object.values(
                    caught
                ).sort(
                    (a, b) => {
                        const rarityA =
                            rarityDisplay(
                                a.fish
                            );

                        const rarityB =
                            rarityDisplay(
                                b.fish
                            );

                        if (
                            rarityA.order !==
                            rarityB.order
                        ) {
                            return (
                                rarityB.order -
                                rarityA.order
                            );
                        }

                        if (
                            a.count !==
                            b.count
                        ) {
                            return (
                                b.count -
                                a.count
                            );
                        }

                        return (
                            b.weight -
                            a.weight
                        );
                    }
                );

            // ==========================================
            // FISH TEXT
            // ==========================================

            const catchText =
                createFishSummary(
                    summary
                );

            // ==========================================
            // TOTAL WEIGHT
            // ==========================================

            const totalWeight =
                summary.reduce(
                    (
                        sum,
                        item
                    ) =>
                        sum +
                        item.weight,
                    0
                );

            // ==========================================
            // BAIT USED
            // ==========================================

            const usedText =
                Object.keys(
                    baitUsed
                )
                    .map(
                        id =>
                            `${baitEmoji(
                                id
                            )} ×${baitUsed[id]}`
                    )
                    .join(" · ") ||
                "-";

            const remaining =
                baitCount(
                    user,
                    baitID
                );

            // ==========================================
            // CATCH RATE
            // ==========================================

            const catchRate =
                amount > 0
                    ? (
                        actualCaught /
                        amount *
                        100
                    ).toFixed(0)
                    : "0";

            // ==========================================
            // BEST RARITY
            // ==========================================

            const best =
                bestRarity(
                    summary
                );

            // ==========================================
            // COLOR
            // ==========================================

            const resultColor =
                getResultColor(
                    summary,
                    rod
                );

            // ==========================================
            // RESULT EMBED
            // ==========================================

            const resultEmbed =
                createEmbed({
                    message,
                    color:
                        resultColor,
                    title:
                        "🎣 `FISHING COMPLETE`",
                    description:
                        `🌊 ${zone.name} · ` +
                        `🎯 ${actualCaught}/${amount}\n\n` +
                        (
                            best
                                ? `${best.emoji} ${best.name} · Bậc cao nhất`
                                : ""
                        )
                });

            // ==========================================
            // FIELD 1 — CATCH
            // ==========================================

            resultEmbed.addFields({
                name:
                    "🐟 `CHIẾN LỢI PHẨM`",

                value:
                    catchText,

                inline: false
            });

            // ==========================================
            // FIELD 2 — STATS
            // ==========================================

            resultEmbed.addFields({
                name:
                    "📊 `THỐNG KÊ`",

                value:
                    `⚖️ ${totalWeight.toFixed(2)}kg · ` +
                    `🎯 ${catchRate}% · ` +
                    `🪱 ${usedText}\n` +

                    `📦 Còn ${remaining} · ` +
                    `🐟 ${user.stats.totalFishCaught.toLocaleString()} cá · ` +
                    `🏆 ${user.stats.biggestFish.toFixed(2)}kg`,

                inline: false
            });

            // ==========================================
            // FIELD 3 — ROD
            // ==========================================

            resultEmbed.addFields({
                name:
                    "🎣 `CẦN CÂU`",

                value:
                    `${formatRod(
                        baseRod,
                        rod
                    )}\n` +

                    `${durabilityBar(
                        rod.uses,
                        maxUses
                    )}\n` +

                    (
                        rod.destroyed
                            ? "💥 Cần đã gãy"
                            : "🟢 Cần vẫn hoạt động"
                    ),

                inline: false
            });

            // ==========================================
            // RESULT
            // ==========================================

            const resultMessage =
                await baitMessage.edit({
                    embeds: [
                        resultEmbed
                    ],

                    components:
                        createRetryButton(
                            ownerID,
                            amount
                        )
                });

            // ==========================================
            // RETRY COLLECTOR
            // ==========================================

            const retryCollector =
                resultMessage.createMessageComponentCollector({
                    filter:
                        interaction =>
                            interaction.isButton() &&
                            interaction.customId ===
                                `fishretry_${ownerID}_${amount}`,

                    time: 60000,

                    max: 1
                });

            retryCollector.on(
                "collect",
                async interaction => {

                    if (
                        interaction.user.id !==
                        ownerID
                    ) {
                        try {
                            await interaction.reply({
                                content:
                                    "❌ Đây không phải nút câu cá của bạn.",
                                ephemeral: true
                            });
                        } catch {}

                        return;
                    }

                    if (
                        fishingLocks.has(
                            ownerID
                        )
                    ) {
                        try {
                            await interaction.reply({
                                content:
                                    "⏳ Bạn đang câu cá, hãy đợi lượt hiện tại hoàn tất.",
                                ephemeral: true
                            });
                        } catch {}

                        return;
                    }

                    try {
                        await interaction.deferUpdate();
                    } catch {
                        return;
                    }

                    try {
                        await resultMessage.edit({
                            components: []
                        });
                    } catch {}

                    const retryMessage = {
                        ...resultMessage,

                        author:
                            interaction.user,

                        channel:
                            interaction.channel,

                        guild:
                            interaction.guild,

                        client:
                            interaction.client,

                        reply:
                            async data => {
                                return resultMessage.edit(
                                    data
                                );
                            }
                    };

                    try {
                        await command.execute(
                            retryMessage,
                            [String(amount)]
                        );
                    } catch (error) {
                        console.error(
                            "❌ RETRY EXECUTE ERROR:",
                            error
                        );

                        try {
                            await resultMessage.edit({
                                content:
                                    "❌ Đã xảy ra lỗi khi câu lại.",
                                embeds: [],
                                components: []
                            });
                        } catch {}
                    }
                }
            );

            // ==========================================
            // COLLECTOR END
            // ==========================================

            retryCollector.on(
                "end",
                async () => {
                    try {
                        const current =
                            await resultMessage.fetch();

                        if (
                            current.components.length
                        ) {
                            await resultMessage.edit({
                                components: []
                            });
                        }
                    } catch {}
                }
            );

        } catch (error) {

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
                            title:
                                "❌ `FISHING ERROR`",
                            description:
                                "Đã xảy ra lỗi trong lúc câu cá.\n\n" +
                                "💡 Vui lòng thử lại sau."
                        })
                    ]
                });
            } catch {}

        } finally {
            fishingLocks.delete(
                userID
            );
        }
    }
};

module.exports = command;
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
    success: "#57f287",
    warning: "#ffd166",
    error: "#ff6b81",
    danger: "#ff4d67",

    common: "#95a5a6",
    rare: "#3498db",
    epic: "#9b59b6",
    legendary: "#f1c40f",
    mythical: "#e056fd",

    // Bậc mới / siêu hiếm
    super_rare: "#ff6b35",
    ultra_rare: "#ff2d95",
    divine: "#00ffff",
    celestial: "#ffffff",
    secret: "#ff0000"
};

// ======================================================
// RARITY ORDER
// ======================================================
//
// Có thể tự thêm rarity trong config.
// Các rarity không nằm ở đây vẫn được xử lý bằng
// vị trí/giá trị từ config nếu có.
//

const RARITY_ORDER = {
    common: 1,
    uncommon: 2,
    rare: 3,
    epic: 4,
    legendary: 5,
    mythical: 6,

    super_rare: 7,
    "super rare": 7,

    ultra_rare: 8,
    "ultra rare": 8,

    divine: 9,
    celestial: 10,
    secret: 11
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
// RARITY NORMALIZE
// ======================================================

function normalizeRarity(value) {
    return String(
        value ||
        "common"
    )
        .trim()
        .toLowerCase()
        .replace(/-/g, "_");
}

function getRarityOrder(rarity) {
    const key =
        normalizeRarity(rarity);

    if (
        RARITY_ORDER[key] !==
        undefined
    ) {
        return RARITY_ORDER[key];
    }

    // Nếu config có order
    const configRarity =
        fishingConfig?.rarities?.[key];

    if (
        configRarity?.order !==
        undefined
    ) {
        return num(
            configRarity.order,
            1
        );
    }

    return 1;
}

// ======================================================
// RARITY DISPLAY
// ======================================================

function rarityDisplay(fish) {
    const rarity =
        normalizeRarity(
            fish?.rarity
        );

    // Nếu config có dữ liệu rarity
    const configRarity =
        fishingConfig?.rarities?.[rarity];

    if (configRarity) {
        return {
            key: rarity,

            name:
                configRarity.name ||
                rarity
                    .replace(/_/g, " ")
                    .toUpperCase(),

            emoji:
                configRarity.emoji ||
                "✨",

            color:
                configRarity.color ||
                COLORS[rarity] ||
                COLORS.primary,

            order:
                num(
                    configRarity.order,
                    getRarityOrder(rarity)
                )
        };
    }

    const map = {
        common: {
            name: "COMMON",
            emoji: "⚪",
            color: COLORS.common
        },

        uncommon: {
            name: "UNCOMMON",
            emoji: "🟢",
            color: "#2ecc71"
        },

        rare: {
            name: "RARE",
            emoji: "🔵",
            color: COLORS.rare
        },

        epic: {
            name: "EPIC",
            emoji: "🟣",
            color: COLORS.epic
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
        },

        super_rare: {
            name: "SUPER RARE",
            emoji: "🔥",
            color: COLORS.super_rare
        },

        "super rare": {
            name: "SUPER RARE",
            emoji: "🔥",
            color: COLORS.super_rare
        },

        ultra_rare: {
            name: "ULTRA RARE",
            emoji: "💎",
            color: COLORS.ultra_rare
        },

        "ultra rare": {
            name: "ULTRA RARE",
            emoji: "💎",
            color: COLORS.ultra_rare
        },

        divine: {
            name: "DIVINE",
            emoji: "☀️",
            color: COLORS.divine
        },

        celestial: {
            name: "CELESTIAL",
            emoji: "🌌",
            color: COLORS.celestial
        },

        secret: {
            name: "SECRET",
            emoji: "🔴",
            color: COLORS.secret
        }
    };

    const result =
        map[rarity] ||
        {
            name: rarity
                .replace(/_/g, " ")
                .toUpperCase(),

            emoji: "✨",

            color:
                COLORS[rarity] ||
                COLORS.primary
        };

    return {
        ...result,

        key: rarity,

        order:
            getRarityOrder(rarity)
    };
}

// ======================================================
// LIFETIME STATS
// ======================================================

function ensureStats(user) {
    user.stats ??= {};

    user.stats.totalFishCaught =
        Math.max(
            0,
            Math.floor(
                num(
                    user.stats.totalFishCaught
                )
            )
        );

    user.stats.totalWeightCaught =
        Math.max(
            0,
            num(
                user.stats.totalWeightCaught
            )
        );

    user.stats.biggestFish =
        Math.max(
            0,
            num(
                user.stats.biggestFish
            )
        );
}

// ======================================================
// ADD STATS
// ======================================================

function addFishStats(
    user,
    weight
) {
    ensureStats(user);

    const safeWeight =
        Math.max(
            0,
            num(weight)
        );

    user.stats.totalFishCaught += 1;

    user.stats.totalWeightCaught +=
        safeWeight;

    if (
        safeWeight >
        user.stats.biggestFish
    ) {
        user.stats.biggestFish =
            safeWeight;
    }

    user.stats.totalWeightCaught =
        round(
            user.stats.totalWeightCaught,
            2
        );

    user.stats.biggestFish =
        round(
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
    const embed =
        new EmbedBuilder()
            .setColor(color)
            .setAuthor({
                name:
                    `${message.author.username} · Fishing`,

                iconURL:
                    message.author.displayAvatarURL({
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
// ZONE
// ======================================================

function getCurrentZone() {
    if (!fishingZones) {
        return null;
    }

    const now =
        new Date();

    // Chủ nhật = Volcano
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

    return zones[
        Math.floor(
            now.getHours() / 6
        ) % zones.length
    ];
}

// ======================================================
// ROD
// ======================================================

function formatRod(
    base,
    rod
) {
    return (
        `${base.emoji || "🎣"} ` +
        `${base.name} +${num(rod.level)} · ` +
        `🍀 ${luck(
            rod.luck ??
            base.luck
        )}`
    );
}

function durabilityBar(
    current,
    max
) {
    current =
        Math.max(
            0,
            num(current)
        );

    max =
        Math.max(
            1,
            num(max, 1)
        );

    const percent =
        Math.max(
            0,
            Math.min(
                100,
                current /
                max *
                100
            )
        );

    const filled =
        Math.round(
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
        "⬛".repeat(
            10 - filled
        ) +
        ` **${percent.toFixed(0)}%**`
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
    const min =
        num(fish.min);

    const max =
        num(fish.max);

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

    const fallbackMin =
        num(
            fishingConfig?.minWeight,
            0.5
        );

    const fallbackMax =
        num(
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

function rarityMultiplier(
    fish,
    luckValue
) {
    const rarity =
        normalizeRarity(
            fish.rarity
        );

    /*
     * Các bậc càng cao được cộng
     * luck nhẹ hơn để tránh lệch quá mạnh.
     */

    const multipliers = {
        uncommon: 0.03,
        rare: 0.05,
        epic: 0.08,
        legendary: 0.12,
        mythical: 0.18,

        super_rare: 0.22,
        ultra_rare: 0.25,

        divine: 0.28,
        celestial: 0.30,
        secret: 0.32
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

function randomFish(
    zoneFish,
    luckValue
) {
    const weighted =
        zoneFish
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
                x =>
                    x.rate > 0
            );

    if (
        !weighted.length
    ) {
        return null;
    }

    const total =
        weighted.reduce(
            (sum, x) =>
                sum + x.rate,
            0
        );

    let random =
        Math.random() *
        total;

    for (
        const item
        of weighted
    ) {
        random -=
            item.rate;

        if (
            random <= 0
        ) {
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
    const bait =
        baits?.[id];

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

function baitCount(
    user,
    id
) {
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

function createBaitButtons(
    user,
    ownerID
) {
    const ids =
        Object.keys(
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
            const id
            of ids.slice(
                i,
                i + 5
            )
        ) {
            const bait =
                baits[id];

            const count =
                baitCount(
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

        rows.push(row);
    }

    return rows;
}

// ======================================================
// RETRY BUTTON
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

function saveCollection(
    user,
    fishID
) {
    user.collection ??= {};

    user.collection[
        fishID
    ] = true;
}

// ======================================================
// COUNTDOWN
// ======================================================

function countdownBar(
    remaining,
    total
) {
    const percent =
        Math.max(
            0,
            Math.min(
                100,
                100 -
                remaining /
                total *
                100
            )
        );

    const filled =
        Math.round(
            percent / 10
        );

    return (
        "🟦".repeat(
            filled
        ) +
        "⬛".repeat(
            10 - filled
        )
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
    const start =
        Date.now();

    let lastSecond = -1;

    while (true) {
        const remaining =
            Math.max(
                0,
                totalMs -
                (
                    Date.now() -
                    start
                )
            );

        const second =
            Math.ceil(
                remaining / 1000
            );

        if (
            second !==
                lastSecond ||
            remaining <= 0
        ) {
            lastSecond =
                second;

            try {
                await baitMessage.edit({
                    embeds: [
                        createEmbed({
                            message,
                            color:
                                COLORS.info,

                            title:
                                "🎣 ĐANG CÂU",

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
                                            remaining /
                                            1000
                                        ).toFixed(1)}s**`
                                ) +

                                `\n\n` +

                                `🎯 **${amount} lần** · ` +
                                `${baitName(
                                    baitID
                                )}`
                        })
                    ],

                    components: []
                });
            } catch {}
        }

        if (
            remaining <= 0
        ) {
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
// RESULT COLOR
// ======================================================

function getResultColor(
    summary,
    rod
) {
    if (
        rod.destroyed
    ) {
        return COLORS.danger;
    }

    if (
        !summary.length
    ) {
        return COLORS.info;
    }

    let best = null;

    for (
        const item
        of summary
    ) {
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

    return (
        best?.color ||
        COLORS.success
    );
}

// ======================================================
// BEST RARITY
// ======================================================

function bestRarity(
    summary
) {
    let best = null;

    for (
        const item
        of summary
    ) {
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
// FISH COMMAND
// ======================================================

module.exports = {
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
        if (
            !interaction.isButton()
        ) {
            return false;
        }

        if (
            !interaction.customId
                .startsWith(
                    "fishretry_"
                )
        ) {
            return false;
        }

        const parts =
            interaction.customId
                .split("_");

        const ownerID =
            parts[1];

        const amount =
            Number(parts[2]);

        if (
            interaction.user.id !==
            ownerID
        ) {
            await interaction.reply({
                content:
                    "❌ Đây không phải nút câu cá của bạn.",

                ephemeral: true
            });

            return true;
        }

        if (
            !Number.isInteger(
                amount
            ) ||
            amount <= 0 ||
            amount > 50
        ) {
            await interaction.reply({
                content:
                    "❌ Số lần câu không hợp lệ.",

                ephemeral: true
            });

            return true;
        }

        /*
         * Tạo message giả để dùng chung
         * execute() hiện tại.
         */

        const fakeMessage = {
            ...interaction.message,

            author:
                interaction.user,

            channel:
                interaction.channel,

            reply:
                async data => {
                    return interaction.reply(
                        data
                    );
                }
        };

        await interaction.deferUpdate();

        /*
         * Xóa button cũ trước khi bắt đầu.
         */

        try {
            await interaction.message.edit({
                components: []
            });
        } catch {}

        await this.execute(
            fakeMessage,
            [String(amount)]
        );

        return true;
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

        // ==================================================
        // ANTI SPAM
        // ==================================================

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
                            .delete()
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
            // ==================================================
            // USER
            // ==================================================

            const user =
                getUser(userID);

            if (!user) {
                return message.reply({
                    embeds: [
                        createEmbed({
                            message,
                            color:
                                COLORS.error,

                            title:
                                "❌ NO PLAYER DATA",

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

            // ==================================================
            // AMOUNT
            // ==================================================

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
                                color:
                                    COLORS.error,

                                title:
                                    "❌ SỐ LẦN CÂU KHÔNG HỢP LỆ",

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
                                color:
                                    COLORS.error,

                                title:
                                    "❌ VƯỢT QUÁ GIỚI HẠN",

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

            const zone =
                getCurrentZone();

            if (!zone) {
                return message.reply({
                    embeds: [
                        createEmbed({
                            message,
                            color:
                                COLORS.error,

                            title:
                                "🌊 KHÔNG CÓ KHU VỰC",

                            description:
                                "Hiện chưa có khu vực câu cá khả dụng."
                        })
                    ]
                });
            }

            // ==================================================
            // ROD
            // ==================================================

            const rodID =
                user.can.dangDung;

            if (!rodID) {
                return message.reply({
                    embeds: [
                        createEmbed({
                            message,
                            color:
                                COLORS.error,

                            title:
                                "🎣 CHƯA TRANG BỊ CẦN",

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
                            color:
                                COLORS.error,

                            title:
                                "❌ DỮ LIỆU CẦN LỖI",

                            description:
                                "Không tìm thấy dữ liệu cần câu."
                        })
                    ]
                });
            }

            // ==================================================
            // ROD DATA
            // ==================================================

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
                            color:
                                COLORS.danger,

                            title:
                                "💥 CẦN CÂU ĐÃ GÃY",

                            description:
                                `🎣 **${formatRod(
                                    baseRod,
                                    rod
                                )}**\n` +

                                `${durabilityBar(
                                    0,
                                    maxUses
                                )}\n\n` +

                                `🔧 Trạng thái: **Đã gãy**`
                        })
                    ]
                });
            }

            // ==================================================
            // DURABILITY
            // ==================================================

            if (
                rod.uses <
                amount
            ) {
                return message.reply({
                    embeds: [
                        createEmbed({
                            message,
                            color:
                                COLORS.warning,

                            title:
                                "🎯 ĐỘ BỀN KHÔNG ĐỦ",

                            description:
                                `🎣 **${formatRod(
                                    baseRod,
                                    rod
                                )}**\n` +

                                `${durabilityBar(
                                    rod.uses,
                                    maxUses
                                )}\n\n` +

                                `🎣 Cần: **${amount} lần**\n` +
                                `🛠️ Còn: **${rod.uses}/${maxUses}**`
                        })
                    ]
                });
            }

            // ==================================================
            // BAIT DATA
            // ==================================================

            const baitIDs =
                Object.keys(
                    baits || {}
                );

            let totalBait = 0;

            for (
                const id
                of baitIDs
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
                                )} ${baits[id].name}: **0**`
                        )
                        .join("\n");

                return message.reply({
                    embeds: [
                        createEmbed({
                            message,
                            color:
                                COLORS.error,

                            title:
                                "🪱 KHÔNG CÓ MỒI",

                            description:
                                `🎣 **${formatRod(
                                    baseRod,
                                    rod
                                )}**\n` +

                                `${durabilityBar(
                                    rod.uses,
                                    maxUses
                                )}\n\n` +

                                `🪱 **MỒI HIỆN CÓ**\n` +
                                `${text}`
                        })
                    ]
                });
            }

            // ==================================================
            // ZONE FISH
            // ==================================================

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
                            color:
                                COLORS.error,

                            title:
                                "❌ KHÔNG CÓ DỮ LIỆU CÁ",

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

            const ownerID =
                message.author.id;

            const baitText =
                baitIDs
                    .map(
                        id =>
                            `${baitEmoji(
                                id
                            )} ${baits[id].name} x${baitCount(
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
                            color:
                                COLORS.info,

                            title:
                                "🪱 CHỌN MỒI",

                            description:
                                `🌊 **${zone.name}**\n` +
                                `${zone.description || "*Một vùng nước bí ẩn...*"}\n\n` +

                                `🎣 ${formatRod(
                                    baseRod,
                                    rod
                                )}\n` +

                                `${durabilityBar(
                                    rod.uses,
                                    maxUses
                                )}\n\n` +

                                `🎯 **${amount} lần** · Chọn mồi\n\n` +

                                `${baitText}`,

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

            // ==================================================
            // WAIT BAIT
            // ==================================================

            let baitID;

            try {
                const interaction =
                    await baitMessage
                        .awaitMessageComponent({
                            filter: i =>
                                i.user.id ===
                                    ownerID &&
                                i.customId
                                    .startsWith(
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
                                color:
                                    COLORS.error,

                                title:
                                    "❌ KHÔNG ĐỦ MỒI",

                                description:
                                    `${baitName(
                                        baitID
                                    )}\n\n` +

                                    `🎣 Cần: **${amount}**\n` +
                                    `🪱 Có: **${count}**`
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
                            color:
                                COLORS.info,

                            title:
                                "⚡ CHUẨN BỊ CÂU",

                            description:
                                `🌊 **${zone.name}**\n\n` +

                                `🎣 ${formatRod(
                                    baseRod,
                                    rod
                                )}\n` +

                                `🎯 **${amount} lần** · ` +
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
                            color:
                                COLORS.warning,

                            title:
                                "⏰ HẾT THỜI GIAN",

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

            // ==================================================
            // FINAL BAIT CHECK
            // ==================================================

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
                            color:
                                COLORS.error,

                            title:
                                "❌ KHÔNG ĐỦ MỒI",

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

                // MỒI
                user.moi[
                    baitID
                ]--;

                baitUsed[
                    baitID
                ] =
                    (
                        baitUsed[
                            baitID
                        ] || 0
                    ) + 1;

                // CẦN
                rod.uses =
                    Math.max(
                        0,
                        rod.uses - 1
                    );

                // CÁ
                const fish =
                    randomFish(
                        zoneFish,
                        rod.luck
                    );

                if (!fish) {
                    continue;
                }

                actualCaught++;

                // CÂN NẶNG
                const weight =
                    fishWeight(
                        fish
                    );

                // INVENTORY
                user.fish[
                    fish.id
                ] ??= [];

                user.fish[
                    fish.id
                ].push(
                    weight
                );

                // COLLECTION
                saveCollection(
                    user,
                    fish.id
                );

                // STATS
                addFishStats(
                    user,
                    weight
                );

                // SUMMARY
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
                ].weight +=
                    weight;
            }

            // ==================================================
            // ROD
            // ==================================================

            if (
                rod.uses <= 0
            ) {
                rod.uses = 0;
                rod.destroyed = true;
            }

            // ==================================================
            // SAVE
            // ==================================================

            save();

            // ==================================================
            // SUMMARY SORT
            // ==================================================

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

            // ==================================================
            // CATCH TEXT
            // ==================================================

            const catchText =
                summary
                    .map(
                        item => {
                            const rarity =
                                rarityDisplay(
                                    item.fish
                                );

                            return (
                                `${item.fish.emoji || "🐟"} ` +
                                `**${item.fish.name}** ` +
                                `×${item.count} ` +
                                `(${item.weight.toFixed(2)}kg) ` +
                                `${rarity.emoji}${rarity.name}`
                            );
                        }
                    )
                    .join("\n") ||
                "🌊 Không câu được gì.";

            // ==================================================
            // TOTAL WEIGHT
            // ==================================================

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

            // ==================================================
            // BAIT USED
            // ==================================================

            const usedText =
                Object.keys(
                    baitUsed
                )
                    .map(
                        id =>
                            `${baitEmoji(
                                id
                            )} x${baitUsed[id]}`
                    )
                    .join(" · ") ||
                "-";

            const remaining =
                baitCount(
                    user,
                    baitID
                );

            // ==================================================
            // CATCH RATE
            // ==================================================

            const catchRate =
                amount > 0
                    ? (
                        actualCaught /
                        amount *
                        100
                    ).toFixed(0)
                    : "0";

            // ==================================================
            // BEST RARITY
            // ==================================================

            const best =
                bestRarity(
                    summary
                );

            // ==================================================
            // COLOR
            // ==================================================

            const resultColor =
                getResultColor(
                    summary,
                    rod
                );

            // ==================================================
            // RESULT
            // ==================================================

            const resultDescription =
                `🌊 **${zone.name}**\n\n` +

                `🐟 **CHIẾN LỢI PHẨM**\n` +
                `${catchText}\n\n` +

                `📊 **KẾT QUẢ**\n` +
                `🎯 **${actualCaught}/${amount}** · ` +
                `📈 **${catchRate}%** · ` +
                `⚖️ **${totalWeight.toFixed(2)}kg**\n` +
                `🪱 ${usedText} · Còn **${remaining}**\n\n` +

                (
                    best
                        ? `${best.emoji} **BẬC CAO NHẤT: ${best.name}**\n\n`
                        : ""
                ) +

                `📚 **THỐNG KÊ**\n` +
                `🐟 ${user.stats.totalFishCaught.toLocaleString()} cá · ` +
                `⚖️ ${user.stats.totalWeightCaught.toFixed(2)}kg · ` +
                `🏆 ${user.stats.biggestFish.toFixed(2)}kg\n\n` +

                `🎣 **CẦN CÂU**\n` +
                `${formatRod(
                    baseRod,
                    rod
                )}\n` +
                `${durabilityBar(
                    rod.uses,
                    maxUses
                )}\n\n` +

                (
                    rod.destroyed
                        ? "💥 **Cần đã gãy**"
                        : "🟢 **Cần vẫn hoạt động**"
                );

            return baitMessage.edit({
                embeds: [
                    createEmbed({
                        message,
                        color:
                            resultColor,

                        title:
                            "🎣 FISHING COMPLETE",

                        description:
                            resultDescription
                    })
                ],

                components:
                    createRetryButton(
                        ownerID,
                        amount
                    )
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
                            color:
                                COLORS.error,

                            title:
                                "❌ FISHING ERROR",

                            description:
                                "Đã xảy ra lỗi trong lúc câu cá.\n\n" +
                                "💡 Vui lòng thử lại sau."
                        })
                    ]
                });
            } catch {}
        }

        // ==================================================
        // UNLOCK
        // ==================================================

        finally {
            fishingLocks.delete(
                userID
            );
        }
    }
};
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

const { getUser, save } = require("../../data");

// ======================================================
// 🎨 EMBED CONFIG
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

const FOOTER = {
    text: "✦ Fishing Adventure · Fishing"
};

const RARITY_ORDER = {
    common: 1,
    rare: 2,
    epic: 3,
    legendary: 4,
    mythical: 5
};

const fishingLocks = new Set();

// ======================================================
// 🧩 UTILS
// ======================================================

function roundNumber(value, decimals = 2) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return 0;
    }

    return Number(
        number.toFixed(decimals)
    );
}

function formatLuck(value) {
    return roundNumber(
        Math.max(
            0,
            Number(value) || 0
        ),
        2
    );
}

// ======================================================
// 🌊 CURRENT ZONE
// ======================================================

function getCurrentZone() {
    if (!fishingZones) {
        return null;
    }

    const now = new Date();

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
// 🎣 ROD
// ======================================================

function formatRod(baseRod, rod) {
    const level =
        Number(rod.level || 0);

    const luck =
        formatLuck(
            rod.luck ??
            baseRod.luck ??
            0
        );

    return (
        `${baseRod.emoji || "🎣"} ` +
        `${baseRod.name} +${level} · ` +
        `🍀 ${luck}`
    );
}

function getRodDurabilityBar(
    current,
    max
) {
    current = Math.max(
        0,
        Number(current) || 0
    );

    max = Math.max(
        1,
        Number(max) || 1
    );

    const percent =
        Math.max(
            0,
            Math.min(
                100,
                current / max * 100
            )
        );

    const blocks = 10;

    const filled =
        Math.round(
            percent /
            100 *
            blocks
        );

    const empty =
        blocks - filled;

    let color = "🟩";

    if (percent <= 50) {
        color = "🟨";
    }

    if (percent <= 25) {
        color = "🟥";
    }

    return (
        `${color.repeat(filled)}` +
        `${"⬛".repeat(empty)} ` +
        `**${percent.toFixed(0)}%**`
    );
}

// ======================================================
// 🐟 FISH RATE
// ======================================================

function getFishRate(fish) {
    return Math.max(
        0,
        Number(
            fish.catchRate ??
            fish.rate ??
            0
        )
    );
}

// ======================================================
// ⚖️ FISH WEIGHT
// ======================================================

function getFishWeight(fish) {
    const fishMin =
        Number(fish.min);

    const fishMax =
        Number(fish.max);

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
// ⭐ RARITY MULTIPLIER
// ======================================================

function getRarityMultiplier(
    fish,
    luck
) {
    const rarity =
        String(
            fish.rarity ||
            "common"
        ).toLowerCase();

    const safeLuck =
        Math.max(
            0,
            Number(luck) || 0
        );

    const multipliers = {
        rare: 0.05,
        epic: 0.08,
        legendary: 0.12,
        mythical: 0.18
    };

    return (
        1 +
        safeLuck *
        (
            multipliers[
                rarity
            ] || 0
        )
    );
}

// ======================================================
// 🎣 RANDOM FISH
// ======================================================

function randomFish(
    zoneFish,
    luck
) {
    const weightedFish =
        zoneFish
            .map(fish => ({
                fish,

                rate:
                    getFishRate(fish) *
                    getRarityMultiplier(
                        fish,
                        luck
                    )
            }))
            .filter(
                item =>
                    item.rate > 0
            );

    if (
        !weightedFish.length
    ) {
        return null;
    }

    const totalRate =
        weightedFish.reduce(
            (sum, item) =>
                sum + item.rate,
            0
        );

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

    return weightedFish[
        weightedFish.length - 1
    ].fish;
}

// ======================================================
// ⭐ RARITY DISPLAY
// ======================================================

function getRarityDisplay(fish) {
    const rarity =
        String(
            fish?.rarity ||
            "common"
        ).toLowerCase();

    const rarityMap = {
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

    return (
        rarityMap[rarity] ||
        rarityMap.common
    );
}

// ======================================================
// 🏆 BEST RARITY
// ======================================================

function getBestRarity(
    summaryList
) {
    let best = null;
    let bestValue = 0;

    for (
        const item
        of summaryList
    ) {
        const rarity =
            String(
                item.fish?.rarity ||
                "common"
            ).toLowerCase();

        const value =
            RARITY_ORDER[
                rarity
            ] || 1;

        if (
            value >
            bestValue
        ) {
            bestValue = value;
            best = rarity;
        }
    }

    return best;
}

// ======================================================
// 🏆 SORT CHIẾN LỢI PHẨM
// ======================================================

function sortCatchSummary(
    summaryList
) {
    return summaryList.sort(
        (a, b) => {

            const rarityA =
                String(
                    a.fish?.rarity ||
                    "common"
                ).toLowerCase();

            const rarityB =
                String(
                    b.fish?.rarity ||
                    "common"
                ).toLowerCase();

            const rarityValueA =
                RARITY_ORDER[
                    rarityA
                ] || 1;

            const rarityValueB =
                RARITY_ORDER[
                    rarityB
                ] || 1;

            // 1. Hiếm nhất đứng trước
            if (
                rarityValueA !==
                rarityValueB
            ) {
                return (
                    rarityValueB -
                    rarityValueA
                );
            }

            // 2. Cùng rarity:
            // số lượng nhiều đứng trước
            if (
                a.count !==
                b.count
            ) {
                return (
                    b.count -
                    a.count
                );
            }

            // 3. Cùng số lượng:
            // tổng cân nặng lớn đứng trước
            if (
                a.weight !==
                b.weight
            ) {
                return (
                    b.weight -
                    a.weight
                );
            }

            // 4. Cuối cùng sort theo tên
            return String(
                a.fish?.name || ""
            ).localeCompare(
                String(
                    b.fish?.name || ""
                ),
                "vi"
            );
        }
    );
}

// ======================================================
// 🪱 BAIT
// ======================================================

function getBaitName(
    baitID
) {
    const info =
        baits?.[baitID];

    if (!info) {
        return "🪱 Mồi";
    }

    return (
        `${info.emoji || "🪱"} ` +
        `${info.name}`
    );
}

function getBaitEmoji(
    baitID
) {
    return (
        baits?.[baitID]?.emoji ||
        "🪱"
    );
}

function getBaitCount(
    user,
    baitID
) {
    return Math.max(
        0,
        Number(
            user.moi?.[baitID] ||
            0
        )
    );
}

// ======================================================
// 🔘 BAIT BUTTONS
// ======================================================

function createBaitButtons(
    user,
    ownerID
) {
    const baitIds =
        Object.keys(
            baits || {}
        );

    const rows = [];

    for (
        let i = 0;
        i < baitIds.length;
        i += 5
    ) {
        const row =
            new ActionRowBuilder();

        for (
            const baitID
            of baitIds.slice(
                i,
                i + 5
            )
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
// 🖼️ EMBED
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

    if (
        image &&
        typeof image === "string"
    ) {
        embed.setImage(image);
    }

    return embed;
}

// ======================================================
// 💾 COLLECTION
// ======================================================

function saveToCollection(
    user,
    fishID
) {
    user.collection =
        user.collection || {};

    user.collection[
        fishID
    ] = true;
}

// ======================================================
// ⏳ COUNTDOWN BAR
// ======================================================

function createCountdownBar(
    remaining,
    total
) {
    const percent =
        Math.max(
            0,
            Math.min(
                100,
                100 -
                (
                    remaining /
                    total *
                    100
                )
            )
        );

    const blocks = 10;

    const filled =
        Math.round(
            percent /
            100 *
            blocks
        );

    return (
        "🟦".repeat(
            filled
        ) +
        "⬛".repeat(
            blocks -
            filled
        )
    );
}

// ======================================================
// ⏳ FISHING COUNTDOWN
// ======================================================

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
        const elapsed =
            Date.now() -
            start;

        const remaining =
            Math.max(
                0,
                totalMs -
                elapsed
            );

        const second =
            Math.ceil(
                remaining /
                1000
            );

        if (
            second !==
                lastSecond ||
            remaining <= 0
        ) {
            lastSecond =
                second;

            const progress =
                createCountdownBar(
                    remaining,
                    totalMs
                );

            const timeText =
                remaining <= 0
                    ? "🎣 **Cá đã cắn câu!**"
                    : `⏳ **${(
                        remaining /
                        1000
                    ).toFixed(1)}s**`;

            try {
                await baitMessage.edit({
                    embeds: [
                        createEmbed({
                            message,
                            color:
                                COLORS.info,
                            title:
                                "🎣 `ĐANG CÂU`",
                            description:
                                `🌊 **${zone.name}**\n\n` +
                                `${progress}\n` +
                                `${timeText}\n\n` +
                                `🎯 **${amount} lần câu** · ` +
                                `${getBaitName(
                                    baitID
                                )}\n\n` +
                                `*Đang chờ cá cắn câu...*`
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
// 🎣 MODULE
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
        const userID =
            message.author.id;

        // ==================================================
        // 🔒 ANTI SPAM
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
            // 👤 USER
            // ==================================================

            const user =
                getUser(
                    userID
                );

            if (!user) {
                return message.reply({
                    embeds: [
                        createEmbed({
                            message,
                            color:
                                COLORS.error,
                            title:
                                "❌ `NO PLAYER DATA`",
                            description:
                                "Không thể tải dữ liệu người chơi của bạn."
                        })
                    ]
                });
            }

            // ==================================================
            // 🧱 DATA
            // ==================================================

            user.moi =
                user.moi || {};

            user.fish =
                user.fish || {};

            user.can =
                user.can || {};

            user.rodData =
                user.rodData || {};

            user.collection =
                user.collection || {};

            // ==================================================
            // 🎯 AMOUNT
            // ==================================================

            const MAX_AMOUNT =
                50;

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
                                color:
                                    COLORS.error,
                                title:
                                    "❌ `VƯỢT QUÁ GIỚI HẠN`",
                                description:
                                    `Mỗi lượt chỉ được câu tối đa **${MAX_AMOUNT} lần**.\n\n` +
                                    `💡 Hãy nhập từ **1 đến ${MAX_AMOUNT}**.`
                            })
                        ]
                    });
                }
            }

            // ==================================================
            // 🌊 ZONE
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
                                "🌊 `KHÔNG CÓ KHU VỰC`",
                            description:
                                "Hiện chưa có khu vực câu cá khả dụng."
                        })
                    ]
                });
            }

            // ==================================================
            // 🎣 EQUIPPED ROD
            // ==================================================

            const rodID =
                user.can?.dangDung;

            if (!rodID) {
                return message.reply({
                    embeds: [
                        createEmbed({
                            message,
                            color:
                                COLORS.error,
                            title:
                                "🎣 `CHƯA TRANG BỊ CẦN`",
                            description:
                                `Bạn chưa trang bị cần câu.\n\n` +
                                `💡 Dùng \`${prefix}rod\` để kiểm tra và trang bị cần.`
                        })
                    ]
                });
            }

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
                        createEmbed({
                            message,
                            color:
                                COLORS.error,
                            title:
                                "❌ `DỮ LIỆU CẦN LỖI`",
                            description:
                                "Không tìm thấy dữ liệu cần câu đang trang bị."
                        })
                    ]
                });
            }

            // ==================================================
            // 🍀 ROD STATS
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

            const configMaxUses =
                Math.max(
                    1,
                    Number(
                        baseRod.uses
                    ) || 1
                );

            let currentUses =
                Number(
                    rod.uses
                );

            if (
                !Number.isFinite(
                    currentUses
                )
            ) {
                currentUses =
                    configMaxUses;
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
            // 💥 BROKEN ROD
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
                                "💥 `CẦN CÂU ĐÃ GÃY`",
                            description:
                                `🎣 **${formatRod(
                                    baseRod,
                                    {
                                        ...rod,
                                        uses: 0
                                    }
                                )}**\n` +
                                `${getRodDurabilityBar(
                                    0,
                                    configMaxUses
                                )}\n\n` +
                                `🔧 Trạng thái: **💥 Đã gãy**\n\n` +
                                `💡 Hãy sửa hoặc mua cần mới trước khi tiếp tục.`
                        })
                    ]
                });
            }

            // ==================================================
            // 🎯 LOW DURABILITY
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
                                "🎯 `ĐỘ BỀN KHÔNG ĐỦ`",
                            description:
                                `🎣 **${formatRod(
                                    baseRod,
                                    rod
                                )}**\n` +
                                `${getRodDurabilityBar(
                                    rod.uses,
                                    configMaxUses
                                )}\n\n` +
                                `🎣 Muốn câu: **${amount} lần**\n` +
                                `🎯 Độ bền: **${rod.uses}/${configMaxUses}**\n\n` +
                                `💡 Cần ít nhất **${amount}** độ bền.`
                        })
                    ]
                });
            }

            // ==================================================
            // 🪱 BAIT DATA
            // ==================================================

            const baitIds =
                Object.keys(
                    baits || {}
                );

            const baitCounts = {};

            let totalBait = 0;

            for (
                const id
                of baitIds
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
            // ❌ NO BAIT
            // ==================================================

            if (
                totalBait <= 0
            ) {
                const baitText =
                    baitIds
                        .map(
                            id =>
                                `${getBaitEmoji(
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
                                "🪱 `KHÔNG CÓ MỒI`",
                            description:
                                `🎣 **${formatRod(
                                    baseRod,
                                    rod
                                )}**\n` +
                                `${getRodDurabilityBar(
                                    rod.uses,
                                    configMaxUses
                                )}\n\n` +
                                `🪱 **MỒI HIỆN CÓ**\n\n` +
                                `${baitText || "*Không có mồi.*"}\n\n` +
                                `💡 Hãy mua thêm mồi rồi thử lại.`
                        })
                    ]
                });
            }

            // ==================================================
            // 🐟 ZONE FISH
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
                                "❌ `KHÔNG CÓ DỮ LIỆU CÁ`",
                            description:
                                `🌊 **${zone.name}**\n\n` +
                                `Không tìm thấy cá tương ứng với khu vực này.`
                        })
                    ]
                });
            }

            // ==================================================
            // 🪱 BAIT SELECT
            // ==================================================

            const ownerID =
                message.author.id;

            const baitListText =
                baitIds
                    .map(
                        id =>
                            `${getBaitEmoji(
                                id
                            )} ${baits[id].name} x${baitCounts[id]}`
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
                                "🪱 `CHỌN MỒI`",
                            description:
                                `🌊 **${zone.name}**\n` +
                                `${zone.description || "*Một vùng nước bí ẩn...*"}\n\n` +
                                `🎣 ${formatRod(
                                    baseRod,
                                    rod
                                )}\n` +
                                `${getRodDurabilityBar(
                                    rod.uses,
                                    configMaxUses
                                )}\n\n` +
                                `🎯 Số lần câu: **${amount}**\n` +
                                `🍀 Luck: **${formatLuck(
                                    rod.luck
                                )}**\n\n` +
                                `🪱 **MỒI HIỆN CÓ**\n\n` +
                                `${baitListText}\n\n` +
                                `👇 **Chọn loại mồi:**`,
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
            // 🪱 WAIT BAIT
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
                        time: 30000
                    });

                baitID =
                    interaction.customId
                        .split("_")
                        .pop();

                const selectedBaitCount =
                    getBaitCount(
                        user,
                        baitID
                    );

                if (
                    selectedBaitCount <
                    amount
                ) {
                    await interaction.update({
                        embeds: [
                            createEmbed({
                                message,
                                color:
                                    COLORS.error,
                                title:
                                    "❌ `KHÔNG ĐỦ MỒI`",
                                description:
                                    `${getBaitName(
                                        baitID
                                    )}\n\n` +
                                    `🎣 Cần: **${amount}**\n` +
                                    `🪱 Hiện có: **${selectedBaitCount}**\n\n` +
                                    `💡 Không đủ mồi để câu **${amount} lần**.`
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
                                "⚡ `CHUẨN BỊ CÂU`",
                            description:
                                `🌊 **${zone.name}**\n\n` +
                                `🎣 ${formatRod(
                                    baseRod,
                                    rod
                                )}\n` +
                                `🎯 **${amount} lần câu**\n` +
                                `🪱 ${getBaitName(
                                    baitID
                                )} x${amount}\n\n` +
                                `*Đang chuẩn bị...*`
                        })
                    ],
                    components: []
                });
            }

            catch {
                return baitMessage.edit({
                    embeds: [
                        createEmbed({
                            message,
                            color:
                                COLORS.warning,
                            title:
                                "⏰ `HẾT THỜI GIAN CHỌN MỒI`",
                            description:
                                `Bạn đã không chọn mồi trong **30 giây**.\n\n` +
                                `💡 Dùng lại \`${prefix}fish ${amount}\` để câu cá.`
                        })
                    ],
                    components: []
                });
            }

            // ==================================================
            // ⏱️ FISHING TIME
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

            await fishingCountdown({
                baitMessage,
                message,
                zone,
                amount,
                baitID,
                totalMs
            });

            // ==================================================
            // 🪱 FINAL BAIT CHECK
            // ==================================================

            const finalBaitCount =
                getBaitCount(
                    user,
                    baitID
                );

            if (
                finalBaitCount <
                amount
            ) {
                return baitMessage.edit({
                    embeds: [
                        createEmbed({
                            message,
                            color:
                                COLORS.error,
                            title:
                                "❌ `KHÔNG ĐỦ MỒI`",
                            description:
                                `Không đủ ${getBaitName(
                                    baitID
                                )} để hoàn thành lượt câu.\n\n` +
                                `🎣 Cần: **${amount}**\n` +
                                `🪱 Hiện có: **${finalBaitCount}**`
                        })
                    ],
                    components: []
                });
            }

            // ==================================================
            // 🍀 LUCK
            // ==================================================

            const luck =
                formatLuck(
                    rod.luck
                );

            // ==================================================
            // 📊 SUMMARY DATA
            // ==================================================

            const caughtSummary = {};
            const baitUsed = {};

            for (
                const id
                of baitIds
            ) {
                baitUsed[id] = 0;
            }

            let actualCaught = 0;

            // ==================================================
            // 🎣 CATCH FISH
            // ==================================================

            for (
                let i = 0;
                i < amount;
                i++
            ) {
                if (
                    Number(
                        user.moi[
                            baitID
                        ] || 0
                    ) <= 0
                ) {
                    break;
                }

                // Trừ mồi
                user.moi[
                    baitID
                ]--;

                user.moi[
                    baitID
                ] = Math.max(
                    0,
                    user.moi[
                        baitID
                    ]
                );

                baitUsed[
                    baitID
                ]++;

                // Trừ độ bền
                rod.uses--;

                rod.uses =
                    Math.max(
                        0,
                        rod.uses
                    );

                // Chọn cá
                const catchFish =
                    randomFish(
                        zoneFish,
                        luck
                    );

                if (!catchFish) {
                    continue;
                }

                actualCaught++;

                // Cân nặng
                const weight =
                    getFishWeight(
                        catchFish
                    );

                // Inventory
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
                ].push(weight);

                // Collection
                saveToCollection(
                    user,
                    catchFish.id
                );

                // Summary
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
            // 💥 ROD BROKEN
            // ==================================================

            if (
                rod.uses <= 0
            ) {
                rod.uses = 0;

                rod.destroyed =
                    true;
            }

            // ==================================================
            // 💾 SAVE
            // ==================================================

            save();

            // ==================================================
            // 📊 SORT SUMMARY
            // ==================================================

            const summaryList =
                sortCatchSummary(
                    Object.values(
                        caughtSummary
                    )
                );

            // ==================================================
            // 🐟 CATCH TEXT
            // ==================================================

            const catchText =
                summaryList
                    .map(
                        item => {

                            const rarity =
                                getRarityDisplay(
                                    item.fish
                                );

                            const rarityText =
                                rarity.name ===
                                "COMMON"
                                    ? ""
                                    : ` ${rarity.emoji} ${rarity.name}`;

                            return (
                                `${item.fish.emoji || "🐟"} ` +
                                `${item.fish.name} x${item.count} · ` +
                                `⚖️ ${item.weight.toFixed(2)} KG` +
                                rarityText
                            );
                        }
                    )
                    .join("\n") ||
                "*Không câu được gì.*";

            // ==================================================
            // ⚖️ TOTAL WEIGHT
            // ==================================================

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
            // 🪱 BAIT USED
            // ==================================================

            const baitText =
                Object.keys(
                    baitUsed
                )
                    .filter(
                        id =>
                            baitUsed[id] >
                            0
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
            // 🪱 BAIT REMAINING
            // ==================================================

            const baitRemaining =
                getBaitCount(
                    user,
                    baitID
                );

            // ==================================================
            // 📈 CATCH RATE
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
            // 🎣 ROD STATUS
            // ==================================================

            const rodStatus =
                rod.destroyed ||
                rod.uses <= 0
                    ? "💥 Đã gãy"
                    : "✅ Sẵn sàng";

            // ==================================================
            // ⭐ BEST RARITY
            // ==================================================

            const bestRarity =
                getBestRarity(
                    summaryList
                );

            let resultColor =
                rod.destroyed
                    ? COLORS.danger
                    : COLORS.success;

            if (
                bestRarity ===
                "legendary"
            ) {
                resultColor =
                    COLORS.legendary;
            }

            if (
                bestRarity ===
                "mythical"
            ) {
                resultColor =
                    COLORS.mythical;
            }

            // ==================================================
            // 🎉 RESULT EMBED
            // ==================================================

            await baitMessage.edit({
                embeds: [
                    createEmbed({
                        message,

                        color:
                            resultColor,

                        title:
                            "🎣 `FISHING COMPLETE`",

                        description:

                            `🌊 **${zone.name}**\n\n` +

                            `🐟 **CHIẾN LỢI PHẨM**\n` +

                            `${catchText}\n\n` +

                            `📊 **THỐNG KÊ**\n` +

                            `🎯 Thành công: **${actualCaught}/${amount}** · ` +
                            `📈 Tỷ lệ: **${catchRate}%**\n` +

                            `⚖️ Tổng: **${totalWeight.toFixed(
                                2
                            )} KG**\n` +

                            `🪱 Đã dùng: **${baitText}** · ` +
                            `Còn lại: **${baitRemaining}**\n\n` +

                            `🎣 **CẦN CÂU**\n` +

                            `${formatRod(
                                baseRod,
                                rod
                            )}\n` +

                            `${getRodDurabilityBar(
                                rod.uses,
                                configMaxUses
                            )}\n` +

                            `🔧 Trạng thái: ${rodStatus}\n\n` +

                            `*Chúc bạn câu được cá hiếm.*`,

                        image:
                            zone.image
                    })
                ],

                components: []
            });
        }

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
                                "❌ `FISHING ERROR`",
                            description:
                                `Đã xảy ra lỗi trong lúc câu cá.\n\n` +
                                `💡 Vui lòng thử lại sau.`
                        })
                    ]
                });
            } catch {}
        }

        finally {
            fishingLocks.delete(
                userID
            );
        }
    }
};
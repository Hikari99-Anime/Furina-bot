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
// 🎨 COLORS
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

const SEPARATOR = "୨୧ ───────── ୨୧";

const FOOTER = {
    text: "✦ Fishing Adventure · Fishing"
};

// ======================================================
// 🔒 ANTI SPAM
// ======================================================

const fishingLocks = new Set();

// ======================================================
// 🗺️ LẤY KHU VỰC HIỆN TẠI
// ======================================================

function getCurrentZone() {

    if (!fishingZones) {
        return null;
    }

    const now = new Date();

    // Chủ nhật -> Volcano
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

    /*
     * 00-05 -> Tropical
     * 06-11 -> Cold
     * 12-17 -> Swamp
     * 18-23 -> Deep
     */

    const index = Math.floor(
        now.getHours() / 6
    );

    return zones[
        index % zones.length
    ];
}

// ======================================================
// 🔢 LÀM TRÒN SỐ
// ======================================================

function roundNumber(
    value,
    decimals = 2
) {

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return 0;
    }

    return Number(
        number.toFixed(decimals)
    );
}

// ======================================================
// 🍀 FORMAT LUCK
// ======================================================

function formatLuck(value) {

    const luck = Math.max(
        0,
        Number(value) || 0
    );

    return roundNumber(
        luck,
        2
    );
}

// ======================================================
// 🎣 FORMAT CẦN
// ======================================================

function formatRod(
    baseRod,
    rod
) {

    const level = Number(
        rod.level || 0
    );

    const luck = formatLuck(
        rod.luck ??
        baseRod.luck ??
        0
    );

    const uses = Math.max(
        0,
        Number(
            rod.uses ?? 0
        )
    );

    const maxUses = Math.max(
        1,
        Number(
            rod.maxUses ??
            baseRod.uses
        ) || 1
    );

    return (
        `${baseRod.emoji || "🎣"} ` +
        `${baseRod.name} ` +
        `\`+${level}\` · ` +
        `🍀 ${luck} · ` +
        `🎯 ${uses}/${maxUses}`
    );
}

// ======================================================
// 🟩 THANH ĐỘ BỀN
// ======================================================

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

    const percent = Math.max(
        0,
        Math.min(
            100,
            current / max * 100
        )
    );

    const totalBlocks = 10;

    const filled = Math.round(
        percent /
        100 *
        totalBlocks
    );

    const empty =
        totalBlocks -
        filled;

    let color = "🟩";

    if (percent <= 50) {
        color = "🟨";
    }

    if (percent <= 25) {
        color = "🟥";
    }

    return (
        `${color.repeat(filled)}` +
        `⬛`.repeat(empty) +
        ` **${percent.toFixed(0)}%** ` +
        `(${current}/${max})`
    );
}

// ======================================================
// 🐟 RATE CÁ
// ======================================================

function getFishRate(fish) {

    const rate = Number(
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
// ⚖️ CÂN NẶNG
// ======================================================

function getFishWeight(fish) {

    const fishMin = Number(
        fish.min
    );

    const fishMax = Number(
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
// ⭐ RARITY MULTIPLIER
// ======================================================

function getRarityMultiplier(
    fish,
    luck
) {

    const rarity = String(
        fish.rarity ||
        "common"
    ).toLowerCase();

    const safeLuck = Math.max(
        0,
        Number(luck) || 0
    );

    switch (rarity) {

        case "rare":
            return (
                1 +
                safeLuck *
                0.05
            );

        case "epic":
            return (
                1 +
                safeLuck *
                0.08
            );

        case "legendary":
            return (
                1 +
                safeLuck *
                0.12
            );

        case "mythical":
            return (
                1 +
                safeLuck *
                0.18
            );

        default:
            return 1;
    }
}

// ======================================================
// 🎣 CHỌN CÁ
// ======================================================

function randomFish(
    zoneFish,
    luck
) {

    const weightedFish =
        zoneFish

            .map(fish => {

                const baseRate =
                    getFishRate(fish);

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
            })

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
// 🪱 TÊN MỒI
// ======================================================

function getBaitName(baitID) {

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

// ======================================================
// 🪱 EMOJI MỒI
// ======================================================

function getBaitEmoji(baitID) {

    return (
        baits?.[baitID]?.emoji ||
        "🪱"
    );
}

// ======================================================
// 🔢 SỐ LƯỢNG MỒI
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
// 🔘 BUTTON MỒI
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

    let currentRow = null;

    for (
        const baitID
        of baitIds
    ) {

        const info =
            baits[baitID];

        const count =
            getBaitCount(
                user,
                baitID
            );

        if (
            !currentRow ||
            currentRow.components.length >= 5
        ) {

            currentRow =
                new ActionRowBuilder();

            rows.push(
                currentRow
            );
        }

        currentRow.addComponents(

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

    return rows;
}

// ======================================================
// 🖼️ EMBED CƠ BẢN
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
// ⭐ RARITY DISPLAY
// ======================================================

function getRarityDisplay(fish) {

    const rarity = String(
        fish?.rarity ||
        "common"
    ).toLowerCase();

    switch (rarity) {

        case "rare":

            return {
                name: "RARE",
                emoji: "🔵",
                color: COLORS.info
            };

        case "epic":

            return {
                name: "EPIC",
                emoji: "🟣",
                color: COLORS.primary
            };

        case "legendary":

            return {
                name: "LEGENDARY",
                emoji: "🌟",
                color: COLORS.legendary
            };

        case "mythical":

            return {
                name: "MYTHICAL",
                emoji: "💜",
                color: COLORS.mythical
            };

        default:

            return {
                name: "COMMON",
                emoji: "⚪",
                color: COLORS.success
            };
    }
}

// ======================================================
// 🏆 RARITY CAO NHẤT
// ======================================================

function getBestRarity(summaryList) {

    const order = {
        common: 1,
        rare: 2,
        epic: 3,
        legendary: 4,
        mythical: 5
    };

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
            order[rarity] || 1;

        if (
            value >
            bestValue
        ) {

            bestValue =
                value;

            best =
                rarity;
        }
    }

    return best;
}

// ======================================================
// 💾 LƯU COLLECTION VĨNH VIỄN
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
// ⏳ TẠO TEXT COUNTDOWN
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

    const empty =
        blocks -
        filled;

    return (
        "🟦".repeat(filled) +
        "⬛".repeat(empty)
    );
}

// ======================================================
// ⏳ COUNTDOWN CÂU CÁ
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

    let lastSecond =
        -1;

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
                remaining / 1000
            );

        /*
         * Chỉ edit khi đổi giây.
         * Tránh spam Discord API.
         */

        if (
            second !== lastSecond ||
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
                        remaining / 1000
                    ).toFixed(1)}s**`;

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

                                `${progress}\n` +

                                `${timeText}\n\n` +

                                `🎯 **${amount} lần câu**  ·  ` +
                                `${getBaitName(baitID)}\n\n` +

                                `✦ *Đang chờ cá cắn câu...*`

                        })

                    ],

                    components: []
                });

            }

            catch {
                // Message có thể đã bị xóa
            }
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

        const userID =
            message.author.id;

        // ==================================================
        // 🔒 ANTI SPAM
        // ==================================================

        if (
            fishingLocks.has(userID)
        ) {

            try {

                const warning =
                    await message.reply(
                        "⏳ Bạn đang câu cá, hãy đợi lượt hiện tại hoàn tất."
                    );

                setTimeout(
                    () => {

                        warning
                            .delete()
                            .catch(() => {});

                    },
                    3000
                );

            }

            catch {}

            return;
        }

        // ==================================================
        // 🔒 KHÓA NGAY
        // ==================================================

        fishingLocks.add(userID);

        try {

            // ==================================================
            // 👤 USER
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
                                "❌ `NO PLAYER DATA`",

                            description:
                                "Không thể tải dữ liệu người chơi của bạn."
                        })

                    ]
                });
            }

            // ==================================================
            // 🧱 ĐẢM BẢO DATA
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
            // 🎯 SỐ LẦN CÂU
            // ==================================================

            const MAX_AMOUNT =
                50;

            let amount = 1;

            if (
                args?.[0] !== undefined
            ) {

                amount =
                    Number(args[0]);

                if (
                    !Number.isInteger(amount) ||
                    amount <= 0
                ) {

                    return message.reply({

                        embeds: [

                            createEmbed({

                                message,

                                color:
                                    COLORS.error,

                                title:
                                    "❌ Số lần câu không hợp lệ",

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
                                    "❌ Vượt quá giới hạn",

                                description:

                                    `Mỗi lượt chỉ được câu tối đa **${MAX_AMOUNT} lần**.\n\n` +

                                    `💡 Hãy nhập từ **1 đến ${MAX_AMOUNT}**.`
                            })

                        ]
                    });
                }
            }

            // ==================================================
            // 🌊 KHU VỰC
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
                                "🌊 Không có khu vực câu cá",

                            description:
                                "Hiện chưa có khu vực câu cá khả dụng."
                        })

                    ]
                });
            }

            // ==================================================
            // 🎣 CẦN ĐANG DÙNG
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
                                "🎣 Chưa trang bị cần câu",

                            description:

                                `Bạn chưa trang bị cần câu.\n\n` +

                                `💡 Dùng \`${prefix}rod\` để kiểm tra và trang bị cần.`
                        })

                    ]
                });
            }

            // ==================================================
            // 🎣 DATA CẦN
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

                        createEmbed({

                            message,

                            color:
                                COLORS.error,

                            title:
                                "❌ Dữ liệu cần câu lỗi",

                            description:
                                "Không tìm thấy dữ liệu cần câu đang trang bị."
                        })

                    ]
                });
            }

            // ==================================================
            // 🍀 CHUẨN HÓA CẦN
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
            // 🎯 ĐỘ BỀN
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

            if (
                !Number.isFinite(
                    currentUses
                )
            ) {

                currentUses =
                    configMaxUses;
            }

            if (
                oldMaxUses > 0 &&
                oldMaxUses !==
                configMaxUses
            ) {

                if (
                    currentUses >=
                    oldMaxUses
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
            // 💥 CẦN GÃY
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
                                "💥 `ROD BROKEN`",

                            description:

                                `🎣 **CẦN CÂU**\n\n` +

                                `${formatRod(
                                    baseRod,
                                    {
                                        ...rod,
                                        uses: 0
                                    }
                                )}\n\n` +

                                `${getRodDurabilityBar(
                                    0,
                                    configMaxUses
                                )}\n\n` +

                                `${SEPARATOR}\n\n` +

                                `🔧 Trạng thái: **💥 Đã gãy**\n\n` +

                                `💡 Hãy sửa hoặc mua cần mới trước khi tiếp tục.`
                        })

                    ]
                });
            }

            // ==================================================
            // 🎯 KHÔNG ĐỦ ĐỘ BỀN
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
                                "🎯 `LOW DURABILITY`",

                            description:

                                `🎣 **CẦN CÂU**\n\n` +

                                `${formatRod(
                                    baseRod,
                                    rod
                                )}\n\n` +

                                `${getRodDurabilityBar(
                                    rod.uses,
                                    configMaxUses
                                )}\n\n` +

                                `${SEPARATOR}\n\n` +

                                `🎣 Muốn câu: **${amount} lần**\n` +

                                `🎯 Độ bền: **${rod.uses}/${configMaxUses}**\n\n` +

                                `💡 Cần ít nhất **${amount}** độ bền.`
                        })

                    ]
                });
            }

            // ==================================================
            // 🪱 MỒI
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
            // ❌ KHÔNG CÓ MỒI
            // ==================================================

            if (
                totalBait <= 0
            ) {

                const baitText =
                    baitIds
                        .map(
                            id =>
                                `${getBaitEmoji(id)} ${baits[id].name}: **0**`
                        )
                        .join("\n");

                return message.reply({

                    embeds: [

                        createEmbed({

                            message,

                            color:
                                COLORS.error,

                            title:
                                "🪱 `NO BAIT`",

                            description:

                                `🎣 **CẦN CÂU**\n\n` +

                                `${formatRod(
                                    baseRod,
                                    rod
                                )}\n\n` +

                                `${getRodDurabilityBar(
                                    rod.uses,
                                    configMaxUses
                                )}\n\n` +

                                `${SEPARATOR}\n\n` +

                                `🪱 **MỒI HIỆN CÓ**\n\n` +

                                `${baitText || "*Không có mồi.*"}\n\n` +

                                `${SEPARATOR}\n\n` +

                                `💡 Hãy mua thêm mồi rồi thử lại.`
                        })

                    ]
                });
            }

            // ==================================================
            // 🐟 CÁ CỦA KHU VỰC
            // ==================================================

            const zoneFish =
                Array.isArray(fishList)
                    ? fishList.filter(
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
                    )
                    : [];

            if (
                zoneFish.length === 0
            ) {

                return message.reply({

                    embeds: [

                        createEmbed({

                            message,

                            color:
                                COLORS.error,

                            title:
                                "❌ Khu vực không có dữ liệu cá",

                            description:

                                `${zone.name}\n\n` +

                                `Khu vực đang có ID cá:\n` +

                                `\`${zone.fish?.join(
                                    ", "
                                ) || "Không có"}\`\n\n` +

                                `Nhưng các ID này không tồn tại trong \`fishList\`.`
                        })

                    ]
                });
            }

            // ==================================================
            // 🪱 CHỌN MỒI
            // ==================================================

            const ownerID =
                message.author.id;

            const baitListText =
                baitIds
                    .map(
                        id =>
                            `${getBaitEmoji(id)} ${baits[id].name} x${baitCounts[id]}`
                    )
                    .join("\n");

            const baitSelectEmbed =
                createEmbed({

                    message,

                    color:
                        COLORS.info,

                    title:
                        "⚡ `CHỌN MỒI`",

                    description:

                        `🌊 **${zone.name}**\n` +
                        `${zone.description || "*Một vùng nước bí ẩn...*"}\n\n` +

                        `${SEPARATOR}\n\n` +

                        `🎣 ${formatRod(
                            baseRod,
                            rod
                        )}\n` +

                        `${getRodDurabilityBar(
                            rod.uses,
                            configMaxUses
                        )}\n\n` +

                        `🎯 Số lần câu: **${amount}**\n` +
                        `🍀 Luck: **${formatLuck(rod.luck)}**\n\n` +

                        `🪱 **MỒI HIỆN CÓ**\n\n` +

                        `${baitListText || "*Không có mồi.*"}\n\n` +

                        `👇 **Chọn loại mồi:**`,

                    image:
                        zone.image
                });

            const baitRows =
                createBaitButtons(
                    user,
                    ownerID
                );

            const baitMessage =
                await message.reply({

                    embeds: [
                        baitSelectEmbed
                    ],

                    components:
                        baitRows
                });

            // ==================================================
            // 🪱 CHỜ CHỌN MỒI
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
                // KIỂM TRA MỒI
                // ==================================================

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
                                    "❌ `NOT ENOUGH BAIT`",

                                description:

                                    `${getBaitName(
                                        baitID
                                    )}\n\n` +

                                    `${SEPARATOR}\n\n` +

                                    `🎣 Cần: **${amount}**\n` +

                                    `🪱 Hiện có: **${selectedBaitCount}**\n\n` +

                                    `💡 Bạn không đủ loại mồi này để câu **${amount} lần**.`
                            })

                        ],

                        components: []
                    });

                    return;
                }

                // ==================================================
                // ⚡ PREPARING
                // ==================================================

                await interaction.update({

                    embeds: [

                        createEmbed({

                            message,

                            color:
                                COLORS.info,

                            title:
                                "⚡ `PREPARING FISHING`",

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

                                `✦ *Đang chuẩn bị...*`
                        })

                    ],

                    components: []
                });

            }

            catch (error) {

                return baitMessage.edit({

                    embeds: [

                        createEmbed({

                            message,

                            color:
                                COLORS.warning,

                            title:
                                "⏰ `BAIT SELECTION EXPIRED`",

                            description:

                                `Bạn đã không chọn mồi trong **30 giây**.\n\n` +

                                `${SEPARATOR}\n\n` +

                                `💡 Hãy dùng lại \`${prefix}fish ${amount}\` để câu cá.`
                        })

                    ],

                    components: []
                });
            }

            // ==================================================
            // ⏱️ THỜI GIAN CÂU
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
                    star *
                    150
                );

            const totalMs =
                Math.min(
                    amount *
                    perCatchMs,
                    30000
                );

            // ==================================================
            // 🎣 COUNTDOWN REALTIME
            // ==================================================

            await fishingCountdown({

                baitMessage,

                message,

                zone,

                amount,

                baitID,

                totalMs
            });

            // ==================================================
            // 🪱 KIỂM TRA MỒI LẠI
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
                                "❌ `NOT ENOUGH BAIT`",

                            description:

                                `Không đủ ${getBaitName(
                                    baitID
                                )} để hoàn thành lượt câu.\n\n` +

                                `${SEPARATOR}\n\n` +

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
            // 📊 SUMMARY
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
            // 🎣 CÂU CÁ
            // ==================================================

            for (
                let i = 0;
                i < amount;
                i++
            ) {

                if (
                    Number(
                        user.moi[baitID] || 0
                    ) <= 0
                ) {
                    break;
                }

                // Trừ mồi
                user.moi[baitID]--;

                user.moi[baitID] =
                    Math.max(
                        0,
                        user.moi[baitID]
                    );

                baitUsed[baitID]++;

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

                // Cân
                const weight =
                    getFishWeight(
                        catchFish
                    );

                // ==================================================
                // 💾 INVENTORY
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
            // 💥 CẦN GÃY
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
            // 📊 TỔNG KẾT
            // ==================================================

            const summaryList =
                Object.values(
                    caughtSummary
                ).sort(
                    (a, b) =>
                        b.count -
                        a.count
                );

            // ==================================================
            // 🐟 TEXT CÁ
            // ==================================================

            const catchText =
                summaryList

                    .map(item => {

                        const rarity =
                            getRarityDisplay(
                                item.fish
                            );

                        const rarityText =
                            rarity.name ===
                            "COMMON"
                                ? ""
                                : ` ${rarity.emoji} \`${rarity.name}\``;

                        return (

                            `${item.fish.emoji || "🐟"} ` +

                            `${item.fish.name} x${item.count}` +

                            ` · ⚖️ ${item.weight.toFixed(
                                2
                            )} KG` +

                            `${rarityText}`
                        );
                    })

                    .join("\n") ||

                "*Không câu được gì.*";

            // ==================================================
            // ⚖️ TỔNG KG
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
            // 🪱 MỒI ĐÃ DÙNG
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
            // 🪱 MỒI CÒN LẠI
            // ==================================================

            const baitRemaining =
                getBaitCount(
                    user,
                    baitID
                );

            // ==================================================
            // 📈 TỶ LỆ
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
            // 🎣 TRẠNG THÁI CẦN
            // ==================================================

            const rodStatus =
                rod.destroyed ||
                rod.uses <= 0
                    ? "💥 Đã gãy"
                    : "✅ Sẵn sàng";

            // ==================================================
            // ⭐ RARITY
            // ==================================================

            const bestRarity =
                getBestRarity(
                    summaryList
                );

            let resultColor =
                rod.destroyed
                    ? COLORS.danger
                    : COLORS.success;

            let rarityBanner = "";

            if (
                bestRarity ===
                "legendary"
            ) {

                resultColor =
                    COLORS.legendary;

                rarityBanner =
                    `🌟🌟🌟 **LEGENDARY CATCH!** 🌟🌟🌟\n\n`;

            } else if (
                bestRarity ===
                "mythical"
            ) {

                resultColor =
                    COLORS.mythical;

                rarityBanner =
                    `💜💜💜 **MYTHICAL CATCH!** 💜💜💜\n\n`;

            } else if (
                bestRarity ===
                "epic"
            ) {

                rarityBanner =
                    `✨ **EPIC CATCH!** ✨\n\n`;
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

                            `${rarityBanner}` +

                            `🌊 **${zone.name}**\n\n` +

                            `${SEPARATOR}\n\n` +

                            `🐟 **CHIẾN LỢI PHẨM**\n\n` +

                            `${catchText}\n\n` +

                            `${SEPARATOR}\n\n` +

                            `📊 **THỐNG KÊ**\n\n` +

                            `🎯 Câu thành công: **${actualCaught}/${amount}**\n` +

                            `📈 Tỷ lệ thành công: **${catchRate}%**\n` +

                            `⚖️ Tổng cân nặng: **${totalWeight.toFixed(
                                2
                            )} KG**\n` +

                            `🪱 Mồi đã dùng: **${baitText}**\n` +

                            `🪱 Mồi còn lại: **${baitRemaining}**\n\n` +

                            `${SEPARATOR}\n\n` +

                            `🎣 **CẦN CÂU**\n\n` +

                            `${formatRod(
                                baseRod,
                                rod
                            )}\n` +

                            `${getRodDurabilityBar(
                                rod.uses,
                                configMaxUses
                            )}\n\n` +

                            `🔧 Trạng thái: ${rodStatus}\n\n` +

                            (
                                rod.destroyed
                                    ? `💥 **Cần đã hết độ bền!** Hãy sửa cần trước khi câu tiếp.\n\n`
                                    : ""
                            ) +

                            `✦ *Chúc bạn câu được cá hiếm.*`,

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

            }

            catch {}
        }

        finally {

            // ==================================================
            // 🔓 MỞ KHÓA
            // ==================================================

            fishingLocks.delete(
                userID
            );
        }
    }
};
// ==========================================================
// DISCORD FISHING BOT
// BALANCED ECONOMY V2
// ==========================================================

const prefix = "f";

const prefixes = ["f"];


// ==========================================================
// EMOJI
// ==========================================================

const emoji = {

    money: "<:Fcoin_Vang:1534730937298980924>",
    coin: "🪙",

    fish: "🐟",
    rod: "🎣",
    bait: "🪱",

    shop: "🛒",
    sell: "💵",

    chest: "🎁",
    key: "🔑",

    insurance: "🛡️",

    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",

    quest: "📜",
    reward: "🎁",

    level: "⭐",

    common: "⚪",
    rare: "🔵",
    epic: "🟣",
    legendary: "🟡",
    mythical: "🔴",

    trash: "🗑️",
    boot: "🥾"

};


// ==========================================================
// FORMAT MONEY
// ==========================================================

function formatMoney(number) {

    number = Number(number) || 0;

    return number.toLocaleString("vi-VN");

}


// ==========================================================
// RANDOM
// ==========================================================

function randomInt(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;

}


function randomFloat(min, max) {

    return Math.random() * (max - min) + min;

}


// ==========================================================
// RATE STONE
// ==========================================================

const rateStone = {

    da_rate: {

        id: "da_rate",

        name: "Đá tăng tỉ lệ",

        emoji: "🪨",

        price: 50000,

        uses: 5,

        rate: 0.10

    }

};


// ==========================================================
// FISH LIST
// ==========================================================
//
// Bạn chưa đưa danh sách 150 cá gốc trong tin nhắn.
// Phần này tạo đủ ca1 -> ca150 để config không crash.
//
// Sau này bạn có thể thay toàn bộ block này bằng:
// const fishList = [ ...150 con cá thật... ];
//
// Không cần sửa các phần khác.
// ==========================================================

const fishList = Array.from(
    { length: 150 },
    (_, index) => {

        const number =
            index + 1;

        let rarity;
        let price;
        let rate;
        let min;
        let max;

        // --------------------------------------------------
        // CA 1 - 50
        // --------------------------------------------------

        if (number <= 50) {

            if (number <= 35) {

                rarity = "common";
                price = 80 + number * 4;
                rate = 100 - number * 0.8;

            } else if (number <= 44) {

                rarity = "rare";
                price = 300 + number * 10;
                rate = 25 - (number - 35) * 1.2;

            } else if (number <= 48) {

                rarity = "epic";
                price = 700 + number * 20;
                rate = 10 - (number - 44) * 1.2;

            } else if (number <= 49) {

                rarity = "legendary";
                price = 2500;
                rate = 2;

            } else {

                rarity = "mythical";
                price = 8000;
                rate = 0.5;

            }

            min = 0.5;
            max = 5 + (number / 10);

        }

        // --------------------------------------------------
        // CA 51 - 85
        // --------------------------------------------------

        else if (number <= 85) {

            const n =
                number - 50;

            if (n <= 22) {

                rarity = "common";
                price = 250 + n * 8;
                rate = 80 - n * 1.5;

            } else if (n <= 30) {

                rarity = "rare";
                price = 700 + n * 20;
                rate = 20 - (n - 22);

            } else if (n <= 33) {

                rarity = "epic";
                price = 1800 + n * 50;
                rate = 6 - (n - 30);

            } else if (n <= 34) {

                rarity = "legendary";
                price = 6000;
                rate = 1.2;

            } else {

                rarity = "mythical";
                price = 15000;
                rate = 0.3;

            }

            min = 1;
            max = 10 + (n / 5);

        }

        // --------------------------------------------------
        // CA 86 - 115
        // --------------------------------------------------

        else if (number <= 115) {

            const n =
                number - 85;

            if (n <= 17) {

                rarity = "common";
                price = 500 + n * 12;
                rate = 70 - n * 2;

            } else if (n <= 25) {

                rarity = "rare";
                price = 1300 + n * 35;
                rate = 15 - (n - 17) * 0.8;

            } else if (n <= 28) {

                rarity = "epic";
                price = 3500 + n * 80;
                rate = 5 - (n - 25);

            } else if (n <= 29) {

                rarity = "legendary";
                price = 12000;
                rate = 0.8;

            } else {

                rarity = "mythical";
                price = 30000;
                rate = 0.2;

            }

            min = 2;
            max = 18 + (n / 3);

        }

        // --------------------------------------------------
        // CA 116 - 135
        // --------------------------------------------------

        else if (number <= 135) {

            const n =
                number - 115;

            if (n <= 10) {

                rarity = "common";
                price = 1000 + n * 20;
                rate = 50 - n * 2;

            } else if (n <= 16) {

                rarity = "rare";
                price = 2500 + n * 60;
                rate = 10 - (n - 10) * 0.7;

            } else if (n <= 18) {

                rarity = "epic";
                price = 7000 + n * 150;
                rate = 3 - (n - 16) * 0.8;

            } else if (n === 19) {

                rarity = "legendary";
                price = 25000;
                rate = 0.5;

            } else {

                rarity = "mythical";
                price = 60000;
                rate = 0.12;

            }

            min = 3;
            max = 30 + (n / 2);

        }

        // --------------------------------------------------
        // CA 136 - 150
        // --------------------------------------------------

        else {

            const n =
                number - 135;

            if (n <= 6) {

                rarity = "common";
                price = 2000 + n * 40;
                rate = 35 - n * 3;

            } else if (n <= 10) {

                rarity = "rare";
                price = 5000 + n * 100;
                rate = 8 - (n - 6) * 1;

            } else if (n <= 12) {

                rarity = "epic";
                price = 15000 + n * 300;
                rate = 3 - (n - 10) * 0.8;

            } else if (n <= 14) {

                rarity = "legendary";
                price = 50000 + n * 1000;
                rate = 0.7 - (n - 12) * 0.2;

            } else {

                rarity = "mythical";
                price = 150000;
                rate = 0.08;

            }

            min = 5;
            max = 50 + n;

        }


        return {

            id:
                `ca${number}`,

            name:
                `Cá #${number}`,

            emoji:
                emoji.fish,

            price,

            rate:
                Math.max(
                    0.01,
                    Number(rate.toFixed(3))
                ),

            rarity,

            min,

            max

        };

    }
);


// ==========================================================
// TRASH
// ==========================================================

const trashItems = {

    torn_boot: {

        id: "torn_boot",

        name: "Ủng rách",

        emoji: "🥾",

        price: 0,

        sellPrice: 0,

        rarity: "common",

        rate: 100,

        min: 1,

        max: 1

    }

};


// ==========================================================
// FISH CONFIG
// ==========================================================

const fishConfig = {

    list: fishList,

    sellMultiplier: 1,

    minSellPrice: 0,

    trashEnabled: true,

    trash: trashItems

};


// ==========================================================
// PROFIT CLASS
// ==========================================================

const profitClass = {

    LOSS: "loss",

    BREAK_EVEN: "break_even",

    LOW_PROFIT: "low_profit",

    HIGH_PROFIT: "high_profit"

};


const profitClassConfig = {

    loss: {

        name: "Lỗ nhẹ",

        emoji: "🔴",

        color: 0xE74C3C

    },

    break_even: {

        name: "Hòa vốn",

        emoji: "⚪",

        color: 0xBDC3C7

    },

    low_profit: {

        name: "Lời ít",

        emoji: "🟢",

        color: 0x2ECC71

    },

    high_profit: {

        name: "Lời nhiều",

        emoji: "💰",

        color: 0xF1C40F

    }

};


// ==========================================================
// RODS
// ==========================================================

const rods = {

    wood: {

        id: "wood",

        name: "Cần câu gỗ",

        emoji: "<:cancau_1:1534625089088393358>",

        price: 10000,

        uses: 25,

        luck: 1.00,

        star: 1,

        maxLevel: 15

    },

    iron: {

        id: "iron",

        name: "Cần câu sắt",

        emoji: "<:cancau_2:1534635569219633212>",

        price: 30000,

        uses: 60,

        luck: 1.20,

        star: 2,

        maxLevel: 15

    },

    gold: {

        id: "gold",

        name: "Cần câu vàng",

        emoji: "<:cancau_3:1534625401119445170>",

        price: 75000,

        uses: 110,

        luck: 1.45,

        star: 3,

        maxLevel: 15

    },

    diamond: {

        id: "diamond",

        name: "Cần câu kim cương",

        emoji: "<:cancau_4:1534635400793165965>",

        price: 175000,

        uses: 275,

        luck: 1.80,

        star: 4,

        maxLevel: 15

    },

    mythic: {

        id: "mythic",

        name: "Cần câu huyền thoại",

        emoji: "<:cancau_5:1534635179778511100>",

        price: 400000,

        uses: 550,

        luck: 2.20,

        star: 5,

        maxLevel: 15

    }

};


// ==========================================================
// ROD TITLES
// ==========================================================

const rodTitles = {

    1: "Tân thủ",
    2: "Tập sự",
    3: "Người câu cá",
    4: "Thợ câu",
    5: "Cao thủ",
    6: "Lão luyện",
    7: "Chuyên gia",
    8: "Bậc thầy",
    9: "Đại sư",
    10: "Huyền thoại",
    11: "Thần câu",
    12: "Chúa tể đại dương",
    13: "Thủy thần",
    14: "Vô song",
    15: "Fishing God"

};


// ==========================================================
// UPGRADE
// ==========================================================

const upgrade = {

    maxLevel: 15,

    luckPerLevel: 0.05,

    success: {

        0: 70,
        1: 65,
        2: 60,
        3: 55,
        4: 50,

        5: 45,
        6: 40,
        7: 35,
        8: 30,
        9: 25,

        10: 22,
        11: 18,
        12: 14,
        13: 10,
        14: 6

    },

    minLevel: 0,

    maxLevel: 15

};


// ==========================================================
// BAITS
// ==========================================================

const baits = {

    worm: {

        id: "worm",

        name: "Mồi giun",

        emoji: "🪱",

        price: 50,

        luck: 1.05

    },

    shrimp: {

        id: "shrimp",

        name: "Mồi tôm",

        emoji: "🦐",

        price: 200,

        luck: 1.15

    },

    fish_food: {

        id: "fish_food",

        name: "Thức ăn cá",

        emoji: "🥣",

        price: 500,

        luck: 1.30

    },

    golden_bait: {

        id: "golden_bait",

        name: "Mồi vàng",

        emoji: "✨",

        price: 2000,

        luck: 1.60

    }

};


// ==========================================================
// KEYS
// ==========================================================

const keys = {

    bronze_key: {

        id: "bronze_key",

        name: "Chìa khóa đồng",

        emoji: "🗝️",

        price: 1000

    },

    silver_key: {

        id: "silver_key",

        name: "Chìa khóa bạc",

        emoji: "🔑",

        price: 4000

    },

    gold_key: {

        id: "gold_key",

        name: "Chìa khóa vàng",

        emoji: "🔐",

        price: 12000

    },

    diamond_key: {

        id: "diamond_key",

        name: "Chìa khóa kim cương",

        emoji: "💎",

        price: 30000

    }

};


// ==========================================================
// CHESTS
// ==========================================================

const chests = {

    wooden_chest: {

        id: "wooden_chest",

        name: "Rương gỗ",

        emoji: "📦",

        rarity: "common",

        key: "bronze_key",

        minReward: 300,

        maxReward: 1200

    },

    silver_chest: {

        id: "silver_chest",

        name: "Rương bạc",

        emoji: "🗃️",

        rarity: "rare",

        key: "silver_key",

        minReward: 1500,

        maxReward: 5500

    },

    gold_chest: {

        id: "gold_chest",

        name: "Rương vàng",

        emoji: "🎁",

        rarity: "legendary",

        key: "gold_key",

        minReward: 7000,

        maxReward: 22000

    },

    diamond_chest: {

        id: "diamond_chest",

        name: "Rương kim cương",

        emoji: "💎",

        rarity: "mythical",

        key: "diamond_key",

        minReward: 25000,

        maxReward: 80000

    }

};


// ==========================================================
// INSURANCE
// ==========================================================

const insurance = {

    basic_insurance: {

        id: "basic_insurance",

        name: "Bảo hiểm cơ bản",

        emoji: "🛡️",

        price: 2000,

        protection: 25

    },

    advanced_insurance: {

        id: "advanced_insurance",

        name: "Bảo hiểm cao cấp",

        emoji: "🛡️",

        price: 10000,

        protection: 50

    },

    premium_insurance: {

        id: "premium_insurance",

        name: "Bảo hiểm VIP",

        emoji: "💠",

        price: 40000,

        protection: 100

    }

};


// ==========================================================
// SELL
// ==========================================================

const sellConfig = {

    multiplier: 1,

    minPrice: 0,

    trashSellPrice: 0

};


// ==========================================================
// SHOP
// ==========================================================

const shop = {

    rods,

    baits,

    keys,

    insurance,

    rateStone,

    sell: sellConfig

};


// ==========================================================
// QUEST
// ==========================================================

const questConfig = {

    maxPerDay: 5,

    reward: {

        easy: {

            min: 400,

            max: 1000

        },

        normal: {

            min: 1000,

            max: 2500

        },

        rare: {

            min: 2500,

            max: 5500

        },

        legendary: {

            min: 5000,

            max: 10000

        }

    }

};


// ==========================================================
// RARITY
// ==========================================================

const rarityConfig = {

    common: {

        name: "Common",

        emoji: emoji.common,

        color: 0xFFFFFF

    },

    rare: {

        name: "Rare",

        emoji: emoji.rare,

        color: 0x3498DB

    },

    epic: {

        name: "Epic",

        emoji: emoji.epic,

        color: 0x9B59B6

    },

    legendary: {

        name: "Legendary",

        emoji: emoji.legendary,

        color: 0xF1C40F

    },

    mythical: {

        name: "Mythical",

        emoji: emoji.mythical,

        color: 0xE74C3C

    }

};


// ==========================================================
// LEVEL
// ==========================================================

const levelConfig = {

    maxLevel: 100,

    baseExp: 100,

    expMultiplier: 1.5,

    rewardPerLevel: 500

};


// ==========================================================
// FISHING CONFIG
// ==========================================================

const fishingConfig = {

    cooldown: 6000,

    minWeight: 0.5,

    maxWeight: 100,

    bonusChance: 5,

    trashChance: 15,

    limitWeightByConfig: true,

    trashEnabled: true

};


// ==========================================================
// ECONOMY
// ==========================================================

const economyConfig = {

    startingMoney: 1000,

    maxMoney: 999999999,

    dailyReward: {

        min: 1000,

        max: 3000

    },

    includeRodDepreciation: true,

    rodCostWeight: 1,

    includeBaitCost: true

};


// ==========================================================
// FISHING ZONES
// ==========================================================

const fishingZones = {

    tropical: {

        id: "tropical",

        name: "🌴 Biển Nhiệt Đới",

        description:
            "Vùng biển khởi đầu, nhiều cá phổ biến và dễ câu.",

        fish: Array.from(
            { length: 50 },
            (_, i) => `ca${i + 1}`
        ),

        trashRate: 8,

        image:
            "https://media.discordapp.net/attachments/1534756360103788596/1535257413786140733/1000013743-Photoroom.png"

    },

    cold: {

        id: "cold",

        name: "❄️ Biển Băng Giá",

        description:
            "Vùng biển lạnh với nhiều loài cá quý hiếm.",

        fish: Array.from(
            { length: 35 },
            (_, i) => `ca${i + 51}`
        ),

        trashRate: 7,

        image:
            "https://media.discordapp.net/attachments/1534756360103788596/1535257294261067868/1000013742-Photoroom.png"

    },

    swamp: {

        id: "swamp",

        name: "🐊 Đầm Lầy",

        description:
            "Đầm lầy nguy hiểm với nhiều sinh vật kỳ lạ.",

        fish: Array.from(
            { length: 30 },
            (_, i) => `ca${i + 86}`
        ),

        trashRate: 10,

        image:
            "https://media.discordapp.net/attachments/1534756360103788596/1535257149284941865/1000013741-Photoroom.png"

    },

    deep: {

        id: "deep",

        name: "🌊 Vực Sâu",

        description:
            "Vùng nước sâu với những sinh vật cực kỳ hiếm.",

        fish: Array.from(
            { length: 20 },
            (_, i) => `ca${i + 116}`
        ),

        trashRate: 6,

        image:
            "https://media.discordapp.net/attachments/1534756360103788596/1535256926739374100/1000013740-Photoroom.png"

    },

    volcano: {

        id: "volcano",

        name: "🌋 Núi Lửa",

        description:
            "Vùng biển núi lửa chỉ xuất hiện vào Chủ Nhật.",

        fish: Array.from(
            { length: 15 },
            (_, i) => `ca${i + 136}`
        ),

        trashRate: 4,

        image:
            "https://media.discordapp.net/attachments/1534756360103788596/1535256789833093150/1000013739-Photoroom.png"

    }

};


// ==========================================================
// RARITY LUCK
// ==========================================================

const rarityLuckConfig = {

    common: {

        base: 1.00,

        luckScale: 0.00

    },

    rare: {

        base: 0.35,

        luckScale: 0.18

    },

    epic: {

        base: 0.16,

        luckScale: 0.40

    },

    legendary: {

        base: 0.055,

        luckScale: 0.75

    },

    mythical: {

        base: 0.012,

        luckScale: 1.10

    }

};


// ==========================================================
// LUCK RARITY MULTIPLIER
// ==========================================================

function getLuckRarityMultiplier(
    rarity,
    luck = 1
) {

    const config =
        rarityLuckConfig[rarity];

    if (!config) {

        return 1;

    }

    const safeLuck =
        Math.max(
            1,
            Number(luck) || 1
        );

    if (rarity === "common") {

        return 1;

    }

    const extraLuck =
        Math.max(
            0,
            safeLuck - 1
        );

    return (
        config.base +
        (
            extraLuck *
            config.luckScale
        )
    );

}


// ==========================================================
// FISH WEIGHT
// ==========================================================

function getFishWeight(
    fish,
    luck = 1
) {

    if (!fish) {

        return 0;

    }

    const rate =
        Number(fish.rate) || 0;

    if (rate <= 0) {

        return 0;

    }

    const rarity =
        fish.rarity || "common";

    const multiplier =
        getLuckRarityMultiplier(
            rarity,
            luck
        );

    return (
        rate *
        multiplier
    );

}


// ==========================================================
// WEIGHTED RANDOM
// ==========================================================

function weightedRandom(
    items,
    luck = 1
) {

    if (
        !Array.isArray(items) ||
        items.length === 0
    ) {

        return null;

    }

    const validItems =
        items.filter(
            item =>
                item &&
                Number(item.rate) > 0
        );

    if (!validItems.length) {

        return null;

    }

    let totalWeight = 0;

    const weighted =
        validItems.map(item => {

            const weight =
                getFishWeight(
                    item,
                    luck
                );

            totalWeight +=
                weight;

            return {

                item,

                weight

            };

        });

    let random =
        Math.random() *
        totalWeight;

    for (
        const entry
        of weighted
    ) {

        random -=
            entry.weight;

        if (
            random <= 0
        ) {

            return entry.item;

        }

    }

    return weighted[
        weighted.length - 1
    ].item;

}


// ==========================================================
// PICK FISH
// ==========================================================

function pickFish(
    fishIds,
    luck = 1
) {

    if (
        !Array.isArray(fishIds)
    ) {

        return null;

    }

    const availableFish =
        fishList.filter(
            fish =>
                fishIds.includes(
                    fish.id
                )
        );

    if (
        !availableFish.length
    ) {

        return null;

    }

    return weightedRandom(
        availableFish,
        luck
    );

}


// ==========================================================
// PICK TRASH
// ==========================================================

function pickTrash() {

    const trash =
        Object.values(
            trashItems
        );

    return weightedRandom(
        trash,
        1
    );

}


// ==========================================================
// ROD COST
// ==========================================================

function calculateRodCostPerCast(
    rodId
) {

    if (
        !rodId ||
        !rods[rodId]
    ) {

        return 0;

    }

    const rod =
        rods[rodId];

    const price =
        Number(rod.price) || 0;

    const uses =
        Number(rod.uses) || 1;

    return (
        price /
        uses
    );

}


// ==========================================================
// BAIT COST
// ==========================================================

function calculateBaitCostPerCast(
    baitId
) {

    if (
        !baitId ||
        !baits[baitId]
    ) {

        return 0;

    }

    return Number(
        baits[baitId].price
    ) || 0;

}


// ==========================================================
// TOTAL FISHING COST
// ==========================================================

function calculateFishingCost(
    rodId = "wood",
    baitId = null
) {

    let cost = 0;

    if (
        economyConfig.includeRodDepreciation
    ) {

        cost +=
            calculateRodCostPerCast(
                rodId
            ) *
            economyConfig.rodCostWeight;

    }

    if (
        baitId &&
        economyConfig.includeBaitCost
    ) {

        cost +=
            calculateBaitCostPerCast(
                baitId
            );

    }

    return Math.floor(
        cost
    );

}


// ==========================================================
// SELL FISH
// ==========================================================

function calculateFishSellPrice(
    fish,
    weight
) {

    if (!fish) {

        return 0;

    }

    if (
        fish.sellPrice !== undefined
    ) {

        return Math.max(
            0,
            Number(
                fish.sellPrice
            ) || 0
        );

    }

    const safeWeight =
        Math.max(
            0,
            Number(weight) || 0
        );

    const price =
        Number(fish.price) *
        safeWeight *
        sellConfig.multiplier;

    return Math.max(
        sellConfig.minPrice,
        Math.floor(price)
    );

}


// ==========================================================
// SELL TRASH
// ==========================================================

function calculateTrashSellPrice(
    item
) {

    if (!item) {

        return 0;

    }

    if (
        item.id === "torn_boot"
    ) {

        return 0;

    }

    return Math.max(
        0,
        Number(
            item.sellPrice
        ) || 0
    );

}


// ==========================================================
// GENERATE FISH WEIGHT
// ==========================================================

function generateFishWeight(
    fish
) {

    if (!fish) {

        return 0;

    }

    const min =
        Math.max(
            fishingConfig.minWeight,
            Number(fish.min) ||
            fishingConfig.minWeight
        );

    const max =
        Math.min(
            fishingConfig.maxWeight,
            Number(fish.max) ||
            fishingConfig.maxWeight
        );

    if (
        max <= min
    ) {

        return Number(
            min.toFixed(1)
        );

    }

    const random =
        Math.pow(
            Math.random(),
            0.65
        );

    const weight =
        min +
        (
            (max - min) *
            random
        );

    return Number(
        weight.toFixed(1)
    );

}


// ==========================================================
// AVERAGE WEIGHT
// ==========================================================

function getAverageWeight(
    fish
) {

    if (!fish) {

        return 0;

    }

    const min =
        Number(fish.min) || 0;

    const max =
        Number(fish.max) || 0;

    return (
        min +
        (
            (max - min) *
            0.58
        )
    );

}


// ==========================================================
// EXPECTED VALUE
// ==========================================================

function getExpectedFishValue(
    fish
) {

    if (!fish) {

        return 0;

    }

    const averageWeight =
        getAverageWeight(
            fish
        );

    return (
        Number(fish.price) *
        averageWeight
    );

}


// ==========================================================
// PROFIT CLASS
// ==========================================================

function getProfitClass(
    fish
) {

    const value =
        getExpectedFishValue(
            fish
        );

    if (
        value < 100
    ) {

        return profitClass.LOSS;

    }

    if (
        value < 300
    ) {

        return profitClass.BREAK_EVEN;

    }

    if (
        value < 1000
    ) {

        return profitClass.LOW_PROFIT;

    }

    return profitClass.HIGH_PROFIT;

}


// ==========================================================
// APPLY PROFIT CLASS
// ==========================================================

function applyProfitClasses() {

    for (
        const fish
        of fishList
    ) {

        fish.expectedValue =
            Math.floor(
                getExpectedFishValue(
                    fish
                )
            );

        fish.profitClass =
            getProfitClass(
                fish
            );

    }

}


// ==========================================================
// FISHING RESULT
// ==========================================================

function generateFishingResult(
    zoneId,
    luck = 1
) {

    const zone =
        fishingZones[
            zoneId
        ];

    if (!zone) {

        return {

            type: "error",

            item: null,

            weight: 0,

            price: 0

        };

    }


    // ------------------------------------------------------
    // TRASH
    // ------------------------------------------------------

    const trashChance =
        Number(
            zone.trashRate
        ) || 0;

    if (
        fishingConfig.trashEnabled &&
        Math.random() * 100 <
        trashChance
    ) {

        const trash =
            pickTrash();

        if (trash) {

            return {

                type: "trash",

                item: trash,

                weight: 1,

                price:
                    calculateTrashSellPrice(
                        trash
                    ),

                profitClass:
                    profitClass.LOSS

            };

        }

    }


    // ------------------------------------------------------
    // FISH
    // ------------------------------------------------------

    const fish =
        pickFish(
            zone.fish,
            Math.max(
                1,
                Number(luck) || 1
            )
        );

    if (!fish) {

        return {

            type: "error",

            item: null,

            weight: 0,

            price: 0

        };

    }

    const weight =
        generateFishWeight(
            fish
        );

    const price =
        calculateFishSellPrice(
            fish,
            weight
        );

    return {

        type: "fish",

        item: fish,

        weight,

        price,

        profitClass:
            getProfitClass(
                fish
            )

    };

}


// ==========================================================
// REAL PROFIT
// ==========================================================

function calculateFishProfit(
    fish,
    weight,
    rodId = "wood",
    baitId = null
) {

    const revenue =
        calculateFishSellPrice(
            fish,
            weight
        );

    const cost =
        calculateFishingCost(
            rodId,
            baitId
        );

    const profit =
        revenue -
        cost;

    return {

        revenue,

        cost,

        profit,

        profitable:
            profit > 0

    };

}


// ==========================================================
// ANALYZE ZONE
// ==========================================================

function analyzeZoneRates(
    zoneId,
    luck = 1
) {

    const zone =
        fishingZones[
            zoneId
        ];

    if (!zone) {

        return null;

    }

    const fish =
        fishList.filter(
            f =>
                zone.fish.includes(
                    f.id
                )
        );

    let total = 0;

    const data =
        fish.map(
            f => {

                const weight =
                    getFishWeight(
                        f,
                        luck
                    );

                total +=
                    weight;

                return {

                    id: f.id,

                    name: f.name,

                    rarity:
                        f.rarity,

                    weight

                };

            }
        );

    return data.map(
        entry => ({

            ...entry,

            chance:
                total > 0
                    ? (
                        entry.weight /
                        total
                    ) * 100
                    : 0

        })
    );

}


// ==========================================================
// ANALYZE RARITY
// ==========================================================

function analyzeRarityRates(
    zoneId,
    luck = 1
) {

    const data =
        analyzeZoneRates(
            zoneId,
            luck
        );

    if (!data) {

        return null;

    }

    const summary = {

        common: 0,

        rare: 0,

        epic: 0,

        legendary: 0,

        mythical: 0

    };

    for (
        const item
        of data
    ) {

        if (
            summary[
                item.rarity
            ] !== undefined
        ) {

            summary[
                item.rarity
            ] +=
                item.chance;

        }

    }

    return summary;

}


// ==========================================================
// TOTAL LUCK
// ==========================================================

function calculateTotalLuck(
    rodId = "wood",
    rodLevel = 0,
    baitId = null,
    rateStoneBonus = 0
) {

    const rod =
        rods[rodId];

    const rodLuck =
        rod
            ? Number(
                rod.luck
            ) || 1
            : 1;

    const baitLuck =
        baitId &&
        baits[baitId]
            ? Number(
                baits[baitId].luck
            ) || 1
            : 1;

    const level =
        Math.max(
            0,
            Math.min(
                15,
                Number(
                    rodLevel
                ) || 0
            )
        );

    const upgradeLuck =
        level *
        upgrade.luckPerLevel;

    const stoneLuck =
        Math.max(
            0,
            Number(
                rateStoneBonus
            ) || 0
        );

    const totalLuck =
        rodLuck +
        upgradeLuck +
        (
            baitLuck - 1
        ) +
        stoneLuck;

    return Number(
        Math.max(
            1,
            totalLuck
        ).toFixed(2)
    );

}


// ==========================================================
// COMPATIBILITY ALIASES
// ==========================================================

const rodList = rods;

const baitList = baits;

const keyList = keys;

const chestList = chests;


// ==========================================================
// VALIDATE CONFIG
// ==========================================================

function validateConfig() {

    const errors = [];


    // ------------------------------------------------------
    // FISH
    // ------------------------------------------------------

    if (
        fishList.length !== 150
    ) {

        errors.push(
            `Fish hiện tại: ${fishList.length}/150`
        );

    }

    const ids =
        new Set();

    for (
        const fish
        of fishList
    ) {

        if (!fish.id) {

            errors.push(
                "Fish thiếu id"
            );

        }

        if (
            ids.has(
                fish.id
            )
        ) {

            errors.push(
                `${fish.id} bị trùng id`
            );

        }

        ids.add(
            fish.id
        );

        if (!fish.name) {

            errors.push(
                `${fish.id || "unknown"} thiếu name`
            );

        }

        if (
            Number(fish.price) < 0
        ) {

            errors.push(
                `${fish.id} có price < 0`
            );

        }

        if (
            Number(fish.rate) <= 0
        ) {

            errors.push(
                `${fish.id} có rate <= 0`
            );

        }

        if (
            Number(fish.min) >
            Number(fish.max)
        ) {

            errors.push(
                `${fish.id} min > max`
            );

        }

        const validRarity = [

            "common",
            "rare",
            "epic",
            "legendary",
            "mythical"

        ];

        if (
            !validRarity.includes(
                fish.rarity
            )
        ) {

            errors.push(
                `${fish.id} rarity không hợp lệ`
            );

        }

    }


    // ------------------------------------------------------
    // ZONES
    // ------------------------------------------------------

    for (
        const zone
        of Object.values(
            fishingZones
        )
    ) {

        if (
            !Array.isArray(
                zone.fish
            )
        ) {

            errors.push(
                `${zone.id} thiếu fish`
            );

            continue;

        }

        for (
            const fishId
            of zone.fish
        ) {

            const exists =
                fishList.some(
                    fish =>
                        fish.id ===
                        fishId
                );

            if (!exists) {

                errors.push(
                    `${zone.id}: không tìm thấy ${fishId}`
                );

            }

        }

    }


    // ------------------------------------------------------
    // RODS
    // ------------------------------------------------------

    for (
        const rod
        of Object.values(
            rods
        )
    ) {

        if (
            rod.price < 0
        ) {

            errors.push(
                `${rod.id} có giá < 0`
            );

        }

        if (
            rod.uses <= 0
        ) {

            errors.push(
                `${rod.id} uses <= 0`
            );

        }

        if (
            rod.luck < 1
        ) {

            errors.push(
                `${rod.id} luck < 1`
            );

        }

    }


    // ------------------------------------------------------
    // BAITS
    // ------------------------------------------------------

    for (
        const bait
        of Object.values(
            baits
        )
    ) {

        if (
            bait.price < 0
        ) {

            errors.push(
                `${bait.id} price < 0`
            );

        }

        if (
            bait.luck < 1
        ) {

            errors.push(
                `${bait.id} luck < 1`
            );

        }

    }


    return {

        valid:
            errors.length === 0,

        errors

    };

}


// ==========================================================
// APPLY PROFIT
// ==========================================================

applyProfitClasses();


// ==========================================================
// EXPORT
// ==========================================================

module.exports = {

    // Prefix
    prefix,
    prefixes,

    // Emoji
    emoji,

    // Utility
    formatMoney,
    randomInt,
    randomFloat,

    // Fish
    fishList,
    fishConfig,

    // Trash
    trashItems,

    // Random
    weightedRandom,
    pickFish,
    pickTrash,

    // Weight
    generateFishWeight,

    // Fishing
    generateFishingResult,

    // Economy
    getAverageWeight,
    getExpectedFishValue,
    getProfitClass,
    calculateFishProfit,
    calculateFishingCost,
    calculateRodCostPerCast,
    calculateBaitCostPerCast,

    // Profit
    profitClass,
    profitClassConfig,
    applyProfitClasses,

    // Luck
    calculateTotalLuck,
    getLuckRarityMultiplier,
    getFishWeight,

    // Analysis
    analyzeZoneRates,
    analyzeRarityRates,

    // Sell
    calculateFishSellPrice,
    calculateTrashSellPrice,

    // Rod
    rods,
    rodList,
    rodTitles,

    // Upgrade
    upgrade,

    // Zones
    fishingZones,

    // Baits
    baits,
    baitList,

    // Keys
    keys,
    keyList,

    // Chests
    chests,
    chestList,

    // Insurance
    insurance,

    // Rate Stone
    rateStone,

    // Shop
    shop,

    // Sell config
    sellConfig,

    // Quest
    questConfig,

    // Rarity
    rarityConfig,

    // Level
    levelConfig,

    // Fishing config
    fishingConfig,

    // Economy
    economyConfig,

    // Validation
    validateConfig

};
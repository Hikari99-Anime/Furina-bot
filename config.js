// ==========================================
// DISCORD FISHING BOT - CONFIG
// ==========================================


// ==========================================
// PREFIX
// ==========================================

const prefix = "f";

const prefixes = [
    "f"
];


// ==========================================
// EMOJI
// ==========================================

const emoji = {

    // Tiền
    money: "💰",
    coin: "🪙",

    // Cá
    fish: "🐟",

    // Cần câu
    rod: "🎣",

    // Mồi
    bait: "🪱",

    // Shop
    shop: "🛒",

    // Bán
    sell: "💵",

    // Rương
    chest: "🎁",

    // Chìa khóa
    key: "🔑",

    // Bảo hiểm
    insurance: "🛡️",

    // Trạng thái
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",

    // Quest
    quest: "📜",
    reward: "🎁",

    // Level
    level: "⭐",

    // Rarity
    common: "⚪",
    rare: "🔵",
    epic: "🟣",
    legendary: "🟡",
    mythical: "🔴"

};


// ==========================================
// FORMAT MONEY
// ==========================================

function formatMoney(number) {

    number = Number(number) || 0;

    return number.toLocaleString("vi-VN");

}


// ==========================================
// FISH LIST
// ==========================================

const fishList = [

    {
        id: "carp",
        name: "Cá chép",
        emoji: "🐟",
        price: 100,
        rarity: "common",
        catchRate: 30
    },

    {
        id: "tilapia",
        name: "Cá rô phi",
        emoji: "🐟",
        price: 120,
        rarity: "common",
        catchRate: 25
    },

    {
        id: "catfish",
        name: "Cá trê",
        emoji: "🐟",
        price: 150,
        rarity: "common",
        catchRate: 20
    },

    {
        id: "mackerel",
        name: "Cá thu",
        emoji: "🐠",
        price: 200,
        rarity: "common",
        catchRate: 15
    },

    {
        id: "salmon",
        name: "Cá hồi",
        emoji: "🐠",
        price: 500,
        rarity: "rare",
        catchRate: 8
    },

    {
        id: "tuna",
        name: "Cá ngừ",
        emoji: "🐟",
        price: 700,
        rarity: "rare",
        catchRate: 6
    },

    {
        id: "koi",
        name: "Cá Koi",
        emoji: "🐠",
        price: 1000,
        rarity: "rare",
        catchRate: 5
    },

    {
        id: "pufferfish",
        name: "Cá nóc",
        emoji: "🐡",
        price: 1200,
        rarity: "rare",
        catchRate: 4
    },

    {
        id: "goldfish",
        name: "Cá vàng",
        emoji: "🐠",
        price: 2500,
        rarity: "epic",
        catchRate: 3
    },

    {
        id: "swordfish",
        name: "Cá kiếm",
        emoji: "🐟",
        price: 3500,
        rarity: "epic",
        catchRate: 2.5
    },

    {
        id: "anglerfish",
        name: "Cá cần câu",
        emoji: "🐟",
        price: 5000,
        rarity: "epic",
        catchRate: 2
    },

    {
        id: "electric_eel",
        name: "Lươn điện",
        emoji: "🐍",
        price: 6500,
        rarity: "epic",
        catchRate: 1.5
    },

    {
        id: "shark",
        name: "Cá mập",
        emoji: "🦈",
        price: 10000,
        rarity: "legendary",
        catchRate: 1
    },

    {
        id: "whale",
        name: "Cá voi",
        emoji: "🐋",
        price: 15000,
        rarity: "legendary",
        catchRate: 0.7
    },

    {
        id: "dragon_fish",
        name: "Cá rồng",
        emoji: "🐉",
        price: 25000,
        rarity: "legendary",
        catchRate: 0.5
    },

    {
        id: "golden_dragon_fish",
        name: "Cá rồng vàng",
        emoji: "🐉",
        price: 50000,
        rarity: "mythical",
        catchRate: 0.2
    },

    {
        id: "leviathan",
        name: "Leviathan",
        emoji: "🐲",
        price: 100000,
        rarity: "mythical",
        catchRate: 0.1
    }

];


// ==========================================
// FISH CONFIG
// ==========================================

const fishConfig = {

    list: fishList,

    sellMultiplier: 1

};


// ==========================================
// RODS
// ==========================================

const rods = {

    // ======================================
    // 1 - CẦN GỖ
    // ======================================

    wood: {

        id: "wood",

        name: "Cần câu gỗ",

        emoji: "<:cancau_1:1534625089088393358>",

        emojiId: "1534625089088393358",

        price: 0,

        luck: 1,

        maxLevel: 5

    },


    // ======================================
    // 2 - CẦN SẮT
    // ======================================

    iron: {

        id: "iron",

        name: "Cần câu sắt",

        emoji: "<:cancau_2:1534635569219633212>",

        emojiId: "1534635569219633212",

        price: 5000,

        luck: 1.2,

        maxLevel: 10

    },


    // ======================================
    // 3 - CẦN VÀNG
    // ======================================

    gold: {

        id: "gold",

        name: "Cần câu vàng",

        emoji: "<:cancau_3:1534625401119445170>",

        emojiId: "1534625401119445170",

        price: 25000,

        luck: 1.5,

        maxLevel: 15

    },


    // ======================================
    // 4 - CẦN KIM CƯƠNG
    // ======================================

    diamond: {

        id: "diamond",

        name: "Cần câu kim cương",

        emoji: "<:cancau_4:1534635400793165965>",

        emojiId: "1534635400793165965",

        price: 100000,

        luck: 2,

        maxLevel: 20

    },


    // ======================================
    // 5 - CẦN HUYỀN THOẠI
    // ======================================

    legendary: {

        id: "legendary",

        name: "Cần câu huyền thoại",

        emoji: "<:cancau_5:1534635179778511100>",

        emojiId: "1534635179778511100",

        price: 500000,

        luck: 2.5,

        maxLevel: 25

    }

};


// ==========================================
// ROD TITLES
// ==========================================

const rodTitles = {

    0: "Tân thủ",

    1: "Người mới",

    2: "Tập sự",

    3: "Ngư dân",

    4: "Thợ câu",

    5: "Cao thủ",

    6: "Lão luyện",

    7: "Chuyên gia",

    8: "Bậc thầy",

    9: "Đại sư",

    10: "Ngư vương",

    11: "Ngư vương cao cấp",

    12: "Thợ săn biển",

    13: "Kẻ chinh phục",

    14: "Bá chủ đại dương",

    15: "Huyền thoại",

    16: "Huyền thoại tối cao",

    17: "Chúa tể biển cả",

    18: "Chúa tể đại dương",

    19: "Thần câu",

    20: "Thần câu tối cao",

    21: "Thần biển",

    22: "Vua đại dương",

    23: "Bá chủ huyền thoại",

    24: "Chí tôn",

    25: "Ngư thần"

};


// ==========================================
// BAITS
// ==========================================

const baits = {

    worm: {

        id: "worm",

        name: "Mồi giun",

        emoji: "🪱",

        price: 100,

        luck: 1.1

    },

    shrimp: {

        id: "shrimp",

        name: "Mồi tôm",

        emoji: "🦐",

        price: 500,

        luck: 1.25

    },

    fish_food: {

        id: "fish_food",

        name: "Thức ăn cá",

        emoji: "🥣",

        price: 1000,

        luck: 1.5

    },

    golden_bait: {

        id: "golden_bait",

        name: "Mồi vàng",

        emoji: "✨",

        price: 5000,

        luck: 2

    }

};


// ==========================================
// KEYS
// ==========================================

const keys = {

    bronze_key: {

        id: "bronze_key",

        name: "Chìa khóa đồng",

        emoji: "🗝️",

        price: 2500

    },

    silver_key: {

        id: "silver_key",

        name: "Chìa khóa bạc",

        emoji: "🔑",

        price: 10000

    },

    gold_key: {

        id: "gold_key",

        name: "Chìa khóa vàng",

        emoji: "🔐",

        price: 50000

    },

    diamond_key: {

        id: "diamond_key",

        name: "Chìa khóa kim cương",

        emoji: "💎",

        price: 150000

    }

};


// ==========================================
// CHESTS
// ==========================================

const chests = {

    wooden_chest: {

        id: "wooden_chest",

        name: "Rương gỗ",

        emoji: "📦",

        rarity: "common",

        key: "bronze_key",

        minReward: 500,

        maxReward: 2500

    },

    silver_chest: {

        id: "silver_chest",

        name: "Rương bạc",

        emoji: "🗃️",

        rarity: "rare",

        key: "silver_key",

        minReward: 2500,

        maxReward: 10000

    },

    gold_chest: {

        id: "gold_chest",

        name: "Rương vàng",

        emoji: "🎁",

        rarity: "legendary",

        key: "gold_key",

        minReward: 10000,

        maxReward: 50000

    },

    diamond_chest: {

        id: "diamond_chest",

        name: "Rương kim cương",

        emoji: "💎",

        rarity: "mythical",

        key: "diamond_key",

        minReward: 50000,

        maxReward: 200000

    }

};


// ==========================================
// INSURANCE
// ==========================================

const insurance = {

    basic_insurance: {

        id: "basic_insurance",

        name: "Bảo hiểm cơ bản",

        emoji: "🛡️",

        price: 5000,

        protection: 25

    },

    advanced_insurance: {

        id: "advanced_insurance",

        name: "Bảo hiểm cao cấp",

        emoji: "🛡️",

        price: 25000,

        protection: 50

    },

    premium_insurance: {

        id: "premium_insurance",

        name: "Bảo hiểm VIP",

        emoji: "💠",

        price: 100000,

        protection: 100

    }

};


// ==========================================
// SELL CONFIG
// ==========================================

const sellConfig = {

    multiplier: 1,

    minPrice: 1

};


// ==========================================
// SHOP CONFIG
// ==========================================

const shop = {

    rods,

    baits,

    keys,

    insurance,

    sell: sellConfig

};


// ==========================================
// QUEST CONFIG
// ==========================================

const questConfig = {

    maxPerDay: 5,

    reward: {

        easy: {

            min: 2500,

            max: 4500

        },

        normal: {

            min: 4000,

            max: 12000

        },

        rare: {

            min: 10000,

            max: 18000

        },

        legendary: {

            min: 22000,

            max: 35000

        }

    }

};


// ==========================================
// RARITY CONFIG
// ==========================================

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


// ==========================================
// LEVEL CONFIG
// ==========================================

const levelConfig = {

    maxLevel: 100,

    baseExp: 100,

    expMultiplier: 1.5,

    rewardPerLevel: 1000

};


// ==========================================
// FISHING CONFIG
// ==========================================

const fishingConfig = {

    cooldown: 5000,

    minWeight: 0.5,

    maxWeight: 20,

    bonusChance: 5

};


// ==========================================
// ECONOMY CONFIG
// ==========================================

const economyConfig = {

    startingMoney: 1000,

    maxMoney: 999999999999,

    dailyReward: {

        min: 1000,

        max: 5000

    }

};


// ==========================================
// COMPATIBILITY ALIASES
// ==========================================

const rodList = rods;

const baitList = baits;

const keyList = keys;

const chestList = chests;


// ==========================================
// EXPORT
// ==========================================

module.exports = {

    // Prefix
    prefix,
    prefixes,

    // Emoji
    emoji,

    // Utility
    formatMoney,

    // Fish
    fishList,
    fishConfig,

    // Rods
    rods,
    rodList,
    rodTitles,

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

    // Shop
    shop,

    // Sell
    sellConfig,

    // Quest
    questConfig,

    // Rarity
    rarityConfig,

    // Level
    levelConfig,

    // Fishing
    fishingConfig,

    // Economy
    economyConfig

};
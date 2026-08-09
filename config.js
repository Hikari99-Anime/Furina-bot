// ==========================================
// DISCORD FISHING BOT - CONFIG
// BALANCED VERSION
// ==========================================

// ==========================================
// PREFIX
// ==========================================

const prefix = "f";

const prefixes = [
    "f"
];

// ==========================================
// ĐÁ CƯỜNG HÓA
// ==========================================

const rateStone = {
    da_tang_rate: {
        id: "da_tang_rate",
        name: "Đá tăng tỉ lệ",
        emoji: "🪨",
        price: 500000,

        // Số lần sử dụng
        uses: 5,

        // +5% luck khi câu
        rate: 5
    }
};

// ==========================================
// EMOJI
// ==========================================

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

// ==========================================
// FORMAT MONEY
// ==========================================

function formatMoney(number) {
    number = Number(number) || 0;

    return number.toLocaleString("vi-VN");
}

// ==========================================
// RANDOM NUMBER
// ==========================================

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

// ==========================================
// FISH LIST
// ==========================================

const fishList = [

    // ==========================================
    // 🌴 BIỂN NHIỆT ĐỚI
    // ==========================================

    {
        id: "ca1",
        name: "Cá chép",
        emoji: "🐟",
        price: 100,
        rarity: "common",
        rate: 40,
        min: 0.5,
        max: 3
    },

    {
        id: "ca2",
        name: "Cá rô phi",
        emoji: "🐟",
        price: 120,
        rarity: "common",
        rate: 35,
        min: 0.5,
        max: 3.5
    },

    {
        id: "ca3",
        name: "Cá trê",
        emoji: "🐟",
        price: 150,
        rarity: "common",
        rate: 30,
        min: 0.7,
        max: 4
    },

    {
        id: "ca4",
        name: "Cá thu",
        emoji: "🐠",
        price: 200,
        rarity: "common",
        rate: 25,
        min: 1,
        max: 5
    },

    {
        id: "ca5",
        name: "Cá hồi",
        emoji: "🐠",
        price: 500,
        rarity: "rare",
        rate: 18,
        min: 1,
        max: 6
    },

    {
        id: "ca6",
        name: "Cá ngừ",
        emoji: "🐟",
        price: 700,
        rarity: "rare",
        rate: 14,
        min: 2,
        max: 10
    },

    {
        id: "ca7",
        name: "Cá Koi",
        emoji: "🐠",
        price: 1000,
        rarity: "rare",
        rate: 10,
        min: 1,
        max: 7
    },

    {
        id: "ca8",
        name: "Cá nóc",
        emoji: "🐡",
        price: 1200,
        rarity: "rare",
        rate: 8,
        min: 1,
        max: 6
    },

    {
        id: "ca9",
        name: "Cá vàng",
        emoji: "🐠",
        price: 2500,
        rarity: "epic",
        rate: 6,
        min: 0.5,
        max: 5
    },

    {
        id: "ca10",
        name: "Cá kiếm",
        emoji: "🐟",
        price: 3500,
        rarity: "epic",
        rate: 4,
        min: 3,
        max: 15
    },

    {
        id: "ca11",
        name: "Cá cần câu",
        emoji: "🐟",
        price: 5000,
        rarity: "epic",
        rate: 3,
        min: 1,
        max: 8
    },

    {
        id: "ca12",
        name: "Lươn điện",
        emoji: "🐍",
        price: 6500,
        rarity: "epic",
        rate: 2.5,
        min: 1,
        max: 10
    },

    {
        id: "ca13",
        name: "Cá mập",
        emoji: "🦈",
        price: 9000,
        rarity: "legendary",
        rate: 1.5,
        min: 10,
        max: 50
    },

    {
        id: "ca14",
        name: "Cá rồng",
        emoji: "🐉",
        price: 22000,
        rarity: "legendary",
        rate: 0.8,
        min: 5,
        max: 30
    },

    {
        id: "ca15",
        name: "Cá rồng vàng",
        emoji: "🐉",
        price: 40000,
        rarity: "mythical",
        rate: 0.3,
        min: 5,
        max: 50
    },

    // ==========================================
    // ❄️ BIỂN BĂNG GIÁ
    // ==========================================

    {
        id: "ca16",
        name: "Cá tuyết",
        emoji: "🐟",
        price: 600,
        rarity: "common",
        rate: 30,
        min: 1,
        max: 5
    },

    {
        id: "ca17",
        name: "Cá băng",
        emoji: "🐠",
        price: 800,
        rarity: "common",
        rate: 27,
        min: 1,
        max: 6
    },

    {
        id: "ca18",
        name: "Cá bạc",
        emoji: "🐟",
        price: 1000,
        rarity: "common",
        rate: 24,
        min: 1,
        max: 7
    },

    {
        id: "ca19",
        name: "Cá tuyết xanh",
        emoji: "🐠",
        price: 1500,
        rarity: "rare",
        rate: 18,
        min: 1,
        max: 8
    },

    {
        id: "ca20",
        name: "Cá lạnh",
        emoji: "🐟",
        price: 1800,
        rarity: "rare",
        rate: 16,
        min: 2,
        max: 9
    },

    {
        id: "ca21",
        name: "Cá trắng",
        emoji: "🐟",
        price: 2200,
        rarity: "rare",
        rate: 14,
        min: 2,
        max: 10
    },

    {
        id: "ca22",
        name: "Cá pha lê",
        emoji: "🐠",
        price: 3000,
        rarity: "rare",
        rate: 11,
        min: 1,
        max: 8
    },

    {
        id: "ca23",
        name: "Cá băng lam",
        emoji: "🐟",
        price: 4000,
        rarity: "epic",
        rate: 8,
        min: 2,
        max: 12
    },

    {
        id: "ca24",
        name: "Cá tuyết khổng lồ",
        emoji: "🐠",
        price: 5500,
        rarity: "epic",
        rate: 6,
        min: 5,
        max: 20
    },

    {
        id: "ca25",
        name: "Cá ma băng",
        emoji: "👻",
        price: 7500,
        rarity: "epic",
        rate: 4,
        min: 2,
        max: 15
    },

    {
        id: "ca26",
        name: "Cá cực quang",
        emoji: "🐟",
        price: 9500,
        rarity: "legendary",
        rate: 2.5,
        min: 3,
        max: 18
    },

    {
        id: "ca27",
        name: "Cá hoàng kim băng",
        emoji: "🐠",
        price: 16000,
        rarity: "legendary",
        rate: 1,
        min: 5,
        max: 25
    },

    {
        id: "ca28",
        name: "Long Ngư Băng",
        emoji: "🐉",
        price: 30000,
        rarity: "mythical",
        rate: 0.4,
        min: 8,
        max: 40
    },

    // ==========================================
    // 🐊 ĐẦM LẦY
    // ==========================================

    {
        id: "ca29",
        name: "Cá bùn",
        emoji: "🐟",
        price: 400,
        rarity: "common",
        rate: 32,
        min: 0.5,
        max: 4
    },

    {
        id: "ca30",
        name: "Cá lầy",
        emoji: "🐟",
        price: 600,
        rarity: "common",
        rate: 28,
        min: 1,
        max: 5
    },

    {
        id: "ca31",
        name: "Cá da trơn",
        emoji: "🐟",
        price: 800,
        rarity: "common",
        rate: 25,
        min: 1,
        max: 6
    },

    {
        id: "ca32",
        name: "Cá đen",
        emoji: "🐟",
        price: 1200,
        rarity: "common",
        rate: 22,
        min: 1,
        max: 7
    },

    {
        id: "ca33",
        name: "Cá độc",
        emoji: "🐡",
        price: 1800,
        rarity: "rare",
        rate: 16,
        min: 1,
        max: 8
    },

    {
        id: "ca34",
        name: "Cá răng nhọn",
        emoji: "🐟",
        price: 2200,
        rarity: "rare",
        rate: 14,
        min: 2,
        max: 9
    },

    {
        id: "ca35",
        name: "Cá đầm lầy",
        emoji: "🐠",
        price: 3000,
        rarity: "rare",
        rate: 11,
        min: 2,
        max: 10
    },

    {
        id: "ca36",
        name: "Cá mắt đỏ",
        emoji: "👁️",
        price: 4000,
        rarity: "epic",
        rate: 8,
        min: 1,
        max: 8
    },

    {
        id: "ca37",
        name: "Cá quỷ",
        emoji: "😈",
        price: 6000,
        rarity: "epic",
        rate: 5,
        min: 2,
        max: 12
    },

    {
        id: "ca38",
        name: "Cá khổng lồ đầm lầy",
        emoji: "🐊",
        price: 8500,
        rarity: "epic",
        rate: 3.5,
        min: 5,
        max: 25
    },

    {
        id: "ca39",
        name: "Cá ma",
        emoji: "👻",
        price: 11000,
        rarity: "legendary",
        rate: 2,
        min: 2,
        max: 15
    },

    {
        id: "ca40",
        name: "Cá vua đầm lầy",
        emoji: "👑",
        price: 18000,
        rarity: "legendary",
        rate: 0.9,
        min: 5,
        max: 30
    },

    {
        id: "ca41",
        name: "Thủy Quái Đầm Lầy",
        emoji: "🐲",
        price: 35000,
        rarity: "mythical",
        rate: 0.3,
        min: 10,
        max: 50
    },

    // ==========================================
    // 🌊 VỰC SÂU
    // ==========================================

    {
        id: "ca42",
        name: "Cá vực sâu",
        emoji: "🐟",
        price: 1000,
        rarity: "common",
        rate: 25,
        min: 2,
        max: 8
    },

    {
        id: "ca43",
        name: "Cá đen sâu",
        emoji: "🐟",
        price: 1500,
        rarity: "common",
        rate: 22,
        min: 2,
        max: 10
    },

    {
        id: "ca44",
        name: "Cá mắt sáng",
        emoji: "👁️",
        price: 2000,
        rarity: "common",
        rate: 19,
        min: 1,
        max: 8
    },

    {
        id: "ca45",
        name: "Cá đèn lồng",
        emoji: "🏮",
        price: 3000,
        rarity: "rare",
        rate: 15,
        min: 1,
        max: 9
    },

    {
        id: "ca46",
        name: "Cá bóng tối",
        emoji: "🐟",
        price: 4000,
        rarity: "rare",
        rate: 13,
        min: 2,
        max: 12
    },

    {
        id: "ca47",
        name: "Cá gai sâu",
        emoji: "🐡",
        price: 5000,
        rarity: "rare",
        rate: 11,
        min: 2,
        max: 13
    },

    {
        id: "ca48",
        name: "Cá phát sáng",
        emoji: "✨",
        price: 6500,
        rarity: "rare",
        rate: 9,
        min: 1,
        max: 10
    },

    {
        id: "ca49",
        name: "Cá thủy tinh",
        emoji: "🐠",
        price: 8000,
        rarity: "epic",
        rate: 7,
        min: 1,
        max: 8
    },

    {
        id: "ca50",
        name: "Cá bóng ma",
        emoji: "👻",
        price: 10000,
        rarity: "epic",
        rate: 5.5,
        min: 2,
        max: 15
    },

    {
        id: "ca51",
        name: "Cá răng cưa",
        emoji: "🦈",
        price: 12000,
        rarity: "epic",
        rate: 4.5,
        min: 3,
        max: 18
    },

    {
        id: "ca52",
        name: "Cá mực sâu",
        emoji: "🦑",
        price: 14000,
        rarity: "epic",
        rate: 4,
        min: 2,
        max: 20
    },

    {
        id: "ca53",
        name: "Cá khổng lồ",
        emoji: "🐋",
        price: 17000,
        rarity: "legendary",
        rate: 3,
        min: 10,
        max: 50
    },

    {
        id: "ca54",
        name: "Cá quỷ biển",
        emoji: "😈",
        price: 21000,
        rarity: "legendary",
        rate: 2.5,
        min: 5,
        max: 30
    },

    {
        id: "ca55",
        name: "Cá rồng biển",
        emoji: "🐉",
        price: 26000,
        rarity: "legendary",
        rate: 2,
        min: 5,
        max: 35
    },

    {
        id: "ca56",
        name: "Cá thần biển",
        emoji: "🔱",
        price: 33000,
        rarity: "legendary",
        rate: 1.5,
        min: 8,
        max: 40
    },

    {
        id: "ca57",
        name: "Kraken con",
        emoji: "🐙",
        price: 42000,
        rarity: "legendary",
        rate: 1,
        min: 10,
        max: 50
    },

    {
        id: "ca58",
        name: "Cá tinh thể",
        emoji: "💎",
        price: 52000,
        rarity: "mythical",
        rate: 0.7,
        min: 3,
        max: 25
    },

    {
        id: "ca59",
        name: "Cá hư không",
        emoji: "🌌",
        price: 65000,
        rarity: "mythical",
        rate: 0.5,
        min: 5,
        max: 30
    },

    {
        id: "ca60",
        name: "Leviathan con",
        emoji: "🐲",
        price: 85000,
        rarity: "mythical",
        rate: 0.35,
        min: 15,
        max: 70
    },

    {
        id: "ca61",
        name: "Vua Vực Sâu",
        emoji: "👑",
        price: 110000,
        rarity: "mythical",
        rate: 0.2,
        min: 20,
        max: 100
    },

    // ==========================================
    // 🌋 NÚI LỬA
    // ==========================================

    {
        id: "ca62",
        name: "Cá dung nham",
        emoji: "🔥",
        price: 28000,
        rarity: "epic",
        rate: 3,
        min: 3,
        max: 15
    },

    {
        id: "ca63",
        name: "Cá lửa",
        emoji: "🔥",
        price: 55000,
        rarity: "legendary",
        rate: 1.5,
        min: 5,
        max: 25
    },

    {
        id: "ca64",
        name: "Cá rồng lửa",
        emoji: "🐉",
        price: 110000,
        rarity: "legendary",
        rate: 0.7,
        min: 8,
        max: 40
    },

    {
        id: "ca65",
        name: "Phượng Hoàng Ngư",
        emoji: "🔥",
        price: 280000,
        rarity: "mythical",
        rate: 0.2,
        min: 15,
        max: 80
    }
];

// ==========================================
// TRASH / ITEMS
// ==========================================

// Ủng rách:
// - Có thể câu được
// - Không có giá trị
// - Bán = 0 đồng
// - Không nên cộng vào doanh thu
const trashItems = {

    torn_boot: {
        id: "torn_boot",
        name: "Ủng rách",
        emoji: "🥾",
        price: 0,
        sellPrice: 0,
        rarity: "common",
        rate: 12,
        min: 1,
        max: 1
    }
};

// ==========================================
// FISH CONFIG
// ==========================================

const fishConfig = {
    list: fishList,

    // Giá bán = giá cá × cân nặng × multiplier
    sellMultiplier: 1,

    // Giới hạn an toàn
    minSellPrice: 0,

    // Có cho phép đồ rác xuất hiện không
    trashEnabled: true,

    trash: trashItems
};

// ==========================================
// WEIGHTED RANDOM
// ==========================================

function weightedRandom(items, luck = 1) {

    if (!Array.isArray(items) || items.length === 0) {
        return null;
    }

    const validItems = items.filter(item =>
        item &&
        Number(item.rate) > 0
    );

    if (validItems.length === 0) {
        return null;
    }

    // Luck chỉ tăng khả năng của item hiếm.
    // Không làm common tăng vô hạn.
    const rarityMultiplier = {
        common: 1,
        rare: 1 + ((luck - 1) * 0.75),
        epic: 1 + ((luck - 1) * 1.25),
        legendary: 1 + ((luck - 1) * 1.75),
        mythical: 1 + ((luck - 1) * 2.25)
    };

    let totalWeight = 0;

    const weighted = validItems.map(item => {

        const rarityBonus =
            rarityMultiplier[item.rarity] || 1;

        const weight =
            Number(item.rate) * rarityBonus;

        totalWeight += weight;

        return {
            item,
            weight
        };
    });

    let random = Math.random() * totalWeight;

    for (const entry of weighted) {

        random -= entry.weight;

        if (random <= 0) {
            return entry.item;
        }
    }

    return weighted[weighted.length - 1].item;
}

// ==========================================
// PICK FISH
// ==========================================

function pickFish(fishIds, luck = 1) {

    if (!Array.isArray(fishIds)) {
        return null;
    }

    const availableFish = fishList.filter(fish =>
        fishIds.includes(fish.id)
    );

    // Nếu không có cá
    if (availableFish.length === 0) {
        return null;
    }

    return weightedRandom(availableFish, luck);
}

// ==========================================
// PICK TRASH
// ==========================================

function pickTrash(luck = 1) {

    const trash = Object.values(trashItems);

    return weightedRandom(trash, 1);
}

// ==========================================
// RODS
// ==========================================

const rods = {

    // ======================================
    // CẦN 1
    // ======================================

    wood: {
        id: "wood",
        name: "Cần câu gỗ",
        emoji: "<:cancau_1:1534625089088393358>",
        price: 10000,
        uses: 20,
        luck: 1,
        star: 1,
        maxLevel: 15
    },

    // ======================================
    // CẦN 2
    // ======================================

    iron: {
        id: "iron",
        name: "Cần câu sắt",
        emoji: "<:cancau_2:1534635569219633212>",
        price: 50000,
        uses: 50,
        luck: 1,
        star: 2,
        maxLevel: 15
    },

    // ======================================
    // CẦN 3
    // ======================================

    gold: {
        id: "gold",
        name: "Cần câu vàng",
        emoji: "<:cancau_3:1534625401119445170>",
        price: 150000,
        uses: 100,
        luck: 2,
        star: 3,
        maxLevel: 15
    },

    // ======================================
    // CẦN 4
    // ======================================

    diamond: {
        id: "diamond",
        name: "Cần câu kim cương",
        emoji: "<:cancau_4:1534635400793165965>",
        price: 500000,
        uses: 250,
        luck: 3,
        star: 4,
        maxLevel: 15
    },

    // ======================================
    // CẦN 5
    // ======================================

    mythic: {
        id: "mythic",
        name: "Cần câu huyền thoại",
        emoji: "<:cancau_5:1534635179778511100>",
        price: 1500000,
        uses: 500,
        luck: 5,
        star: 5,
        maxLevel: 15
    }
};

// ==========================================
// ROD TITLES
// ==========================================

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

// ==========================================
// UPGRADE CONFIG
// ==========================================

const upgrade = {

    maxLevel: 15,

    // Mỗi cấp +0.1 luck
    luckPerLevel: 0.1,

    success: {
        0: 70,
        1: 65,
        2: 60,
        3: 55,
        4: 55,

        5: 50,
        6: 45,
        7: 40,
        8: 35,
        9: 30,

        10: 25,
        11: 20,
        12: 15,
        13: 10,
        14: 5
    },

    // Không cho upgrade vượt quá cấp
    minLevel: 0,
    maxLevel: 15
};

// ==========================================
// FISHING ZONES
// ==========================================

const fishingZones = {

    // ======================================
    // BIỂN NHIỆT ĐỚI
    // ======================================

    tropical: {
        id: "tropical",

        name: "🌴 Biển Nhiệt Đới",

        description:
            "Vùng biển ấm áp với nhiều loài cá phổ biến.",

        fish: [
            "ca1",
            "ca2",
            "ca3",
            "ca4",
            "ca5",
            "ca6",
            "ca7",
            "ca8",
            "ca9",
            "ca10",
            "ca11",
            "ca12",
            "ca13",
            "ca14",
            "ca15"
        ],

        // Ủng rách có thể xuất hiện
        trashRate: 8,

        image:
            "https://media.discordapp.net/attachments/1534756360103788596/1535257413786140733/1000013743-Photoroom.png"
    },

    // ======================================
    // BIỂN BĂNG GIÁ
    // ======================================

    cold: {
        id: "cold",

        name: "❄️ Biển Băng Giá",

        description:
            "Vùng biển lạnh giá, nơi những loài cá đặc biệt sinh sống.",

        fish: [
            "ca16",
            "ca17",
            "ca18",
            "ca19",
            "ca20",
            "ca21",
            "ca22",
            "ca23",
            "ca24",
            "ca25",
            "ca26",
            "ca27",
            "ca28"
        ],

        trashRate: 7,

        image:
            "https://media.discordapp.net/attachments/1534756360103788596/1535257294261067868/1000013742-Photoroom.png"
    },

    // ======================================
    // ĐẦM LẦY
    // ======================================

    swamp: {
        id: "swamp",

        name: "🐊 Đầm Lầy",

        description:
            "Khu đầm lầy bí ẩn với những sinh vật kỳ lạ.",

        fish: [
            "ca29",
            "ca30",
            "ca31",
            "ca32",
            "ca33",
            "ca34",
            "ca35",
            "ca36",
            "ca37",
            "ca38",
            "ca39",
            "ca40",
            "ca41"
        ],

        trashRate: 12,

        image:
            "https://media.discordapp.net/attachments/1534756360103788596/1535257149284941865/1000013741-Photoroom.png"
    },

    // ======================================
    // VỰC SÂU
    // ======================================

    deep: {
        id: "deep",

        name: "🌊 Vực Sâu",

        description:
            "Vùng nước sâu tối tăm, nơi những con cá quý hiếm ẩn mình.",

        fish: [
            "ca42",
            "ca43",
            "ca44",
            "ca45",
            "ca46",
            "ca47",
            "ca48",
            "ca49",
            "ca50",
            "ca51",
            "ca52",
            "ca53",
            "ca54",
            "ca55",
            "ca56",
            "ca57",
            "ca58",
            "ca59",
            "ca60",
            "ca61"
        ],

        trashRate: 5,

        image:
            "https://media.discordapp.net/attachments/1534756360103788596/1535256926739374100/1000013740-Photoroom.png"
    },

    // ======================================
    // NÚI LỬA - CHỦ NHẬT
    // ======================================

    volcano: {
        id: "volcano",

        name: "🌋 Núi Lửa",

        description:
            "Vùng biển nóng bỏng quanh núi lửa, chỉ xuất hiện vào Chủ Nhật.",

        fish: [
            "ca62",
            "ca63",
            "ca64",
            "ca65"
        ],

        trashRate: 3,

        image:
            "https://media.discordapp.net/attachments/1534756360103788596/1535256789833093150/1000013739-Photoroom.png"
    }
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
// SELL
// ==========================================

const sellConfig = {

    // Giá bán = giá gốc × cân nặng × multiplier
    multiplier: 1,

    // Cho phép bán 0 đồng
    minPrice: 0,

    // Ủng rách bán 0
    trashSellPrice: 0
};

// ==========================================
// SHOP
// ==========================================

const shop = {
    rods,
    baits,
    keys,
    insurance,
    sell: sellConfig
};

// ==========================================
// QUEST
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
// RARITY
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
// LEVEL
// ==========================================

const levelConfig = {

    maxLevel: 100,

    baseExp: 100,

    expMultiplier: 1.5,

    rewardPerLevel: 1000
};

// ==========================================
// FISHING
// ==========================================

const fishingConfig = {

    // 5 giây / lần câu
    cooldown: 5000,

    minWeight: 0.5,

    maxWeight: 100,

    // Chance bonus
    bonusChance: 5,

    // Chance bắt được đồ rác
    trashChance: 8,

    // Không cho cá vượt maxWeight
    limitWeightByConfig: true
};

// ==========================================
// ECONOMY
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
// SELL CALCULATION
// ==========================================

function calculateFishSellPrice(fish, weight) {

    if (!fish) {
        return 0;
    }

    // Đồ rác
    if (fish.sellPrice !== undefined) {
        return Math.max(
            0,
            Number(fish.sellPrice) || 0
        );
    }

    const safeWeight = Math.max(
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

// ==========================================
// SELL TRASH
// ==========================================

function calculateTrashSellPrice(item) {

    if (!item) {
        return 0;
    }

    // Ủng rách = 0 đồng
    if (item.id === "torn_boot") {
        return 0;
    }

    return Math.max(
        0,
        Number(item.sellPrice) || 0
    );
}

// ==========================================
// GENERATE FISH WEIGHT
// ==========================================

function generateFishWeight(fish) {

    if (!fish) {
        return 0;
    }

    const min =
        Math.max(
            fishingConfig.minWeight,
            Number(fish.min) || fishingConfig.minWeight
        );

    const max =
        Math.min(
            fishingConfig.maxWeight,
            Number(fish.max) || fishingConfig.maxWeight
        );

    if (max <= min) {
        return Number(min.toFixed(1));
    }

    return Number(
        randomFloat(min, max).toFixed(1)
    );
}

// ==========================================
// GET FISH RESULT
// ==========================================

function generateFishingResult(zoneId, luck = 1) {

    const zone = fishingZones[zoneId];

    if (!zone) {
        return {
            type: "error",
            item: null,
            weight: 0,
            price: 0
        };
    }

    // Kiểm tra đồ rác trước
    const trashChance =
        Number(zone.trashRate) ||
        fishingConfig.trashChance;

    if (
        fishingConfig.trashEnabled &&
        Math.random() * 100 < trashChance
    ) {

        const trash = pickTrash();

        if (trash) {
            return {
                type: "trash",
                item: trash,
                weight: 1,
                price: calculateTrashSellPrice(trash)
            };
        }
    }

    // Câu cá
    const fish = pickFish(
        zone.fish,
        Math.max(1, Number(luck) || 1)
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
        generateFishWeight(fish);

    const price =
        calculateFishSellPrice(
            fish,
            weight
        );

    return {
        type: "fish",
        item: fish,
        weight,
        price
    };
}

// ==========================================
// COMPATIBILITY ALIASES
// ==========================================

const rodList = rods;
const baitList = baits;
const keyList = keys;
const chestList = chests;

// ==========================================
// CONFIG VALIDATION
// ==========================================

function validateConfig() {

    const errors = [];

    // ------------------------------
    // FISH
    // ------------------------------

    for (const fish of fishList) {

        if (!fish.id) {
            errors.push("Fish thiếu id");
        }

        if (!fish.name) {
            errors.push(
                `${fish.id || "unknown"} thiếu name`
            );
        }

        if (Number(fish.price) < 0) {
            errors.push(
                `${fish.id} có price < 0`
            );
        }

        if (Number(fish.rate) <= 0) {
            errors.push(
                `${fish.id} có rate <= 0`
            );
        }

        if (Number(fish.min) > Number(fish.max)) {
            errors.push(
                `${fish.id} min > max`
            );
        }
    }

    // ------------------------------
    // ZONES
    // ------------------------------

    for (const zone of Object.values(fishingZones)) {

        if (!Array.isArray(zone.fish)) {
            errors.push(
                `${zone.id} thiếu danh sách fish`
            );

            continue;
        }

        for (const fishId of zone.fish) {

            const exists =
                fishList.some(
                    fish => fish.id === fishId
                );

            if (!exists) {
                errors.push(
                    `${zone.id}: không tìm thấy ${fishId}`
                );
            }
        }
    }

    // ------------------------------
    // RODS
    // ------------------------------

    for (const rod of Object.values(rods)) {

        if (rod.price < 0) {
            errors.push(
                `${rod.id} có giá < 0`
            );
        }

        if (rod.uses <= 0) {
            errors.push(
                `${rod.id} uses <= 0`
            );
        }
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

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
    randomInt,
    randomFloat,

    // Fish
    fishList,
    fishConfig,

    // Trash
    trashItems,

    // Fishing random
    weightedRandom,
    pickFish,
    pickTrash,
    generateFishWeight,
    generateFishingResult,

    // Sell
    calculateFishSellPrice,
    calculateTrashSellPrice,

    // Rods
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
    economyConfig,

    // Rate stone
    rateStone,

    // Validation
    validateConfig
};
// ==========================================
// DISCORD FISHING BOT - CONFIG
// BALANCED ECONOMY
// 150 FISH / 5 ZONES
// ==========================================

// ==========================================
// PREFIX
// ==========================================

const prefix = "f";

const prefixes = [
    "f"
];

// ==========================================
// ĐÁ TĂNG TỈ LỆ
// ==========================================

const rateStone = {
    da_tang_rate: {
        id: "da_tang_rate",
        name: "Đá tăng tỉ lệ",
        emoji: "🪨",
        price: 50000,
        uses: 5,
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
// RANDOM
// ==========================================

function randomInt(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}

function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

// ==========================================
// FISH LIST
// TOTAL: 150
//
// 🌴 Tropical: 50
// ❄️ Cold: 35
// 🐊 Swamp: 30
// 🌊 Deep: 20
// 🌋 Volcano: 15
// ==========================================

const fishList = [

    // ======================================
    // 🌴 BIỂN NHIỆT ĐỚI
    // ca1 - ca50
    // ======================================

    {
        id: "ca1",
        name: "Cá chép",
        emoji: "🐟",
        price: 30,
        rarity: "common",
        rate: 40,
        min: 0.5,
        max: 3
    },

    {
        id: "ca2",
        name: "Cá rô phi",
        emoji: "🐟",
        price: 35,
        rarity: "common",
        rate: 38,
        min: 0.5,
        max: 3.5
    },

    {
        id: "ca3",
        name: "Cá trê",
        emoji: "🐟",
        price: 40,
        rarity: "common",
        rate: 35,
        min: 0.7,
        max: 4
    },

    {
        id: "ca4",
        name: "Cá thu",
        emoji: "🐠",
        price: 50,
        rarity: "common",
        rate: 32,
        min: 1,
        max: 5
    },

    {
        id: "ca5",
        name: "Cá mòi",
        emoji: "🐟",
        price: 25,
        rarity: "common",
        rate: 42,
        min: 0.3,
        max: 2
    },

    {
        id: "ca6",
        name: "Cá cơm",
        emoji: "🐟",
        price: 28,
        rarity: "common",
        rate: 40,
        min: 0.2,
        max: 1.5
    },

    {
        id: "ca7",
        name: "Cá nục",
        emoji: "🐟",
        price: 45,
        rarity: "common",
        rate: 34,
        min: 0.5,
        max: 3
    },

    {
        id: "ca8",
        name: "Cá bạc má",
        emoji: "🐟",
        price: 55,
        rarity: "common",
        rate: 30,
        min: 0.7,
        max: 4
    },

    {
        id: "ca9",
        name: "Cá đối",
        emoji: "🐟",
        price: 60,
        rarity: "common",
        rate: 28,
        min: 0.8,
        max: 4
    },

    {
        id: "ca10",
        name: "Cá dìa",
        emoji: "🐟",
        price: 65,
        rarity: "common",
        rate: 27,
        min: 0.8,
        max: 4.5
    },

    {
        id: "ca11",
        name: "Cá hồng",
        emoji: "🐠",
        price: 80,
        rarity: "common",
        rate: 25,
        min: 1,
        max: 5
    },

    {
        id: "ca12",
        name: "Cá trích",
        emoji: "🐟",
        price: 70,
        rarity: "common",
        rate: 27,
        min: 0.5,
        max: 4
    },

    {
        id: "ca13",
        name: "Cá chim",
        emoji: "🐠",
        price: 90,
        rarity: "common",
        rate: 24,
        min: 1,
        max: 5
    },

    {
        id: "ca14",
        name: "Cá mú",
        emoji: "🐟",
        price: 110,
        rarity: "common",
        rate: 22,
        min: 1,
        max: 6
    },

    {
        id: "ca15",
        name: "Cá ngát",
        emoji: "🐟",
        price: 120,
        rarity: "common",
        rate: 21,
        min: 1,
        max: 6
    },

    {
        id: "ca16",
        name: "Cá hồi",
        emoji: "🐠",
        price: 140,
        rarity: "rare",
        rate: 18,
        min: 1,
        max: 6
    },

    {
        id: "ca17",
        name: "Cá ngừ",
        emoji: "🐟",
        price: 170,
        rarity: "rare",
        rate: 16,
        min: 2,
        max: 8
    },

    {
        id: "ca18",
        name: "Cá Koi",
        emoji: "🐠",
        price: 220,
        rarity: "rare",
        rate: 14,
        min: 1,
        max: 6
    },

    {
        id: "ca19",
        name: "Cá nóc",
        emoji: "🐡",
        price: 250,
        rarity: "rare",
        rate: 12,
        min: 1,
        max: 5
    },

    {
        id: "ca20",
        name: "Cá hề",
        emoji: "🐠",
        price: 280,
        rarity: "rare",
        rate: 11,
        min: 0.5,
        max: 3
    },

    {
        id: "ca21",
        name: "Cá kiếm",
        emoji: "🐟",
        price: 350,
        rarity: "rare",
        rate: 10,
        min: 3,
        max: 10
    },

    {
        id: "ca22",
        name: "Cá đuối",
        emoji: "🐟",
        price: 400,
        rarity: "rare",
        rate: 9,
        min: 3,
        max: 12
    },

    {
        id: "ca23",
        name: "Cá mặt trăng",
        emoji: "🐟",
        price: 450,
        rarity: "rare",
        rate: 8,
        min: 2,
        max: 10
    },

    {
        id: "ca24",
        name: "Cá phát sáng",
        emoji: "✨",
        price: 500,
        rarity: "rare",
        rate: 7,
        min: 1,
        max: 6
    },

    {
        id: "ca25",
        name: "Cá thiên thần",
        emoji: "🐠",
        price: 550,
        rarity: "rare",
        rate: 6,
        min: 1,
        max: 5
    },

    {
        id: "ca26",
        name: "Cá vàng",
        emoji: "🐠",
        price: 650,
        rarity: "epic",
        rate: 5,
        min: 0.5,
        max: 4
    },

    {
        id: "ca27",
        name: "Cá hồng hoàng",
        emoji: "🐟",
        price: 750,
        rarity: "epic",
        rate: 4.5,
        min: 2,
        max: 8
    },

    {
        id: "ca28",
        name: "Cá lưỡi kiếm",
        emoji: "🐟",
        price: 850,
        rarity: "epic",
        rate: 4,
        min: 2,
        max: 9
    },

    {
        id: "ca29",
        name: "Lươn điện",
        emoji: "🐍",
        price: 950,
        rarity: "epic",
        rate: 3.5,
        min: 1,
        max: 8
    },

    {
        id: "ca30",
        name: "Cá san hô",
        emoji: "🐠",
        price: 1100,
        rarity: "epic",
        rate: 3,
        min: 1,
        max: 6
    },

    {
        id: "ca31",
        name: "Cá ngọc trai",
        emoji: "🐟",
        price: 1300,
        rarity: "epic",
        rate: 2.8,
        min: 1,
        max: 5
    },

    {
        id: "ca32",
        name: "Cá pha lê",
        emoji: "💎",
        price: 1500,
        rarity: "epic",
        rate: 2.5,
        min: 1,
        max: 6
    },

    {
        id: "ca33",
        name: "Cá hoàng gia",
        emoji: "👑",
        price: 1800,
        rarity: "epic",
        rate: 2.2,
        min: 2,
        max: 8
    },

    {
        id: "ca34",
        name: "Cá kiếm xanh",
        emoji: "🐟",
        price: 2200,
        rarity: "epic",
        rate: 2,
        min: 3,
        max: 12
    },

    {
        id: "ca35",
        name: "Cá mập con",
        emoji: "🦈",
        price: 2800,
        rarity: "legendary",
        rate: 1.5,
        min: 5,
        max: 20
    },

    {
        id: "ca36",
        name: "Cá rồng nhỏ",
        emoji: "🐉",
        price: 3500,
        rarity: "legendary",
        rate: 1.2,
        min: 3,
        max: 15
    },

    {
        id: "ca37",
        name: "Cá mặt trời",
        emoji: "☀️",
        price: 4000,
        rarity: "legendary",
        rate: 1,
        min: 3,
        max: 15
    },

    {
        id: "ca38",
        name: "Cá vàng thần",
        emoji: "🐠",
        price: 5000,
        rarity: "legendary",
        rate: 0.8,
        min: 2,
        max: 12
    },

    {
        id: "ca39",
        name: "Cá long vương",
        emoji: "🐉",
        price: 6500,
        rarity: "legendary",
        rate: 0.7,
        min: 5,
        max: 20
    },

    {
        id: "ca40",
        name: "Cá biển sao",
        emoji: "⭐",
        price: 7500,
        rarity: "legendary",
        rate: 0.6,
        min: 2,
        max: 10
    },

    {
        id: "ca41",
        name: "Cá thần may mắn",
        emoji: "✨",
        price: 8500,
        rarity: "legendary",
        rate: 0.5,
        min: 2,
        max: 12
    },

    {
        id: "ca42",
        name: "Cá rồng vàng",
        emoji: "🐉",
        price: 10000,
        rarity: "mythical",
        rate: 0.35,
        min: 5,
        max: 20
    },

    {
        id: "ca43",
        name: "Cá ngọc lam",
        emoji: "💎",
        price: 12000,
        rarity: "mythical",
        rate: 0.3,
        min: 2,
        max: 10
    },

    {
        id: "ca44",
        name: "Cá thiên giới",
        emoji: "🌟",
        price: 14000,
        rarity: "mythical",
        rate: 0.25,
        min: 3,
        max: 15
    },

    {
        id: "ca45",
        name: "Cá hư không",
        emoji: "🌌",
        price: 16000,
        rarity: "mythical",
        rate: 0.2,
        min: 5,
        max: 20
    },

    {
        id: "ca46",
        name: "Cá sao băng",
        emoji: "☄️",
        price: 18000,
        rarity: "mythical",
        rate: 0.18,
        min: 3,
        max: 15
    },

    {
        id: "ca47",
        name: "Cá biển thần",
        emoji: "🔱",
        price: 20000,
        rarity: "mythical",
        rate: 0.15,
        min: 5,
        max: 20
    },

    {
        id: "ca48",
        name: "Cá đại dương",
        emoji: "🌊",
        price: 23000,
        rarity: "mythical",
        rate: 0.12,
        min: 8,
        max: 25
    },

    {
        id: "ca49",
        name: "Thủy Long",
        emoji: "🐲",
        price: 26000,
        rarity: "mythical",
        rate: 0.1,
        min: 8,
        max: 30
    },

    {
        id: "ca50",
        name: "Vua Biển Nhiệt Đới",
        emoji: "👑",
        price: 30000,
        rarity: "mythical",
        rate: 0.08,
        min: 10,
        max: 35
    },


    // ======================================
    // ❄️ BIỂN BĂNG GIÁ
    // ca51 - ca85
    // ======================================

    {
        id: "ca51",
        name: "Cá tuyết",
        emoji: "🐟",
        price: 120,
        rarity: "common",
        rate: 32,
        min: 1,
        max: 5
    },

    {
        id: "ca52",
        name: "Cá băng",
        emoji: "🐠",
        price: 140,
        rarity: "common",
        rate: 30,
        min: 1,
        max: 5
    },

    {
        id: "ca53",
        name: "Cá bạc",
        emoji: "🐟",
        price: 160,
        rarity: "common",
        rate: 28,
        min: 1,
        max: 6
    },

    {
        id: "ca54",
        name: "Cá tuyết xanh",
        emoji: "🐠",
        price: 180,
        rarity: "common",
        rate: 25,
        min: 1,
        max: 7
    },

    {
        id: "ca55",
        name: "Cá lạnh",
        emoji: "🐟",
        price: 200,
        rarity: "common",
        rate: 23,
        min: 1,
        max: 7
    },

    {
        id: "ca56",
        name: "Cá trắng",
        emoji: "🐟",
        price: 230,
        rarity: "common",
        rate: 21,
        min: 1,
        max: 8
    },

    {
        id: "ca57",
        name: "Cá tuyết đốm",
        emoji: "🐟",
        price: 260,
        rarity: "common",
        rate: 19,
        min: 1,
        max: 8
    },

    {
        id: "ca58",
        name: "Cá băng nhỏ",
        emoji: "🐠",
        price: 280,
        rarity: "common",
        rate: 18,
        min: 1,
        max: 7
    },

    {
        id: "ca59",
        name: "Cá pha lê",
        emoji: "💎",
        price: 320,
        rarity: "rare",
        rate: 15,
        min: 1,
        max: 7
    },

    {
        id: "ca60",
        name: "Cá lam băng",
        emoji: "🐟",
        price: 350,
        rarity: "rare",
        rate: 14,
        min: 1,
        max: 8
    },

    {
        id: "ca61",
        name: "Cá tuyết bạc",
        emoji: "🐟",
        price: 380,
        rarity: "rare",
        rate: 13,
        min: 2,
        max: 9
    },

    {
        id: "ca62",
        name: "Cá băng lam",
        emoji: "🐠",
        price: 420,
        rarity: "rare",
        rate: 12,
        min: 2,
        max: 9
    },

    {
        id: "ca63",
        name: "Cá lạnh sâu",
        emoji: "🐟",
        price: 460,
        rarity: "rare",
        rate: 11,
        min: 2,
        max: 10
    },

    {
        id: "ca64",
        name: "Cá băng ngọc",
        emoji: "💎",
        price: 500,
        rarity: "rare",
        rate: 10,
        min: 1,
        max: 8
    },

    {
        id: "ca65",
        name: "Cá tuyết khổng lồ",
        emoji: "🐠",
        price: 550,
        rarity: "rare",
        rate: 9,
        min: 3,
        max: 12
    },

    {
        id: "ca66",
        name: "Cá ma băng",
        emoji: "👻",
        price: 650,
        rarity: "epic",
        rate: 7,
        min: 2,
        max: 12
    },

    {
        id: "ca67",
        name: "Cá cực quang",
        emoji: "🌌",
        price: 750,
        rarity: "epic",
        rate: 6,
        min: 2,
        max: 10
    },

    {
        id: "ca68",
        name: "Cá băng hồng",
        emoji: "🐠",
        price: 850,
        rarity: "epic",
        rate: 5.5,
        min: 1,
        max: 8
    },

    {
        id: "ca69",
        name: "Cá tuyết hoàng gia",
        emoji: "👑",
        price: 950,
        rarity: "epic",
        rate: 5,
        min: 2,
        max: 10
    },

    {
        id: "ca70",
        name: "Cá pha lê xanh",
        emoji: "💎",
        price: 1100,
        rarity: "epic",
        rate: 4.5,
        min: 1,
        max: 8
    },

    {
        id: "ca71",
        name: "Cá băng đen",
        emoji: "🐟",
        price: 1300,
        rarity: "epic",
        rate: 4,
        min: 2,
        max: 12
    },

    {
        id: "ca72",
        name: "Cá băng đỏ",
        emoji: "🐠",
        price: 1500,
        rarity: "epic",
        rate: 3.5,
        min: 2,
        max: 12
    },

    {
        id: "ca73",
        name: "Cá băng vàng",
        emoji: "🐠",
        price: 1800,
        rarity: "legendary",
        rate: 2.5,
        min: 2,
        max: 12
    },

    {
        id: "ca74",
        name: "Cá cực quang vàng",
        emoji: "✨",
        price: 2200,
        rarity: "legendary",
        rate: 2,
        min: 3,
        max: 15
    },

    {
        id: "ca75",
        name: "Cá long băng",
        emoji: "🐉",
        price: 2600,
        rarity: "legendary",
        rate: 1.7,
        min: 4,
        max: 18
    },

    {
        id: "ca76",
        name: "Cá băng vương",
        emoji: "👑",
        price: 3000,
        rarity: "legendary",
        rate: 1.4,
        min: 5,
        max: 20
    },

    {
        id: "ca77",
        name: "Cá tuyết thần",
        emoji: "❄️",
        price: 3500,
        rarity: "legendary",
        rate: 1.2,
        min: 5,
        max: 20
    },

    {
        id: "ca78",
        name: "Long Ngư Băng",
        emoji: "🐉",
        price: 4200,
        rarity: "legendary",
        rate: 1,
        min: 5,
        max: 22
    },

    {
        id: "ca79",
        name: "Cá băng thiên giới",
        emoji: "🌟",
        price: 5000,
        rarity: "legendary",
        rate: 0.8,
        min: 5,
        max: 25
    },

    {
        id: "ca80",
        name: "Cá băng hư không",
        emoji: "🌌",
        price: 6000,
        rarity: "mythical",
        rate: 0.5,
        min: 5,
        max: 25
    },

    {
        id: "ca81",
        name: "Cá băng tinh thể",
        emoji: "💎",
        price: 7000,
        rarity: "mythical",
        rate: 0.4,
        min: 4,
        max: 20
    },

    {
        id: "ca82",
        name: "Cá băng thần",
        emoji: "🔱",
        price: 8500,
        rarity: "mythical",
        rate: 0.3,
        min: 5,
        max: 25
    },

    {
        id: "ca83",
        name: "Băng Long",
        emoji: "🐲",
        price: 10000,
        rarity: "mythical",
        rate: 0.22,
        min: 8,
        max: 30
    },

    {
        id: "ca84",
        name: "Cá cực quang thần",
        emoji: "🌈",
        price: 12000,
        rarity: "mythical",
        rate: 0.16,
        min: 5,
        max: 25
    },

    {
        id: "ca85",
        name: "Vua Băng Hải",
        emoji: "👑",
        price: 15000,
        rarity: "mythical",
        rate: 0.1,
        min: 10,
        max: 35
    },


    // ======================================
    // 🐊 ĐẦM LẦY
    // ca86 - ca115
    // ======================================

    {
        id: "ca86",
        name: "Cá bùn",
        emoji: "🐟",
        price: 100,
        rarity: "common",
        rate: 30,
        min: 0.5,
        max: 4
    },

    {
        id: "ca87",
        name: "Cá lầy",
        emoji: "🐟",
        price: 120,
        rarity: "common",
        rate: 28,
        min: 1,
        max: 5
    },

    {
        id: "ca88",
        name: "Cá da trơn",
        emoji: "🐟",
        price: 140,
        rarity: "common",
        rate: 26,
        min: 1,
        max: 6
    },

    {
        id: "ca89",
        name: "Cá đen",
        emoji: "🐟",
        price: 160,
        rarity: "common",
        rate: 24,
        min: 1,
        max: 7
    },

    {
        id: "ca90",
        name: "Cá lau kiếng",
        emoji: "🐟",
        price: 180,
        rarity: "common",
        rate: 22,
        min: 1,
        max: 6
    },

    {
        id: "ca91",
        name: "Cá trê đen",
        emoji: "🐟",
        price: 200,
        rarity: "common",
        rate: 20,
        min: 1,
        max: 7
    },

    {
        id: "ca92",
        name: "Cá mắt vàng",
        emoji: "👁️",
        price: 230,
        rarity: "common",
        rate: 18,
        min: 1,
        max: 7
    },

    {
        id: "ca93",
        name: "Cá răng nhọn",
        emoji: "🐟",
        price: 260,
        rarity: "rare",
        rate: 15,
        min: 2,
        max: 8
    },

    {
        id: "ca94",
        name: "Cá độc",
        emoji: "🐡",
        price: 300,
        rarity: "rare",
        rate: 14,
        min: 1,
        max: 8
    },

    {
        id: "ca95",
        name: "Cá mắt đỏ",
        emoji: "👁️",
        price: 350,
        rarity: "rare",
        rate: 13,
        min: 1,
        max: 8
    },

    {
        id: "ca96",
        name: "Cá lưỡi dao",
        emoji: "🐟",
        price: 400,
        rarity: "rare",
        rate: 12,
        min: 2,
        max: 9
    },

    {
        id: "ca97",
        name: "Cá đầm xanh",
        emoji: "🐠",
        price: 450,
        rarity: "rare",
        rate: 11,
        min: 2,
        max: 10
    },

    {
        id: "ca98",
        name: "Cá đầm đỏ",
        emoji: "🐟",
        price: 500,
        rarity: "rare",
        rate: 10,
        min: 2,
        max: 10
    },

    {
        id: "ca99",
        name: "Cá lầy khổng lồ",
        emoji: "🐟",
        price: 600,
        rarity: "rare",
        rate: 9,
        min: 3,
        max: 12
    },

    {
        id: "ca100",
        name: "Cá ma đầm lầy",
        emoji: "👻",
        price: 700,
        rarity: "epic",
        rate: 7,
        min: 2,
        max: 12
    },

    {
        id: "ca101",
        name: "Cá quỷ",
        emoji: "😈",
        price: 800,
        rarity: "epic",
        rate: 6,
        min: 2,
        max: 12
    },

    {
        id: "ca102",
        name: "Cá độc vương",
        emoji: "🐡",
        price: 950,
        rarity: "epic",
        rate: 5,
        min: 2,
        max: 10
    },

    {
        id: "ca103",
        name: "Cá khổng lồ đầm lầy",
        emoji: "🐊",
        price: 1100,
        rarity: "epic",
        rate: 4.5,
        min: 5,
        max: 20
    },

    {
        id: "ca104",
        name: "Cá đầm pha lê",
        emoji: "💎",
        price: 1300,
        rarity: "epic",
        rate: 4,
        min: 2,
        max: 12
    },

    {
        id: "ca105",
        name: "Cá đầm hoàng gia",
        emoji: "👑",
        price: 1500,
        rarity: "epic",
        rate: 3.5,
        min: 3,
        max: 15
    },

    {
        id: "ca106",
        name: "Cá ma cổ đại",
        emoji: "👻",
        price: 1800,
        rarity: "legendary",
        rate: 2.5,
        min: 3,
        max: 15
    },

    {
        id: "ca107",
        name: "Cá vua đầm lầy",
        emoji: "👑",
        price: 2200,
        rarity: "legendary",
        rate: 2,
        min: 5,
        max: 20
    },

    {
        id: "ca108",
        name: "Cá quỷ khổng lồ",
        emoji: "😈",
        price: 2600,
        rarity: "legendary",
        rate: 1.6,
        min: 5,
        max: 20
    },

    {
        id: "ca109",
        name: "Cá rồng đầm lầy",
        emoji: "🐉",
        price: 3200,
        rarity: "legendary",
        rate: 1.3,
        min: 5,
        max: 25
    },

    {
        id: "ca110",
        name: "Cá độc thần",
        emoji: "☠️",
        price: 3800,
        rarity: "legendary",
        rate: 1,
        min: 5,
        max: 20
    },

    {
        id: "ca111",
        name: "Thủy Quái Đầm Lầy",
        emoji: "🐲",
        price: 4500,
        rarity: "legendary",
        rate: 0.8,
        min: 8,
        max: 30
    },

    {
        id: "ca112",
        name: "Cá bóng tối",
        emoji: "🌑",
        price: 5500,
        rarity: "mythical",
        rate: 0.55,
        min: 5,
        max: 25
    },

    {
        id: "ca113",
        name: "Cá vực đầm",
        emoji: "🌌",
        price: 7000,
        rarity: "mythical",
        rate: 0.4,
        min: 5,
        max: 30
    },

    {
        id: "ca114",
        name: "Cổ Long Đầm Lầy",
        emoji: "🐲",
        price: 9000,
        rarity: "mythical",
        rate: 0.25,
        min: 8,
        max: 35
    },

    {
        id: "ca115",
        name: "Chúa Tể Đầm Lầy",
        emoji: "👑",
        price: 12000,
        rarity: "mythical",
        rate: 0.12,
        min: 10,
        max: 40
    },


    // ======================================
    // 🌊 VỰC SÂU
    // ca116 - ca135
    // ======================================

    {
        id: "ca116",
        name: "Cá vực sâu",
        emoji: "🐟",
        price: 300,
        rarity: "common",
        rate: 25,
        min: 2,
        max: 8
    },

    {
        id: "ca117",
        name: "Cá đen sâu",
        emoji: "🐟",
        price: 350,
        rarity: "common",
        rate: 23,
        min: 2,
        max: 9
    },

    {
        id: "ca118",
        name: "Cá mắt sáng",
        emoji: "👁️",
        price: 400,
        rarity: "common",
        rate: 21,
        min: 1,
        max: 8
    },

    {
        id: "ca119",
        name: "Cá đèn lồng",
        emoji: "🏮",
        price: 450,
        rarity: "rare",
        rate: 17,
        min: 1,
        max: 9
    },

    {
        id: "ca120",
        name: "Cá bóng tối",
        emoji: "🐟",
        price: 500,
        rarity: "rare",
        rate: 15,
        min: 2,
        max: 12
    },

    {
        id: "ca121",
        name: "Cá gai sâu",
        emoji: "🐡",
        price: 550,
        rarity: "rare",
        rate: 13,
        min: 2,
        max: 13
    },

    {
        id: "ca122",
        name: "Cá phát sáng",
        emoji: "✨",
        price: 650,
        rarity: "rare",
        rate: 11,
        min: 1,
        max: 10
    },

    {
        id: "ca123",
        name: "Cá thủy tinh",
        emoji: "🐠",
        price: 750,
        rarity: "rare",
        rate: 9,
        min: 1,
        max: 8
    },

    {
        id: "ca124",
        name: "Cá bóng ma",
        emoji: "👻",
        price: 850,
        rarity: "epic",
        rate: 7,
        min: 2,
        max: 15
    },

    {
        id: "ca125",
        name: "Cá răng cưa",
        emoji: "🦈",
        price: 950,
        rarity: "epic",
        rate: 6,
        min: 3,
        max: 18
    },

    {
        id: "ca126",
        name: "Cá mực sâu",
        emoji: "🦑",
        price: 1100,
        rarity: "epic",
        rate: 5,
        min: 2,
        max: 20
    },

    {
        id: "ca127",
        name: "Cá khổng lồ",
        emoji: "🐋",
        price: 1300,
        rarity: "epic",
        rate: 4,
        min: 10,
        max: 30
    },

    {
        id: "ca128",
        name: "Cá quỷ biển",
        emoji: "😈",
        price: 1500,
        rarity: "epic",
        rate: 3.5,
        min: 5,
        max: 25
    },

    {
        id: "ca129",
        name: "Cá rồng biển",
        emoji: "🐉",
        price: 1800,
        rarity: "legendary",
        rate: 2.5,
        min: 5,
        max: 30
    },

    {
        id: "ca130",
        name: "Cá thần biển",
        emoji: "🔱",
        price: 2200,
        rarity: "legendary",
        rate: 2,
        min: 8,
        max: 35
    },

    {
        id: "ca131",
        name: "Kraken con",
        emoji: "🐙",
        price: 2800,
        rarity: "legendary",
        rate: 1.5,
        min: 10,
        max: 40
    },

    {
        id: "ca132",
        name: "Cá tinh thể",
        emoji: "💎",
        price: 3500,
        rarity: "legendary",
        rate: 1.1,
        min: 3,
        max: 25
    },

    {
        id: "ca133",
        name: "Cá hư không",
        emoji: "🌌",
        price: 4500,
        rarity: "mythical",
        rate: 0.7,
        min: 5,
        max: 30
    },

    {
        id: "ca134",
        name: "Leviathan con",
        emoji: "🐲",
        price: 6000,
        rarity: "mythical",
        rate: 0.4,
        min: 15,
        max: 50
    },

    {
        id: "ca135",
        name: "Vua Vực Sâu",
        emoji: "👑",
        price: 8500,
        rarity: "mythical",
        rate: 0.18,
        min: 20,
        max: 70
    },


    // ======================================
    // 🌋 NÚI LỬA
    // ca136 - ca150
    // ======================================

    {
        id: "ca136",
        name: "Cá dung nham",
        emoji: "🔥",
        price: 600,
        rarity: "common",
        rate: 20,
        min: 3,
        max: 10
    },

    {
        id: "ca137",
        name: "Cá tro núi lửa",
        emoji: "🔥",
        price: 700,
        rarity: "common",
        rate: 18,
        min: 2,
        max: 10
    },

    {
        id: "ca138",
        name: "Cá lửa",
        emoji: "🔥",
        price: 800,
        rarity: "rare",
        rate: 15,
        min: 3,
        max: 12
    },

    {
        id: "ca139",
        name: "Cá magma",
        emoji: "🌋",
        price: 900,
        rarity: "rare",
        rate: 13,
        min: 3,
        max: 15
    },

    {
        id: "ca140",
        name: "Cá đỏ dung nham",
        emoji: "🐟",
        price: 1000,
        rarity: "rare",
        rate: 11,
        min: 3,
        max: 15
    },

    {
        id: "ca141",
        name: "Cá lửa xanh",
        emoji: "🔥",
        price: 1200,
        rarity: "rare",
        rate: 9,
        min: 3,
        max: 15
    },

    {
        id: "ca142",
        name: "Cá hỏa tinh",
        emoji: "✨",
        price: 1400,
        rarity: "epic",
        rate: 7,
        min: 3,
        max: 18
    },

    {
        id: "ca143",
        name: "Cá dung nham đen",
        emoji: "🔥",
        price: 1600,
        rarity: "epic",
        rate: 5.5,
        min: 4,
        max: 20
    },

    {
        id: "ca144",
        name: "Cá phượng hoàng",
        emoji: "🔥",
        price: 1900,
        rarity: "epic",
        rate: 4,
        min: 5,
        max: 20
    },

    {
        id: "ca145",
        name: "Cá rồng lửa",
        emoji: "🐉",
        price: 2300,
        rarity: "legendary",
        rate: 2.5,
        min: 8,
        max: 25
    },

    {
        id: "ca146",
        name: "Cá hỏa long",
        emoji: "🐲",
        price: 2800,
        rarity: "legendary",
        rate: 1.8,
        min: 8,
        max: 30
    },

    {
        id: "ca147",
        name: "Cá thần lửa",
        emoji: "🔥",
        price: 3500,
        rarity: "legendary",
        rate: 1.2,
        min: 10,
        max: 35
    },

    {
        id: "ca148",
        name: "Phượng Hoàng Ngư",
        emoji: "🔥",
        price: 4500,
        rarity: "mythical",
        rate: 0.7,
        min: 15,
        max: 45
    },

    {
        id: "ca149",
        name: "Hỏa Long Vương",
        emoji: "🐲",
        price: 6000,
        rarity: "mythical",
        rate: 0.35,
        min: 15,
        max: 55
    },

    {
        id: "ca150",
        name: "Thần Ngư Núi Lửa",
        emoji: "👑",
        price: 9000,
        rarity: "mythical",
        rate: 0.15,
        min: 20,
        max: 70
    }

];

// ==========================================
// TRASH
// ==========================================

const trashItems = {

    torn_boot: {
        id: "torn_boot",
        name: "Ủng rách",
        emoji: "🥾",
        price: 0,
        sellPrice: 0,
        rarity: "common",

        // Rate riêng của ủng
        // Tăng mạnh hơn bản cũ
        rate: 30,

        min: 1,
        max: 1
    }

};

// ==========================================
// FISH CONFIG
// ==========================================

const fishConfig = {

    list: fishList,

    sellMultiplier: 1,

    minSellPrice: 0,

    trashEnabled: true,

    trash: trashItems
};

// ==========================================
// WEIGHTED RANDOM
// ==========================================

function weightedRandom(items, luck = 1) {

    if (
        !Array.isArray(items) ||
        items.length === 0
    ) {
        return null;
    }

    const validItems = items.filter(
        item =>
            item &&
            Number(item.rate) > 0
    );

    if (!validItems.length) {
        return null;
    }

    const rarityMultiplier = {

        common: 1,

        rare:
            1 + ((luck - 1) * 0.65),

        epic:
            1 + ((luck - 1) * 1.1),

        legendary:
            1 + ((luck - 1) * 1.6),

        mythical:
            1 + ((luck - 1) * 2)

    };

    let totalWeight = 0;

    const weighted =
        validItems.map(item => {

            const rarityBonus =
                rarityMultiplier[
                    item.rarity
                ] || 1;

            const weight =
                Number(item.rate) *
                rarityBonus;

            totalWeight += weight;

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

// ==========================================
// PICK FISH
// ==========================================

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

// ==========================================
// PICK TRASH
// ==========================================

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

// ==========================================
// RODS
// ==========================================

const rods = {

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

    iron: {
        id: "iron",
        name: "Cần câu sắt",
        emoji: "<:cancau_2:1534635569219633212>",
        price: 50000,
        uses: 50,
        luck: 1.25,
        star: 2,
        maxLevel: 15
    },

    gold: {
        id: "gold",
        name: "Cần câu vàng",
        emoji: "<:cancau_3:1534625401119445170>",
        price: 150000,
        uses: 100,
        luck: 1.6,
        star: 3,
        maxLevel: 15
    },

    diamond: {
        id: "diamond",
        name: "Cần câu kim cương",
        emoji: "<:cancau_4:1534635400793165965>",
        price: 500000,
        uses: 250,
        luck: 2.2,
        star: 4,
        maxLevel: 15
    },

    mythic: {
        id: "mythic",
        name: "Cần câu huyền thoại",
        emoji: "<:cancau_5:1534635179778511100>",
        price: 1500000,
        uses: 500,
        luck: 3,
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
// UPGRADE
// ==========================================

const upgrade = {

    maxLevel: 15,

    luckPerLevel: 0.1,

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

// ==========================================
// FISHING ZONES
//
// 50 / 35 / 30 / 20 / 15
// ==========================================

const fishingZones = {

    // ======================================
    // 🌴 50 CÁ
    // ======================================

    tropical: {

        id: "tropical",

        name: "🌴 Biển Nhiệt Đới",

        description:
            "Vùng biển khởi đầu, nhiều cá phổ biến và dễ câu.",

        fish: Array.from(
            { length: 50 },
            (_, i) =>
                `ca${i + 1}`
        ),

        // Ủng khá nhiều
        trashRate: 20,

        image:
            "https://media.discordapp.net/attachments/1534756360103788596/1535257413786140733/1000013743-Photoroom.png"
    },


    // ======================================
    // ❄️ 35 CÁ
    // ======================================

    cold: {

        id: "cold",

        name: "❄️ Biển Băng Giá",

        description:
            "Vùng biển lạnh với nhiều loài cá quý hiếm.",

        fish: Array.from(
            { length: 35 },
            (_, i) =>
                `ca${i + 51}`
        ),

        trashRate: 16,

        image:
            "https://media.discordapp.net/attachments/1534756360103788596/1535257294261067868/1000013742-Photoroom.png"
    },


    // ======================================
    // 🐊 30 CÁ
    // ======================================

    swamp: {

        id: "swamp",

        name: "🐊 Đầm Lầy",

        description:
            "Đầm lầy nguy hiểm với nhiều sinh vật kỳ lạ.",

        fish: Array.from(
            { length: 30 },
            (_, i) =>
                `ca${i + 86}`
        ),

        // Đầm lầy nhiều ủng nhất
        trashRate: 25,

        image:
            "https://media.discordapp.net/attachments/1534756360103788596/1535257149284941865/1000013741-Photoroom.png"
    },


    // ======================================
    // 🌊 20 CÁ
    // ======================================

    deep: {

        id: "deep",

        name: "🌊 Vực Sâu",

        description:
            "Vùng nước sâu với những sinh vật cực kỳ hiếm.",

        fish: Array.from(
            { length: 20 },
            (_, i) =>
                `ca${i + 116}`
        ),

        trashRate: 10,

        image:
            "https://media.discordapp.net/attachments/1534756360103788596/1535256926739374100/1000013740-Photoroom.png"
    },


    // ======================================
    // 🌋 15 CÁ
    // CHỦ NHẬT
    // ======================================

    volcano: {

        id: "volcano",

        name: "🌋 Núi Lửa",

        description:
            "Vùng biển núi lửa chỉ xuất hiện vào Chủ Nhật.",

        fish: Array.from(
            { length: 15 },
            (_, i) =>
                `ca${i + 136}`
        ),

        // Khu cuối ít ủng
        trashRate: 6,

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
        price: 50,
        luck: 1.1
    },

    shrimp: {
        id: "shrimp",
        name: "Mồi tôm",
        emoji: "🦐",
        price: 200,
        luck: 1.25
    },

    fish_food: {
        id: "fish_food",
        name: "Thức ăn cá",
        emoji: "🥣",
        price: 500,
        luck: 1.5
    },

    golden_bait: {
        id: "golden_bait",
        name: "Mồi vàng",
        emoji: "✨",
        price: 2000,
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
        minReward: 200,
        maxReward: 1000
    },

    silver_chest: {
        id: "silver_chest",
        name: "Rương bạc",
        emoji: "🗃️",
        rarity: "rare",
        key: "silver_key",
        minReward: 1000,
        maxReward: 4000
    },

    gold_chest: {
        id: "gold_chest",
        name: "Rương vàng",
        emoji: "🎁",
        rarity: "legendary",
        key: "gold_key",
        minReward: 4000,
        maxReward: 15000
    },

    diamond_chest: {
        id: "diamond_chest",
        name: "Rương kim cương",
        emoji: "💎",
        rarity: "mythical",
        key: "diamond_key",
        minReward: 15000,
        maxReward: 50000
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

// ==========================================
// SELL
// ==========================================

const sellConfig = {

    multiplier: 1,

    minPrice: 0,

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
            min: 500,
            max: 1500
        },

        normal: {
            min: 1000,
            max: 3000
        },

        rare: {
            min: 2500,
            max: 6000
        },

        legendary: {
            min: 5000,
            max: 12000
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

    rewardPerLevel: 500

};

// ==========================================
// FISHING
// ==========================================

const fishingConfig = {

    cooldown: 5000,

    minWeight: 0.5,

    maxWeight: 100,

    bonusChance: 5,

    trashChance: 15,

    limitWeightByConfig: true,

    trashEnabled: true

};

// ==========================================
// ECONOMY
// ==========================================

const economyConfig = {

    startingMoney: 1000,

    maxMoney: 999999999,

    dailyReward: {

        min: 500,

        max: 2000

    }

};

// ==========================================
// SELL FISH
// ==========================================

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

// ==========================================
// SELL TRASH
// ==========================================

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

// ==========================================
// GENERATE WEIGHT
// ==========================================

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

    return Number(
        randomFloat(
            min,
            max
        ).toFixed(1)
    );

}

// ==========================================
// GENERATE FISHING RESULT
// ==========================================

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

    // ======================================
    // TRASH
    // ======================================

    const trashChance =
        Number(
            zone.trashRate
        ) ||
        fishingConfig.trashChance;

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
                    )

            };

        }

    }

    // ======================================
    // FISH
    // ======================================

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
// VALIDATE CONFIG
// ==========================================

function validateConfig() {

    const errors = [];

    // ======================================
    // FISH
    // ======================================

    if (
        fishList.length !== 150
    ) {

        errors.push(
            `Fish hiện tại: ${fishList.length}/150`
        );

    }

    for (
        const fish
        of fishList
    ) {

        if (!fish.id) {

            errors.push(
                "Fish thiếu id"
            );

        }

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

    }

    // ======================================
    // ZONES
    // ======================================

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
                        fish.id === fishId
                );

            if (!exists) {

                errors.push(
                    `${zone.id}: không tìm thấy ${fishId}`
                );

            }

        }

    }

    // ======================================
    // RODS
    // ======================================

    for (
        const rod
        of Object.values(rods)
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

    }

    return {

        valid:
            errors.length === 0,

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

    // Random
    weightedRandom,
    pickFish,
    pickTrash,
    generateFishWeight,
    generateFishingResult,

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

    // Fishing
    fishingConfig,

    // Economy
    economyConfig,

    // Rate stone
    rateStone,

    // Validation
    validateConfig

};
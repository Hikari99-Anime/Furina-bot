// ==========================================================
// DISCORD FISHING BOT
// BALANCED ECONOMY V3
// ==========================================================
// 150 FISH / 5 ZONES
//
// ECONOMY:
// - Giá cá giảm
// - Có tỷ lệ câu hụt
// - Có rác
// - Rod có khấu hao
// - Luck chỉ hỗ trợ rarity
// - Legendary / Mythical cực hiếm
// ==========================================================


// ==========================================================
// PREFIX
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

    da_tang_rate: {

        id: "da_tang_rate",

        name: "Đá tăng tỉ lệ",

        emoji: "🪨",

        price: 50000,

        uses: 5,

        rate: 0.10

    }

};


// ==========================================================
// FISH LIST - 150 LOÀI
// ==========================================================
//
// Giá được giảm để tránh economy bị lạm phát.
//
// price = giá / kg
//
// rate = trọng số xuất hiện trong cùng rarity.
//
// ==========================================================

const fishList = [

    // ======================================================
    // 🌴 ZONE 1 - TROPICAL
    // ca1 -> ca50
    // ======================================================

    {
        id: "ca1",
        name: "Cá cơm",
        emoji: "🐟",
        price: 12,
        rate: 100,
        rarity: "common",
        min: 0.5,
        max: 2
    },

    {
        id: "ca2",
        name: "Cá trích",
        emoji: "🐠",
        price: 15,
        rate: 95,
        rarity: "common",
        min: 0.6,
        max: 2.5
    },

    {
        id: "ca3",
        name: "Cá mòi",
        emoji: "🐟",
        price: 18,
        rate: 92,
        rarity: "common",
        min: 0.5,
        max: 2.2
    },

    {
        id: "ca4",
        name: "Cá nục",
        emoji: "🐡",
        price: 20,
        rate: 90,
        rarity: "common",
        min: 0.8,
        max: 3
    },

    {
        id: "ca5",
        name: "Cá đối",
        emoji: "🐟",
        price: 22,
        rate: 88,
        rarity: "common",
        min: 1,
        max: 3.5
    },

    {
        id: "ca6",
        name: "Cá dìa",
        emoji: "🐠",
        price: 25,
        rate: 85,
        rarity: "common",
        min: 1,
        max: 4
    },

    {
        id: "ca7",
        name: "Cá bống",
        emoji: "🐟",
        price: 28,
        rate: 82,
        rarity: "common",
        min: 0.7,
        max: 3
    },

    {
        id: "ca8",
        name: "Cá kèo",
        emoji: "🦈",
        price: 30,
        rate: 80,
        rarity: "common",
        min: 0.8,
        max: 3.2
    },

    {
        id: "ca9",
        name: "Cá rô biển",
        emoji: "🐠",
        price: 32,
        rate: 78,
        rarity: "common",
        min: 1,
        max: 4
    },

    {
        id: "ca10",
        name: "Cá hồng nhỏ",
        emoji: "🐟",
        price: 35,
        rate: 75,
        rarity: "common",
        min: 1,
        max: 4
    },

    {
        id: "ca11",
        name: "Cá thu nhỏ",
        emoji: "🐟",
        price: 38,
        rate: 72,
        rarity: "common",
        min: 1.5,
        max: 5
    },

    {
        id: "ca12",
        name: "Cá bạc má",
        emoji: "🐠",
        price: 40,
        rate: 70,
        rarity: "common",
        min: 1,
        max: 4
    },

    {
        id: "ca13",
        name: "Cá dìa vàng",
        emoji: "🐡",
        price: 45,
        rate: 68,
        rarity: "common",
        min: 1,
        max: 4.5
    },

    {
        id: "ca14",
        name: "Cá mó",
        emoji: "🐠",
        price: 48,
        rate: 65,
        rarity: "common",
        min: 1,
        max: 5
    },

    {
        id: "ca15",
        name: "Cá đục",
        emoji: "🐟",
        price: 50,
        rate: 63,
        rarity: "common",
        min: 1,
        max: 5
    },

    {
        id: "ca16",
        name: "Cá hồng",
        emoji: "🐟",
        price: 55,
        rate: 60,
        rarity: "common",
        min: 1.5,
        max: 6
    },

    {
        id: "ca17",
        name: "Cá mú nhỏ",
        emoji: "🐠",
        price: 60,
        rate: 58,
        rarity: "rare",
        min: 1.5,
        max: 6
    },

    {
        id: "ca18",
        name: "Cá nhồng",
        emoji: "🐟",
        price: 65,
        rate: 55,
        rarity: "rare",
        min: 2,
        max: 7
    },

    {
        id: "ca19",
        name: "Cá cam",
        emoji: "🐠",
        price: 70,
        rate: 52,
        rarity: "rare",
        min: 2,
        max: 7
    },

    {
        id: "ca20",
        name: "Cá dìa sọc",
        emoji: "🐡",
        price: 75,
        rate: 50,
        rarity: "rare",
        min: 2,
        max: 8
    },

    {
        id: "ca21",
        name: "Cá bướm biển",
        emoji: "🦋",
        price: 80,
        rate: 47,
        rarity: "rare",
        min: 1,
        max: 5
    },

    {
        id: "ca22",
        name: "Cá thiên thần",
        emoji: "😇",
        price: 85,
        rate: 45,
        rarity: "rare",
        min: 1,
        max: 5
    },

    {
        id: "ca23",
        name: "Cá hề",
        emoji: "🤡",
        price: 90,
        rate: 43,
        rarity: "rare",
        min: 1,
        max: 4
    },

    {
        id: "ca24",
        name: "Cá đuôi gai",
        emoji: "🐠",
        price: 95,
        rate: 40,
        rarity: "rare",
        min: 1.5,
        max: 6
    },

    {
        id: "ca25",
        name: "Cá mao tiên",
        emoji: "🦂",
        price: 100,
        rate: 38,
        rarity: "rare",
        min: 1,
        max: 5
    },

    {
        id: "ca26",
        name: "Cá nóc",
        emoji: "🐡",
        price: 110,
        rate: 35,
        rarity: "rare",
        min: 1,
        max: 5
    },

    {
        id: "ca27",
        name: "Cá kiếm con",
        emoji: "⚔️",
        price: 120,
        rate: 32,
        rarity: "rare",
        min: 2,
        max: 8
    },

    {
        id: "ca28",
        name: "Cá thu vua",
        emoji: "👑",
        price: 130,
        rate: 30,
        rarity: "epic",
        min: 2,
        max: 9
    },

    {
        id: "ca29",
        name: "Cá mú đỏ",
        emoji: "🔴",
        price: 140,
        rate: 28,
        rarity: "epic",
        min: 2,
        max: 8
    },

    {
        id: "ca30",
        name: "Cá hồng ngọc",
        emoji: "💎",
        price: 150,
        rate: 26,
        rarity: "epic",
        min: 2,
        max: 8
    },

    {
        id: "ca31",
        name: "Cá mặt trăng",
        emoji: "🌙",
        price: 160,
        rate: 24,
        rarity: "epic",
        min: 3,
        max: 10
    },

    {
        id: "ca32",
        name: "Cá đuối xanh",
        emoji: "🌊",
        price: 170,
        rate: 22,
        rarity: "epic",
        min: 3,
        max: 10
    },

    {
        id: "ca33",
        name: "Cá vẹt cầu vồng",
        emoji: "🌈",
        price: 180,
        rate: 20,
        rarity: "epic",
        min: 2,
        max: 8
    },

    {
        id: "ca34",
        name: "Cá mập san hô",
        emoji: "🦈",
        price: 200,
        rate: 18,
        rarity: "epic",
        min: 5,
        max: 15
    },

    {
        id: "ca35",
        name: "Cá kiếm",
        emoji: "⚔️",
        price: 220,
        rate: 16,
        rarity: "epic",
        min: 5,
        max: 18
    },

    {
        id: "ca36",
        name: "Cá cờ",
        emoji: "🎏",
        price: 240,
        rate: 14,
        rarity: "epic",
        min: 5,
        max: 18
    },

    {
        id: "ca37",
        name: "Cá ngừ vây vàng",
        emoji: "🟡",
        price: 260,
        rate: 12,
        rarity: "legendary",
        min: 6,
        max: 20
    },

    {
        id: "ca38",
        name: "Cá mú khổng lồ",
        emoji: "👹",
        price: 280,
        rate: 10,
        rarity: "legendary",
        min: 8,
        max: 25
    },

    {
        id: "ca39",
        name: "Cá mập trắng",
        emoji: "🦈",
        price: 300,
        rate: 8,
        rarity: "legendary",
        min: 10,
        max: 30
    },

    {
        id: "ca40",
        name: "Cá kiếm hoàng kim",
        emoji: "✨",
        price: 330,
        rate: 7,
        rarity: "legendary",
        min: 8,
        max: 25
    },

    {
        id: "ca41",
        name: "Cá rồng biển",
        emoji: "🐉",
        price: 380,
        rate: 5,
        rarity: "legendary",
        min: 8,
        max: 30
    },

    {
        id: "ca42",
        name: "Cá voi sát thủ",
        emoji: "🐋",
        price: 420,
        rate: 3,
        rarity: "legendary",
        min: 15,
        max: 40
    },

    {
        id: "ca43",
        name: "Cá phượng hoàng",
        emoji: "🔥",
        price: 500,
        rate: 2,
        rarity: "mythical",
        min: 10,
        max: 30
    },

    {
        id: "ca44",
        name: "Cá rồng vàng",
        emoji: "🐲",
        price: 550,
        rate: 1.5,
        rarity: "mythical",
        min: 12,
        max: 35
    },

    {
        id: "ca45",
        name: "Cá thần biển",
        emoji: "🔱",
        price: 650,
        rate: 1,
        rarity: "mythical",
        min: 15,
        max: 40
    },

    {
        id: "ca46",
        name: "Cá ngọc trai",
        emoji: "🦪",
        price: 700,
        rate: 0.8,
        rarity: "mythical",
        min: 10,
        max: 30
    },

    {
        id: "ca47",
        name: "Cá hoàng đế",
        emoji: "👑",
        price: 750,
        rate: 0.6,
        rarity: "mythical",
        min: 12,
        max: 35
    },

    {
        id: "ca48",
        name: "Cá tinh linh",
        emoji: "🧚",
        price: 800,
        rate: 0.4,
        rarity: "mythical",
        min: 8,
        max: 25
    },

    {
        id: "ca49",
        name: "Cá sao biển",
        emoji: "🌟",
        price: 850,
        rate: 0.25,
        rarity: "mythical",
        min: 10,
        max: 30
    },

    {
        id: "ca50",
        name: "Cá đại dương cổ đại",
        emoji: "🌊",
        price: 1000,
        rate: 0.1,
        rarity: "mythical",
        min: 15,
        max: 40
    },


    // ======================================================
    // ❄️ ZONE 2 - COLD
    // ca51 -> ca85
    // ======================================================

    ...[
        ["Cá tuyết", "🐟", 45, 80, "common"],
        ["Cá trích Bắc Cực", "🐠", 50, 75, "common"],
        ["Cá minh thái", "🐟", 55, 70, "common"],
        ["Cá hồi bạc", "🐟", 65, 65, "common"],
        ["Cá tuyết đen", "🐡", 70, 60, "common"],
        ["Cá băng", "🧊", 75, 55, "common"],
        ["Cá hồi đỏ", "🔴", 85, 50, "rare"],
        ["Cá hồi vua", "👑", 95, 46, "rare"],
        ["Cá than", "⚫", 100, 43, "rare"],
        ["Cá tuyết khổng lồ", "🐟", 110, 40, "rare"],
        ["Cá sói biển", "🐺", 120, 36, "rare"],
        ["Cá băng xanh", "💙", 130, 33, "rare"],
        ["Cá răng kiếm", "🦷", 145, 30, "rare"],
        ["Cá mặt quỷ", "👺", 155, 27, "rare"],
        ["Cá đèn lồng", "🏮", 165, 24, "rare"],
        ["Cá ma tuyết", "👻", 180, 20, "epic"],
        ["Cá băng ngọc", "💎", 195, 18, "epic"],
        ["Cá pha lê", "🔮", 210, 16, "epic"],
        ["Cá rồng băng", "🐉", 230, 14, "epic"],
        ["Cá voi tuyết", "🐋", 250, 12, "epic"],
        ["Cá kiếm băng", "⚔️", 270, 10, "epic"],
        ["Cá hoàng kim phương Bắc", "🌟", 300, 8, "legendary"],
        ["Cá sói trắng", "🐺", 320, 7, "legendary"],
        ["Cá thần băng", "❄️", 350, 5, "legendary"],
        ["Cá long vương băng", "🐲", 400, 4, "legendary"],
        ["Cá cực quang", "🌌", 450, 3, "legendary"],
        ["Cá thiên thạch", "☄️", 500, 2, "mythical"],
        ["Cá băng cổ đại", "🧊", 550, 1.5, "mythical"],
        ["Cá long thần", "🐉", 650, 1, "mythical"],
        ["Cá linh hồn Bắc Cực", "👻", 700, 0.7, "mythical"],
        ["Cá sao băng", "🌠", 750, 0.5, "mythical"],
        ["Cá nữ thần băng", "👸", 850, 0.3, "mythical"],
        ["Cá vương miện tuyết", "👑", 900, 0.2, "mythical"],
        ["Cá bất tử", "♾️", 1000, 0.1, "mythical"],
        ["Cá Bắc Cực tối thượng", "🌌", 1200, 0.05, "mythical"]
    ].map((x, i) => ({
        id: `ca${i + 51}`,
        name: x[0],
        emoji: x[1],
        price: x[2],
        rate: x[3],
        rarity: x[4],
        min: x[4] === "mythical" ? 8 : 1,
        max: x[4] === "mythical" ? 30 : 12
    })),


    // ======================================================
    // 🐊 ZONE 3 - SWAMP
    // ca86 -> ca115
    // ======================================================

    ...[
        ["Cá lóc", "🐟", 35, 85, "common"],
        ["Cá rô đồng", "🐠", 40, 80, "common"],
        ["Cá trê", "🐟", 45, 76, "common"],
        ["Cá chạch", "🐍", 50, 72, "common"],
        ["Cá bống tượng", "🐟", 55, 68, "common"],
        ["Cá rô phi", "🐠", 60, 64, "common"],
        ["Cá mè", "🐟", 65, 60, "common"],
        ["Cá trắm", "🐟", 70, 55, "common"],
        ["Cá chuối", "🐍", 75, 52, "common"],
        ["Cá trê vàng", "🟡", 80, 48, "rare"],
        ["Cá lóc vàng", "✨", 90, 44, "rare"],
        ["Cá trê khổng lồ", "🐟", 100, 40, "rare"],
        ["Cá sấu con", "🐊", 120, 35, "rare"],
        ["Cá ma đầm lầy", "👻", 130, 30, "rare"],
        ["Cá độc", "☠️", 140, 27, "rare"],
        ["Cá rắn", "🐍", 155, 24, "epic"],
        ["Cá quỷ", "😈", 170, 21, "epic"],
        ["Cá mắt đỏ", "👁️", 185, 18, "epic"],
        ["Cá đầm lầy khổng lồ", "🐊", 200, 15, "epic"],
        ["Cá xương", "💀", 220, 12, "epic"],
        ["Cá bóng tối", "🌑", 250, 9, "legendary"],
        ["Cá độc vương", "☠️", 280, 8, "legendary"],
        ["Cá ma vương", "👻", 320, 6, "legendary"],
        ["Cá quỷ đầm lầy", "😈", 360, 5, "legendary"],
        ["Cá rồng đen", "🐉", 420, 3, "legendary"],
        ["Cá hắc long", "🐲", 500, 2, "mythical"],
        ["Cá tử thần", "💀", 600, 1.2, "mythical"],
        ["Cá vực tối", "🌑", 700, 0.8, "mythical"],
        ["Cá ác mộng", "😱", 800, 0.5, "mythical"],
        ["Cá thần đầm lầy", "🔱", 950, 0.2, "mythical"]
    ].map((x, i) => ({
        id: `ca${i + 86}`,
        name: x[0],
        emoji: x[1],
        price: x[2],
        rate: x[3],
        rarity: x[4],
        min: x[4] === "mythical" ? 8 : 1,
        max: x[4] === "mythical" ? 30 : 15
    })),


    // ======================================================
    // 🌊 ZONE 4 - DEEP
    // ca116 -> ca135
    // ======================================================

    ...[
        ["Cá đèn biển", "🏮", 100, 60, "common"],
        ["Cá rìu", "🪓", 110, 55, "common"],
        ["Cá mắt kính", "👓", 120, 50, "common"],
        ["Cá mực nhỏ", "🦑", 130, 46, "common"],
        ["Cá nhám", "🦈", 140, 42, "rare"],
        ["Cá angler", "💡", 150, 38, "rare"],
        ["Cá rồng biển sâu", "🐉", 165, 34, "rare"],
        ["Cá quỷ biển", "😈", 180, 30, "rare"],
        ["Cá kiếm đen", "⚔️", 195, 26, "rare"],
        ["Cá mập xanh", "🦈", 210, 23, "rare"],
        ["Cá khổng lồ", "🐋", 230, 20, "epic"],
        ["Cá leviathan", "🐉", 260, 17, "epic"],
        ["Cá titan", "👹", 290, 14, "epic"],
        ["Cá hư không", "🌀", 320, 11, "epic"],
        ["Cá sao đen", "🌑", 350, 9, "legendary"],
        ["Cá vực thẳm", "🌊", 400, 7, "legendary"],
        ["Cá thần biển sâu", "🔱", 450, 5, "legendary"],
        ["Cá long vương", "🐲", 550, 3, "legendary"],
        ["Cá hư vô", "🌀", 700, 1.5, "mythical"],
        ["Cá cổ thần đại dương", "🌌", 1000, 0.2, "mythical"]
    ].map((x, i) => ({
        id: `ca${i + 116}`,
        name: x[0],
        emoji: x[1],
        price: x[2],
        rate: x[3],
        rarity: x[4],
        min: x[4] === "mythical" ? 10 : 2,
        max: x[4] === "mythical" ? 40 : 20
    })),


    // ======================================================
    // 🌋 ZONE 5 - VOLCANO
    // ca136 -> ca150
    // ======================================================

    ...[
        ["Cá dung nham", "🌋", 150, 55, "common"],
        ["Cá lửa", "🔥", 170, 50, "common"],
        ["Cá tro núi lửa", "🌫️", 190, 45, "common"],
        ["Cá than đỏ", "🔴", 210, 40, "rare"],
        ["Cá magma", "🌋", 230, 35, "rare"],
        ["Cá hỏa long", "🐉", 250, 30, "rare"],
        ["Cá phượng hoàng biển", "🔥", 280, 25, "epic"],
        ["Cá rồng lửa", "🐲", 320, 20, "epic"],
        ["Cá núi lửa khổng lồ", "🌋", 360, 16, "epic"],
        ["Cá dung nham cổ đại", "🔥", 400, 12, "epic"],
        ["Cá địa ngục", "😈", 450, 9, "legendary"],
        ["Cá hỏa thần", "🔥", 500, 7, "legendary"],
        ["Cá rồng magma", "🐉", 600, 5, "legendary"],
        ["Cá thiên hỏa", "☀️", 750, 2, "mythical"],
        ["Cá thần núi lửa", "🌋", 1000, 0.5, "mythical"]
    ].map((x, i) => ({
        id: `ca${i + 136}`,
        name: x[0],
        emoji: x[1],
        price: x[2],
        rate: x[3],
        rarity: x[4],
        min: x[4] === "mythical" ? 10 : 2,
        max: x[4] === "mythical" ? 40 : 25
    }))

];


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

    },

    old_can: {

        id: "old_can",

        name: "Lon cũ",

        emoji: "🥫",

        price: 0,

        sellPrice: 5,

        rarity: "common",

        rate: 70,

        min: 1,

        max: 1

    },

    seaweed: {

        id: "seaweed",

        name: "Rong biển",

        emoji: "🌿",

        price: 0,

        sellPrice: 8,

        rarity: "common",

        rate: 50,

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

        // 30k / 50 lượt = 600 Fcoin / lượt

        uses: 50,

        luck: 1.20,

        star: 2,

        maxLevel: 15

    },

    gold: {

        id: "gold",

        name: "Cần câu vàng",

        emoji: "<:cancau_3:1534625401119445170>",

        price: 75000,

        uses: 100,

        luck: 1.45,

        star: 3,

        maxLevel: 15

    },

    diamond: {

        id: "diamond",

        name: "Cần câu kim cương",

        emoji: "<:cancau_4:1534635400793165965>",

        price: 175000,

        uses: 250,

        luck: 1.80,

        star: 4,

        maxLevel: 15

    },

    mythic: {

        id: "mythic",

        name: "Cần câu huyền thoại",

        emoji: "<:cancau_5:1534635179778511100>",

        price: 400000,

        uses: 500,

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

    // ======================================================
    // CÂU HỤT
    // ======================================================
    //
    // 12% lượt câu không bắt được cá.
    //
    missChance = 12,
    //
    // Nghĩa là trung bình 100 lượt:
    // ~12 lượt hụt.
    // ======================================================

    missChance: 12,

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
            "Vùng biển khởi đầu, nhiều cá phổ biến.",

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
            "Vùng biển lạnh với nhiều loài cá quý.",

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
            "Đầm lầy nguy hiểm với sinh vật kỳ lạ.",

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

        base: 1,

        luckScale: 0

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

    return weightedRandom(
        Object.values(trashItems),
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

    return Math.max(
        0,
        Number(
            item.sellPrice
        ) || 0
    );

}


// ==========================================================
// GENERATE WEIGHT
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

    return (
        Number(fish.price) *
        getAverageWeight(fish)
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

    if (value < 100) {

        return profitClass.LOSS;

    }

    if (value < 300) {

        return profitClass.BREAK_EVEN;

    }

    if (value < 1000) {

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


    // ======================================================
    // CÂU HỤT
    // ======================================================

    const missChance =
        Number(
            fishingConfig.missChance
        ) || 0;

    if (
        Math.random() * 100 <
        missChance
    ) {

        return {

            type: "miss",

            item: null,

            weight: 0,

            price: 0,

            profitClass:
                profitClass.LOSS

        };

    }


    // ======================================================
    // RÁC
    // ======================================================

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


    // ======================================================
    // CÁ
    // ======================================================

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

                total += weight;

                return {

                    id: f.id,

                    name: f.name,

                    emoji: f.emoji,

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
// RARITY SUMMARY
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
// ALIASES
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

    // ======================================================
    // FISH COUNT
    // ======================================================

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
                `${fish.id} thiếu name`
            );

        }

        if (
            Number(fish.price) < 0
        ) {

            errors.push(
                `${fish.id} price < 0`
            );

        }

        if (
            Number(fish.rate) <= 0
        ) {

            errors.push(
                `${fish.id} rate <= 0`
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


    // ======================================================
    // ZONES
    // ======================================================

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


    // ======================================================
    // ROD
    // ======================================================

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
                `${rod.id} price < 0`
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


    // ======================================================
    // BAIT
    // ======================================================

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
// AUTO APPLY
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

    // Rate stone
    rateStone,

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

    // Validation
    validateConfig

};
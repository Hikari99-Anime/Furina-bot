// ==========================================================
// DISCORD FISHING BOT
// BALANCED ECONOMY V6
// ==========================================================
// 205 FISH
//
// RARITY:
// Common
// Uncommon
// Rare
// Epic
// Legendary
// Mythical
// Celestial
// Divine
//
// KHÔNG CÓ TRANSCENDENT
//
// ZONES:
// 🌴 Tropical
// ❄️ Cold
// 🐊 Swamp
// 🌊 Deep
// 🌋 Volcano
//
// VOLCANO = ZONE ĐẶC BIỆT
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
    uncommon: "🟢",
    rare: "🔵",
    epic: "🟣",
    legendary: "🟡",
    mythical: "🔴",
    celestial: "☄️",
    divine: "🌌"
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
// FISH LIST
// ==========================================================

const fishList = [

    // ======================================================
    // 🌴 TROPICAL
    // ca1 -> ca50
    // ======================================================

    { id:"ca1", name:"Cá cơm", emoji:"🐟", price:20, rate:100, rarity:"common", min:.5, max:2 },
    { id:"ca2", name:"Cá trích", emoji:"🐠", price:24, rate:95, rarity:"common", min:.6, max:2.5 },
    { id:"ca3", name:"Cá mòi", emoji:"🐟", price:28, rate:92, rarity:"common", min:.5, max:2.2 },
    { id:"ca4", name:"Cá nục", emoji:"🐡", price:32, rate:90, rarity:"common", min:.8, max:3 },
    { id:"ca5", name:"Cá đối", emoji:"🐟", price:36, rate:88, rarity:"common", min:1, max:3.5 },

    { id:"ca6", name:"Cá dìa", emoji:"🐠", price:40, rate:85, rarity:"uncommon", min:1, max:4 },
    { id:"ca7", name:"Cá bống", emoji:"🐟", price:44, rate:82, rarity:"uncommon", min:.7, max:3 },
    { id:"ca8", name:"Cá kèo", emoji:"🐡", price:48, rate:80, rarity:"uncommon", min:.8, max:3.2 },
    { id:"ca9", name:"Cá rô biển", emoji:"🐠", price:52, rate:78, rarity:"uncommon", min:1, max:4 },
    { id:"ca10", name:"Cá hồng nhỏ", emoji:"🐟", price:56, rate:75, rarity:"uncommon", min:1, max:4 },

    { id:"ca11", name:"Cá thu nhỏ", emoji:"🐟", price:62, rate:72, rarity:"rare", min:1.5, max:5 },
    { id:"ca12", name:"Cá bạc má", emoji:"🐠", price:68, rate:70, rarity:"rare", min:1, max:4 },
    { id:"ca13", name:"Cá dìa vàng", emoji:"🐡", price:75, rate:68, rarity:"rare", min:1, max:4.5 },
    { id:"ca14", name:"Cá mó", emoji:"🐠", price:82, rate:65, rarity:"rare", min:1, max:5 },
    { id:"ca15", name:"Cá đục", emoji:"🐟", price:88, rate:63, rarity:"rare", min:1, max:5 },

    { id:"ca16", name:"Cá hồng", emoji:"🐟", price:96, rate:60, rarity:"rare", min:1.5, max:6 },
    { id:"ca17", name:"Cá mú nhỏ", emoji:"🐠", price:105, rate:58, rarity:"rare", min:1.5, max:6 },
    { id:"ca18", name:"Cá nhồng", emoji:"🐟", price:115, rate:55, rarity:"rare", min:2, max:7 },
    { id:"ca19", name:"Cá cam", emoji:"🐠", price:125, rate:52, rarity:"rare", min:2, max:7 },
    { id:"ca20", name:"Cá dìa sọc", emoji:"🐡", price:135, rate:50, rarity:"rare", min:2, max:8 },

    { id:"ca21", name:"Cá bướm biển", emoji:"🦋", price:145, rate:47, rarity:"epic", min:1, max:5 },
    { id:"ca22", name:"Cá thiên thần", emoji:"😇", price:155, rate:45, rarity:"epic", min:1, max:5 },
    { id:"ca23", name:"Cá hề", emoji:"🤡", price:165, rate:43, rarity:"epic", min:1, max:4 },
    { id:"ca24", name:"Cá đuôi gai", emoji:"🐠", price:175, rate:40, rarity:"epic", min:1.5, max:6 },
    { id:"ca25", name:"Cá mao tiên", emoji:"🦂", price:185, rate:38, rarity:"epic", min:1, max:5 },

    { id:"ca26", name:"Cá nóc", emoji:"🐡", price:195, rate:35, rarity:"epic", min:1, max:5 },
    { id:"ca27", name:"Cá kiếm con", emoji:"⚔️", price:210, rate:32, rarity:"epic", min:2, max:8 },
    { id:"ca28", name:"Cá thu vua", emoji:"👑", price:230, rate:30, rarity:"legendary", min:2, max:9 },
    { id:"ca29", name:"Cá mú đỏ", emoji:"🔴", price:250, rate:28, rarity:"legendary", min:2, max:8 },
    { id:"ca30", name:"Cá hồng ngọc", emoji:"💎", price:275, rate:26, rarity:"legendary", min:2, max:8 },

    { id:"ca31", name:"Cá mặt trăng", emoji:"🌙", price:300, rate:24, rarity:"legendary", min:3, max:10 },
    { id:"ca32", name:"Cá đuối xanh", emoji:"🌊", price:325, rate:22, rarity:"legendary", min:3, max:10 },
    { id:"ca33", name:"Cá vẹt cầu vồng", emoji:"🌈", price:350, rate:20, rarity:"legendary", min:2, max:8 },
    { id:"ca34", name:"Cá mập san hô", emoji:"🦈", price:380, rate:18, rarity:"legendary", min:5, max:15 },
    { id:"ca35", name:"Cá kiếm", emoji:"⚔️", price:410, rate:16, rarity:"legendary", min:5, max:18 },

    { id:"ca36", name:"Cá cờ", emoji:"🎏", price:440, rate:14, rarity:"legendary", min:5, max:18 },
    { id:"ca37", name:"Cá ngừ vây vàng", emoji:"🟡", price:480, rate:12, rarity:"mythical", min:6, max:20 },
    { id:"ca38", name:"Cá mú khổng lồ", emoji:"👹", price:520, rate:10, rarity:"mythical", min:8, max:25 },
    { id:"ca39", name:"Cá mập trắng", emoji:"🦈", price:570, rate:8, rarity:"mythical", min:10, max:30 },
    { id:"ca40", name:"Cá kiếm hoàng kim", emoji:"✨", price:620, rate:7, rarity:"mythical", min:8, max:25 },

    { id:"ca41", name:"Cá rồng biển", emoji:"🐉", price:680, rate:5, rarity:"mythical", min:8, max:30 },
    { id:"ca42", name:"Cá voi sát thủ", emoji:"🐋", price:740, rate:3.5, rarity:"mythical", min:15, max:40 },
    { id:"ca43", name:"Cá phượng hoàng", emoji:"🔥", price:820, rate:2.5, rarity:"mythical", min:10, max:30 },
    { id:"ca44", name:"Cá rồng vàng", emoji:"🐲", price:900, rate:1.8, rarity:"mythical", min:12, max:35 },
    { id:"ca45", name:"Cá thần biển", emoji:"🔱", price:1000, rate:1.2, rarity:"mythical", min:15, max:40 },

    { id:"ca46", name:"Cá ngọc trai", emoji:"🦪", price:1100, rate:.9, rarity:"mythical", min:10, max:30 },
    { id:"ca47", name:"Cá hoàng đế", emoji:"👑", price:1200, rate:.7, rarity:"mythical", min:12, max:35 },
    { id:"ca48", name:"Cá tinh linh", emoji:"🧚", price:1350, rate:.5, rarity:"celestial", min:8, max:25 },
    { id:"ca49", name:"Cá sao biển", emoji:"🌟", price:1500, rate:.3, rarity:"celestial", min:10, max:30 },
    { id:"ca50", name:"Cá đại dương cổ đại", emoji:"🌊", price:1800, rate:.15, rarity:"celestial", min:15, max:40 },


    // ======================================================
    // ❄️ COLD
    // ca51 -> ca85
    // ======================================================

    ...[
        ["Cá tuyết","🐟",60,80,"common"],
        ["Cá trích Bắc Cực","🐠",66,75,"common"],
        ["Cá minh thái","🐟",72,70,"common"],
        ["Cá hồi bạc","🐟",80,65,"common"],
        ["Cá tuyết đen","🐡",88,60,"common"],

        ["Cá băng","🧊",96,58,"uncommon"],
        ["Cá hồi đỏ","🔴",105,54,"uncommon"],
        ["Cá hồi vua","👑",115,50,"uncommon"],
        ["Cá than","⚫",125,46,"uncommon"],
        ["Cá tuyết khổng lồ","🐟",135,42,"uncommon"],

        ["Cá sói biển","🐺",150,38,"rare"],
        ["Cá băng xanh","💙",165,35,"rare"],
        ["Cá răng kiếm","🦷",180,32,"rare"],
        ["Cá mặt quỷ","👺",195,29,"rare"],
        ["Cá đèn lồng","🏮",210,26,"rare"],

        ["Cá ma tuyết","👻",230,23,"epic"],
        ["Cá băng ngọc","💎",250,20,"epic"],
        ["Cá pha lê","🔮",275,17,"epic"],
        ["Cá rồng băng","🐉",300,14,"epic"],
        ["Cá voi tuyết","🐋",330,12,"epic"],

        ["Cá kiếm băng","⚔️",360,10,"legendary"],
        ["Cá hoàng kim phương Bắc","🌟",400,8,"legendary"],
        ["Cá sói trắng","🐺",440,7,"legendary"],
        ["Cá thần băng","❄️",480,5.5,"legendary"],
        ["Cá long vương băng","🐲",530,4.5,"legendary"],

        ["Cá cực quang","🌌",600,3.5,"mythical"],
        ["Cá thiên thạch","☄️",680,2.5,"mythical"],
        ["Cá băng cổ đại","🧊",760,1.8,"mythical"],
        ["Cá long thần","🐉",850,1.2,"mythical"],
        ["Cá linh hồn Bắc Cực","👻",950,.8,"mythical"],

        ["Cá sao băng","🌠",1100,.55,"celestial"],
        ["Cá nữ thần băng","👸",1250,.4,"celestial"],
        ["Cá vương miện tuyết","👑",1450,.3,"celestial"],
        ["Cá bất tử","♾️",1650,.2,"celestial"],
        ["Cá Bắc Cực tối thượng","🌌",1900,.12,"celestial"]
    ].map((x,i)=>({
        id:`ca${i+51}`,
        name:x[0],
        emoji:x[1],
        price:x[2],
        rate:x[3],
        rarity:x[4],
        min:x[4]==="celestial"||x[4]==="mythical"?8:1,
        max:x[4]==="celestial"||x[4]==="mythical"?35:14
    })),


    // ======================================================
    // 🐊 SWAMP
    // ca86 -> ca115
    // ======================================================

    ...[
        ["Cá lóc","🐟",50,85,"common"],
        ["Cá rô đồng","🐠",55,80,"common"],
        ["Cá trê","🐟",60,76,"common"],
        ["Cá chạch","🐍",65,72,"common"],
        ["Cá bống tượng","🐟",70,68,"common"],

        ["Cá rô phi","🐠",78,64,"uncommon"],
        ["Cá mè","🐟",86,60,"uncommon"],
        ["Cá trắm","🐟",94,56,"uncommon"],
        ["Cá chuối","🐍",102,52,"uncommon"],
        ["Cá trê vàng","🟡",110,48,"uncommon"],

        ["Cá lóc vàng","✨",120,44,"rare"],
        ["Cá trê khổng lồ","🐟",135,40,"rare"],
        ["Cá sấu con","🐊",150,36,"rare"],
        ["Cá ma đầm lầy","👻",165,32,"rare"],
        ["Cá độc","☠️",180,28,"rare"],

        ["Cá rắn","🐍",200,25,"epic"],
        ["Cá quỷ","😈",220,22,"epic"],
        ["Cá mắt đỏ","👁️",240,19,"epic"],
        ["Cá đầm lầy khổng lồ","🐊",265,16,"epic"],
        ["Cá xương","💀",290,13,"epic"],

        ["Cá bóng tối","🌑",320,10,"legendary"],
        ["Cá độc vương","☠️",360,8.5,"legendary"],
        ["Cá ma vương","👻",400,7,"legendary"],
        ["Cá quỷ đầm lầy","😈",450,5.5,"legendary"],
        ["Cá rồng đen","🐉",520,4,"legendary"],

        ["Cá hắc long","🐲",600,3,"mythical"],
        ["Cá tử thần","💀",700,2,"mythical"],
        ["Cá vực tối","🌑",800,1.3,"mythical"],
        ["Cá ác mộng","😱",920,.85,"mythical"],
        ["Cá thần đầm lầy","🔱",1050,.55,"mythical"]
    ].map((x,i)=>({
        id:`ca${i+86}`,
        name:x[0],
        emoji:x[1],
        price:x[2],
        rate:x[3],
        rarity:x[4],
        min:x[4]==="mythical"?8:1,
        max:x[4]==="mythical"?35:16
    })),


    // ======================================================
    // 🌊 DEEP
    // ca116 -> ca135
    // ======================================================

    ...[
        ["Cá đèn biển","🏮",130,60,"common"],
        ["Cá rìu","🪓",145,55,"common"],
        ["Cá mắt kính","👓",160,50,"common"],
        ["Cá mực nhỏ","🦑",175,46,"common"],

        ["Cá nhám","🦈",195,42,"uncommon"],
        ["Cá angler","💡",215,38,"uncommon"],
        ["Cá rồng biển sâu","🐉",235,34,"uncommon"],
        ["Cá quỷ biển","😈",255,30,"uncommon"],

        ["Cá kiếm đen","⚔️",280,27,"rare"],
        ["Cá mập xanh","🦈",310,24,"rare"],
        ["Cá khổng lồ","🐋",340,21,"rare"],

        ["Cá leviathan","🐉",380,18,"epic"],
        ["Cá titan","👹",420,15,"epic"],
        ["Cá hư không","🌀",470,12,"epic"],
        ["Cá sao đen","🌑",520,9.5,"epic"],

        ["Cá vực thẳm","🌊",580,8,"legendary"],
        ["Cá thần biển sâu","🔱",650,6,"legendary"],
        ["Cá long vương","🐲",730,4.5,"legendary"],

        ["Cá hư vô","🌀",850,2.5,"mythical"],
        ["Cá cổ thần đại dương","🌌",1100,1,"mythical"]
    ].map((x,i)=>({
        id:`ca${i+116}`,
        name:x[0],
        emoji:x[1],
        price:x[2],
        rate:x[3],
        rarity:x[4],
        min:x[4]==="mythical"?10:2,
        max:x[4]==="mythical"?40:22
    })),


    // ======================================================
    // 🌋 VOLCANO
    // ca136 -> ca150
    //
    // VÙNG ĐẶC BIỆT
    // GIÁ + RATE CAO
    // ======================================================

    ...[
        ["Cá dung nham","🌋",250,65,"common"],
        ["Cá lửa","🔥",280,60,"common"],
        ["Cá tro núi lửa","🌫️",310,55,"common"],

        ["Cá than đỏ","🔴",350,50,"uncommon"],
        ["Cá magma","🌋",390,46,"uncommon"],
        ["Cá hỏa long","🐉",430,42,"uncommon"],

        ["Cá phượng hoàng biển","🔥",480,37,"rare"],
        ["Cá rồng lửa","🐲",540,32,"rare"],
        ["Cá núi lửa khổng lồ","🌋",600,27,"epic"],

        ["Cá dung nham cổ đại","🔥",680,23,"epic"],
        ["Cá địa ngục","😈",760,18,"epic"],

        ["Cá hỏa thần","🔥",850,13,"legendary"],
        ["Cá rồng magma","🐉",1000,9,"legendary"],

        ["Cá thiên hỏa","☀️",1250,5,"mythical"],
        ["Cá thần núi lửa","🌋",1600,2.5,"celestial"]
    ].map((x,i)=>({
        id:`ca${i+136}`,
        name:x[0],
        emoji:x[1],
        price:x[2],
        rate:x[3],
        rarity:x[4],
        min:x[4]==="celestial"||x[4]==="mythical"?10:2,
        max:x[4]==="celestial"||x[4]==="mythical"?45:28
    })),


    // ======================================================
    // 🌌 DIVINE
    // ca151 -> ca155
    // ======================================================

    {
        id:"ca151",
        name:"Cá Thủy Tổ Thiên Giới",
        emoji:"🌌",
        price:550000,
        rate:.3,
        rarity:"divine",
        min:50,
        max:100
    },

    {
        id:"ca152",
        name:"Cá Băng Thần Vĩnh Hằng",
        emoji:"❄️",
        price:650000,
        rate:.5,
        rarity:"divine",
        min:50,
        max:120
    },

    {
        id:"ca153",
        name:"Cá Hắc Thần Đầm Lầy",
        emoji:"🖤",
        price:500000,
        rate:.1,
        rarity:"divine",
        min:40,
        max:80
    },

    {
        id:"ca154",
        name:"Cá Hư Vô Tận Cùng",
        emoji:"🌀",
        price:900000,
        rate:.01,
        rarity:"divine",
        min:25,
        max:75
    },

    {
        id:"ca155",
        name:"Cá Hỏa Thần Khai Thiên",
        emoji:"☀️",
        price:500000,
        rate:.1,
        rarity:"divine",
        min:25,
        max:80
    },


    // ======================================================
    // ⭐ 50 CÁ MỚI
    // ca156 -> ca205
    // ======================================================


    // ------------------------------------------------------
    // 🌴 TROPICAL
    // ca156 -> ca165
    // ------------------------------------------------------

    {
        id:"ca156",
        name:"Cá san hô xanh",
        emoji:"🐟",
        price:70,
        rate:68,
        rarity:"common",
        min:1,
        max:4
    },

    {
        id:"ca157",
        name:"Cá san hô đỏ",
        emoji:"🐠",
        price:80,
        rate:64,
        rarity:"uncommon",
        min:1,
        max:5
    },

    {
        id:"ca158",
        name:"Cá mặt nạ",
        emoji:"🎭",
        price:95,
        rate:58,
        rarity:"uncommon",
        min:1,
        max:5
    },

    {
        id:"ca159",
        name:"Cá cầu vồng biển",
        emoji:"🌈",
        price:120,
        rate:50,
        rarity:"rare",
        min:1,
        max:6
    },

    {
        id:"ca160",
        name:"Cá ngọc xanh",
        emoji:"💎",
        price:160,
        rate:42,
        rarity:"rare",
        min:2,
        max:7
    },

    {
        id:"ca161",
        name:"Cá hoàng hôn",
        emoji:"🌅",
        price:230,
        rate:30,
        rarity:"epic",
        min:2,
        max:8
    },

    {
        id:"ca162",
        name:"Cá san hô thần bí",
        emoji:"🪸",
        price:320,
        rate:18,
        rarity:"legendary",
        min:3,
        max:10
    },

    {
        id:"ca163",
        name:"Cá mặt trời cổ đại",
        emoji:"☀️",
        price:520,
        rate:7,
        rarity:"mythical",
        min:5,
        max:15
    },

    {
        id:"ca164",
        name:"Cá thiên hà biển",
        emoji:"🌌",
        price:1000,
        rate:1.5,
        rarity:"celestial",
        min:8,
        max:22
    },

    {
        id:"ca165",
        name:"Cá tinh tú đại dương",
        emoji:"✨",
        price:1500,
        rate:.35,
        rarity:"celestial",
        min:10,
        max:30
    },


    // ------------------------------------------------------
    // ❄️ COLD
    // ca166 -> ca175
    // ------------------------------------------------------

    {
        id:"ca166",
        name:"Cá tuyết bạc",
        emoji:"🐟",
        price:100,
        rate:65,
        rarity:"common",
        min:1,
        max:5
    },

    {
        id:"ca167",
        name:"Cá băng nhỏ",
        emoji:"🧊",
        price:120,
        rate:60,
        rarity:"uncommon",
        min:1,
        max:5
    },

    {
        id:"ca168",
        name:"Cá sương giá",
        emoji:"❄️",
        price:145,
        rate:54,
        rarity:"uncommon",
        min:1,
        max:6
    },

    {
        id:"ca169",
        name:"Cá pha lê xanh",
        emoji:"💎",
        price:190,
        rate:46,
        rarity:"rare",
        min:2,
        max:7
    },

    {
        id:"ca170",
        name:"Cá cực quang nhỏ",
        emoji:"🌌",
        price:240,
        rate:38,
        rarity:"rare",
        min:2,
        max:8
    },

    {
        id:"ca171",
        name:"Cá băng hoàng gia",
        emoji:"👑",
        price:320,
        rate:27,
        rarity:"epic",
        min:3,
        max:10
    },

    {
        id:"ca172",
        name:"Cá long băng",
        emoji:"🐉",
        price:450,
        rate:18,
        rarity:"legendary",
        min:4,
        max:12
    },

    {
        id:"ca173",
        name:"Cá thần tuyết",
        emoji:"❄️",
        price:650,
        rate:8,
        rarity:"mythical",
        min:6,
        max:18
    },

    {
        id:"ca174",
        name:"Cá sao cực địa",
        emoji:"🌠",
        price:1000,
        rate:2,
        rarity:"celestial",
        min:8,
        max:25
    },

    {
        id:"ca175",
        name:"Cá vĩnh hằng băng giới",
        emoji:"🌌",
        price:1600,
        rate:.35,
        rarity:"celestial",
        min:12,
        max:35
    },


    // ------------------------------------------------------
    // 🐊 SWAMP
    // ca176 -> ca185
    // ------------------------------------------------------

    {
        id:"ca176",
        name:"Cá bùn",
        emoji:"🐟",
        price:75,
        rate:70,
        rarity:"common",
        min:1,
        max:5
    },

    {
        id:"ca177",
        name:"Cá rong đen",
        emoji:"🌿",
        price:90,
        rate:64,
        rarity:"uncommon",
        min:1,
        max:5
    },

    {
        id:"ca178",
        name:"Cá đốm độc",
        emoji:"☠️",
        price:110,
        rate:58,
        rarity:"uncommon",
        min:1,
        max:6
    },

    {
        id:"ca179",
        name:"Cá mắt lục",
        emoji:"🟢",
        price:150,
        rate:48,
        rarity:"rare",
        min:2,
        max:7
    },

    {
        id:"ca180",
        name:"Cá rắn đen",
        emoji:"🐍",
        price:190,
        rate:40,
        rarity:"rare",
        min:2,
        max:8
    },

    {
        id:"ca181",
        name:"Cá quỷ bùn",
        emoji:"😈",
        price:260,
        rate:30,
        rarity:"epic",
        min:3,
        max:10
    },

    {
        id:"ca182",
        name:"Cá vua đầm lầy",
        emoji:"👑",
        price:380,
        rate:20,
        rarity:"legendary",
        min:4,
        max:13
    },

    {
        id:"ca183",
        name:"Cá tử linh",
        emoji:"💀",
        price:560,
        rate:9,
        rarity:"mythical",
        min:6,
        max:18
    },

    {
        id:"ca184",
        name:"Cá hắc tinh",
        emoji:"🌑",
        price:850,
        rate:2.2,
        rarity:"celestial",
        min:8,
        max:25
    },

    {
        id:"ca185",
        name:"Cá vực ma giới",
        emoji:"🌀",
        price:1400,
        rate:.4,
        rarity:"celestial",
        min:12,
        max:35
    },


    // ------------------------------------------------------
    // 🌊 DEEP
    // ca186 -> ca195
    // ------------------------------------------------------

    {
        id:"ca186",
        name:"Cá đèn xanh",
        emoji:"💡",
        price:180,
        rate:55,
        rarity:"common",
        min:2,
        max:6
    },

    {
        id:"ca187",
        name:"Cá đèn tím",
        emoji:"🟣",
        price:210,
        rate:50,
        rarity:"uncommon",
        min:2,
        max:7
    },

    {
        id:"ca188",
        name:"Cá răng bạc",
        emoji:"🦷",
        price:250,
        rate:44,
        rarity:"uncommon",
        min:2,
        max:8
    },

    {
        id:"ca189",
        name:"Cá bóng ma",
        emoji:"👻",
        price:300,
        rate:37,
        rarity:"rare",
        min:2,
        max:9
    },

    {
        id:"ca190",
        name:"Cá vực xanh",
        emoji:"🌊",
        price:350,
        rate:31,
        rarity:"rare",
        min:3,
        max:10
    },

    {
        id:"ca191",
        name:"Cá titan nhỏ",
        emoji:"👹",
        price:450,
        rate:23,
        rarity:"epic",
        min:4,
        max:12
    },

    {
        id:"ca192",
        name:"Cá leviathan đỏ",
        emoji:"🐉",
        price:600,
        rate:15,
        rarity:"legendary",
        min:5,
        max:15
    },

    {
        id:"ca193",
        name:"Cá hư không đỏ",
        emoji:"🔴",
        price:850,
        rate:7,
        rarity:"mythical",
        min:7,
        max:20
    },

    {
        id:"ca194",
        name:"Cá thiên thể vực sâu",
        emoji:"☄️",
        price:1300,
        rate:1.7,
        rarity:"celestial",
        min:10,
        max:30
    },

    {
        id:"ca195",
        name:"Cá tận cùng đại dương",
        emoji:"🌌",
        price:2000,
        rate:.3,
        rarity:"celestial",
        min:15,
        max:40
    },


    // ------------------------------------------------------
    // 🌋 VOLCANO
    // ca196 -> ca205
    //
    // ĐẶC BIỆT:
    // GIÁ CAO NHẤT
    // RATE TỐT HƠN
    // ------------------------------------------------------

    {
        id:"ca196",
        name:"Cá than nóng",
        emoji:"🔥",
        price:300,
        rate:65,
        rarity:"common",
        min:2,
        max:7
    },

    {
        id:"ca197",
        name:"Cá dung nham nhỏ",
        emoji:"🌋",
        price:350,
        rate:60,
        rarity:"uncommon",
        min:2,
        max:8
    },

    {
        id:"ca198",
        name:"Cá lửa đỏ",
        emoji:"🔥",
        price:420,
        rate:54,
        rarity:"uncommon",
        min:2,
        max:9
    },

    {
        id:"ca199",
        name:"Cá magma xanh",
        emoji:"🔵",
        price:520,
        rate:47,
        rarity:"rare",
        min:3,
        max:10
    },

    {
        id:"ca200",
        name:"Cá hỏa ngọc",
        emoji:"💎",
        price:650,
        rate:40,
        rarity:"rare",
        min:3,
        max:12
    },

    {
        id:"ca201",
        name:"Cá địa nhiệt",
        emoji:"🌋",
        price:800,
        rate:31,
        rarity:"epic",
        min:4,
        max:14
    },

    {
        id:"ca202",
        name:"Cá hỏa long vương",
        emoji:"🐉",
        price:1050,
        rate:22,
        rarity:"legendary",
        min:5,
        max:16
    },

    {
        id:"ca203",
        name:"Cá nhật thực",
        emoji:"🌑",
        price:1450,
        rate:13,
        rarity:"mythical",
        min:7,
        max:22
    },

    {
        id:"ca204",
        name:"Cá thiên hỏa",
        emoji:"☀️",
        price:2100,
        rate:5,
        rarity:"celestial",
        min:10,
        max:30
    },

    {
        id:"ca205",
        name:"Cá tận thế núi lửa",
        emoji:"🌋",
        price:3000,
        rate:1,
        rarity:"celestial",
        min:15,
        max:40
    }

];


// ==========================================================
// TRASH
// ==========================================================

const trashItems = {

    torn_boot: {
        id:"torn_boot",
        name:"Ủng rách",
        emoji:"🥾",
        price:0,
        sellPrice:0,
        rarity:"common",
        rate:100,
        min:1,
        max:1
    },

    old_can: {
        id:"old_can",
        name:"Lon cũ",
        emoji:"🥫",
        price:0,
        sellPrice:2,
        rarity:"common",
        rate:70,
        min:1,
        max:1
    },

    seaweed: {
        id:"seaweed",
        name:"Rong biển",
        emoji:"🌿",
        price:0,
        sellPrice:3,
        rarity:"common",
        rate:50,
        min:1,
        max:1
    }

};


// ==========================================================
// FISH CONFIG
// ==========================================================

const fishConfig = {

    list:fishList,

    trashEnabled:true,

    trash:trashItems,

    totalFish:205

};


// ==========================================================
// PROFIT CLASS
// ==========================================================

const profitClass = {

    LOSS:"loss",

    BREAK_EVEN:"break_even",

    LOW_PROFIT:"low_profit",

    HIGH_PROFIT:"high_profit"

};

const profitClassConfig = {

    loss:{
        name:"Lỗ nhẹ",
        emoji:"🔴",
        color:0xE74C3C
    },

    break_even:{
        name:"Hòa vốn",
        emoji:"⚪",
        color:0xBDC3C7
    },

    low_profit:{
        name:"Lời ít",
        emoji:"🟢",
        color:0x2ECC71
    },

    high_profit:{
        name:"Lời nhiều",
        emoji:"💰",
        color:0xF1C40F
    }

};


// ==========================================================
// RODS
// ==========================================================

const rods = {

    wood:{
        id:"wood",
        name:"Cần câu gỗ",
        emoji:"<:cancau_1:1534625089088393358>",
        price:10000,
        uses:25,
        luck:1.00,
        star:1,
        maxLevel:30
    },

    iron:{
        id:"iron",
        name:"Cần câu sắt",
        emoji:"<:cancau_2:1534635569219633212>",
        price:25000,
        uses:50,
        luck:1.20,
        star:2,
        maxLevel:30
    },

    gold:{
        id:"gold",
        name:"Cần câu vàng",
        emoji:"<:cancau_3:1534625401119445170>",
        price:50000,
        uses:100,
        luck:1.45,
        star:3,
        maxLevel:30
    },

    diamond:{
        id:"diamond",
        name:"Cần câu kim cương",
        emoji:"<:cancau_4:1534635400793165965>",
        price:175000,
        uses:250,
        luck:1.80,
        star:4,
        maxLevel:30
    },

    mythic:{
        id:"mythic",
        name:"Cần câu huyền thoại",
        emoji:"<:cancau_5:1534635179778511100>",
        price:350000,
        uses:500,
        luck:2.30,
        star:5,
        maxLevel:30
    }

};


// ==========================================================
// ROD TITLES
// ==========================================================

const rodTitles = {

    1:"Tân thủ",
    2:"Tập sự",
    3:"Người câu cá",
    4:"Thợ câu",
    5:"Cao thủ",
    6:"Lão luyện",
    7:"Chuyên gia",
    8:"Bậc thầy",
    9:"Đại sư",
    10:"Huyền thoại",
    11:"Thần câu",
    12:"Chúa tể đại dương",
    13:"Thủy thần",
    14:"Vô song",
    15:"Fishing God",

    16:"Đại Ngư Sư",
    17:"Thiên Ngư",
    18:"Hải Vương",
    19:"Thủy Hoàng",
    20:"Thần Ngư",

    21:"Tinh Hải",
    22:"Thiên Hải",
    23:"Chí Tôn Ngư",
    24:"Thái Cổ Ngư",
    25:"Vạn Hải Chi Chủ",

    26:"Tinh Linh Câu",
    27:"Thiên Mệnh Câu",
    28:"Cửu Thiên Ngư",
    29:"Vạn Vật Chi Ngư",
    30:"FURINA FISHING GOD"

};


// ==========================================================
// UPGRADE
// ==========================================================

const upgrade = {

    maxLevel:30,

    luckPerLevel:0.05,

    success:{

        0:70,
        1:68,
        2:66,
        3:64,
        4:62,
        5:60,
        6:58,
        7:56,
        8:54,
        9:52,

        10:50,
        11:48,
        12:46,
        13:44,
        14:42,
        15:40,

        16:38,
        17:36,
        18:34,
        19:32,
        20:30,

        21:28,
        22:27,
        23:25,
        24:24,
        25:22,

        26:20,
        27:15,
        28:10,
        29:5

    },

    minLevel:0,

    maxLevel:30

};


// ==========================================================
// BAITS
// ==========================================================

const baits = {

    worm:{
        id:"worm",
        name:"Mồi giun",
        emoji:"🪱",
        price:10,
        luck:1.10
    },

    shrimp:{
        id:"shrimp",
        name:"Mồi tôm",
        emoji:"🦐",
        price:200,
        luck:1.20
    },

    fish_food:{
        id:"fish_food",
        name:"Thức ăn cá",
        emoji:"🥣",
        price:500,
        luck:2.00
    },

    golden_bait:{
        id:"golden_bait",
        name:"Mồi vàng",
        emoji:"✨",
        price:1000,
        luck:2.50
    }

};


// ==========================================================
// KEYS
// ==========================================================

const keys = {

    bronze_key:{
        id:"bronze_key",
        name:"Chìa khóa đồng",
        emoji:"🗝️",
        price:1000
    },

    silver_key:{
        id:"silver_key",
        name:"Chìa khóa bạc",
        emoji:"🔑",
        price:4000
    },

    gold_key:{
        id:"gold_key",
        name:"Chìa khóa vàng",
        emoji:"🔐",
        price:12000
    },

    diamond_key:{
        id:"diamond_key",
        name:"Chìa khóa kim cương",
        emoji:"💎",
        price:30000
    }

};


// ==========================================================
// CHESTS
// ==========================================================

const chests = {

    wooden_chest:{
        id:"wooden_chest",
        name:"Rương gỗ",
        emoji:"📦",
        rarity:"common",
        key:"bronze_key",
        minReward:300,
        maxReward:1200
    },

    silver_chest:{
        id:"silver_chest",
        name:"Rương bạc",
        emoji:"🗃️",
        rarity:"rare",
        key:"silver_key",
        minReward:1500,
        maxReward:5500
    },

    gold_chest:{
        id:"gold_chest",
        name:"Rương vàng",
        emoji:"🎁",
        rarity:"legendary",
        key:"gold_key",
        minReward:7000,
        maxReward:22000
    },

    diamond_chest:{
        id:"diamond_chest",
        name:"Rương kim cương",
        emoji:"💎",
        rarity:"mythical",
        key:"diamond_key",
        minReward:25000,
        maxReward:80000
    }

};


// ==========================================================
// INSURANCE
// ==========================================================

const insurance = {

    basic_insurance:{
        id:"basic_insurance",
        name:"Bảo hiểm cơ bản",
        emoji:"🛡️",
        price:2000,
        protection:25
    },

    advanced_insurance:{
        id:"advanced_insurance",
        name:"Bảo hiểm cao cấp",
        emoji:"🛡️",
        price:10000,
        protection:50
    },

    premium_insurance:{
        id:"premium_insurance",
        name:"Bảo hiểm VIP",
        emoji:"💠",
        price:40000,
        protection:100
    }

};


// ==========================================================
// SELL CONFIG
// ==========================================================
//
// Tăng nhẹ giá bán.
// Không tăng quá mạnh để giữ mục tiêu:
// khoảng 450k -> 500k / 500 cast
// tùy Luck.
// ==========================================================

const sellConfig = {

    multiplier:0.45,

    priceMultiplier:0.35,

    minPrice:1,

    trashSellPrice:0,

    rarityMultiplier:{

        common:0.35,

        uncommon:0.38,

        rare:0.42,

        epic:0.47,

        legendary:0.55,

        mythical:0.65,

        celestial:0.72,

        divine:0.80

    }

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

    sell:sellConfig

};


// ==========================================================
// QUEST
// ==========================================================

const questConfig = {

    maxPerDay:5,

    reward:{

        easy:{
            min:100,
            max:300
        },

        normal:{
            min:300,
            max:800
        },

        rare:{
            min:800,
            max:1800
        },

        legendary:{
            min:1500,
            max:3500
        },

        mythical:{
            min:3000,
            max:7000
        },

        celestial:{
            min:5000,
            max:12000
        },

        divine:{
            min:10000,
            max:25000
        }

    }

};


// ==========================================================
// RARITY
// ==========================================================

const rarityConfig = {

    common:{
        name:"Common",
        emoji:emoji.common,
        color:0xFFFFFF
    },

    uncommon:{
        name:"Uncommon",
        emoji:emoji.uncommon,
        color:0x2ECC71
    },

    rare:{
        name:"Rare",
        emoji:emoji.rare,
        color:0x3498DB
    },

    epic:{
        name:"Epic",
        emoji:emoji.epic,
        color:0x9B59B6
    },

    legendary:{
        name:"Legendary",
        emoji:emoji.legendary,
        color:0xF1C40F
    },

    mythical:{
        name:"Mythical",
        emoji:emoji.mythical,
        color:0xE74C3C
    },

    celestial:{
        name:"Celestial",
        emoji:emoji.celestial,
        color:0x00FFFF
    },

    divine:{
        name:"DIVINE",
        emoji:emoji.divine,
        color:0x9B59FF
    }

};


// ==========================================================
// LEVEL
// ==========================================================

const levelConfig = {

    maxLevel:100,

    baseExp:100,

    expMultiplier:1.5,

    rewardPerLevel:500

};


// ==========================================================
// ECONOMY
// ==========================================================

const economyConfig = {

    startingMoney:1000,

    maxMoney:999999999,

    dailyReward:{
        min:500,
        max:1500
    },

    includeRodDepreciation:true,

    rodCostWeight:1,

    includeBaitCost:true

};


// ==========================================================
// FISHING CONFIG
// ==========================================================

const fishingConfig = {

    missChance:22,

    minWeight:0.5,

    maxWeight:80,

    trashEnabled:true,

    cooldown:3000,

    rateMultiplier:{

        common:0.85,

        uncommon:0.72,

        rare:0.58,

        epic:0.45,

        legendary:0.32,

        mythical:0.20,

        celestial:0.10,

        divine:0.06

    }

};


// ==========================================================
// FISHING ZONES
// ==========================================================

const fishingZones = {

    // ======================================================
    // 🌴 TROPICAL
    // 60 CÁ + 1 DIVINE
    // ======================================================

    tropical:{

        id:"tropical",

        name:"🌴 Biển Nhiệt Đới",

        description:
            "Vùng biển nhiệt đới với nhiều loài cá đầy màu sắc.",

        fish:Array
            .from(
                {length:60},
                (_,i)=>`ca${i+1}`
            )
            .concat("ca151"),

        trashRate:8,

        image:
            "https://media.discordapp.net/attachments/1534756360103788596/1535257413786140733/1000013743-Photoroom.png"

    },


    // ======================================================
    // ❄️ COLD
    // 45 CÁ + 1 DIVINE
    // ======================================================

    cold:{

        id:"cold",

        name:"❄️ Biển Băng Giá",

        description:
            "Biển băng giá với các loài cá phương Bắc.",

        fish:Array
            .from(
                {length:45},
                (_,i)=>`ca${i+61}`
            )
            .concat("ca152"),

        trashRate:7,

        image:
            "https://media.discordapp.net/attachments/1534756360103788596/1535257294261067868/1000013742-Photoroom.png"

    },


    // ======================================================
    // 🐊 SWAMP
    // 40 CÁ + 1 DIVINE
    // ======================================================

    swamp:{

        id:"swamp",

        name:"🐊 Đầm Lầy",

        description:
            "Đầm lầy nguy hiểm với những sinh vật kỳ bí.",

        fish:Array
            .from(
                {length:40},
                (_,i)=>`ca${i+106}`
            )
            .concat("ca153"),

        trashRate:10,

        image:
            "https://media.discordapp.net/attachments/1534756360103788596/1535257149284941865/1000013741-Photoroom.png"

    },


    // ======================================================
    // 🌊 DEEP
    // 30 CÁ + 1 DIVINE
    // ======================================================

    deep:{

        id:"deep",

        name:"🌊 Vực Sâu",

        description:
            "Vực sâu tối tăm, nơi những sinh vật khổng lồ sinh sống.",

        fish:Array
            .from(
                {length:30},
                (_,i)=>`ca${i+146}`
            )
            .concat("ca154"),

        trashRate:6,

        image:
            "https://media.discordapp.net/attachments/1534756360103788596/1535256926739374100/1000013740-Photoroom.png"

    },


    // ======================================================
    // 🌋 VOLCANO
    // 25 CÁ + 1 DIVINE
    // ======================================================

    volcano:{

        id:"volcano",

        name:"🌋 Núi Lửa",

        description:
            "Vùng đặc biệt với cá lửa cực kỳ quý hiếm. Giá cá và cơ hội gặp cá hiếm cao hơn.",

        fish:Array
            .from(
                {length:10},
                (_,i)=>`ca176+i`
            ),

        trashRate:4,

        special:true,

        priceMultiplier:1.25,

        rateMultiplier:1.20,

        image:
            "https://media.discordapp.net/attachments/1534756360103788596/1535256789833093150/1000013739-Photoroom.png"

    }

};


// ==========================================================
// SỬA DANH SÁCH ZONE
// ==========================================================
//
// Vì 205 cá được chia:
// Tropical: ca1-60
// Cold: ca61-105
// Swamp: ca106-145
// Deep: ca146-175
// Volcano: ca176-205
//
// Divine riêng:
// ca151 -> Tropical
// ca152 -> Cold
// ca153 -> Swamp
// ca154 -> Deep
// ca155 -> Volcano
//
// ==========================================================

fishingZones.tropical.fish =
    Array
        .from(
            {length:60},
            (_,i)=>`ca${i+1}`
        )
        .concat("ca151");

fishingZones.cold.fish =
    Array
        .from(
            {length:45},
            (_,i)=>`ca${i+61}`
        )
        .concat("ca152");

fishingZones.swamp.fish =
    Array
        .from(
            {length:40},
            (_,i)=>`ca${i+106}`
        )
        .concat("ca153");

fishingZones.deep.fish =
    Array
        .from(
            {length:30},
            (_,i)=>`ca${i+146}`
        )
        .concat("ca154");

fishingZones.volcano.fish =
    Array
        .from(
            {length:30},
            (_,i)=>`ca${i+176}`
        )
        .concat("ca155");


// ==========================================================
// ZONE SPECIAL RATE
// ==========================================================

function getZoneRateMultiplier(
    zoneId,
    fish
) {

    if (
        zoneId === "volcano" &&
        fish
    ) {

        return 1.20;

    }

    return 1;

}


// ==========================================================
// RARITY LUCK
// ==========================================================

const rarityLuckConfig = {

    common:{
        base:1,
        luckScale:0
    },

    uncommon:{
        base:0.70,
        luckScale:0.06
    },

    rare:{
        base:0.28,
        luckScale:0.10
    },

    epic:{
        base:0.12,
        luckScale:0.18
    },

    legendary:{
        base:0.035,
        luckScale:0.25
    },

    mythical:{
        base:0.008,
        luckScale:0.35
    },

    celestial:{
        base:0.003,
        luckScale:0.50
    },

    divine:{
        base:1,
        luckScale:0.015
    }

};


// ==========================================================
// LUCK RARITY MULTIPLIER
// ==========================================================

function getLuckRarityMultiplier(
    rarity,
    luck=1
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

    if (
        rarity === "common"
    ) {
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
// RATE MULTIPLIER
// ==========================================================

function getRateMultiplier(
    rarity
) {

    return Number(
        fishingConfig
            .rateMultiplier[rarity]
    ) || 0.01;

}


// ==========================================================
// FISH WEIGHT
// ==========================================================

function getFishWeight(
    fish,
    luck=1
) {

    if (!fish) {
        return 0;
    }

    const rate =
        Number(fish.rate) || 0;

    if (
        rate <= 0
    ) {
        return 0;
    }

    const rarity =
        fish.rarity || "common";

    const multiplier =
        getLuckRarityMultiplier(
            rarity,
            luck
        );

    const rateMultiplier =
        getRateMultiplier(
            rarity
        );

    return (
        rate *
        multiplier *
        rateMultiplier
    );

}


// ==========================================================
// RANDOM FISH
// ==========================================================

function weightedRandom(
    items,
    luck=1
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

    if (
        !validItems.length
    ) {
        return null;
    }

    let totalWeight = 0;

    const weighted =
        validItems.map(
            item => {

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

            }
        );

    if (
        totalWeight <= 0
    ) {
        return null;
    }

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
    luck=1
) {

    if (
        !Array.isArray(
            fishIds
        )
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
        Math.max(
            1,
            Number(luck) || 1
        )
    );

}


// ==========================================================
// PICK TRASH
// ==========================================================

function pickTrash() {

    return weightedRandom(
        Object.values(
            trashItems
        ),
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
    rodId="wood",
    baitId=null
) {

    let cost = 0;

    if (
        economyConfig
            .includeRodDepreciation
    ) {

        cost +=
            calculateRodCostPerCast(
                rodId
            ) *
            economyConfig
                .rodCostWeight;

    }

    if (
        baitId &&
        economyConfig
            .includeBaitCost
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

    const safeWeight =
        Math.max(
            0,
            Number(weight) || 0
        );

    const basePrice =
        Number(fish.price) || 0;

    const multiplier =
        sellConfig
            .rarityMultiplier[
                fish.rarity
            ] ??
        sellConfig.multiplier;

    const price =
        basePrice *
        safeWeight *
        multiplier *
        sellConfig.priceMultiplier;

    return Math.max(
        sellConfig.minPrice,
        Math.floor(price)
    );

}


// ==========================================================
// TRASH SELL
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
        getAverageWeight(fish) *
        (
            sellConfig
                .rarityMultiplier[
                    fish.rarity
                ] ??
            sellConfig.multiplier
        ) *
        sellConfig.priceMultiplier
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
        value < 20
    ) {
        return profitClass.LOSS;
    }

    if (
        value < 80
    ) {
        return profitClass.BREAK_EVEN;
    }

    if (
        value < 300
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
    luck=1
) {

    const zone =
        fishingZones[zoneId];

    if (!zone) {

        return {
            type:"error",
            item:null,
            weight:0,
            price:0,
            profitClass:
                profitClass.LOSS
        };

    }


    // ======================================================
    // MISS
    // ======================================================

    const missChance =
        Math.max(
            0,
            Math.min(
                100,
                Number(
                    fishingConfig
                        .missChance
                ) || 0
            )
        );

    if (
        Math.random() * 100 <
        missChance
    ) {

        return {
            type:"miss",
            item:null,
            weight:0,
            price:0,
            profitClass:
                profitClass.LOSS
        };

    }


    // ======================================================
    // TRASH
    // ======================================================

    const trashChance =
        Math.max(
            0,
            Math.min(
                100,
                Number(
                    zone.trashRate
                ) || 0
            )
        );

    if (
        fishingConfig
            .trashEnabled &&
        Math.random() * 100 <
            trashChance
    ) {

        const trash =
            pickTrash();

        if (trash) {

            return {
                type:"trash",
                item:trash,
                weight:1,
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
    // FISH
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
            type:"error",
            item:null,
            weight:0,
            price:0,
            profitClass:
                profitClass.LOSS
        };

    }

    const weight =
        generateFishWeight(
            fish
        );

    let price =
        calculateFishSellPrice(
            fish,
            weight
        );


    // ======================================================
    // VOLCANO BONUS
    // ======================================================

    if (
        zone.special &&
        zone.priceMultiplier
    ) {

        price =
            Math.floor(
                price *
                zone.priceMultiplier
            );

    }


    return {

        type:"fish",

        item:fish,

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
    rodId="wood",
    baitId=null
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
// RARITY ANALYSIS
// ==========================================================

function analyzeRarityRates(
    zoneId,
    luck=1
) {

    const zone =
        fishingZones[zoneId];

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

    const summary = {

        common:0,

        uncommon:0,

        rare:0,

        epic:0,

        legendary:0,

        mythical:0,

        celestial:0,

        divine:0

    };

    let total = 0;

    for (
        const f
        of fish
    ) {

        const weight =
            getFishWeight(
                f,
                luck
            );

        total += weight;

        if (
            summary[f.rarity] !==
            undefined
        ) {

            summary[f.rarity] +=
                weight;

        }

    }

    if (
        total <= 0
    ) {
        return summary;
    }

    for (
        const rarity
        of Object.keys(
            summary
        )
    ) {

        summary[rarity] =
            (
                summary[rarity] /
                total
            ) *
            100;

    }

    return summary;

}


// ==========================================================
// TOTAL LUCK
// ==========================================================

function calculateTotalLuck(
    rodId="wood",
    rodLevel=0,
    baitId=null,
    rateStoneBonus=0
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

    // ======================================================
    // LV30
    // ======================================================

    const level =
        Math.max(
            0,
            Math.min(
                30,
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

    const validRarities = [

        "common",

        "uncommon",

        "rare",

        "epic",

        "legendary",

        "mythical",

        "celestial",

        "divine"

    ];


    // ======================================================
    // COUNT
    // ======================================================

    if (
        fishList.length !== 205
    ) {

        errors.push(
            `Fish hiện tại: ${fishList.length}/205`
        );

    }


    // ======================================================
    // ID
    // ======================================================

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

        if (
            !validRarities.includes(
                fish.rarity
            )
        ) {

            errors.push(
                `${fish.id} rarity không hợp lệ: ${fish.rarity}`
            );

        }

    }


    // ======================================================
    // DIVINE
    // ======================================================

    const divineFish =
        fishList.filter(
            f =>
                f.rarity ===
                "divine"
        );

    if (
        divineFish.length !== 5
    ) {

        errors.push(
            `Divine hiện tại: ${divineFish.length}/5`
        );

    }


    // ======================================================
    // CELESTIAL
    // ======================================================

    const celestialFish =
        fishList.filter(
            f =>
                f.rarity ===
                "celestial"
        );

    if (
        celestialFish.length <= 0
    ) {

        errors.push(
            "Không có Celestial"
        );

    }


    // ======================================================
    // DIVINE IDS
    // ======================================================

    const requiredDivineIds = [

        "ca151",
        "ca152",
        "ca153",
        "ca154",
        "ca155"

    ];

    for (
        const id
        of requiredDivineIds
    ) {

        const fish =
            fishList.find(
                f =>
                    f.id === id
            );

        if (!fish) {

            errors.push(
                `Thiếu Divine ${id}`
            );

        } else if (
            fish.rarity !==
            "divine"
        ) {

            errors.push(
                `${id} phải là Divine`
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
    // 1 DIVINE / ZONE
    // ======================================================

    for (
        const zone
        of Object.values(
            fishingZones
        )
    ) {

        const zoneDivine =
            zone.fish.filter(
                id => {

                    const fish =
                        fishList.find(
                            f =>
                                f.id ===
                                id
                        );

                    return (
                        fish &&
                        fish.rarity ===
                        "divine"
                    );

                }
            );

        if (
            zoneDivine.length !== 1
        ) {

            errors.push(
                `${zone.id} phải có đúng 1 Divine`
            );

        }

    }


    // ======================================================
    // NO TRANSCENDENT
    // ======================================================

    const transcendent =
        fishList.filter(
            f =>
                f.rarity ===
                "transcendent"
        );

    if (
        transcendent.length > 0
    ) {

        errors.push(
            "Không được có Transcendent"
        );

    }


    // ======================================================
    // RARITY CONFIG
    // ======================================================

    for (
        const rarity
        of validRarities
    ) {

        if (
            !rarityConfig[rarity]
        ) {

            errors.push(
                `Thiếu rarityConfig ${rarity}`
            );

        }

        if (
            !rarityLuckConfig[rarity]
        ) {

            errors.push(
                `Thiếu rarityLuckConfig ${rarity}`
            );

        }

        if (
            Number(
                fishingConfig
                    .rateMultiplier[
                        rarity
                    ]
            ) <= 0
        ) {

            errors.push(
                `rateMultiplier ${rarity} <= 0`
            );

        }

    }


    // ======================================================
    // FISHING
    // ======================================================

    if (
        fishingConfig.missChance < 0 ||
        fishingConfig.missChance > 100
    ) {

        errors.push(
            "missChance phải từ 0 -> 100"
        );

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

        if (
            rod.maxLevel !== 30
        ) {

            errors.push(
                `${rod.id} maxLevel phải là 30`
            );

        }

    }


    // ======================================================
    // UPGRADE
    // ======================================================

    if (
        upgrade.maxLevel !== 30
    ) {

        errors.push(
            "Upgrade maxLevel phải là 30"
        );

    }


    // ======================================================
    // RETURN
    // ======================================================

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

    prefix,
    prefixes,

    emoji,

    formatMoney,
    randomInt,
    randomFloat,

    fishList,
    fishConfig,

    trashItems,

    weightedRandom,
    pickFish,
    pickTrash,

    generateFishWeight,

    generateFishingResult,
    fishingConfig,

    getAverageWeight,
    getExpectedFishValue,
    getProfitClass,

    calculateFishProfit,
    calculateFishingCost,
    calculateRodCostPerCast,
    calculateBaitCostPerCast,

    profitClass,
    profitClassConfig,
    applyProfitClasses,

    calculateTotalLuck,
    getLuckRarityMultiplier,
    getFishWeight,

    analyzeRarityRates,

    calculateFishSellPrice,
    calculateTrashSellPrice,

    sellConfig,

    rods,
    rodList,
    rodTitles,

    upgrade,

    fishingZones,

    baits,
    baitList,

    keys,
    keyList,

    chests,
    chestList,

    insurance,

    rateStone,

    shop,

    questConfig,

    rarityConfig,

    levelConfig,

    economyConfig,

    rarityLuckConfig,

    validateConfig

};
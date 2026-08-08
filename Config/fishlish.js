// ==========================================
// 🐟 FISH LIST
// ==========================================

const fishList = [

    // ==========================================
    // 🌴 VÙNG NHIỆT ĐỚI
    // ==========================================

    {
        id: "ca_he",
        name: "Cá hề",
        emoji: "<:cahe:1535197790135648308>",
        rarity: "COMMON",
        zone: "tropical",
        price: 500,
        isFish: true
    },

    {
        id: "ca_buom",
        name: "Cá bướm",
        emoji: "<:cabuom:1535197637760913408>",
        rarity: "COMMON",
        zone: "tropical",
        price: 650,
        isFish: true
    },

    {
        id: "ca_duoi_kiem",
        name: "Cá đuôi kiếm",
        emoji: "<:caduoikiem:1535198065760141414>",
        rarity: "RARE",
        zone: "tropical",
        price: 1000,
        isFish: true
    },

    {
        id: "ca_nhiet_doi",
        name: "Cá nhiệt đới",
        emoji: "<:canhietdoi:1535198264876339251>",
        rarity: "EPIC",
        zone: "tropical",
        price: 1600,
        isFish: true
    },

    {
        id: "ca_mu",
        name: "Cá mú",
        emoji: "<:camu:1535198469617221642>",
        rarity: "RARE",
        zone: "tropical",
        price: 1200,
        isFish: true
    },


    // ==========================================
    // ❄️ VÙNG LẠNH
    // ==========================================

    {
        id: "ca_tuyet",
        name: "Cá tuyết",
        emoji: "🐟",
        rarity: "COMMON",
        zone: "cold",
        price: 600,
        isFish: true
    },

    {
        id: "ca_hoi",
        name: "Cá hồi",
        emoji: "🐟",
        rarity: "COMMON",
        zone: "cold",
        price: 750,
        isFish: true
    },

    {
        id: "ca_bang",
        name: "Cá băng",
        emoji: "🐟",
        rarity: "RARE",
        zone: "cold",
        price: 1100,
        isFish: true
    },

    {
        id: "ca_hoang_de",
        name: "Cá hoàng đế",
        emoji: "🐟",
        rarity: "EPIC",
        zone: "cold",
        price: 1800,
        isFish: true
    },

    {
        id: "ca_vua_bang",
        name: "Cá vua băng",
        emoji: "🐟",
        rarity: "LEGENDARY",
        zone: "cold",
        price: 3500,
        isFish: true
    },


    // ==========================================
    // 🐊 VÙNG ĐẦM LẦY
    // ==========================================

    {
        id: "ca_tre",
        name: "Cá trê",
        emoji: "🐟",
        rarity: "COMMON",
        zone: "swamp",
        price: 550,
        isFish: true
    },

    {
        id: "ca_loc",
        name: "Cá lóc",
        emoji: "🐟",
        rarity: "COMMON",
        zone: "swamp",
        price: 700,
        isFish: true
    },

    {
        id: "ca_chach",
        name: "Cá chạch",
        emoji: "🐟",
        rarity: "RARE",
        zone: "swamp",
        price: 1050,
        isFish: true
    },

    {
        id: "ca_sau",
        name: "Cá sấu",
        emoji: "🐊",
        rarity: "EPIC",
        zone: "swamp",
        price: 1700,
        isFish: true
    },

    {
        id: "ca_quai_vat_lay",
        name: "Cá quái vật lầy",
        emoji: "👹",
        rarity: "LEGENDARY",
        zone: "swamp",
        price: 3200,
        isFish: true
    },


    // ==========================================
    // 🌊 VÙNG SÂU THẲM
    // ==========================================

    {
        id: "ca_den",
        name: "Cá đen",
        emoji: "🐟",
        rarity: "COMMON",
        zone: "deep",
        price: 800,
        isFish: true
    },

    {
        id: "ca_bien_sau",
        name: "Cá biển sâu",
        emoji: "🐟",
        rarity: "RARE",
        zone: "deep",
        price: 1300,
        isFish: true
    },

    {
        id: "ca_quy_bien_sau",
        name: "Cá quỷ biển sâu",
        emoji: "👹",
        rarity: "EPIC",
        zone: "deep",
        price: 2100,
        isFish: true
    },

    {
        id: "ca_phat_sang",
        name: "Cá phát sáng",
        emoji: "✨",
        rarity: "LEGENDARY",
        zone: "deep",
        price: 4000,
        isFish: true
    },

    {
        id: "ca_hu_vo",
        name: "Cá hư vô",
        emoji: "🌌",
        rarity: "MYTHICAL",
        zone: "deep",
        price: 6500,
        isFish: true
    },


    // ==========================================
    // 🌋 VÙNG NÚI LỬA
    // ==========================================

    {
        id: "ca_nham_thach",
        name: "Cá nham thạch",
        emoji: "🐟",
        rarity: "RARE",
        zone: "volcano",
        price: 1500,
        isFish: true
    },

    {
        id: "ca_lua",
        name: "Cá lửa",
        emoji: "🔥",
        rarity: "EPIC",
        zone: "volcano",
        price: 2300,
        isFish: true
    },

    {
        id: "ca_dung_nham",
        name: "Cá dung nham",
        emoji: "🌋",
        rarity: "EPIC",
        zone: "volcano",
        price: 2800,
        isFish: true
    },

    {
        id: "ca_phuong_hoang",
        name: "Cá phượng hoàng",
        emoji: "🔥",
        rarity: "LEGENDARY",
        zone: "volcano",
        price: 5000,
        isFish: true
    },

    {
        id: "ca_than_lua",
        name: "Cá thần lửa",
        emoji: "🌋",
        rarity: "MYTHICAL",
        zone: "volcano",
        price: 8500,
        isFish: true
    },


    // ==========================================
    // 🥾 RÁC - XUẤT HIỆN TẤT CẢ ZONE
    // ==========================================

    {
        id: "ung_cu",
        name: "Ủng cũ",
        emoji: "🥾",
        rarity: "TRASH",
        zone: "all",
        price: 0,
        isFish: false
    }

];

module.exports = fishList;

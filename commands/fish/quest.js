const {
    EmbedBuilder
} = require("discord.js");

const {
    fishList,
    emoji,
    formatMoney
} = require("../../config");

const {
    getUser,
    save
} = require("../../data");

// ==========================================
// CẤU HÌNH
// ==========================================

const MAX_QUEST_PER_DAY = 5;

// ==========================================
// RANDOM
// ==========================================

function random(min, max) {

    return Math.floor(
        Math.random() *
        (max - min + 1)
    ) + min;

}

// ==========================================
// QUEST ID
// ==========================================

function questId(type) {

    return (
        `${type}_` +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .slice(2)
    );

}

// ==========================================
// KIỂM TRA CÁ THẬT
// ==========================================

function isRealFish(fish) {

    return (
        fish &&
        fish.isFish !== false
    );

}

// ==========================================
// RANDOM CÁ
// ==========================================

function randomFish() {

    const availableFish =
        fishList.filter(
            fish =>
                isRealFish(fish)
        );

    if (
        !availableFish.length
    ) {

        return null;

    }

    return availableFish[
        random(
            0,
            availableFish.length - 1
        )
    ];

}

// ==========================================
// RANDOM CÁ THEO RARITY
// ==========================================

function randomFishByRarity(
    rarities
) {

    const fishes =
        fishList.filter(
            fish =>
                isRealFish(fish) &&
                rarities.includes(
                    String(
                        fish.rarity || ""
                    ).toLowerCase()
                )
        );

    if (
        !fishes.length
    ) {

        return null;

    }

    return fishes[
        random(
            0,
            fishes.length - 1
        )
    ];

}

// ==========================================
// 50 MẪU QUEST
// ==========================================

const QUEST_TYPES = [

    // ======================================
    // 1 - 10 : BẮT CÁ
    // ======================================

    {
        id: "fish_easy",

        type: "fish",

        target:
            () => random(10, 20),

        reward:
            () => random(2500, 4500),

        title:
            "🎣 Ngư dân chăm chỉ",

        description:
            target =>
                `Bắt ${target} con cá`,

        emoji:
            "🐟"
    },

    {
        id: "fish_normal",

        type: "fish",

        target:
            () => random(20, 35),

        reward:
            () => random(4000, 6500),

        title:
            "🐟 Tay câu chuyên nghiệp",

        description:
            target =>
                `Bắt ${target} con cá`,

        emoji:
            "🐟"
    },

    {
        id: "fish_many",

        type: "fish",

        target:
            () => random(30, 60),

        reward:
            () => random(6500, 10000),

        title:
            "🌊 Càn quét đại dương",

        description:
            target =>
                `Bắt ${target} con cá`,

        emoji:
            "🌊"
    },

    {
        id: "fish_big",

        type: "fish",

        target:
            () => random(50, 80),

        reward:
            () => random(9000, 14000),

        title:
            "⚓ Đội trưởng đánh cá",

        description:
            target =>
                `Bắt ${target} con cá`,

        emoji:
            "⚓"
    },

    {
        id: "fish_master",

        type: "fish",

        target:
            () => random(80, 120),

        reward:
            () => random(14000, 20000),

        title:
            "👑 Vua ngư dân",

        description:
            target =>
                `Bắt ${target} con cá`,

        emoji:
            "👑"
    },

    {
        id: "fish_speed",

        type: "fish",

        target:
            () => random(15, 25),

        reward:
            () => random(3500, 5500),

        title:
            "⚡ Câu nhanh",

        description:
            target =>
                `Bắt ${target} con cá`,

        emoji:
            "⚡"
    },

    {
        id: "fish_hard",

        type: "fish",

        target:
            () => random(40, 70),

        reward:
            () => random(8000, 13000),

        title:
            "🔥 Không ngừng nghỉ",

        description:
            target =>
                `Bắt ${target} con cá`,

        emoji:
            "🔥"
    },

    {
        id: "fish_marathon",

        type: "fish",

        target:
            () => random(60, 100),

        reward:
            () => random(12000, 18000),

        title:
            "🏃 Marathon câu cá",

        description:
            target =>
                `Bắt ${target} con cá`,

        emoji:
            "🏃"
    },

    {
        id: "fish_pro",

        type: "fish",

        target:
            () => random(100, 150),

        reward:
            () => random(18000, 25000),

        title:
            "🎖️ Ngư thủ kỳ cựu",

        description:
            target =>
                `Bắt ${target} con cá`,

        emoji:
            "🎖️"
    },

    {
        id: "fish_legend",

        type: "fish",

        target:
            () => random(150, 200),

        reward:
            () => random(25000, 35000),

        title:
            "🏆 Huyền thoại biển cả",

        description:
            target =>
                `Bắt ${target} con cá`,

        emoji:
            "🏆"
    },

    // ======================================
    // 11 - 18 : KG
    // ======================================

    {
        id: "kg_easy",

        type: "kg",

        target:
            () => random(20, 40),

        reward:
            () => random(3000, 5000),

        title:
            "⚖️ Mẻ cá đầu tiên",

        description:
            target =>
                `Câu đủ ${target} KG cá`,

        emoji:
            "⚖️"
    },

    {
        id: "kg_normal",

        type: "kg",

        target:
            () => random(40, 70),

        reward:
            () => random(5000, 8000),

        title:
            "⚖️ Thợ săn khổng lồ",

        description:
            target =>
                `Câu đủ ${target} KG cá`,

        emoji:
            "⚖️"
    },

    {
        id: "kg_big",

        type: "kg",

        target:
            () => random(70, 100),

        reward:
            () => random(8000, 12000),

        title:
            "🐋 Săn cá lớn",

        description:
            target =>
                `Câu đủ ${target} KG cá`,

        emoji:
            "🐋"
    },

    {
        id: "kg_heavy",

        type: "kg",

        target:
            () => random(100, 150),

        reward:
            () => random(12000, 18000),

        title:
            "💪 Cần thủ lực lưỡng",

        description:
            target =>
                `Câu đủ ${target} KG cá`,

        emoji:
            "💪"
    },

    {
        id: "kg_master",

        type: "kg",

        target:
            () => random(150, 220),

        reward:
            () => random(18000, 25000),

        title:
            "👑 Đại sư săn cá",

        description:
            target =>
                `Câu đủ ${target} KG cá`,

        emoji:
            "👑"
    },

    {
        id: "kg_beast",

        type: "kg",

        target:
            () => random(200, 300),

        reward:
            () => random(25000, 35000),

        title:
            "🐉 Quái vật đại dương",

        description:
            target =>
                `Câu đủ ${target} KG cá`,

        emoji:
            "🐉"
    },

    {
        id: "kg_giant",

        type: "kg",

        target:
            () => random(300, 450),

        reward:
            () => random(35000, 50000),

        title:
            "🌊 Sóng thần",

        description:
            target =>
                `Câu đủ ${target} KG cá`,

        emoji:
            "🌊"
    },

    {
        id: "kg_ultimate",

        type: "kg",

        target:
            () => random(450, 600),

        reward:
            () => random(50000, 70000),

        title:
            "🏆 Bá chủ đại dương",

        description:
            target =>
                `Câu đủ ${target} KG cá`,

        emoji:
            "🏆"
    },

    // ======================================
    // 19 - 28 : CÁ CỤ THỂ
    // ======================================

    {
        id: "specific_1",

        type: "specific",

        target:
            () => random(2, 4),

        reward:
            () => random(4000, 7000),

        title:
            "🎯 Thợ săn mục tiêu",

        fish:
            () => randomFish(),

        description:
            (target, fish) =>
                `Bắt ${target} ${fish.name}`,

        emoji:
            "🎯"
    },

    {
        id: "specific_2",

        type: "specific",

        target:
            () => random(3, 5),

        reward:
            () => random(5000, 8000),

        title:
            "🐟 Truy tìm cá",

        fish:
            () => randomFish(),

        description:
            (target, fish) =>
                `Bắt ${target} ${fish.name}`,

        emoji:
            "🐟"
    },

    {
        id: "specific_3",

        type: "specific",

        target:
            () => random(4, 6),

        reward:
            () => random(6000, 10000),

        title:
            "🔎 Theo dấu con mồi",

        fish:
            () => randomFish(),

        description:
            (target, fish) =>
                `Bắt ${target} ${fish.name}`,

        emoji:
            "🔎"
    },

    {
        id: "specific_4",

        type: "specific",

        target:
            () => random(5, 8),

        reward:
            () => random(8000, 12000),

        title:
            "🎣 Chuyên gia mục tiêu",

        fish:
            () => randomFish(),

        description:
            (target, fish) =>
                `Bắt ${target} ${fish.name}`,

        emoji:
            "🎣"
    },

    {
        id: "specific_5",

        type: "specific",

        target:
            () => random(6, 10),

        reward:
            () => random(10000, 15000),

        title:
            "🔥 Săn đến cùng",

        fish:
            () => randomFish(),

        description:
            (target, fish) =>
                `Bắt ${target} ${fish.name}`,

        emoji:
            "🔥"
    },

    {
        id: "specific_6",

        type: "specific",

        target:
            () => random(8, 12),

        reward:
            () => random(12000, 18000),

        title:
            "💎 Kho báu sống",

        fish:
            () => randomFish(),

        description:
            (target, fish) =>
                `Bắt ${target} ${fish.name}`,

        emoji:
            "💎"
    },

    {
        id: "specific_7",

        type: "specific",

        target:
            () => random(2, 3),

        reward:
            () => random(7000, 11000),

        title:
            "🏹 Xạ thủ đại dương",

        fish:
            () => randomFish(),

        description:
            (target, fish) =>
                `Bắt ${target} ${fish.name}`,

        emoji:
            "🏹"
    },

    {
        id: "specific_8",

        type: "specific",

        target:
            () => random(3, 5),

        reward:
            () => random(9000, 14000),

        title:
            "⭐ Mục tiêu vàng",

        fish:
            () => randomFish(),

        description:
            (target, fish) =>
                `Bắt ${target} ${fish.name}`,

        emoji:
            "⭐"
    },

    {
        id: "specific_9",

        type: "specific",

        target:
            () => random(5, 8),

        reward:
            () => random(11000, 17000),

        title:
            "👀 Con mắt đại dương",

        fish:
            () => randomFish(),

        description:
            (target, fish) =>
                `Bắt ${target} ${fish.name}`,

        emoji:
            "👀"
    },

    {
        id: "specific_10",

        type: "specific",

        target:
            () => random(8, 12),

        reward:
            () => random(15000, 22000),

        title:
            "👑 Thợ săn chuyên nghiệp",

        fish:
            () => randomFish(),

        description:
            (target, fish) =>
                `Bắt ${target} ${fish.name}`,

        emoji:
            "👑"
    },

    // ======================================
    // 29 - 34 : RARE / EPIC
    // ======================================

    {
        id: "rare_1",

        type: "specific_rarity",

        rarities:
            ["rare"],

        target:
            () => random(1, 2),

        reward:
            () => random(9000, 14000),

        title:
            "💎 Săn cá hiếm",

        description:
            (target, fish) =>
                `Bắt ${target} ${fish.name}`,

        emoji:
            "💎"
    },

    {
        id: "rare_2",

        type: "specific_rarity",

        rarities:
            ["rare", "epic"],

        target:
            () => random(1, 2),

        reward:
            () => random(10000, 17000),

        title:
            "✨ Săn cá quý",

        description:
            (target, fish) =>
                `Bắt ${target} ${fish.name}`,

        emoji:
            "✨"
    },

    {
        id: "rare_3",

        type: "specific_rarity",

        rarities:
            ["epic"],

        target:
            () => 1,

        reward:
            () => random(14000, 22000),

        title:
            "💜 Thợ săn Epic",

        description:
            (target, fish) =>
                `Bắt 1 ${fish.name}`,

        emoji:
            "💜"
    },

    {
        id: "rare_4",

        type: "specific_rarity",

        rarities:
            ["rare", "epic"],

        target:
            () => random(2, 3),

        reward:
            () => random(18000, 26000),

        title:
            "💎 Bộ sưu tập quý",

        description:
            (target, fish) =>
                `Bắt ${target} ${fish.name}`,

        emoji:
            "💎"
    },

    {
        id: "rare_5",

        type: "specific_rarity",

        rarities:
            ["epic"],

        target:
            () => random(1, 2),

        reward:
            () => random(20000, 30000),

        title:
            "🌟 Báu vật biển sâu",

        description:
            (target, fish) =>
                `Bắt ${target} ${fish.name}`,

        emoji:
            "🌟"
    },

    {
        id: "rare_6",

        type: "specific_rarity",

        rarities:
            ["rare", "epic"],

        target:
            () => random(3, 4),

        reward:
            () => random(25000, 35000),

        title:
            "👑 Đại săn cá quý",

        description:
            (target, fish) =>
                `Bắt ${target} ${fish.name}`,

        emoji:
            "👑"
    },

    // ======================================
    // 35 - 38 : LEGENDARY / MYTHICAL
    // ======================================

    {
        id: "legendary_1",

        type: "specific_rarity",

        rarities:
            ["legendary"],

        target:
            () => 1,

        reward:
            () => random(22000, 35000),

        title:
            "👑 Săn cá huyền thoại",

        description:
            (target, fish) =>
                `Bắt 1 ${fish.name}`,

        emoji:
            "👑"
    },

    {
        id: "legendary_2",

        type: "specific_rarity",

        rarities:
            ["legendary", "mythical"],

        target:
            () => 1,

        reward:
            () => random(30000, 45000),

        title:
            "🔥 Sinh vật truyền thuyết",

        description:
            (target, fish) =>
                `Bắt 1 ${fish.name}`,

        emoji:
            "🔥"
    },

    {
        id: "legendary_3",

        type: "specific_rarity",

        rarities:
            ["mythical"],

        target:
            () => 1,

        reward:
            () => random(40000, 60000),

        title:
            "🌌 Săn Mythical",

        description:
            (target, fish) =>
                `Bắt 1 ${fish.name}`,

        emoji:
            "🌌"
    },

    {
        id: "legendary_4",

        type: "specific_rarity",

        rarities:
            ["legendary", "mythical"],

        target:
            () => 2,

        reward:
            () => random(50000, 75000),

        title:
            "🏆 Thợ săn truyền thuyết",

        description:
            (target, fish) =>
                `Bắt ${target} ${fish.name}`,

        emoji:
            "🏆"
    },

    // ======================================
    // 39 - 42 : TIỀN
    // ======================================

    {
        id: "money_1",

        type: "money",

        target:
            () => random(15000, 25000),

        reward:
            () => random(3000, 5000),

        title:
            "💰 Tích lũy tài sản",

        description:
            target =>
                `Có ít nhất ${formatMoney(target)} xu`,

        emoji:
            emoji.money
    },

    {
        id: "money_2",

        type: "money",

        target:
            () => random(25000, 50000),

        reward:
            () => random(5000, 8000),

        title:
            "💵 Túi tiền đầy",

        description:
            target =>
                `Có ít nhất ${formatMoney(target)} xu`,

        emoji:
            emoji.money
    },

    {
        id: "money_3",

        type: "money",

        target:
            () => random(50000, 100000),

        reward:
            () => random(8000, 14000),

        title:
            "🤑 Đại gia ngư dân",

        description:
            target =>
                `Có ít nhất ${formatMoney(target)} xu`,

        emoji:
            "🤑"
    },

    {
        id: "money_4",

        type: "money",

        target:
            () => random(100000, 200000),

        reward:
            () => random(15000, 25000),

        title:
            "💎 Tài sản khổng lồ",

        description:
            target =>
                `Có ít nhất ${formatMoney(target)} xu`,

        emoji:
            "💎"
    },

    // ======================================
    // 43 - 46 : CẦN CÂU
    // ======================================

    {
        id: "rod_1",

        type: "rod",

        target:
            () => 3,

        reward:
            () => 5000,

        title:
            "🎣 Nâng cấp đầu tiên",

        description:
            () =>
                "Có một cần câu đạt +3",

        emoji:
            "🎣"
    },

    {
        id: "rod_2",

        type: "rod",

        target:
            () => 5,

        reward:
            () => 10000,

        title:
            "⭐ Tân binh cường hóa",

        description:
            () =>
                "Có một cần câu đạt +5",

        emoji:
            "⭐"
    },

    {
        id: "rod_3",

        type: "rod",

        target:
            () => 10,

        reward:
            () => 25000,

        title:
            "🔥 Bậc thầy cường hóa",

        description:
            () =>
                "Có một cần câu đạt +10",

        emoji:
            "🔥"
    },

    {
        id: "rod_4",

        type: "rod",

        target:
            () => 15,

        reward:
            () => 40000,

        title:
            "👑 Đại sư cần câu",

        description:
            () =>
                "Có một cần câu đạt +15",

        emoji:
            "👑"
    },

    // ======================================
    // 47 - 50 : MIXED
    // ======================================

    {
        id: "mixed_1",

        type: "mixed",

        target:
            () => random(10, 20),

        kg:
            target =>
                Number(
                    (
                        target * 1.5
                    ).toFixed(1)
                ),

        reward:
            () => random(8000, 15000),

        title:
            "🌊 Chuyến câu hoàn hảo",

        description:
            (target, kg) =>
                `Bắt ${target} cá · ${kg} KG`,

        emoji:
            "🌊"
    },

    {
        id: "mixed_2",

        type: "mixed",

        target:
            () => random(20, 30),

        kg:
            target =>
                Number(
                    (
                        target * 1.8
                    ).toFixed(1)
                ),

        reward:
            () => random(12000, 20000),

        title:
            "⚓ Mẻ cá bội thu",

        description:
            (target, kg) =>
                `Bắt ${target} cá · ${kg} KG`,

        emoji:
            "⚓"
    },

    {
        id: "mixed_3",

        type: "mixed",

        target:
            () => random(30, 40),

        kg:
            target =>
                Number(
                    (
                        target * 2
                    ).toFixed(1)
                ),

        reward:
            () => random(18000, 28000),

        title:
            "🔥 Đại chiến đại dương",

        description:
            (target, kg) =>
                `Bắt ${target} cá · ${kg} KG`,

        emoji:
            "🔥"
    },

    {
        id: "mixed_4",

        type: "mixed",

        target:
            () => random(40, 60),

        kg:
            target =>
                Number(
                    (
                        target * 2.2
                    ).toFixed(1)
                ),

        reward:
            () => random(25000, 40000),

        title:
            "👑 Bá chủ biển cả",

        description:
            (target, kg) =>
                `Bắt ${target} cá · ${kg} KG`,

        emoji:
            "👑"
    }
];

// ==========================================
// TẠO QUEST
// ==========================================

function generateQuest() {

    const template =
        QUEST_TYPES[
            random(
                0,
                QUEST_TYPES.length - 1
            )
        ];

    if (!template) {
        return null;
    }

    const target =
        template.target();

    const quest = {

        id:
            questId(
                template.id
            ),

        templateId:
            template.id,

        type:
            template.type,

        target,

        reward:
            template.reward(),

        title:
            template.title,

        emoji:
            template.emoji,

        claimed:
            false
    };

    // ======================================
    // CÁ CỤ THỂ
    // ======================================

    if (
        template.type ===
        "specific"
    ) {

        const fish =
            template.fish();

        if (!fish) {
            return null;
        }

        quest.fishId =
            fish.id;

        quest.fishName =
            fish.name;

        quest.fishEmoji =
            fish.emoji ||
            "🐟";

        quest.description =
            template.description(
                target,
                fish
            );

        return quest;
    }

    // ======================================
    // CÁ THEO RARITY
    // ======================================

    if (
        template.type ===
        "specific_rarity"
    ) {

        const fish =
            randomFishByRarity(
                template.rarities
            );

        if (!fish) {
            return null;
        }

        quest.fishId =
            fish.id;

        quest.fishName =
            fish.name;

        quest.fishEmoji =
            fish.emoji ||
            "🐟";

        quest.description =
            template.description(
                target,
                fish
            );

        return quest;
    }

    // ======================================
    // MIXED
    // ======================================

    if (
        template.type ===
        "mixed"
    ) {

        quest.kgTarget =
            template.kg(
                target
            );

        quest.description =
            template.description(
                target,
                quest.kgTarget
            );

        return quest;
    }

    // ======================================
    // QUEST THƯỜNG
    // ======================================

    quest.description =
        template.description(
            target
        );

    return quest;
}

// ==========================================
// ĐẾM CÁ
// ==========================================

function getFishCount(user) {

    let count = 0;

    const userFish =
        user.fish || {};

    for (
        const fishId in userFish
    ) {

        const fishInfo =
            fishList.find(
                fish =>
                    String(
                        fish.id
                    ) ===
                    String(
                        fishId
                    )
            );

        if (
            !isRealFish(
                fishInfo
            )
        ) {
            continue;
        }

        const fishes =
            userFish[fishId];

        if (
            !Array.isArray(
                fishes
            )
        ) {
            continue;
        }

        count +=
            fishes.length;
    }

    return count;
}

// ==========================================
// TÍNH KG
// ==========================================

function getFishKg(user) {

    let kg = 0;

    const userFish =
        user.fish || {};

    for (
        const fishId in userFish
    ) {

        const fishInfo =
            fishList.find(
                fish =>
                    String(
                        fish.id
                    ) ===
                    String(
                        fishId
                    )
            );

        if (
            !isRealFish(
                fishInfo
            )
        ) {
            continue;
        }

        const fishes =
            userFish[fishId];

        if (
            !Array.isArray(
                fishes
            )
        ) {
            continue;
        }

        kg +=
            fishes.reduce(
                (
                    total,
                    value
                ) => {

                    const number =
                        Number(
                            value
                        );

                    return Number.isFinite(
                        number
                    )
                        ? total + number
                        : total;

                },
                0
            );
    }

    return Number(
        kg.toFixed(2)
    );
}

// ==========================================
// TIẾN ĐỘ
// ==========================================

function getProgress(
    user,
    quest
) {

    // ======================================
    // CÁ
    // ======================================

    if (
        quest.type ===
        "fish"
    ) {

        return getFishCount(
            user
        );
    }

    // ======================================
    // KG
    // ======================================

    if (
        quest.type ===
        "kg"
    ) {

        return getFishKg(
            user
        );
    }

    // ======================================
    // CÁ CỤ THỂ
    // ======================================

    if (
        quest.type ===
        "specific" ||
        quest.type ===
        "specific_rarity"
    ) {

        const fishes =
            user.fish?.[
                quest.fishId
            ];

        if (
            !Array.isArray(
                fishes
            )
        ) {
            return 0;
        }

        return fishes.length;
    }

    // ======================================
    // TIỀN
    // ======================================

    if (
        quest.type ===
        "money"
    ) {

        return Number(
            user.money || 0
        );
    }

    // ======================================
    // CẦN
    // ======================================

    if (
        quest.type ===
        "rod"
    ) {

        let maxLevel = 0;

        const rodData =
            user.rodData || {};

        for (
            const id in rodData
        ) {

            const level =
                Number(
                    rodData[id]?.level ||
                    0
                );

            maxLevel =
                Math.max(
                    maxLevel,
                    level
                );
        }

        return maxLevel;
    }

    return 0;
}

// ==========================================
// MIXED
// ==========================================

function getMixedProgress(user) {

    return {

        fish:
            getFishCount(
                user
            ),

        kg:
            getFishKg(
                user
            )

    };
}

// ==========================================
// CHECK HOÀN THÀNH
// ==========================================

function isCompleted(
    user,
    quest
) {

    if (
        !quest
    ) {
        return false;
    }

    // ======================================
    // MIXED
    // ======================================

    if (
        quest.type ===
        "mixed"
    ) {

        const progress =
            getMixedProgress(
                user
            );

        return (
            progress.fish >=
                quest.target &&
            progress.kg >=
                quest.kgTarget
        );
    }

    return (
        getProgress(
            user,
            quest
        ) >=
        Number(
            quest.target || 0
        )
    );
}

// ==========================================
// TẠO 5 QUEST
// ==========================================

function createDailyQuests() {

    const quests = [];

    const used =
        new Set();

    let attempts = 0;

    while (
        quests.length <
            MAX_QUEST_PER_DAY &&
        attempts < 200
    ) {

        attempts++;

        const quest =
            generateQuest();

        if (!quest) {
            continue;
        }

        // Không lấy trùng template
        const key =
            quest.templateId;

        if (
            used.has(
                key
            )
        ) {
            continue;
        }

        // Không lấy trùng cá cụ thể
        if (
            quest.fishId
        ) {

            const fishKey =
                `fish_${quest.fishId}`;

            if (
                used.has(
                    fishKey
                )
            ) {
                continue;
            }

            used.add(
                fishKey
            );
        }

        used.add(
            key
        );

        quests.push(
            quest
        );
    }

    return quests;
}

// ==========================================
// CHECK DAILY
// ==========================================

function checkDaily(user) {

    if (
        !user.quest
    ) {

        user.quest = {

            date:
                "",

            quests:
                [],

            completed:
                0
        };
    }

    // ======================================
    // DATA CŨ
    // ======================================

    if (
        !Array.isArray(
            user.quest.quests
        )
    ) {

        if (
            Array.isArray(
                user.quest.list
            )
        ) {

            user.quest.quests =
                user.quest.list;

        }
        else {

            user.quest.quests =
                [];
        }
    }

    // ======================================
    // NGÀY
    // ======================================

    const today =
        new Date()
            .toISOString()
            .slice(
                0,
                10
            );

    // ======================================
    // QUEST MỚI
    // ======================================

    if (
        user.quest.date !==
        today
    ) {

        user.quest = {

            date:
                today,

            quests:
                createDailyQuests(),

            completed:
                0,

            claimed:
                []
        };

        save();
    }

    // ======================================
    // FIX CLAIMED
    // ======================================

    if (
        !Array.isArray(
            user.quest.claimed
        )
    ) {

        user.quest.claimed =
            [];
    }

    return user.quest;
}

// ==========================================
// FORMAT TIẾN ĐỘ
// ==========================================

function formatProgress(
    user,
    quest
) {

    // ======================================
    // KG
    // ======================================

    if (
        quest.type ===
        "kg"
    ) {

        const progress =
            getProgress(
                user,
                quest
            );

        return (
            `${Math.min(
                progress,
                quest.target
            ).toFixed(2)}` +
            `/${quest.target} KG`
        );
    }

    // ======================================
    // MONEY
    // ======================================

    if (
        quest.type ===
        "money"
    ) {

        const progress =
            getProgress(
                user,
                quest
            );

        return (
            `${formatMoney(
                Math.min(
                    progress,
                    quest.target
                )
            )}` +
            `/${formatMoney(
                quest.target
            )} xu`
        );
    }

    // ======================================
    // MIXED
    // ======================================

    if (
        quest.type ===
        "mixed"
    ) {

        const progress =
            getMixedProgress(
                user
            );

        const fishProgress =
            Math.min(
                progress.fish,
                quest.target
            );

        const kgProgress =
            Math.min(
                progress.kg,
                quest.kgTarget
            );

        return (
            `${fishProgress}/${quest.target} cá` +
            ` · ` +
            `${kgProgress.toFixed(2)}/${quest.kgTarget} KG`
        );
    }

    // ======================================
    // CÁ / ROD
    // ======================================

    const progress =
        getProgress(
            user,
            quest
        );

    return (
        `${Math.min(
            progress,
            quest.target
        )}/${quest.target}`
    );
}

// ==========================================
// NHẬN THƯỞNG QUEST
// ==========================================

function claimCompletedQuests(
    user
) {

    const quests =
        user.quest?.quests || [];

    if (
        !Array.isArray(
            user.quest.claimed
        )
    ) {

        user.quest.claimed =
            [];
    }

    const rewards = [];

    for (
        const quest of quests
    ) {

        if (
            !quest
        ) {
            continue;
        }

        // Đã nhận
        if (
            user.quest.claimed.includes(
                quest.id
            )
        ) {
            continue;
        }

        // Đã hoàn thành?
        if (
            !isCompleted(
                user,
                quest
            )
        ) {
            continue;
        }

        const reward =
            Number(
                quest.reward || 0
            );

        // ==================================
        // CỘNG TIỀN
        // ==================================

        user.money =
            Number(
                user.money || 0
            ) +
            reward;

        // ==================================
        // ĐÁNH DẤU
        // ==================================

        user.quest.claimed.push(
            quest.id
        );

        quest.claimed =
            true;

        rewards.push({

            quest,

            reward

        });
    }

    if (
        rewards.length
    ) {

        user.quest.completed =
            user.quest.quests.filter(
                q =>
                    user.quest.claimed.includes(
                        q.id
                    )
            ).length;

        save();
    }

    return rewards;
}

// ==========================================
// COMMAND
// ==========================================

module.exports = {

    name:
        "quest",

    aliases: [
        "nv",
        "nhiemvu",
        "dailyquest"
    ],

    async execute(message) {

        // ==================================
        // USER
        // ==================================

        const user =
            getUser(
                message.author.id
            );

        // ==================================
        // DAILY
        // ==================================

        checkDaily(
            user
        );

        // ==================================
        // NHẬN THƯỞNG TỰ ĐỘNG
        // ==================================

        const rewards =
            claimCompletedQuests(
                user
            );

        // ==================================
        // THÔNG BÁO NHẬN THƯỞNG
        // ==================================

        if (
            rewards.length
        ) {

            for (
                const item of rewards
            ) {

                const rewardEmbed =
                    new EmbedBuilder()

                        .setColor(
                            "#57F287"
                        )

                        .setTitle(
                            "🎉 HOÀN THÀNH NHIỆM VỤ"
                        )

                        .setDescription(

                            `**${item.quest.title}**\n\n` +

                            `✅ ${item.quest.description}\n` +

                            `🎁 Nhận được **${formatMoney(
                                item.reward
                            )} ${emoji.money}**`

                        )

                        .setFooter({

                            text:
                                "✦ Fishing Adventure · Quest Reward"

                        });

                await message.reply({

                    embeds: [
                        rewardEmbed
                    ]

                });
            }
        }

        // ==================================
        // QUEST
        // ==================================

        const quests =
            Array.isArray(
                user.quest?.quests
            )
                ? user.quest.quests
                : [];

        // ==================================
        // ĐẾM ĐÃ NHẬN
        // ==================================

        const completedCount =
            quests.filter(
                quest =>
                    user.quest.claimed.includes(
                        quest.id
                    )
            ).length;

        // ==================================
        // DANH SÁCH
        // ==================================

        const questText =
            quests
                .map(
                    (
                        quest,
                        index
                    ) => {

                        const completed =
                            isCompleted(
                                user,
                                quest
                            );

                        const claimed =
                            user.quest.claimed.includes(
                                quest.id
                            );

                        const status =
                            claimed
                                ? "💰"
                                : completed
                                    ? "✅"
                                    : "🔄";

                        const progress =
                            formatProgress(
                                user,
                                quest
                            );

                        return (

                            `${status} **${index + 1}. ${quest.title}**\n` +

                            `${quest.emoji || "🎯"} ${quest.description}\n` +

                            `📊 ${progress}  •  🎁 ${formatMoney(
                                quest.reward
                            )} ${emoji.money}`

                        );

                    }
                )
                .join(
                    "\n\n"
                );

        // ==================================
        // EMBED
        // ==================================

        const embed =
            new EmbedBuilder()

                .setColor(
                    completedCount ===
                    MAX_QUEST_PER_DAY
                        ? "#57F287"
                        : "#7ddcff"
                )

                .setTitle(
                    "📜 QUEST DAY"
                )

                .setDescription(

                    `🎯 Hoàn thành: **${completedCount}/${MAX_QUEST_PER_DAY}**\n\n` +

                    (
                        questText ||
                        "Chưa có nhiệm vụ."
                    )

                )

                .setFooter({

                    text:
                        "✦ 5 nhiệm vụ random mỗi ngày · Tự động nhận thưởng"

                });

        // ==================================
        // THÔNG BÁO FULL QUEST
        // ==================================

        if (
            rewards.length &&
            completedCount ===
            MAX_QUEST_PER_DAY
        ) {

            embed.setDescription(

                `🏆 **ĐÃ HOÀN THÀNH TOÀN BỘ ${MAX_QUEST_PER_DAY} QUEST!**\n\n` +

                `💰 Đã tự động nhận toàn bộ phần thưởng.\n\n` +

                questText

            );
        }

        // ==================================
        // SEND
        // ==================================

        return message.reply({

            embeds: [
                embed
            ]

        });

    }

};
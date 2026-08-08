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
        Math.random() * (max - min + 1)
    ) + min;
}

// ==========================================
// TẠO ID QUEST
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
    return fish && fish.isFish !== false;
}

// ==========================================
// RANDOM CÁ THẬT
// ==========================================

function randomFish() {

    const availableFish =
        fishList.filter(
            fish =>
                isRealFish(fish)
        );

    if (!availableFish.length) {
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
// TẠO QUEST
// ==========================================

function generateQuest() {

    const type = random(1, 10);

    // ======================================
    // 1. BẮT CÁ - DỄ
    // ======================================

    if (type === 1) {

        const target =
            random(10, 20);

        return {

            id:
                questId("fish"),

            type:
                "fish",

            target,

            reward:
                random(2500, 4500),

            title:
                "🎣 Ngư dân chăm chỉ",

            description:
                `Bắt ${target} con cá`,

            emoji:
                "🐟"

        };
    }

    // ======================================
    // 2. BẮT NHIỀU CÁ
    // ======================================

    if (type === 2) {

        const target =
            random(30, 60);

        return {

            id:
                questId("fish"),

            type:
                "fish",

            target,

            reward:
                random(6500, 10000),

            title:
                "🌊 Càn quét đại dương",

            description:
                `Bắt ${target} con cá`,

            emoji:
                "🐟"

        };
    }

    // ======================================
    // 3. KG
    // ======================================

    if (type === 3) {

        const target =
            random(40, 100);

        return {

            id:
                questId("kg"),

            type:
                "kg",

            target,

            reward:
                random(6500, 12000),

            title:
                "⚖️ Thợ săn khổng lồ",

            description:
                `Câu đủ ${target} KG cá`,

            emoji:
                "⚖️"

        };
    }

    // ======================================
    // 4. CÁ CỤ THỂ
    // ======================================

    if (type === 4) {

        const fish =
            randomFish();

        if (!fish) {
            return generateQuest();
        }

        const target =
            random(2, 5);

        return {

            id:
                questId("specific"),

            type:
                "specific",

            fishId:
                fish.id,

            target,

            reward:
                random(4000, 8000),

            title:
                `${fish.emoji || "🐟"} Thợ săn ${fish.name}`,

            description:
                `Bắt ${target} ${fish.name}`,

            emoji:
                fish.emoji || "🐟"

        };
    }

    // ======================================
    // 5. RARE / EPIC
    // ======================================

    if (type === 5) {

        const rareFish =
            fishList.filter(
                fish =>
                    isRealFish(fish) &&
                    (
                        fish.rarity === "RARE" ||
                        fish.rarity === "EPIC"
                    )
            );

        if (!rareFish.length) {
            return generateQuest();
        }

        const fish =
            rareFish[
                random(
                    0,
                    rareFish.length - 1
                )
            ];

        const target =
            random(1, 2);

        return {

            id:
                questId("rare"),

            type:
                "specific",

            fishId:
                fish.id,

            target,

            reward:
                random(10000, 18000),

            title:
                "💎 Săn cá quý",

            description:
                `Bắt ${target} ${fish.name}`,

            emoji:
                fish.emoji || "💎"

        };
    }

    // ======================================
    // 6. LEGENDARY / MYTHICAL
    // ======================================

    if (type === 6) {

        const legendaryFish =
            fishList.filter(
                fish =>
                    isRealFish(fish) &&
                    (
                        fish.rarity === "LEGENDARY" ||
                        fish.rarity === "MYTHICAL"
                    )
            );

        if (!legendaryFish.length) {
            return generateQuest();
        }

        const fish =
            legendaryFish[
                random(
                    0,
                    legendaryFish.length - 1
                )
            ];

        return {

            id:
                questId("legendary"),

            type:
                "specific",

            fishId:
                fish.id,

            target:
                1,

            reward:
                random(22000, 35000),

            title:
                "👑 Săn cá huyền thoại",

            description:
                `Bắt 1 ${fish.name}`,

            emoji:
                fish.emoji || "👑"

        };
    }

    // ======================================
    // 7. TIỀN
    // ======================================

    if (type === 7) {

        const target =
            random(15000, 40000);

        return {

            id:
                questId("money"),

            type:
                "money",

            target,

            reward:
                random(3000, 7000),

            title:
                "💰 Tích lũy tài sản",

            description:
                `Có ít nhất ${formatMoney(target)} xu`,

            emoji:
                emoji.money

        };
    }

    // ======================================
    // 8. CẦN +5
    // ======================================

    if (type === 8) {

        return {

            id:
                questId("rod"),

            type:
                "rod",

            target:
                5,

            reward:
                10000,

            title:
                "🎣 Tân binh cường hóa",

            description:
                "Có một cần câu đạt +5",

            emoji:
                "🎣"

        };
    }

    // ======================================
    // 9. CẦN +10
    // ======================================

    if (type === 9) {

        return {

            id:
                questId("rod"),

            type:
                "rod",

            target:
                10,

            reward:
                25000,

            title:
                "⭐ Bậc thầy cường hóa",

            description:
                "Có một cần câu đạt +10",

            emoji:
                "⭐"

        };
    }

    // ======================================
    // 10. CÁ + KG
    // ======================================

    const target =
        random(10, 20);

    const kgTarget =
        Number(
            (target * 1.5)
                .toFixed(1)
        );

    return {

        id:
            questId("mixed"),

        type:
            "mixed",

        target,

        reward:
            random(8000, 15000),

        title:
            "🌊 Chuyến câu hoàn hảo",

        description:
            `Bắt ${target} con cá và đạt ít nhất ${kgTarget} KG`,

        kgTarget,

        emoji:
            "🌊"

    };
}

// ==========================================
// ĐẾM CÁ THẬT
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
                    String(fish.id) ===
                    String(fishId)
            );

        if (!fishInfo) {
            continue;
        }

        if (!isRealFish(fishInfo)) {
            continue;
        }

        const fishes =
            userFish[fishId];

        if (!Array.isArray(fishes)) {
            continue;
        }

        count +=
            fishes.length;
    }

    return count;
}

// ==========================================
// TÍNH KG CÁ THẬT
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
                    String(fish.id) ===
                    String(fishId)
            );

        if (!fishInfo) {
            continue;
        }

        if (!isRealFish(fishInfo)) {
            continue;
        }

        const fishes =
            userFish[fishId];

        if (!Array.isArray(fishes)) {
            continue;
        }

        kg +=
            fishes.reduce(
                (total, value) => {

                    const number =
                        Number(value);

                    if (
                        Number.isFinite(number)
                    ) {
                        return total + number;
                    }

                    return total;

                },
                0
            );
    }

    return Number(
        kg.toFixed(2)
    );
}

// ==========================================
// TÍNH TIẾN ĐỘ
// ==========================================

function getProgress(user, quest) {

    // ======================================
    // CÁ
    // ======================================

    if (
        quest.type === "fish"
    ) {

        return getFishCount(user);
    }

    // ======================================
    // KG
    // ======================================

    if (
        quest.type === "kg"
    ) {

        return getFishKg(user);
    }

    // ======================================
    // CÁ CỤ THỂ
    // ======================================

    if (
        quest.type === "specific"
    ) {

        const fishInfo =
            fishList.find(
                fish =>
                    String(fish.id) ===
                    String(quest.fishId)
            );

        if (!isRealFish(fishInfo)) {
            return 0;
        }

        const fishes =
            user.fish?.[quest.fishId];

        if (!Array.isArray(fishes)) {
            return 0;
        }

        return fishes.length;
    }

    // ======================================
    // TIỀN
    // ======================================

    if (
        quest.type === "money"
    ) {

        return Number(
            user.money || 0
        );
    }

    // ======================================
    // CẦN CÂU
    // ======================================

    if (
        quest.type === "rod"
    ) {

        let maxLevel = 0;

        const rodData =
            user.rodData || {};

        for (
            const id in rodData
        ) {

            const level =
                Number(
                    rodData[id]?.level || 0
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
            getFishCount(user),

        kg:
            getFishKg(user)

    };
}

// ==========================================
// CHECK HOÀN THÀNH
// ==========================================

function isCompleted(user, quest) {

    // ======================================
    // MIXED
    // ======================================

    if (
        quest.type === "mixed"
    ) {

        const progress =
            getMixedProgress(user);

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
        quest.target
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
        attempts <
            100
    ) {

        attempts++;

        const quest =
            generateQuest();

        if (!quest) {
            continue;
        }

        const key =
            quest.type === "specific"

                ? `specific_${quest.fishId}`

                : quest.type;

        if (
            used.has(key)
        ) {
            continue;
        }

        used.add(key);

        quests.push(
            quest
        );
    }

    return quests;
}

// ==========================================
// RESET MỖI NGÀY
// ==========================================

function checkDaily(user) {

    if (!user.quest) {

        user.quest = {

            date:
                "",

            quests:
                [],

            completed:
                0

        };
    }

    const today =
        new Date()
            .toISOString()
            .slice(0, 10);

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
                0

        };

        save();
    }
}

// ==========================================
// HIỂN THỊ TIẾN ĐỘ
// ==========================================

function formatProgress(
    user,
    quest
) {

    // ======================================
    // KG
    // ======================================

    if (
        quest.type === "kg"
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
        quest.type === "money"
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
            )}`
        );
    }

    // ======================================
    // MIXED
    // ======================================

    if (
        quest.type === "mixed"
    ) {

        const progress =
            getMixedProgress(user);

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
            `${fishProgress}` +
            `/${quest.target} cá` +
            ` • ` +
            `${kgProgress.toFixed(2)}` +
            `/${quest.kgTarget} KG`
        );
    }

    // ======================================
    // CÁ / SPECIFIC / ROD
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
        )}` +
        `/${quest.target}`
    );
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

        const user =
            getUser(
                message.author.id
            );

        // ==============================
        // KIỂM TRA QUEST HÔM NAY
        // ==============================

        checkDaily(user);

        const quests =
            user.quest.quests;

        let description =
            "";

        // ==============================
        // HIỂN THỊ QUEST
        // ==============================

        quests.forEach(
            (quest, index) => {

                const completed =
                    isCompleted(
                        user,
                        quest
                    );

                const progress =
                    formatProgress(
                        user,
                        quest
                    );

                const status =
                    completed
                        ? "✅"
                        : "🔄";

                description +=
                    `${status} **${index + 1}. ${quest.title}**\n` +

                    `╭・${quest.description}\n` +

                    `╭・📊 Tiến độ: ${progress}\n` +

                    `╰・🎁 Thưởng: ${formatMoney(
                        quest.reward
                    )} ${emoji.money}\n\n`;
            }
        );

        // ==============================
        // ĐẾM HOÀN THÀNH
        // ==============================

        const completedCount =
            quests.filter(
                quest =>
                    isCompleted(
                        user,
                        quest
                    )
            ).length;

        // ==============================
        // EMBED
        // ==============================

        const embed =
            new EmbedBuilder()

                .setColor(
                    "#7ddcff"
                )

                .setTitle(
                    "╭・📜 NHIỆM VỤ HÀNG NGÀY"
                )

                .setDescription(

                    `🎯 Hôm nay bạn có **${MAX_QUEST_PER_DAY} nhiệm vụ random**.\n` +

                    `🏆 Đã hoàn thành: **${completedCount}/${MAX_QUEST_PER_DAY}**\n\n` +

                    description +

                    `╰・🎣 Nhiệm vụ sẽ làm mới vào ngày mai.`
                )

                .setFooter({

                    text:
                        "✦ Fishing Adventure • Daily Quest"

                });

        return message.reply({

            embeds: [
                embed
            ]

        });
    }
};
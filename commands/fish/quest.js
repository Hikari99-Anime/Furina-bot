const {
    EmbedBuilder
} = require("discord.js");

const {
    fishList,
    baits,
    keys,
    emoji,
    formatMoney
} = require("../../config/index.js");

const {
    getUser,
    save
} = require("../../data.js");

// ======================================================
// CẤU HÌNH
// ======================================================

const MAX_QUEST = 5;

// ======================================================
// NGÀY VIỆT NAM
// ======================================================

function getToday() {

    return new Intl.DateTimeFormat(
        "en-CA",
        {
            timeZone: "Asia/Ho_Chi_Minh"
        }
    ).format(new Date());

}

// ======================================================
// RANDOM
// ======================================================

function random(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;

}

// ======================================================
// KIỂM TRA CÁ THẬT
// ======================================================

function isRealFish(fish) {

    /*
     * Nếu không có isFish
     * => mặc định là cá.
     *
     * Nếu:
     * isFish: false
     * => ủng / rác / item
     */

    return (
        fish &&
        fish.isFish !== false
    );

}

// ======================================================
// LẤY DANH SÁCH CÁ THẬT
// ======================================================

function getRealFishList() {

    return fishList.filter(
        fish =>
            isRealFish(fish)
    );

}

// ======================================================
// RANDOM CÁ THẬT
// ======================================================

function randomFish() {

    const list =
        getRealFishList();

    if (!list.length) {
        return null;
    }

    return list[
        random(
            0,
            list.length - 1
        )
    ];

}

// ======================================================
// TẠO ID
// ======================================================

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

// ======================================================
// TẠO QUEST
// ======================================================

function createQuest() {

    const types = [
        "fish",
        "kg",
        "money",
        "bait",
        "key"
    ];

    const type =
        types[
            random(
                0,
                types.length - 1
            )
        ];

    // ==================================================
    // BẮT CÁ
    // ==================================================

    if (type === "fish") {

        const fish =
            randomFish();

        /*
         * Không có cá thật
         * thì thử tạo quest khác.
         */

        if (!fish) {
            return createQuest();
        }

        const target =
            random(3, 15);

        return {

            id:
                questId("fish"),

            type:
                "fish",

            fishId:
                fish.id,

            target,

            reward:
                random(1500, 5000),

            completed:
                false

        };

    }

    // ==================================================
    // TỔNG KG
    // ==================================================

    if (type === "kg") {

        const target =
            random(5, 30);

        return {

            id:
                questId("kg"),

            type:
                "kg",

            target,

            reward:
                random(2500, 7000),

            completed:
                false

        };

    }

    // ==================================================
    // TIỀN
    // ==================================================

    if (type === "money") {

        const target =
            random(5000, 30000);

        return {

            id:
                questId("money"),

            type:
                "money",

            target,

            reward:
                random(2000, 8000),

            completed:
                false

        };

    }

    // ==================================================
    // MỒI
    // ==================================================

    if (type === "bait") {

        const ids =
            Object.keys(
                baits || {}
            );

        /*
         * Không có mồi trong config
         * thì tạo loại quest khác.
         */

        if (!ids.length) {
            return createQuest();
        }

        const baitId =
            ids[
                random(
                    0,
                    ids.length - 1
                )
            ];

        const target =
            random(5, 30);

        return {

            id:
                questId("bait"),

            type:
                "bait",

            baitId,

            target,

            reward:
                random(1500, 5000),

            completed:
                false

        };

    }

    // ==================================================
    // CHÌA KHÓA
    // ==================================================

    const ids =
        Object.keys(
            keys || {}
        );

    /*
     * Không có key trong config
     * thì tạo quest khác.
     */

    if (!ids.length) {
        return createQuest();
    }

    const keyId =
        ids[
            random(
                0,
                ids.length - 1
            )
        ];

    const target =
        random(1, 5);

    return {

        id:
            questId("key"),

        type:
            "key",

        keyId,

        target,

        reward:
            random(2500, 7000),

        completed:
            false

    };

}

// ======================================================
// TẠO 5 QUEST KHÔNG TRÙNG
// ======================================================

function generateQuests() {

    const quests = [];

    let attempts = 0;

    while (
        quests.length < MAX_QUEST &&
        attempts < 100
    ) {

        attempts++;

        const quest =
            createQuest();

        if (!quest) {
            continue;
        }

        /*
         * Không trùng cùng:
         *
         * fishId
         * baitId
         * keyId
         *
         * Và không trùng loại
         * đối với money / kg.
         */

        const duplicate =
            quests.some(
                existing => {

                    if (
                        existing.type !==
                        quest.type
                    ) {

                        return false;

                    }

                    if (
                        quest.type ===
                        "fish"
                    ) {

                        return (
                            String(
                                existing.fishId
                            ) ===
                            String(
                                quest.fishId
                            )
                        );

                    }

                    if (
                        quest.type ===
                        "bait"
                    ) {

                        return (
                            String(
                                existing.baitId
                            ) ===
                            String(
                                quest.baitId
                            )
                        );

                    }

                    if (
                        quest.type ===
                        "key"
                    ) {

                        return (
                            String(
                                existing.keyId
                            ) ===
                            String(
                                quest.keyId
                            )
                        );

                    }

                    /*
                     * kg / money:
                     * không cho trùng loại.
                     */

                    return true;

                }
            );

        if (!duplicate) {

            quests.push(
                quest
            );

        }

    }

    return quests;

}

// ======================================================
// TÌM FISH CONFIG
// ======================================================

function getFishInfo(fishId) {

    return fishList.find(
        fish =>
            String(fish.id) ===
            String(fishId)
    );

}

// ======================================================
// TÍNH SỐ CÁ THẬT
// ======================================================

function getFishCount(user) {

    let total = 0;

    const userFish =
        user.fish || {};

    for (
        const fishId in userFish
    ) {

        const fishInfo =
            getFishInfo(fishId);

        /*
         * Không có config
         * => bỏ qua.
         */

        if (!fishInfo) {
            continue;
        }

        /*
         * Ủng / rác / item
         * => không tính cá.
         */

        if (
            !isRealFish(
                fishInfo
            )
        ) {

            continue;

        }

        const list =
            userFish[fishId];

        if (
            !Array.isArray(list)
        ) {

            continue;

        }

        total +=
            list.length;

    }

    return total;

}

// ======================================================
// TÍNH KG CÁ THẬT
// ======================================================

function getFishKg(user) {

    let total = 0;

    const userFish =
        user.fish || {};

    for (
        const fishId in userFish
    ) {

        const fishInfo =
            getFishInfo(fishId);

        /*
         * Không có fish config
         * => bỏ qua.
         */

        if (!fishInfo) {
            continue;
        }

        /*
         * Ủng / item
         * => tuyệt đối không tính KG.
         */

        if (
            !isRealFish(
                fishInfo
            )
        ) {

            continue;

        }

        const list =
            userFish[fishId];

        if (
            !Array.isArray(list)
        ) {

            continue;

        }

        for (
            const weight of list
        ) {

            const number =
                Number(weight);

            if (
                Number.isFinite(number)
            ) {

                total +=
                    number;

            }

        }

    }

    return Number(
        total.toFixed(2)
    );

}

// ======================================================
// TÍNH TIẾN ĐỘ
// ======================================================

function getProgress(
    quest,
    user
) {

    // ==================================================
    // CÁ
    // ==================================================

    if (
        quest.type === "fish"
    ) {

        const fishInfo =
            getFishInfo(
                quest.fishId
            );

        /*
         * Quest cũ trỏ vào item
         * hoặc fish không tồn tại
         * => không hoàn thành.
         */

        if (
            !isRealFish(
                fishInfo
            )
        ) {

            return 0;

        }

        const list =
            user.fish?.[
                quest.fishId
            ];

        if (
            !Array.isArray(list)
        ) {

            return 0;

        }

        return list.length;

    }

    // ==================================================
    // KG
    // ==================================================

    if (
        quest.type === "kg"
    ) {

        return getFishKg(
            user
        );

    }

    // ==================================================
    // TIỀN
    // ==================================================

    if (
        quest.type === "money"
    ) {

        return Number(
            user.money || 0
        );

    }

    // ==================================================
    // MỒI
    // ==================================================

    if (
        quest.type === "bait"
    ) {

        return Number(
            user.moi?.[
                quest.baitId
            ] || 0
        );

    }

    // ==================================================
    // CHÌA KHÓA
    // ==================================================

    if (
        quest.type === "key"
    ) {

        return Number(
            user.keys?.[
                quest.keyId
            ] || 0
        );

    }

    return 0;

}

// ======================================================
// TÊN QUEST
// ======================================================

function getQuestName(
    quest
) {

    // ==================================================
    // CÁ
    // ==================================================

    if (
        quest.type === "fish"
    ) {

        const fish =
            getFishInfo(
                quest.fishId
            );

        return (
            `${fish?.emoji || "🐟"} ` +
            `Có ${quest.target} ` +
            `${fish?.name || "cá"}`
        );

    }

    // ==================================================
    // KG
    // ==================================================

    if (
        quest.type === "kg"
    ) {

        return (
            `⚖️ Có ${quest.target} KG cá`
        );

    }

    // ==================================================
    // TIỀN
    // ==================================================

    if (
        quest.type === "money"
    ) {

        return (
            `💰 Có ` +
            `${formatMoney(
                quest.target
            )} ` +
            `${emoji.money}`
        );

    }

    // ==================================================
    // MỒI
    // ==================================================

    if (
        quest.type === "bait"
    ) {

        const bait =
            baits?.[
                quest.baitId
            ];

        return (
            `${bait?.emoji || "🪱"} ` +
            `Có ${quest.target} ` +
            `${bait?.name || "mồi"}`
        );

    }

    // ==================================================
    // CHÌA KHÓA
    // ==================================================

    if (
        quest.type === "key"
    ) {

        const key =
            keys?.[
                quest.keyId
            ];

        return (
            `${key?.emoji || "🔑"} ` +
            `Có ${quest.target} ` +
            `${key?.name || "chìa khóa"}`
        );

    }

    return "🎯 Nhiệm vụ";

}

// ======================================================
// KIỂM TRA + NHẬN THƯỞNG
// ======================================================

function processQuests(user) {

    let rewardTotal = 0;

    let completedNow = 0;

    const rewardText = [];

    for (
        const quest of
        user.quest.quests
    ) {

        /*
         * Đã nhận thưởng rồi
         * => không nhận lần nữa.
         */

        if (
            quest.completed
        ) {

            continue;

        }

        const progress =
            getProgress(
                quest,
                user
            );

        if (
            progress >=
            quest.target
        ) {

            quest.completed =
                true;

            /*
             * Tránh user.money undefined.
             */

            user.money =
                Number(
                    user.money || 0
                );

            user.money +=
                Number(
                    quest.reward || 0
                );

            rewardTotal +=
                Number(
                    quest.reward || 0
                );

            completedNow++;

            rewardText.push(

                `✅ ${getQuestName(quest)} ` +
                `· +${formatMoney(
                    quest.reward
                )} ${emoji.money}`

            );

        }

    }

    return {
        rewardTotal,
        completedNow,
        rewardText
    };

}

// ======================================================
// COMMAND
// ======================================================

module.exports = {

    name: "quest",

    aliases: [
        "q",
        "nv",
        "nhiemvu"
    ],

    async execute(message) {

        // ==================================================
        // LẤY USER
        // ==================================================

        const user =
            getUser(
                message.author.id
            );

        /*
         * Đảm bảo money tồn tại.
         */

        if (
            typeof user.money !==
            "number"
        ) {

            user.money =
                Number(
                    user.money || 0
                );

        }

        // ==================================================
        // NGÀY HÔM NAY
        // ==================================================

        const today =
            getToday();

        // ==================================================
        // TẠO QUEST MỚI
        // ==================================================

        if (
            !user.quest ||
            user.quest.date !== today
        ) {

            user.quest = {

                date:
                    today,

                quests:
                    generateQuests()

            };

            save();

        }

        // ==================================================
        // NẾU QUEST BỊ HỎNG
        // ==================================================

        if (
            !Array.isArray(
                user.quest.quests
            )
        ) {

            user.quest.quests =
                generateQuests();

            save();

        }

        // ==================================================
        // KIỂM TRA HOÀN THÀNH
        // ==================================================

        const result =
            processQuests(
                user
            );

        if (
            result.completedNow > 0
        ) {

            save();

        }

        // ==================================================
        // HIỂN THỊ
        // ==================================================

        let text = "";

        let completed = 0;

        user.quest.quests.forEach(
            (
                quest,
                index
            ) => {

                // ==========================================
                // ĐÃ HOÀN THÀNH
                // ==========================================

                if (
                    quest.completed
                ) {

                    completed++;

                    text +=
                        `~~${index + 1}. ` +
                        `${getQuestName(
                            quest
                        )}~~\n` +

                        `└・Đã hoàn thành · ` +
                        `+${formatMoney(
                            quest.reward
                        )} ` +
                        `${emoji.money}\n\n`;

                    return;

                }

                // ==========================================
                // CHƯA HOÀN THÀNH
                // ==========================================

                const progress =
                    Math.min(
                        getProgress(
                            quest,
                            user
                        ),
                        quest.target
                    );

                text +=
                    `${index + 1}. ` +
                    `${getQuestName(
                        quest
                    )}\n` +

                    `└・Tiến độ: ` +
                    `${progress}/${quest.target} ` +
                    `· +${formatMoney(
                        quest.reward
                    )} ` +
                    `${emoji.money}\n\n`;

            }
        );

        // ==================================================
        // DESCRIPTION
        // ==================================================

        let description =
            `*Nhiệm vụ được random riêng cho từng người chơi.*\n` +
            `*Mỗi ngày có tối đa ${MAX_QUEST} nhiệm vụ.*\n\n` +

            `📋 Hoàn thành: ` +
            `\`${completed}/${MAX_QUEST}\`\n\n` +

            text;

        // ==================================================
        // THÔNG BÁO THƯỞNG
        // ==================================================

        if (
            result.completedNow > 0
        ) {

            description +=
                `\n🎁 Vừa hoàn thành:\n` +
                result.rewardText.join(
                    "\n"
                ) +
                `\n\n` +
                `💰 Tổng nhận: ` +
                `${formatMoney(
                    result.rewardTotal
                )} ` +
                `${emoji.money}`;

        }

        // ==================================================
        // EMBED
        // ==================================================

        const embed =
            new EmbedBuilder()

                .setColor(
                    "#9b7cff"
                )

                .setTitle(
                    "📋 `DAILY QUEST`"
                )

                .setDescription(
                    description
                )

                .setFooter({

                    text:
                        `✦ Fishing Adventure · ${today}`

                })

                .setTimestamp();

        return message.reply({

            embeds: [
                embed
            ]

        });

    }

};
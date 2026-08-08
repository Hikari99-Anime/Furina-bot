const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const {
    rods,
    rodTitles,
    upgrade,
    emoji,
    formatMoney
} = require("../../config");

const {
    getUser,
    save
} = require("../../data");

// ======================================================
// CONFIG
// ======================================================

const MAX_LEVEL = 15;

const DOWNGRADE_LEVEL = 5;

const DESTROY_LEVEL = 10;

const DOWNGRADE_CHANCE = 0.9;

const DOWNGRADE_CHANCE_LV10 = 0.5;

const DESTROY_CHANCE = 0.5;

// ======================================================
// ĐÁ TĂNG RATE
// ======================================================

// ID vật phẩm trong inventory
const RATE_STONE_ID = "da_rate";

// Mỗi đá +5% rate
const RATE_STONE_BONUS = 5;

// Mỗi lần upgrade dùng tối đa 5 đá
const MAX_RATE_STONES = 5;

// ======================================================
// GIÁ UPGRADE
// ======================================================

function getUpgradeCost(base, level) {

    return Math.floor(
        base.price *
        (level + 1) *
        0.5
    );

}

// ======================================================
// LUCK
// ======================================================

function getLuck(rod, base) {

    if (
        rod.luck === undefined ||
        rod.luck === null
    ) {

        rod.luck =
            Number(base.luck) || 1;

    }

    rod.luck =
        Number(
            rod.luck
        );

    if (
        !Number.isFinite(
            rod.luck
        )
    ) {

        rod.luck =
            Number(
                base.luck
            ) || 1;

    }

    // Chống 9.999999999
    rod.luck =
        Math.round(
            rod.luck * 10
        ) / 10;

    return rod.luck;

}

// ======================================================
// FORMAT LUCK
// ======================================================

function formatLuck(value) {

    value =
        Number(value);

    if (
        !Number.isFinite(value)
    ) {

        value = 0;

    }

    value =
        Math.round(
            value * 10
        ) / 10;

    if (
        Number.isInteger(value)
    ) {

        return String(value);

    }

    return value
        .toFixed(1)
        .replace(/\.0$/, "");

}

// ======================================================
// SUCCESS RATE
// ======================================================

function getSuccessRate(level) {

    const rate =
        upgrade?.success?.[level];

    if (
        rate !== undefined
    ) {

        return Number(rate);

    }

    return Math.max(
        10,
        100 - level * 5
    );

}

// ======================================================
// FORMAT RATE
// ======================================================

function formatRate(value) {

    value =
        Number(value) || 0;

    value =
        Math.round(
            value * 10
        ) / 10;

    return Number.isInteger(value)
        ? String(value)
        : value.toFixed(1).replace(/\.0$/, "");

}

// ======================================================
// LẤY SỐ ĐÁ
// ======================================================

function getRateStoneCount(user) {

    return Math.max(
        0,
        Number(
            user?.[RATE_STONE_ID] ||
            user?.inventory?.[RATE_STONE_ID] ||
            user?.items?.[RATE_STONE_ID] ||
            0
        )
    );

}

// ======================================================
// TRỪ ĐÁ
// ======================================================

function removeRateStones(user, amount) {

    if (
        amount <= 0
    ) {

        return;

    }

    // Cách 1: inventory
    if (
        user.inventory &&
        Number.isFinite(
            Number(
                user.inventory[RATE_STONE_ID]
            )
        )
    ) {

        user.inventory[RATE_STONE_ID] =
            Math.max(
                0,
                Number(
                    user.inventory[RATE_STONE_ID]
                ) - amount
            );

        return;

    }

    // Cách 2: items
    if (
        user.items &&
        Number.isFinite(
            Number(
                user.items[RATE_STONE_ID]
            )
        )
    ) {

        user.items[RATE_STONE_ID] =
            Math.max(
                0,
                Number(
                    user.items[RATE_STONE_ID]
                ) - amount
            );

        return;

    }

    // Cách 3: trực tiếp user.da_rate
    user[RATE_STONE_ID] =
        Math.max(
            0,
            Number(
                user[RATE_STONE_ID] || 0
            ) - amount
        );

}

// ======================================================
// TẠO NƠI LƯU ĐÁ
// ======================================================

function addRateStones(user, amount) {

    if (!user.items) {

        user.items = {};

    }

    user.items[RATE_STONE_ID] =
        Math.max(
            0,
            Number(
                user.items[RATE_STONE_ID] || 0
            )
        ) + amount;

}

// ======================================================
// NORMALIZE ROD
// ======================================================

function normalizeRod(
    rod,
    base
) {

    rod.level =
        Number(
            rod.level
        ) || 0;

    rod.luck =
        Number(
            rod.luck
        );

    if (
        !Number.isFinite(
            rod.luck
        )
    ) {

        rod.luck =
            Number(
                base.luck
            ) || 1;

    }

    rod.luck =
        Math.round(
            rod.luck * 10
        ) / 10;

    rod.maxUses =
        Number(
            rod.maxUses
        ) ||
        Number(
            base.uses
        ) ||
        1;

    rod.uses =
        Math.max(
            0,
            Number(
                rod.uses
            ) || 0
        );

    if (
        rod.uses >
        rod.maxUses
    ) {

        rod.uses =
            rod.maxUses;

    }

    rod.destroyed =
        Boolean(
            rod.destroyed
        );

    return rod;

}

// ======================================================
// ROD HEADER
// ======================================================

function rodHeader(
    base,
    rod
) {

    return (
        `${base.emoji} ${base.name} ` +
        `\`+${rod.level}\` ` +
        `Độ bền \`${rod.uses}/${rod.maxUses}\` ` +
        `🍀 Luck ${formatLuck(rod.luck)}`
    );

}

// ======================================================
// NÚT CHỌN ĐÁ
// ======================================================

function createRateStoneButtons(
    user,
    ownerID
) {

    const count =
        getRateStoneCount(user);

    const buttons = [];

    for (
        let i = 0;
        i <= MAX_RATE_STONES;
        i++
    ) {

        const bonus =
            i *
            RATE_STONE_BONUS;

        const disabled =
            i > count;

        buttons.push(

            new ButtonBuilder()

                .setCustomId(
                    `upgrade_stone_${ownerID}_${i}`
                )

                .setLabel(
                    i === 0
                        ? "Không dùng"
                        : `${i} đá (+${bonus}%)`
                )

                .setEmoji(
                    i === 0
                        ? "❌"
                        : "🪨"
                )

                .setStyle(
                    i === 0
                        ? ButtonStyle.Secondary
                        : ButtonStyle.Primary
                )

                .setDisabled(
                    disabled
                )

        );

    }

    // Discord tối đa 5 button / row
    // Tách 0-4 và 5
    const rows = [];

    rows.push(
        new ActionRowBuilder()
            .addComponents(
                buttons.slice(0, 5)
            )
    );

    rows.push(
        new ActionRowBuilder()
            .addComponents(
                buttons.slice(5)
            )
    );

    return rows;

}

// ======================================================
// MODULE
// ======================================================

module.exports = {

    name: "upgrade",

    aliases: [
        "cuonghoa",
        "nangcap"
    ],

    async execute(message) {

        const user =
            getUser(
                message.author.id
            );

        // ==================================================
        // DATA
        // ==================================================

        if (!user.can)
            user.can = {};

        if (!user.rodData)
            user.rodData = {};

        if (!user.items)
            user.items = {};

        const id =
            user.can.dangDung;

        // ==================================================
        // CHƯA TRANG BỊ
        // ==================================================

        if (!id) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor(
                            "#ff6b81"
                        )

                        .setTitle(
                            "🎣 `NO ROD EQUIPPED`"
                        )

                        .setDescription(
                            "Bạn chưa trang bị cần câu.\n" +
                            "Hãy trang bị cần trước khi cường hóa."
                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure · Upgrade"
                        })

                ]

            });

        }

        // ==================================================
        // BASE
        // ==================================================

        const base =
            rods[id];

        if (!base) {

            return message.reply({

                content:
                    "❌ Không tìm thấy loại cần này."

            });

        }

        // ==================================================
        // ROD DATA
        // ==================================================

        if (!user.rodData[id]) {

            user.rodData[id] = {

                level: 0,

                luck:
                    Number(
                        base.luck
                    ) || 1,

                uses:
                    Number(
                        base.uses
                    ) || 1,

                maxUses:
                    Number(
                        base.uses
                    ) || 1,

                destroyed:
                    false

            };

        }

        const rod =
            normalizeRod(
                user.rodData[id],
                base
            );

        getLuck(
            rod,
            base
        );

        save();

        // ==================================================
        // CẦN GÃY
        // ==================================================

        if (
            rod.destroyed ||
            rod.uses <= 0
        ) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor(
                            "#ff4d67"
                        )

                        .setTitle(
                            "💥 `ROD BROKEN`"
                        )

                        .setDescription(

                            `${rodHeader(
                                base,
                                rod
                            )}\n\n` +

                            `Cần câu đã bị gãy.\n` +
                            `Hãy sửa chữa trước khi cường hóa.`

                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure · Upgrade"
                        })

                ]

            });

        }

        // ==================================================
        // MAX LEVEL
        // ==================================================

        if (
            rod.level >= MAX_LEVEL
        ) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor(
                            "#ffd43b"
                        )

                        .setTitle(
                            "✨ `MAX LEVEL`"
                        )

                        .setDescription(

                            `${rodHeader(
                                base,
                                rod
                            )}\n\n` +

                            `Cần câu đã đạt cấp tối đa \`+${MAX_LEVEL}\`.\n` +
                            `Không thể cường hóa thêm.`

                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure · Upgrade"
                        })

                ]

            });

        }

        // ==================================================
        // COST
        // ==================================================

        const price =
            getUpgradeCost(
                base,
                rod.level
            );

        const baseSuccessRate =
            getSuccessRate(
                rod.level
            );

        // ==================================================
        // KHÔNG ĐỦ TIỀN
        // ==================================================

        if (
            Number(user.money) <
            price
        ) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor(
                            "#ff6b81"
                        )

                        .setTitle(
                            "💰 `NOT ENOUGH MONEY`"
                        )

                        .setDescription(

                            `${rodHeader(
                                base,
                                rod
                            )}\n\n` +

                            `💸 Chi phí ${formatMoney(price)} ${emoji.money}\n` +
                            `💰 Số dư ${formatMoney(user.money)} ${emoji.money}\n` +
                            `❌ Thiếu ${formatMoney(
                                price - user.money
                            )} ${emoji.money}`

                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure · Upgrade"
                        })

                ]

            });

        }

        // ==================================================
        // CHỌN ĐÁ
        // ==================================================

        const stoneCount =
            getRateStoneCount(user);

        let selectedStones = 0;

        let stoneMessage = null;

        // Luôn cho chọn đá
        stoneMessage =
            await message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor(
                            "#8b5cf6"
                        )

                        .setTitle(
                            "🪨 `RATE STONE`"
                        )

                        .setDescription(

                            `${rodHeader(
                                base,
                                rod
                            )}\n\n` +

                            `🎲 Tỉ lệ gốc: **${formatRate(
                                baseSuccessRate
                            )}%**\n\n` +

                            `🪨 Đá đang có: **${stoneCount}**\n` +

                            `🪨 Mỗi đá: **+${RATE_STONE_BONUS}%**\n` +

                            `📦 Tối đa mỗi lần: **${MAX_RATE_STONES} đá**\n\n` +

                            `Chọn số đá muốn sử dụng:`

                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure · Rate Stone"
                        })

                ],

                components:
                    createRateStoneButtons(
                        user,
                        message.author.id
                    )

            });

        // ==================================================
        // CHỜ CHỌN ĐÁ
        // ==================================================

        try {

            const interaction =
                await stoneMessage.awaitMessageComponent({

                    filter:
                        buttonInteraction =>

                            buttonInteraction.user.id ===
                            message.author.id &&

                            buttonInteraction.customId.startsWith(
                                `upgrade_stone_${message.author.id}_`
                            ),

                    time:
                        30000

                });

            selectedStones =
                Number(
                    interaction.customId
                        .split("_")
                        .pop()
                );

            // ==================================================
            // KIỂM TRA LẠI SỐ ĐÁ
            // ==================================================

            const currentStoneCount =
                getRateStoneCount(user);

            if (
                selectedStones < 0 ||
                selectedStones > MAX_RATE_STONES ||
                selectedStones > currentStoneCount
            ) {

                return interaction.update({

                    embeds: [

                        new EmbedBuilder()

                            .setColor(
                                "#ff6b81"
                            )

                            .setTitle(
                                "❌ `STONE ERROR`"
                            )

                            .setDescription(
                                "Số lượng đá không hợp lệ hoặc bạn không đủ đá."
                            )

                    ],

                    components: []

                });

            }

            // ==================================================
            // RATE CUỐI
            // ==================================================

            const stoneBonus =
                selectedStones *
                RATE_STONE_BONUS;

            const finalSuccessRate =
                Math.min(
                    100,
                    baseSuccessRate +
                    stoneBonus
                );

            // ==================================================
            // UPDATE CHỜ UPGRADE
            // ==================================================

            await interaction.update({

                embeds: [

                    new EmbedBuilder()

                        .setColor(
                            "#7ddcff"
                        )

                        .setTitle(
                            "🎲 `UPGRADING`"
                        )

                        .setDescription(

                            `${rodHeader(
                                base,
                                rod
                            )}\n\n` +

                            `🎲 Tỉ lệ gốc: **${formatRate(
                                baseSuccessRate
                            )}%**\n` +

                            `🪨 Đã dùng: **${selectedStones} đá**\n` +

                            `📈 Bonus: **+${formatRate(
                                stoneBonus
                            )}%**\n` +

                            `🎯 Tỉ lệ cuối: **${formatRate(
                                finalSuccessRate
                            )}%**\n` +

                            `💸 Chi phí: ${formatMoney(
                                price
                            )} ${emoji.money}\n\n` +

                            `Đang cường hóa...\n` +
                            `Hãy chờ kết quả.`

                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure · Upgrade"
                        })

                ],

                components: []

            });

        } catch (error) {

            return stoneMessage.edit({

                embeds: [

                    new EmbedBuilder()

                        .setColor(
                            "#ffd166"
                        )

                        .setTitle(
                            "⏰ `UPGRADE TIMEOUT`"
                        )

                        .setDescription(
                            `Bạn không chọn số đá trong **30 giây**.\n\n` +
                            `Hãy dùng lại lệnh upgrade để thử lại.`
                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure · Upgrade"
                        })

                ],

                components: []

            });

        }

        // ==================================================
        // RATE CUỐI
        // ==================================================

        const stoneBonus =
            selectedStones *
            RATE_STONE_BONUS;

        const finalSuccessRate =
            Math.min(
                100,
                baseSuccessRate +
                stoneBonus
            );

        // ==================================================
        // BẢO HIỂM
        // ==================================================

        const hasRisk =
            rod.level >=
            DOWNGRADE_LEVEL;

        let useInsurance = false;

        if (
            hasRisk &&
            Number(
                user.insurance || 0
            ) > 0
        ) {

            const insuranceMessage =
                await message.channel.send({

                    embeds: [

                        new EmbedBuilder()

                            .setColor(
                                "#ffd166"
                            )

                            .setTitle(
                                "🎫 `INSURANCE`"
                            )

                            .setDescription(

                                `${rodHeader(
                                    base,
                                    rod
                                )}\n\n` +

                                `⚠️ Cường hóa thất bại có thể làm cần giảm cấp.` +

                                (
                                    rod.level >=
                                    DESTROY_LEVEL
                                        ? ` Ở cấp cao còn có nguy cơ gãy.`
                                        : ""
                                ) +

                                `\n\n` +

                                `🎫 Vé bảo hiểm: **${user.insurance}**\n` +

                                `💡 Vé chỉ bị trừ khi thực sự bảo vệ cần.\n\n` +

                                `Bạn có 20 giây để lựa chọn.`

                            )

                            .setFooter({
                                text:
                                    "✦ Fishing Adventure · Upgrade"
                            })

                    ],

                    components: [

                        new ActionRowBuilder()
                            .addComponents(

                                new ButtonBuilder()

                                    .setCustomId(
                                        `upgrade_yes_${message.author.id}`
                                    )

                                    .setLabel(
                                        `Dùng vé (${user.insurance})`
                                    )

                                    .setEmoji(
                                        "🎫"
                                    )

                                    .setStyle(
                                        ButtonStyle.Success
                                    ),

                                new ButtonBuilder()

                                    .setCustomId(
                                        `upgrade_no_${message.author.id}`
                                    )

                                    .setLabel(
                                        "Không dùng"
                                    )

                                    .setEmoji(
                                        "❌"
                                    )

                                    .setStyle(
                                        ButtonStyle.Secondary
                                    )

                            )

                    ]

                });

            useInsurance =
                await new Promise(
                    resolve => {

                        const collector =
                            insuranceMessage
                                .createMessageComponentCollector({

                                    time:
                                        20000,

                                    max:
                                        1

                                });

                        collector.on(
                            "collect",
                            async interaction => {

                                if (
                                    interaction.user.id !==
                                    message.author.id
                                ) {

                                    return interaction.reply({

                                        content:
                                            "❌ Đây không phải bảng nâng cấp của bạn.",

                                        ephemeral:
                                            true

                                    });

                                }

                                await interaction.deferUpdate();

                                resolve(
                                    interaction.customId ===
                                    `upgrade_yes_${message.author.id}`
                                );

                            }
                        );

                        collector.on(
                            "end",
                            collected => {

                                if (
                                    collected.size === 0
                                ) {

                                    resolve(
                                        false
                                    );

                                }

                            }
                        );

                    }
                );

            // Xóa bảng bảo hiểm
            try {

                await insuranceMessage.delete();

            } catch {}

        }

        // ==================================================
        // LƯU TRẠNG THÁI CŨ
        // ==================================================

        const startLevel =
            rod.level;

        const startLuck =
            formatLuck(
                rod.luck
            );

        const startUses =
            rod.uses;

        const startMaxUses =
            rod.maxUses;

        // ==================================================
        // TRỪ TIỀN
        // ==================================================

        user.money =
            Number(
                user.money
            ) - price;

        // ==================================================
        // TRỪ ĐÁ
        // ==================================================

        if (
            selectedStones > 0
        ) {

            removeRateStones(
                user,
                selectedStones
            );

        }

        // ==================================================
        // RANDOM
        // ==================================================

        const roll =
            Math.random() *
            100;

        let resultText = "";

        let color =
            "#ffcc66";

        // ==================================================
        // SUCCESS
        // ==================================================

        if (
            roll <
            finalSuccessRate
        ) {

            rod.level =
                Math.min(
                    MAX_LEVEL,
                    rod.level + 1
                );

            const luckPerLevel =
                Number(
                    upgrade?.luckPerLevel
                );

            const luckIncrease =
                Number.isFinite(
                    luckPerLevel
                )
                    ? luckPerLevel
                    : 0.1;

            rod.luck =
                Number(
                    rod.luck
                ) +
                luckIncrease;

            rod.luck =
                Math.round(
                    rod.luck * 10
                ) / 10;

            const title =
                rodTitles?.[
                    rod.level
                ];

            color =
                "#8affb2";

            resultText =

                `✨ Cường hóa thành công!\n\n` +

                `Cấp \`+${rod.level}\`` +

                (
                    title
                        ? ` · ${title}`
                        : ""
                ) +

                `\n` +

                `🍀 Luck ${formatLuck(
                    rod.luck
                )}`;

        }

        // ==================================================
        // FAIL
        // ==================================================

        else {

            let downgrade =
                false;

            let destroy =
                false;

            // ==============================================
            // LEVEL 10+
            // ==============================================

            if (
                rod.level >=
                DESTROY_LEVEL
            ) {

                const wearRatio =
                    Math.max(
                        0,
                        Math.min(
                            1,
                            1 -
                            (
                                rod.uses /
                                rod.maxUses
                            )
                        )
                    );

                const downgradeChance =
                    DOWNGRADE_CHANCE_LV10 +
                    (
                        1 -
                        DOWNGRADE_CHANCE_LV10
                    ) *
                    wearRatio;

                downgrade =
                    Math.random() <
                    downgradeChance;

                if (
                    rod.uses > 0
                ) {

                    destroy =
                        Math.random() <
                        DESTROY_CHANCE;

                }

            }

            // ==============================================
            // LEVEL 5-9
            // ==============================================

            else if (
                rod.level >=
                DOWNGRADE_LEVEL
            ) {

                downgrade =
                    Math.random() <
                    DOWNGRADE_CHANCE;

            }

            // ==============================================
            // INSURANCE
            // ==============================================

            if (
                useInsurance &&
                (
                    downgrade ||
                    destroy
                )
            ) {

                user.insurance =
                    Math.max(
                        0,
                        Number(
                            user.insurance || 0
                        ) - 1
                    );

                color =
                    "#66ccff";

                resultText =

                    `🎫 Cường hóa thất bại nhưng bảo hiểm đã bảo vệ cần!\n\n` +

                    `Cấp vẫn \`+${rod.level}\`\n` +

                    `🍀 Luck vẫn ${formatLuck(
                        rod.luck
                    )}\n` +

                    `🎫 Vé còn ${user.insurance}`;

            }

            // ==============================================
            // DESTROY
            // ==============================================

            else if (
                destroy
            ) {

                rod.level =
                    Math.max(
                        0,
                        rod.level - 1
                    );

                rod.uses =
                    0;

                rod.destroyed =
                    true;

                color =
                    "#ff4d67";

                resultText =

                    `💥 Cường hóa thất bại, cần bị gãy!\n\n` +

                    `Cấp còn \`+${rod.level}\`\n` +

                    `🍀 Luck ${formatLuck(
                        rod.luck
                    )}\n` +

                    `Độ bền \`0/${rod.maxUses}\`\n\n` +

                    `Hãy sửa chữa cần để sử dụng lại.`;

            }

            // ==============================================
            // DOWNGRADE
            // ==============================================

            else if (
                downgrade
            ) {

                rod.level =
                    Math.max(
                        0,
                        rod.level - 1
                    );

                color =
                    "#ff8888";

                resultText =

                    `⬇️ Cường hóa thất bại, cần bị giảm cấp!\n\n` +

                    `Cấp còn \`+${rod.level}\`\n` +

                    `🍀 Luck ${formatLuck(
                        rod.luck
                    )}\n\n` +

                    `Xu đã mất, hãy thử lại.`;

            }

            // ==============================================
            // NORMAL FAIL
            // ==============================================

            else {

                color =
                    "#ffcc66";

                resultText =

                    `❌ Cường hóa thất bại.\n\n` +

                    `Cấp vẫn \`+${rod.level}\`\n` +

                    `🍀 Luck vẫn ${formatLuck(
                        rod.luck
                    )}\n\n` +

                    `Xu đã mất, hãy thử lại.`;

            }

        }

        // ==================================================
        // SAVE
        // ==================================================

        save();

        // ==================================================
        // LUCK CŨ / MỚI
        // ==================================================

        const oldLuck =
            startLuck;

        const newLuck =
            formatLuck(
                rod.luck
            );

        // ==================================================
        // HEADER CŨ
        // ==================================================

        const oldHeader =
            `${base.emoji} ${base.name} ` +
            `\`+${startLevel}\` ` +
            `Độ bền \`${startUses}/${startMaxUses}\` ` +
            `🍀 Luck ${oldLuck}`;

        // ==================================================
        // HEADER MỚI
        // ==================================================

        const newHeader =
            `${base.emoji} ${base.name} ` +
            `\`+${rod.level}\` ` +
            `Độ bền \`${rod.uses}/${rod.maxUses}\` ` +
            `🍀 Luck ${newLuck}`;

        // ==================================================
        // ĐÁ CÒN LẠI
        // ==================================================

        const remainingStones =
            getRateStoneCount(user);

        // ==================================================
        // FINAL EMBED
        // ==================================================

        const finalEmbed =
            new EmbedBuilder()

                .setColor(
                    color
                )

                .setAuthor({

                    name:
                        `${message.author.username} · Upgrade`,

                    iconURL:
                        message.author.displayAvatarURL({
                            extension: "png",
                            size: 128
                        })

                })

                .setTitle(
                    "✨ `ROD UPGRADE`"
                )

                .setDescription(

                    `${oldHeader}\n` +

                    `→ ${newHeader}\n\n` +

                    `🎲 Tỉ lệ gốc: **${formatRate(
                        baseSuccessRate
                    )}%**\n` +

                    `🪨 Đá sử dụng: **${selectedStones}**\n` +

                    `📈 Bonus đá: **+${formatRate(
                        stoneBonus
                    )}%**\n` +

                    `🎯 Tỉ lệ thực tế: **${formatRate(
                        finalSuccessRate
                    )}%**\n` +

                    `🎲 Kết quả: **${roll < finalSuccessRate
                        ? "Thành công"
                        : "Thất bại"
                    }**\n\n` +

                    `💸 Chi phí ${formatMoney(
                        price
                    )} ${emoji.money}\n\n` +

                    `${resultText}\n\n` +

                    `🪨 Đá còn lại: **${remainingStones}**\n` +

                    `💰 Số dư ${formatMoney(
                        user.money
                    )} ${emoji.money}`

                )

                .setFooter({

                    text:
                        "✦ Fishing Adventure · Upgrade"

                })

                .setTimestamp();

        await stoneMessage.edit({

            embeds: [
                finalEmbed
            ],

            components: []

        });

    }

};
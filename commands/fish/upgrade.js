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
// RATE STONE
// ======================================================

const RATE_STONE_ID = "da_rate";
const RATE_STONE_BONUS = 5;
const MAX_RATE_STONES = 5;

// ======================================================
// STYLE
// ======================================================

const DIVIDER =
    "୨୧ ───────── ୨୧";

const FOOTER = {
    text:
        "✦ Fishing Adventure · Upgrade"
};

// ======================================================
// FURINA BLESSING
// ======================================================

const BLESSINGS = [

    "✨ Furina đã ban phước cho hành trình của bạn.",

    "💧 Một lời chúc từ Fontaine — hãy tin vào vận may.",

    "🎭 Vở diễn vẫn tiếp tục... và hôm nay, vận may đứng về phía bạn.",

    "🌊 Sóng nước đã đáp lại lời cầu nguyện của bạn.",

    "👑 Furina đang dõi theo... đừng làm nàng thất vọng nhé!",

    "💙 Một chút may mắn từ Fontaine dành tặng bạn.",

    "🎀 Hãy ngẩng cao đầu! Vị thần của Fontaine đang chúc phúc cho bạn.",

    "🌊 Dòng nước đã chọn bạn cho màn trình diễn hôm nay."
];

function getBlessing() {

    return BLESSINGS[
        Math.floor(
            Math.random() *
            BLESSINGS.length
        )
    ];
}

// ======================================================
// UPGRADE COST
// ======================================================

function getUpgradeCost(
    base,
    level
) {

    return Math.floor(
        (
            Number(
                base.price
            ) || 0
        ) *
        (level + 1) *
        0.5
    );
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
        Math.round(
            Number(value || 0) * 10
        ) / 10;

    return Number.isInteger(value)
        ? String(value)
        : value
            .toFixed(1)
            .replace(
                /\.0$/,
                ""
            );
}

// ======================================================
// FORMAT LUCK
// ======================================================

function formatLuck(value) {

    value =
        Math.round(
            Number(value || 0) * 10
        ) / 10;

    return Number.isInteger(value)
        ? String(value)
        : value
            .toFixed(1)
            .replace(
                /\.0$/,
                ""
            );
}

// ======================================================
// GET STONE COUNT
// ======================================================

function getRateStoneCount(user) {

    return Math.max(
        0,
        Number(
            user?.items?.[
                RATE_STONE_ID
            ] ||

            user?.inventory?.[
                RATE_STONE_ID
            ] ||

            user?.[
                RATE_STONE_ID
            ] ||

            0
        )
    );
}

// ======================================================
// REMOVE STONE
// ======================================================

function removeRateStones(
    user,
    amount
) {

    if (
        amount <= 0
    ) {

        return;
    }

    if (
        user.items &&
        Number.isFinite(
            Number(
                user.items[
                    RATE_STONE_ID
                ]
            )
        )
    ) {

        user.items[
            RATE_STONE_ID
        ] =
            Math.max(
                0,
                Number(
                    user.items[
                        RATE_STONE_ID
                    ]
                ) - amount
            );

        return;
    }

    if (
        user.inventory &&
        Number.isFinite(
            Number(
                user.inventory[
                    RATE_STONE_ID
                ]
            )
        )
    ) {

        user.inventory[
            RATE_STONE_ID
        ] =
            Math.max(
                0,
                Number(
                    user.inventory[
                        RATE_STONE_ID
                    ]
                ) - amount
            );

        return;
    }

    user[
        RATE_STONE_ID
    ] =
        Math.max(
            0,
            Number(
                user[
                    RATE_STONE_ID
                ] || 0
            ) - amount
        );
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
// ROD DISPLAY
// ======================================================

function rodText(
    base,
    rod
) {

    return (

        `${base.emoji || "🎣"} **${base.name}** \`+${rod.level}\`\n` +

        `⚖️ Độ bền \`${rod.uses}/${rod.maxUses}\` · ` +

        `🍀 Luck **${formatLuck(
            rod.luck
        )}**`
    );
}

// ======================================================
// STONE BUTTONS
// ======================================================

function createRateStoneButtons(
    user,
    ownerID
) {

    const count =
        getRateStoneCount(
            user
        );

    const buttons = [];

    for (
        let i = 0;
        i <= MAX_RATE_STONES;
        i++
    ) {

        const bonus =
            i *
            RATE_STONE_BONUS;

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
                    i > count
                )
        );
    }

    return [

        new ActionRowBuilder()
            .addComponents(
                buttons.slice(
                    0,
                    5
                )
            ),

        new ActionRowBuilder()
            .addComponents(
                buttons.slice(
                    5
                )
            )

    ];
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

    async execute(
        message
    ) {

        // ==================================================
        // USER
        // ==================================================

        const user =
            getUser(
                message.author.id
            );

        if (!user) {

            return message.reply({

                content:
                    "❌ Không tìm thấy dữ liệu người chơi."

            });
        }

        user.can ||=
            {};

        user.rodData ||=
            {};

        user.items ||=
            {};

        // ==================================================
        // CURRENT ROD
        // ==================================================

        const id =
            user.can.dangDung;

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

                            `${DIVIDER}\n\n` +

                            `Bạn chưa trang bị cần câu.\n` +

                            `Hãy trang bị một chiếc cần trước nhé.\n\n` +

                            `${DIVIDER}`

                        )

                        .setFooter(
                            FOOTER
                        )

                ]

            });
        }

        // ==================================================
        // BASE ROD
        // ==================================================

        const base =
            rods[id];

        if (!base) {

            return message.reply(
                "❌ Không tìm thấy loại cần này."
            );
        }

        // ==================================================
        // ROD DATA
        // ==================================================

        if (
            !user.rodData[id]
        ) {

            user.rodData[id] = {

                level:
                    0,

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

        save();

        // ==================================================
        // BROKEN
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

                            `${DIVIDER}\n\n` +

                            rodText(
                                base,
                                rod
                            ) +

                            `\n\n` +

                            `💥 Cần câu đã bị gãy.\n` +

                            `🛠️ Hãy sửa chữa trước khi cường hóa.`

                        )

                        .setFooter(
                            FOOTER
                        )

                ]

            });
        }

        // ==================================================
        // MAX LEVEL
        // ==================================================

        if (
            rod.level >=
            MAX_LEVEL
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

                            `${DIVIDER}\n\n` +

                            rodText(
                                base,
                                rod
                            ) +

                            `\n\n` +

                            `👑 Cần câu đã đạt cấp tối đa **+${MAX_LEVEL}**.\n` +

                            `✨ Không thể cường hóa thêm.`

                        )

                        .setFooter(
                            FOOTER
                        )

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
        // MONEY
        // ==================================================

        if (
            Number(
                user.money || 0
            ) <
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

                            `${DIVIDER}\n\n` +

                            rodText(
                                base,
                                rod
                            ) +

                            `\n\n` +

                            `💸 Chi phí: **${formatMoney(
                                price
                            )} ${emoji.money}**\n` +

                            `💰 Số dư: **${formatMoney(
                                user.money || 0
                            )} ${emoji.money}**\n` +

                            `❌ Thiếu: **${formatMoney(
                                price -
                                Number(
                                    user.money || 0
                                )
                            )} ${emoji.money}**`

                        )

                        .setFooter(
                            FOOTER
                        )

                ]

            });
        }

        // ==================================================
        // STONE SELECT
        // ==================================================

        const stoneCount =
            getRateStoneCount(
                user
            );

        const stoneMessage =
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

                            `${DIVIDER}\n\n` +

                            rodText(
                                base,
                                rod
                            ) +

                            `\n\n` +

                            `🎲 Tỉ lệ gốc: **${formatRate(
                                baseSuccessRate
                            )}%**\n` +

                            `🪨 Đá đang có: **${stoneCount}**\n` +

                            `📈 Mỗi đá: **+${RATE_STONE_BONUS}%**\n` +

                            `📦 Tối đa: **${MAX_RATE_STONES} đá**\n\n` +

                            `✦ Chọn số đá muốn sử dụng.\n\n` +

                            `${DIVIDER}`

                        )

                        .setFooter(
                            FOOTER
                        )

                ],

                components:
                    createRateStoneButtons(
                        user,
                        message.author.id
                    )

            });

        // ==================================================
        // WAIT STONE
        // ==================================================

        let selectedStones = 0;

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

            const currentStoneCount =
                getRateStoneCount(
                    user
                );

            if (

                selectedStones < 0 ||

                selectedStones >
                MAX_RATE_STONES ||

                selectedStones >
                currentStoneCount

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

                                `${DIVIDER}\n\n` +

                                `Số lượng đá không hợp lệ.`

                            )

                            .setFooter(
                                FOOTER
                            )

                    ],

                    components: []

                });
            }

            const stoneBonus =
                selectedStones *
                RATE_STONE_BONUS;

            const finalSuccessRate =
                Math.min(
                    100,
                    baseSuccessRate +
                    stoneBonus
                );

            await interaction.update({

                embeds: [

                    new EmbedBuilder()

                        .setColor(
                            "#7ddcff"
                        )

                        .setTitle(
                            "🎭 `THE SHOW BEGINS`"
                        )

                        .setDescription(

                            `${DIVIDER}\n\n` +

                            rodText(
                                base,
                                rod
                            ) +

                            `\n\n` +

                            `🎲 Tỉ lệ: **${formatRate(
                                finalSuccessRate
                            )}%**\n` +

                            `🪨 Đá sử dụng: **${selectedStones}**\n` +

                            `💸 Chi phí: **${formatMoney(
                                price
                            )} ${emoji.money}**\n\n` +

                            `💧 *${getBlessing()}*\n\n` +

                            `🎭 *Màn trình diễn sắp bắt đầu...*`

                        )

                        .setFooter(
                            FOOTER
                        )

                ],

                components: []

            });

        } catch {

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

                            `${DIVIDER}\n\n` +

                            `Bạn không chọn số đá trong **30 giây**.\n\n` +

                            `✦ Hãy dùng lại lệnh \`upgrade\` để thử lại.`

                        )

                        .setFooter(
                            FOOTER
                        )

                ],

                components: []

            });
        }

        // ==================================================
        // FINAL RATE
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
        // INSURANCE
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

                                `${DIVIDER}\n\n` +

                                rodText(
                                    base,
                                    rod
                                ) +

                                `\n\n` +

                                `⚠️ Cường hóa thất bại có thể làm cần giảm cấp.` +

                                (
                                    rod.level >=
                                    DESTROY_LEVEL
                                        ? `\n💥 Ở cấp cao còn có nguy cơ gãy.`
                                        : ""
                                ) +

                                `\n\n` +

                                `🎫 Vé bảo hiểm: **${user.insurance}**\n\n` +

                                `💡 Vé chỉ bị trừ khi thực sự bảo vệ cần.\n\n` +

                                `✦ Bạn có **20 giây** để lựa chọn.`

                            )

                            .setFooter(
                                FOOTER
                            )

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

            try {

                await insuranceMessage.delete();

            } catch {}

        }

        // ==================================================
        // OLD DATA
        // ==================================================

        const startLevel =
            rod.level;

        const startLuck =
            rod.luck;

        const startUses =
            rod.uses;

        const startMaxUses =
            rod.maxUses;

        // ==================================================
        // PAY
        // ==================================================

        user.money =
            Number(
                user.money || 0
            ) -
            price;

        // ==================================================
        // REMOVE STONES
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

        const success =
            roll <
            finalSuccessRate;

        let resultText =
            "";

        let color =
            "#ffcc66";

        // ==================================================
        // SUCCESS
        // ==================================================

        if (success) {

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

                `✨ **Cường hóa thành công!**\n\n` +

                `\`+${startLevel}\` → \`+${rod.level}\`\n` +

                `🍀 Luck ${formatLuck(
                    startLuck
                )} → **${formatLuck(
                    rod.luck
                )}**` +

                (
                    title
                        ? `\n👑 ${title}`
                        : ""
                );

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
                            user.insurance ||
                            0
                        ) - 1
                    );

                color =
                    "#66ccff";

                resultText =

                    `🎫 **Bảo hiểm đã bảo vệ cần!**\n\n` +

                    `Cường hóa thất bại nhưng:\n` +

                    `✨ Cấp vẫn \`+${rod.level}\`\n` +

                    `🍀 Luck vẫn **${formatLuck(
                        rod.luck
                    )}**\n\n` +

                    `🎫 Vé còn: **${user.insurance}**`;

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

                    `💥 **Cường hóa thất bại, cần bị gãy!**\n\n` +

                    `Cấp còn \`+${rod.level}\`\n` +

                    `🍀 Luck **${formatLuck(
                        rod.luck
                    )}**\n` +

                    `⚖️ Độ bền \`0/${rod.maxUses}\`\n\n` +

                    `🛠️ Hãy sửa chữa cần để sử dụng lại.`;

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

                    `⬇️ **Cường hóa thất bại, cần bị giảm cấp!**\n\n` +

                    `Cấp còn \`+${rod.level}\`\n` +

                    `🍀 Luck **${formatLuck(
                        rod.luck
                    )}**\n\n` +

                    `💸 Xu đã mất, hãy thử lại.`;

            }

            // ==============================================
            // NORMAL FAIL
            // ==============================================

            else {

                color =
                    "#ffcc66";

                resultText =

                    `❌ **Cường hóa thất bại.**\n\n` +

                    `Cấp vẫn \`+${rod.level}\`\n` +

                    `🍀 Luck vẫn **${formatLuck(
                        rod.luck
                    )}**\n\n` +

                    `💸 Xu đã mất, hãy thử lại.`;
            }
        }

        // ==================================================
        // SAVE
        // ==================================================

        save();

        // ==================================================
        // REMAINING STONES
        // ==================================================

        const remainingStones =
            getRateStoneCount(
                user
            );

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

                            extension:
                                "png",

                            size:
                                128

                        })

                })

                .setTitle(

                    success
                        ? "✨ `UPGRADE SUCCESS`"
                        : "🎭 `UPGRADE RESULT`"

                )

                .setDescription(

                    `${DIVIDER}\n\n` +

                    rodText(
                        base,
                        rod
                    ) +

                    `\n\n` +

                    `🎲 Tỉ lệ gốc: **${formatRate(
                        baseSuccessRate
                    )}%**\n` +

                    `🪨 Đá sử dụng: **${selectedStones}**\n` +

                    `📈 Bonus đá: **+${formatRate(
                        stoneBonus
                    )}%**\n` +

                    `🎯 Tỉ lệ thực tế: **${formatRate(
                        finalSuccessRate
                    )}%**\n\n` +

                    `${DIVIDER}\n\n` +

                    `${resultText}\n\n` +

                    `💧 *${getBlessing()}*\n\n` +

                    `${DIVIDER}\n\n` +

                    `🪨 Đá còn lại: **${remainingStones}**\n` +

                    `💰 Số dư: **${formatMoney(
                        user.money
                    )} ${emoji.money}**`

                )

                .setFooter(
                    FOOTER
                )

                .setTimestamp();

        // ==================================================
        // UPDATE MESSAGE
        // ==================================================

        return stoneMessage.edit({

            embeds: [
                finalEmbed
            ],

            components: []

        });
    }
};
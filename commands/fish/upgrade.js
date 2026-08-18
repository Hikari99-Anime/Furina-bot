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

const MAX_LEVEL = 30;

// Từ +10 bắt đầu có nguy cơ tụt cấp
const DOWNGRADE_LEVEL = 10;

// Từ +25 bắt đầu có nguy cơ gãy
const DESTROY_LEVEL = 25;

// Tỉ lệ tụt cấp
const DOWNGRADE_CHANCE = 0.35;
const DOWNGRADE_CHANCE_LV20 = 0.55;
const DOWNGRADE_CHANCE_LV25 = 0.70;

// Tỉ lệ gãy ở +25 trở lên
const DESTROY_CHANCE = 0.20;

// ======================================================
// RATE STONE
// ======================================================

const RATE_STONE_ID = "da_rate";
const RATE_STONE_BONUS = 5;
const MAX_RATE_STONES = 5;

// ======================================================
// TIME
// ======================================================

const STONE_SELECT_TIME = 30000;
const CONFIRM_TIME = 30000;
const INSURANCE_TIME = 20000;
const UPGRADE_COUNTDOWN = 3;

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

function getUpgradeCost(base, level) {

    const basePrice =
        Number(base?.price) || 0;

    /*
     * Công thức:
     *
     * +0 → 50% giá gốc
     * +1 → 100%
     * +2 → 150%
     * ...
     * +29 → 1500%
     */

    return Math.max(
        1,
        Math.floor(
            basePrice *
            (level + 1) *
            0.5
        )
    );
}

// ======================================================
// SUCCESS RATE
// ======================================================

function getSuccessRate(level) {

    const configRate =
        upgrade?.success?.[level];

    if (
        configRate !== undefined
    ) {

        return Math.max(
            5,
            Math.min(
                100,
                Number(configRate)
            )
        );
    }

    /*
     * Fallback 30 cấp:
     *
     * +0  = 100%
     * +5  = 85%
     * +10 = 70%
     * +15 = 55%
     * +20 = 40%
     * +25 = 25%
     * +29 = 13%
     */

    return Math.max(
        10,
        100 - level * 3
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
            user?.items?.[RATE_STONE_ID] ??
            user?.inventory?.[RATE_STONE_ID] ??
            user?.[RATE_STONE_ID] ??
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
                ) -
                amount
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
                ) -
                amount
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
            ) -
            amount
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
        Math.max(
            0,
            Math.min(
                MAX_LEVEL,
                Number(
                    rod.level
                ) || 0
            )
        );

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
// CONFIRM BUTTONS
// ======================================================

function createConfirmButtons(
    ownerID
) {

    return [

        new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()

                    .setCustomId(
                        `upgrade_confirm_${ownerID}`
                    )

                    .setLabel(
                        "Xác nhận nâng cấp"
                    )

                    .setEmoji(
                        "✅"
                    )

                    .setStyle(
                        ButtonStyle.Success
                    ),

                new ButtonBuilder()

                    .setCustomId(
                        `upgrade_cancel_${ownerID}`
                    )

                    .setLabel(
                        "Hủy"
                    )

                    .setEmoji(
                        "❌"
                    )

                    .setStyle(
                        ButtonStyle.Danger
                    )

            )

    ];
}

// ======================================================
// INSURANCE BUTTONS
// ======================================================

function createInsuranceButtons(
    ownerID,
    insuranceCount
) {

    return [

        new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()

                    .setCustomId(
                        `upgrade_insurance_yes_${ownerID}`
                    )

                    .setLabel(
                        `Dùng bảo hiểm (${insuranceCount})`
                    )

                    .setEmoji(
                        "🎫"
                    )

                    .setStyle(
                        ButtonStyle.Success
                    ),

                new ButtonBuilder()

                    .setCustomId(
                        `upgrade_insurance_no_${ownerID}`
                    )

                    .setLabel(
                        "Không dùng"
                    )

                    .setEmoji(
                        "⚔️"
                    )

                    .setStyle(
                        ButtonStyle.Primary
                    ),

                new ButtonBuilder()

                    .setCustomId(
                        `upgrade_insurance_cancel_${ownerID}`
                    )

                    .setLabel(
                        "Hủy"
                    )

                    .setEmoji(
                        "❌"
                    )

                    .setStyle(
                        ButtonStyle.Danger
                    )

            )

    ];
}

// ======================================================
// FAILURE RISK
// ======================================================

function getFailureRisk(
    level
) {

    if (
        level < DOWNGRADE_LEVEL
    ) {

        return {
            downgrade: 0,
            destroy: 0
        };
    }

    if (
        level < 20
    ) {

        return {
            downgrade:
                DOWNGRADE_CHANCE,
            destroy:
                0
        };
    }

    if (
        level < DESTROY_LEVEL
    ) {

        return {
            downgrade:
                DOWNGRADE_CHANCE_LV20,
            destroy:
                0
        };
    }

    return {
        downgrade:
            DOWNGRADE_CHANCE_LV25,
        destroy:
            DESTROY_CHANCE
    };
}

// ======================================================
// RISK TEXT
// ======================================================

function getRiskText(
    risk
) {

    if (
        risk.downgrade <= 0 &&
        risk.destroy <= 0
    ) {

        return (
            `🛡️ Thất bại: **Không mất cấp**`
        );
    }

    let text = "";

    if (
        risk.downgrade > 0
    ) {

        text +=

            `⬇️ Giảm cấp: **${formatRate(
                risk.downgrade * 100
            )}%**\n`;
    }

    if (
        risk.destroy > 0
    ) {

        text +=

            `💥 Gãy cần: **${formatRate(
                risk.destroy * 100
            )}%**\n`;
    }

    return text.trim();
}

// ======================================================
// CANCEL EMBED
// ======================================================

function createCancelEmbed(
    reason = "Bạn đã hủy quá trình cường hóa."
) {

    return new EmbedBuilder()

        .setColor(
            "#ff6b81"
        )

        .setTitle(
            "❌ `UPGRADE CANCELLED`"
        )

        .setDescription(

            `${DIVIDER}\n\n` +

            `${reason}\n\n` +

            `💰 Tiền: **Không bị trừ**\n` +

            `🪨 Đá: **Không bị sử dụng**\n` +

            `🎫 Bảo hiểm: **Không bị sử dụng**\n\n` +

            `✦ Không có tài nguyên nào bị mất.\n\n` +

            `${DIVIDER}`

        )

        .setFooter(
            FOOTER
        );
}

// ======================================================
// CONFIRM EMBED
// ======================================================

function createConfirmEmbed(
    base,
    rod,
    price,
    baseSuccessRate,
    selectedStones,
    finalSuccessRate,
    stoneBonus,
    user,
    risk,
    remainingSeconds
) {

    const nextLevel =
        rod.level + 1;

    const balance =
        Number(
            user.money || 0
        );

    const afterMoney =
        balance -
        price;

    return new EmbedBuilder()

        .setColor(
            "#ffd166"
        )

        .setTitle(
            "⚠️ `XÁC NHẬN CƯỜNG HÓA`"
        )

        .setDescription(

            `${DIVIDER}\n\n` +

            rodText(
                base,
                rod
            ) +

            `\n\n` +

            `━━━━━━━━━━━━━━━━━━━━\n` +

            `📈 **THÔNG TIN NÂNG CẤP**\n\n` +

            `🎣 Cấp: **+${rod.level} → +${nextLevel}**\n` +

            `🍀 Luck hiện tại: **${formatLuck(
                rod.luck
            )}**\n\n` +

            `━━━━━━━━━━━━━━━━━━━━\n` +

            `💰 **CHI PHÍ**\n\n` +

            `💸 Giá nâng cấp: **${formatMoney(
                price
            )} ${emoji.money}**\n` +

            `💰 Số dư hiện tại: **${formatMoney(
                balance
            )} ${emoji.money}**\n` +

            `💳 Số dư sau nâng: **${formatMoney(
                afterMoney
            )} ${emoji.money}**\n\n` +

            `━━━━━━━━━━━━━━━━━━━━\n` +

            `🎲 **TỈ LỆ**\n\n` +

            `🎯 Tỉ lệ gốc: **${formatRate(
                baseSuccessRate
            )}%**\n` +

            `🪨 Đá sử dụng: **${selectedStones}**\n` +

            `📈 Bonus đá: **+${formatRate(
                stoneBonus
            )}%**\n` +

            `✨ Tỉ lệ cuối: **${formatRate(
                finalSuccessRate
            )}%**\n\n` +

            `━━━━━━━━━━━━━━━━━━━━\n` +

            `⚠️ **RỦI RO**\n\n` +

            `${getRiskText(
                risk
            )}\n\n` +

            `🎫 Bảo hiểm hiện có: **${Number(
                user.insurance || 0
            )} vé**\n\n` +

            `━━━━━━━━━━━━━━━━━━━━\n\n` +

            `⏳ Tự động hủy sau: **${remainingSeconds} giây**\n\n` +

            `⚠️ **Tiền và đá chỉ bị trừ sau khi bạn xác nhận.**\n\n` +

            `Hãy kiểm tra kỹ thông tin trước khi tiếp tục.\n\n` +

            `${DIVIDER}`

        )

        .setFooter({
            text:
                `${FOOTER.text} · Xác nhận để tiếp tục`
        });
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

        user.can ||= {};
        user.rodData ||= {};
        user.items ||= {};

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
                            "👑 `MAX LEVEL`"
                        )

                        .setDescription(

                            `${DIVIDER}\n\n` +

                            rodText(
                                base,
                                rod
                            ) +

                            `\n\n` +

                            `✨ Cần câu đã đạt cấp tối đa **+${MAX_LEVEL}**.\n` +

                            `👑 Không thể cường hóa thêm.`

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
        // MONEY CHECK
        // ==================================================

        const currentMoney =
            Number(
                user.money || 0
            );

        if (
            currentMoney <
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

                            `💸 Giá nâng cấp: **${formatMoney(
                                price
                            )} ${emoji.money}**\n` +

                            `💰 Số dư: **${formatMoney(
                                currentMoney
                            )} ${emoji.money}**\n` +

                            `❌ Còn thiếu: **${formatMoney(
                                price -
                                currentMoney
                            )} ${emoji.money}**\n\n` +

                            `✦ Bạn chưa mất bất kỳ tài nguyên nào.`

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
                            "🪨 `CHỌN RATE STONE`"
                        )

                        .setDescription(

                            `${DIVIDER}\n\n` +

                            rodText(
                                base,
                                rod
                            ) +

                            `\n\n` +

                            `💰 Giá nâng cấp: **${formatMoney(
                                price
                            )} ${emoji.money}**\n` +

                            `💰 Số dư: **${formatMoney(
                                currentMoney
                            )} ${emoji.money}**\n\n` +

                            `🎲 Tỉ lệ gốc: **${formatRate(
                                baseSuccessRate
                            )}%**\n` +

                            `🪨 Đá đang có: **${stoneCount}**\n` +

                            `📈 Mỗi đá: **+${RATE_STONE_BONUS}%**\n` +

                            `📦 Tối đa: **${MAX_RATE_STONES} đá**\n\n` +

                            `✦ Chọn số đá muốn sử dụng.\n` +

                            `⏳ Thời gian lựa chọn: **30 giây**\n\n` +

                            `⚠️ **Chưa có tiền hoặc đá nào bị trừ.**\n\n` +

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

        let selectedStones =
            0;

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
                        STONE_SELECT_TIME

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

                                `${DIVIDER}\n\n` +

                                `Số lượng đá không hợp lệ.\n\n` +

                                `🪨 Đá hiện có: **${currentStoneCount}**`

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

            const risk =
                getFailureRisk(
                    rod.level
                );

            // ==================================================
            // CONFIRM COUNTDOWN
            // ==================================================

            let remainingSeconds =
                30;

            await interaction.update({

                embeds: [

                    createConfirmEmbed(
                        base,
                        rod,
                        price,
                        baseSuccessRate,
                        selectedStones,
                        finalSuccessRate,
                        stoneBonus,
                        user,
                        risk,
                        remainingSeconds
                    )

                ],

                components:
                    createConfirmButtons(
                        message.author.id
                    )

            });

            const countdown =
                setInterval(
                    async () => {

                        remainingSeconds--;

                        if (
                            remainingSeconds <= 0
                        ) {

                            clearInterval(
                                countdown
                            );

                            return;
                        }

                        try {

                            await stoneMessage.edit({

                                embeds: [

                                    createConfirmEmbed(
                                        base,
                                        rod,
                                        price,
                                        baseSuccessRate,
                                        selectedStones,
                                        finalSuccessRate,
                                        stoneBonus,
                                        user,
                                        risk,
                                        remainingSeconds
                                    )

                                ],

                                components:
                                    createConfirmButtons(
                                        message.author.id
                                    )

                            });

                        } catch {}

                    },
                    1000
                );

            // ==================================================
            // WAIT CONFIRM
            // ==================================================

            let confirmInteraction;

            try {

                confirmInteraction =
                    await stoneMessage.awaitMessageComponent({

                        filter:
                            buttonInteraction =>

                                buttonInteraction.user.id ===
                                message.author.id &&

                                (
                                    buttonInteraction.customId ===
                                    `upgrade_confirm_${message.author.id}` ||

                                    buttonInteraction.customId ===
                                    `upgrade_cancel_${message.author.id}`
                                ),

                        time:
                            CONFIRM_TIME

                    });

            } catch {

                clearInterval(
                    countdown
                );

                return stoneMessage.edit({

                    embeds: [

                        createCancelEmbed(
                            "⏰ Bạn đã hết thời gian xác nhận nâng cấp."
                        )

                    ],

                    components: []

                });
            }

            clearInterval(
                countdown
            );

            // ==================================================
            // CANCEL
            // ==================================================

            if (
                confirmInteraction.customId ===
                `upgrade_cancel_${message.author.id}`
            ) {

                return confirmInteraction.update({

                    embeds: [

                        createCancelEmbed()

                    ],

                    components: []

                });
            }

            // ==================================================
            // CONFIRM
            // ==================================================

            await confirmInteraction.update({

                embeds: [

                    new EmbedBuilder()

                        .setColor(
                            "#7ddcff"
                        )

                        .setTitle(
                            "🎭 `UPGRADE CONFIRMED`"
                        )

                        .setDescription(

                            `${DIVIDER}\n\n` +

                            `🎣 **${base.name}**\n\n` +

                            `📈 \`+${rod.level}\` → \`+${rod.level + 1}\`\n\n` +

                            `💰 Giá: **${formatMoney(
                                price
                            )} ${emoji.money}**\n` +

                            `🪨 Đá: **${selectedStones}**\n` +

                            `🎯 Tỉ lệ: **${formatRate(
                                finalSuccessRate
                            )}%**\n\n` +

                            `⏳ **Đã xác nhận!**\n` +

                            `Đang kiểm tra bảo hiểm...`

                        )

                        .setFooter(
                            FOOTER
                        )

                ],

                components: []

            });

            // ==================================================
            // INSURANCE
            // ==================================================

            let useInsurance =
                false;

            const hasRisk =
                risk.downgrade > 0 ||
                risk.destroy > 0;

            const insuranceCount =
                Number(
                    user.insurance || 0
                );

            if (
                hasRisk &&
                insuranceCount > 0
            ) {

                let insuranceSeconds =
                    20;

                const insuranceEmbed =
                    () =>

                        new EmbedBuilder()

                            .setColor(
                                "#ffd166"
                            )

                            .setTitle(
                                "🎫 `BẢO HIỂM`"
                            )

                            .setDescription(

                                `${DIVIDER}\n\n` +

                                rodText(
                                    base,
                                    rod
                                ) +

                                `\n\n` +

                                `⚠️ **Cường hóa này có rủi ro!**\n\n` +

                                `${getRiskText(
                                    risk
                                )}\n\n` +

                                `🎫 Vé bảo hiểm hiện có: **${Number(
                                    user.insurance || 0
                                )}**\n\n` +

                                `🛡️ Nếu dùng bảo hiểm và upgrade thất bại gây tụt cấp/gãy, vé sẽ bảo vệ cần.\n\n` +

                                `⏳ Tự động chọn **Không dùng** sau: **${insuranceSeconds} giây**\n\n` +

                                `${DIVIDER}`

                            )

                            .setFooter(
                                FOOTER
                            );

                await stoneMessage.edit({

                    embeds: [
                        insuranceEmbed()
                    ],

                    components:
                        createInsuranceButtons(
                            message.author.id,
                            insuranceCount
                        )

                });

                const insuranceCountdown =
                    setInterval(
                        async () => {

                            insuranceSeconds--;

                            if (
                                insuranceSeconds <= 0
                            ) {

                                clearInterval(
                                    insuranceCountdown
                                );

                                return;
                            }

                            try {

                                await stoneMessage.edit({

                                    embeds: [
                                        insuranceEmbed()
                                    ],

                                    components:
                                        createInsuranceButtons(
                                            message.author.id,
                                            insuranceCount
                                        )

                                });

                            } catch {}

                        },
                        1000
                    );

                try {

                    const insuranceInteraction =
                        await stoneMessage.awaitMessageComponent({

                            filter:
                                buttonInteraction =>

                                    buttonInteraction.user.id ===
                                    message.author.id &&

                                    (
                                        buttonInteraction.customId ===
                                        `upgrade_insurance_yes_${message.author.id}` ||

                                        buttonInteraction.customId ===
                                        `upgrade_insurance_no_${message.author.id}` ||

                                        buttonInteraction.customId ===
                                        `upgrade_insurance_cancel_${message.author.id}`
                                    ),

                            time:
                                INSURANCE_TIME

                        });

                    clearInterval(
                        insuranceCountdown
                    );

                    // ==========================================
                    // CANCEL INSURANCE
                    // ==========================================

                    if (
                        insuranceInteraction.customId ===
                        `upgrade_insurance_cancel_${message.author.id}`
                    ) {

                        return insuranceInteraction.update({

                            embeds: [

                                createCancelEmbed(
                                    "Bạn đã hủy quá trình cường hóa ở bước bảo hiểm."
                                )

                            ],

                            components: []

                        });
                    }

                    // ==========================================
                    // USE INSURANCE
                    // ==========================================

                    if (
                        insuranceInteraction.customId ===
                        `upgrade_insurance_yes_${message.author.id}`
                    ) {

                        useInsurance =
                            true;
                    }

                    // ==========================================
                    // NO INSURANCE
                    // ==========================================

                    await insuranceInteraction.update({

                        embeds: [

                            new EmbedBuilder()

                                .setColor(
                                    useInsurance
                                        ? "#66ccff"
                                        : "#ffcc66"
                                )

                                .setTitle(
                                    useInsurance
                                        ? "🎫 `INSURANCE READY`"
                                        : "⚔️ `NO INSURANCE`"
                                )

                                .setDescription(

                                    `${DIVIDER}\n\n` +

                                    (
                                        useInsurance
                                            ? `🎫 Vé bảo hiểm đã được chọn.\n\n`
                                            : `⚔️ Bạn quyết định không dùng bảo hiểm.\n\n`
                                    ) +

                                    `🎣 **${base.name}**\n` +

                                    `📈 \`+${rod.level}\` → \`+${rod.level + 1}\`\n` +

                                    `💰 Giá: **${formatMoney(
                                        price
                                    )} ${emoji.money}**\n` +

                                    `🪨 Đá: **${selectedStones}**\n` +

                                    `🎯 Tỉ lệ: **${formatRate(
                                        finalSuccessRate
                                    )}%**\n\n` +

                                    `⏳ Chuẩn bị cường hóa...`

                                )

                                .setFooter(
                                    FOOTER
                                )

                        ],

                        components: []

                    });

                } catch {

                    clearInterval(
                        insuranceCountdown
                    );

                    useInsurance =
                        false;

                    await stoneMessage.edit({

                        embeds: [

                            new EmbedBuilder()

                                .setColor(
                                    "#ffcc66"
                                )

                                .setTitle(
                                    "⚔️ `NO INSURANCE`"
                                )

                                .setDescription(

                                    `${DIVIDER}\n\n` +

                                    `⏰ Bạn không chọn bảo hiểm trong thời gian quy định.\n\n` +

                                    `⚔️ Hệ thống sẽ tiếp tục **không dùng bảo hiểm**.\n\n` +

                                    `⏳ Chuẩn bị cường hóa...`

                                )

                                .setFooter(
                                    FOOTER
                                )

                        ],

                        components: []

                    });
                }

            }

            // ==================================================
            // UPGRADE COUNTDOWN
            // ==================================================

            for (
                let seconds =
                    UPGRADE_COUNTDOWN;
                seconds >= 1;
                seconds--
            ) {

                await new Promise(
                    resolve =>
                        setTimeout(
                            resolve,
                            1000
                        )
                );

                await stoneMessage.edit({

                    embeds: [

                        new EmbedBuilder()

                            .setColor(
                                "#7ddcff"
                            )

                            .setTitle(
                                `🎭 \`UPGRADE ${seconds}\``
                            )

                            .setDescription(

                                `${DIVIDER}\n\n` +

                                `🎣 **${base.name}**\n\n` +

                                `📈 \`+${rod.level}\` → \`+${rod.level + 1}\`\n` +

                                `💰 Giá: **${formatMoney(
                                    price
                                )} ${emoji.money}**\n` +

                                `🪨 Đá: **${selectedStones}**\n` +

                                `🎯 Tỉ lệ: **${formatRate(
                                    finalSuccessRate
                                )}%**\n\n` +

                                `━━━━━━━━━━━━━━━━━━━━\n\n` +

                                `🎭 **${seconds}...**\n\n` +

                                `💧 *${getBlessing()}*`

                            )

                            .setFooter(
                                FOOTER
                            )

                    ],

                    components: []

                });
            }

            // ==================================================
            // RE-CHECK MONEY
            // ==================================================

            const latestMoney =
                Number(
                    user.money || 0
                );

            if (
                latestMoney <
                price
            ) {

                return stoneMessage.edit({

                    embeds: [

                        new EmbedBuilder()

                            .setColor(
                                "#ff6b81"
                            )

                            .setTitle(
                                "❌ `UPGRADE FAILED`"
                            )

                            .setDescription(

                                `${DIVIDER}\n\n` +

                                `Số dư của bạn không còn đủ để thực hiện nâng cấp.\n\n` +

                                `💸 Giá: **${formatMoney(
                                    price
                                )} ${emoji.money}**\n` +

                                `💰 Số dư: **${formatMoney(
                                    latestMoney
                                )} ${emoji.money}**\n\n` +

                                `🪨 Đá chưa bị trừ.\n` +

                                `💰 Tiền chưa bị trừ.\n\n` +

                                `✦ Hãy thử lại.`

                            )

                            .setFooter(
                                FOOTER
                            )

                    ],

                    components: []

                });
            }

            // ==================================================
            // CHECK STONE AGAIN
            // ==================================================

            const latestStoneCount =
                getRateStoneCount(
                    user
                );

            if (
                selectedStones >
                latestStoneCount
            ) {

                return stoneMessage.edit({

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

                                `Số đá của bạn không còn đủ để thực hiện nâng cấp.\n\n` +

                                `🪨 Cần: **${selectedStones}**\n` +

                                `🪨 Hiện có: **${latestStoneCount}**\n\n` +

                                `💰 Tiền chưa bị trừ.\n` +

                                `🪨 Đá chưa bị trừ.`

                            )

                            .setFooter(
                                FOOTER
                            )

                    ],

                    components: []

                });
            }

            // ==================================================
            // PAY
            // ==================================================

            user.money =
                latestMoney -
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
            // ROLL
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

            if (
                success
            ) {

                const startLevel =
                    rod.level;

                const startLuck =
                    rod.luck;

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

                    `📈 \`+${startLevel}\` → \`+${rod.level}\`\n` +

                    `🍀 Luck **${formatLuck(
                        startLuck
                    )}** → **${formatLuck(
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
                // DESTROY ROLL
                // ==============================================

                if (
                    risk.destroy > 0
                ) {

                    destroy =
                        Math.random() <
                        risk.destroy;
                }

                // ==============================================
                // DOWNGRADE ROLL
                // ==============================================

                if (
                    !destroy &&
                    risk.downgrade > 0
                ) {

                    downgrade =
                        Math.random() <
                        risk.downgrade;
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

                        `Cường hóa thất bại nhưng hậu quả đã được bảo vệ.\n\n` +

                        `🎣 Cấp vẫn: **+${rod.level}**\n` +

                        `🍀 Luck: **${formatLuck(
                            rod.luck
                        )}**\n\n` +

                        `🎫 Vé còn lại: **${user.insurance}**`;

                }

                // ==============================================
                // DESTROY
                // ==============================================

                else if (
                    destroy
                ) {

                    rod.uses =
                        0;

                    rod.destroyed =
                        true;

                    color =
                        "#ff4d67";

                    resultText =

                        `💥 **Cường hóa thất bại, cần đã bị gãy!**\n\n` +

                        `🎣 Cấp: **+${rod.level}**\n` +

                        `🍀 Luck: **${formatLuck(
                            rod.luck
                        )}**\n` +

                        `⚖️ Độ bền: **0/${rod.maxUses}**\n\n` +

                        `🛠️ Hãy sửa chữa cần để sử dụng lại.`;

                }

                // ==============================================
                // DOWNGRADE
                // ==============================================

                else if (
                    downgrade
                ) {

                    const oldLevel =
                        rod.level;

                    rod.level =
                        Math.max(
                            0,
                            rod.level - 1
                        );

                    color =
                        "#ff8888";

                    resultText =

                        `⬇️ **Cường hóa thất bại!**\n\n` +

                        `📉 \`+${oldLevel}\` → \`+${rod.level}\`\n` +

                        `🍀 Luck: **${formatLuck(
                            rod.luck
                        )}**\n\n` +

                        `💸 Tiền và đá đã được sử dụng.\n` +

                        `⚔️ Hãy thử lại khi bạn sẵn sàng.`;

                }

                // ==============================================
                // NORMAL FAIL
                // ==============================================

                else {

                    color =
                        "#ffcc66";

                    resultText =

                        `❌ **Cường hóa thất bại.**\n\n` +

                        `🎣 Cấp vẫn: **+${rod.level}**\n` +

                        `🍀 Luck vẫn: **${formatLuck(
                            rod.luck
                        )}**\n\n` +

                        `💸 Tiền và đá đã được sử dụng.\n\n` +

                        `🎭 Màn trình diễn chưa kết thúc...`;
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

                        `━━━━━━━━━━━━━━━━━━━━\n` +

                        `💰 **GIAO DỊCH**\n\n` +

                        `💸 Đã trả: **${formatMoney(
                            price
                        )} ${emoji.money}**\n` +

                        `💰 Số dư còn: **${formatMoney(
                            user.money
                        )} ${emoji.money}**\n` +

                        `🪨 Đá đã dùng: **${selectedStones}**\n` +

                        `🪨 Đá còn: **${remainingStones}**\n\n` +

                        `━━━━━━━━━━━━━━━━━━━━\n` +

                        `🎲 **TỈ LỆ**\n\n` +

                        `🎯 Tỉ lệ gốc: **${formatRate(
                            baseSuccessRate
                        )}%**\n` +

                        `📈 Bonus đá: **+${formatRate(
                            stoneBonus
                        )}%**\n` +

                        `✨ Tỉ lệ cuối: **${formatRate(
                            finalSuccessRate
                        )}%**\n\n` +

                        `━━━━━━━━━━━━━━━━━━━━\n\n` +

                        `${resultText}\n\n` +

                        `💧 *${getBlessing()}*\n\n` +

                        `${DIVIDER}`

                    )

                    .setFooter(
                        FOOTER
                    )

                    .setTimestamp();

            // ==================================================
            // FINAL UPDATE
            // ==================================================

            return stoneMessage.edit({

                embeds: [
                    finalEmbed
                ],

                components: []

            });

        } catch {

            return stoneMessage.edit({

                embeds: [

                    createCancelEmbed(
                        "⏰ Bạn không chọn số đá trong 30 giây. Quá trình cường hóa đã tự động hủy."
                    )

                ],

                components: []

            });
        }
    }
};
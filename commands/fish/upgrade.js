const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder
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

const DOWNGRADE_LEVEL = 10;
const DESTROY_LEVEL = 25;

const DOWNGRADE_CHANCE = 0.35;
const DOWNGRADE_CHANCE_LV20 = 0.55;
const DOWNGRADE_CHANCE_LV25 = 0.70;

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

const STONE_SELECT_TIME = 30_000;
const CONFIRM_TIME = 30_000;
const INSURANCE_TIME = 20_000;
const UPGRADE_COUNTDOWN = 3;

// ======================================================
// COLORS
// ======================================================

const COLORS = {
    stone: "#9B6DFF",
    confirm: "#F5C451",
    insurance: "#4DB8FF",
    preparing: "#5EE7DF",

    success: "#57E389",
    fail: "#FFB84D",
    downgrade: "#FF8A65",
    destroy: "#FF4D67",
    cancel: "#8B8F98",

    error: "#FF6B81",
    max: "#FFD43B",
    broken: "#FF4D67"
};

// ======================================================
// FOOTER
// ======================================================

const FOOTER = {
    text: "✦ Fishing Adventure · Upgrade"
};

// ======================================================
// STORY TEXT
// ======================================================

const BLESSINGS = [
    "💧 “Dòng nước hôm nay đang đứng về phía bạn.”",
    "🌊 “Những con sóng đang thì thầm một điều tốt đẹp.”",
    "✨ “Một chút may mắn từ Fontaine dành cho bạn.”",
    "🎭 “Màn trình diễn sắp bắt đầu... hãy tin vào vận may.”",
    "👑 “Furina đang dõi theo... đừng làm nàng thất vọng!”",
    "💙 “Có lẽ hôm nay chính là ngày may mắn của bạn.”",
    "🌊 “Dòng nước đã chọn bạn cho màn trình diễn hôm nay.”",
    "🎀 “Vận may chỉ mỉm cười với người dám thử.”"
];

const SUCCESS_QUOTES = [
    "“Ánh sáng lóe lên trên mặt nước... và vận may đã chọn bạn.”",
    "“Một màn trình diễn tuyệt đẹp. Cần câu đã đáp lại lời bạn.”",
    "“Sóng nước reo vang — sức mạnh mới đã thức tỉnh.”",
    "“Lần này, may mắn thực sự đứng về phía bạn.”"
];

const FAIL_QUOTES = [
    "“Một thoáng im lặng... rồi mọi thứ trở về như cũ.”",
    "“Vận may đã quay lưng, nhưng hành trình vẫn chưa kết thúc.”",
    "“Không sao cả. Những con sóng vẫn còn rất nhiều cơ hội.”",
    "“Thất bại hôm nay chỉ là bước chuẩn bị cho ngày mai.”"
];

const DOWNGRADE_QUOTES = [
    "“Một cơn sóng mạnh đã cuốn mất một phần sức mạnh của cần.”",
    "“Cần câu rung lên... và một cấp độ đã biến mất.”",
    "“Vận may không mỉm cười. Hãy thử lại khi thời cơ đến.”"
];

const DESTROY_QUOTES = [
    "“Một tiếng rắc vang lên... màn trình diễn kết thúc.”",
    "“Sức mạnh quá lớn đã khiến cần câu không thể chịu nổi.”",
    "“Cần câu đã gãy... nhưng hành trình của bạn chưa kết thúc.”"
];

function randomText(list) {
    return list[
        Math.floor(Math.random() * list.length)
    ];
}

function getBlessing() {
    return randomText(BLESSINGS);
}

// ======================================================
// FORMAT
// ======================================================

function formatRate(value) {
    value = Math.round(
        Number(value || 0) * 10
    ) / 10;

    return Number.isInteger(value)
        ? String(value)
        : value.toFixed(1).replace(/\.0$/, "");
}

function formatLuck(value) {
    return formatRate(value);
}

// ======================================================
// EMBED
// ======================================================

function createEmbed(
    color,
    title,
    description,
    message = null
) {
    const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(`\`${title}\``)
        .setDescription(description)
        .setFooter(FOOTER);

    if (message?.author) {
        embed.setAuthor({
            name: `${message.author.username} · Upgrade`,
            iconURL: message.author.displayAvatarURL({
                extension: "png",
                size: 128
            })
        });
    }

    return embed;
}

// ======================================================
// UPGRADE COST
// ======================================================

function getUpgradeCost(base, level) {
    const basePrice =
        Number(base?.price) || 0;

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

    if (configRate !== undefined) {
        return Math.max(
            5,
            Math.min(
                100,
                Number(configRate)
            )
        );
    }

    return Math.max(
        10,
        100 - level * 3
    );
}

// ======================================================
// RATE STONE COUNT
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
// REMOVE RATE STONES
// ======================================================

function removeRateStones(user, amount) {
    if (amount <= 0) return;

    if (
        user.items &&
        Number.isFinite(
            Number(user.items[RATE_STONE_ID])
        )
    ) {
        user.items[RATE_STONE_ID] = Math.max(
            0,
            Number(user.items[RATE_STONE_ID]) - amount
        );

        return;
    }

    if (
        user.inventory &&
        Number.isFinite(
            Number(user.inventory[RATE_STONE_ID])
        )
    ) {
        user.inventory[RATE_STONE_ID] = Math.max(
            0,
            Number(user.inventory[RATE_STONE_ID]) - amount
        );

        return;
    }

    user[RATE_STONE_ID] = Math.max(
        0,
        Number(user[RATE_STONE_ID] || 0) - amount
    );
}

// ======================================================
// NORMALIZE ROD
// ======================================================

function normalizeRod(rod, base) {
    rod.level = Math.max(
        0,
        Math.min(
            MAX_LEVEL,
            Number(rod.level) || 0
        )
    );

    rod.luck = Number(rod.luck);

    if (!Number.isFinite(rod.luck)) {
        rod.luck =
            Number(base.luck) || 1;
    }

    rod.luck =
        Math.round(
            rod.luck * 10
        ) / 10;

    rod.maxUses =
        Number(rod.maxUses) ||
        Number(base.uses) ||
        1;

    rod.uses = Math.max(
        0,
        Number(rod.uses) || 0
    );

    if (rod.uses > rod.maxUses) {
        rod.uses =
            rod.maxUses;
    }

    rod.destroyed =
        Boolean(rod.destroyed);

    return rod;
}

// ======================================================
// ROD TEXT
// ======================================================

function rodText(base, rod) {
    return (
        `${base.emoji || "🎣"} **${base.name}** \`+${rod.level}\` · ` +
        `🍀 **${formatLuck(rod.luck)}** · ` +
        `⚖️ ${rod.uses}/${rod.maxUses}`
    );
}

// ======================================================
// RISK
// ======================================================

function getFailureRisk(level) {
    if (level < DOWNGRADE_LEVEL) {
        return {
            downgrade: 0,
            destroy: 0
        };
    }

    if (level < 20) {
        return {
            downgrade: DOWNGRADE_CHANCE,
            destroy: 0
        };
    }

    if (level < DESTROY_LEVEL) {
        return {
            downgrade: DOWNGRADE_CHANCE_LV20,
            destroy: 0
        };
    }

    return {
        downgrade: DOWNGRADE_CHANCE_LV25,
        destroy: DESTROY_CHANCE
    };
}

function getRiskText(risk) {
    if (
        risk.downgrade <= 0 &&
        risk.destroy <= 0
    ) {
        return "🛡️ Thất bại: **Không mất cấp**";
    }

    const parts = [];

    if (risk.downgrade > 0) {
        parts.push(
            `⬇️ Tụt cấp **${formatRate(
                risk.downgrade * 100
            )}%**`
        );
    }

    if (risk.destroy > 0) {
        parts.push(
            `💥 Gãy **${formatRate(
                risk.destroy * 100
            )}%**`
        );
    }

    return parts.join(" · ");
}

// ======================================================
// STONE MENU
// ======================================================

function createStoneSelectMenu(user, ownerID) {
    const count =
        getRateStoneCount(user);

    const options = [];

    for (
        let i = 0;
        i <= MAX_RATE_STONES;
        i++
    ) {
        const bonus =
            i * RATE_STONE_BONUS;

        const available =
            i <= count;

        options.push({
            label:
                i === 0
                    ? "Không dùng đá"
                    : `${i} đá · +${bonus}%`,

            description:
                i === 0
                    ? "Nâng cấp không sử dụng Rate Stone"
                    : available
                        ? `Sử dụng ${i} đá để tăng tỉ lệ`
                        : `Không đủ đá · đang có ${count}`,

            value: String(i),

            emoji:
                i === 0
                    ? "❌"
                    : "🪨"
        });
    }

    return [
        new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(
                        `upgrade_stone_select_${ownerID}`
                    )
                    .setPlaceholder(
                        "🪨 Chọn số Rate Stone..."
                    )
                    .addOptions(options)
            )
    ];
}

// ======================================================
// BUTTONS
// ======================================================

function createConfirmButtons(ownerID) {
    return [
        new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(
                        `upgrade_confirm_${ownerID}`
                    )
                    .setLabel("Cường hóa")
                    .setEmoji("✨")
                    .setStyle(
                        ButtonStyle.Success
                    ),

                new ButtonBuilder()
                    .setCustomId(
                        `upgrade_cancel_${ownerID}`
                    )
                    .setLabel("Hủy")
                    .setEmoji("❌")
                    .setStyle(
                        ButtonStyle.Danger
                    )
            )
    ];
}

function createInsuranceButtons(
    ownerID,
    count
) {
    return [
        new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(
                        `upgrade_insurance_yes_${ownerID}`
                    )
                    .setLabel(
                        `Dùng bảo hiểm (${count})`
                    )
                    .setEmoji("🎫")
                    .setStyle(
                        ButtonStyle.Success
                    ),

                new ButtonBuilder()
                    .setCustomId(
                        `upgrade_insurance_no_${ownerID}`
                    )
                    .setLabel("Không dùng")
                    .setEmoji("⚔️")
                    .setStyle(
                        ButtonStyle.Primary
                    ),

                new ButtonBuilder()
                    .setCustomId(
                        `upgrade_insurance_cancel_${ownerID}`
                    )
                    .setLabel("Hủy")
                    .setEmoji("❌")
                    .setStyle(
                        ButtonStyle.Danger
                    )
            )
    ];
}

// ======================================================
// STONE EMBED
// ======================================================

function createStoneEmbed(
    base,
    rod,
    price,
    successRate,
    user,
    remaining
) {
    const money =
        Number(user.money || 0);

    const stones =
        getRateStoneCount(user);

    return createEmbed(
        COLORS.stone,
        "🪨 CHỌN RATE STONE",
        [
            rodText(base, rod),
            "",
            `> ${rod.level >= 20
                ? "“Một bước nguy hiểm... nhưng phần thưởng xứng đáng.”"
                : "“Hãy chọn sức mạnh bạn muốn đặt vào lần cường hóa này.”"
            }`,
            "",
            `📈 \`+${rod.level}\` → **+${rod.level + 1}**  ·  🎯 **${formatRate(successRate)}%**`,
            `💰 **${formatMoney(price)} ${emoji.money}**  ·  🪨 **${stones}**`,
            "",
            `⏳ Hãy chọn trong **${remaining}s**`
        ].join("\n")
    );
}

// ======================================================
// CONFIRM EMBED
// ======================================================

function createConfirmEmbed(
    base,
    rod,
    price,
    baseRate,
    stones,
    finalRate,
    bonus,
    user,
    risk,
    remaining
) {
    const afterMoney =
        Number(user.money || 0) -
        price;

    return createEmbed(
        COLORS.confirm,
        "⚠️ XÁC NHẬN CƯỜNG HÓA",
        [
            rodText(base, rod),
            "",
            `> “Một bước nữa thôi... liệu vận may có mỉm cười?”`,
            "",
            `📈 \`+${rod.level}\` → **+${rod.level + 1}**  ·  🎯 **${formatRate(finalRate)}%**`,
            `💰 **${formatMoney(price)} ${emoji.money}**  ·  💳 Còn **${formatMoney(afterMoney)}**`,
            `🪨 **${stones} viên**  ·  ✦ **+${formatRate(bonus)}%**`,
            "",
            `⚠️ ${getRiskText(risk)}`,
            `🎫 Bảo hiểm: **${Number(user.insurance || 0)} vé**`,
            "",
            `> ${getBlessing()}`,
            "",
            `⏳ Tự hủy sau **${remaining}s**`
        ].join("\n")
    );
}

// ======================================================
// PREPARING
// ======================================================

function createPreparingEmbed(
    base,
    rod,
    price,
    stones,
    rate,
    title,
    quote
) {
    return createEmbed(
        COLORS.preparing,
        title,
        [
            rodText(base, rod),
            "",
            `📈 \`+${rod.level}\` → **+${rod.level + 1}**  ·  🎯 **${formatRate(rate)}%**`,
            `💰 **${formatMoney(price)} ${emoji.money}**  ·  🪨 **${stones}**`,
            "",
            `> ${quote}`
        ].join("\n")
    );
}

// ======================================================
// CANCEL
// ======================================================

function createCancelEmbed(reason) {
    return createEmbed(
        COLORS.cancel,
        "❌ CƯỜNG HÓA ĐÃ HỦY",
        [
            `> “${reason}”`,
            "",
            "Tiền, Rate Stone và bảo hiểm đều được giữ nguyên."
        ].join("\n")
    );
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

        // ==================================================
        // USER
        // ==================================================

        const ownerID =
            message.author.id;

        const user =
            getUser(ownerID);

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
                    createEmbed(
                        COLORS.error,
                        "🎣 CHƯA TRANG BỊ CẦN",
                        [
                            "> “Muốn bắt cá lớn, trước tiên phải có một chiếc cần.”",
                            "",
                            "Hãy trang bị cần câu trước khi cường hóa."
                        ].join("\n")
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
                    Number(base.luck) || 1,
                uses:
                    Number(base.uses) || 1,
                maxUses:
                    Number(base.uses) || 1,
                destroyed: false
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
                    createEmbed(
                        COLORS.broken,
                        "💥 CẦN CÂU ĐÃ GÃY",
                        [
                            rodText(base, rod),
                            "",
                            "> “Một tiếng rắc vang lên... màn trình diễn kết thúc.”",
                            "",
                            `⚖️ Độ bền **0/${rod.maxUses}**`,
                            "🛠️ Hãy sửa chữa cần trước khi tiếp tục."
                        ].join("\n")
                    )
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
                    createEmbed(
                        COLORS.max,
                        "👑 ĐÃ ĐẠT CẤP TỐI ĐA",
                        [
                            rodText(base, rod),
                            "",
                            "> “Sức mạnh của cần đã đạt đến giới hạn.”",
                            "",
                            `✨ Cấp tối đa **+${MAX_LEVEL}**.`
                        ].join("\n")
                    )
                ]
            });
        }

        // ==================================================
        // COST / RATE
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
            Number(user.money || 0);

        if (
            currentMoney < price
        ) {
            return message.reply({
                embeds: [
                    createEmbed(
                        COLORS.error,
                        "💰 KHÔNG ĐỦ TIỀN",
                        [
                            rodText(base, rod),
                            "",
                            "> “Có vẻ túi tiền của bạn chưa sẵn sàng cho lần thử này.”",
                            "",
                            `💸 Cần **${formatMoney(price)} ${emoji.money}**`,
                            `💳 Có **${formatMoney(currentMoney)} ${emoji.money}**`,
                            `❌ Thiếu **${formatMoney(price - currentMoney)} ${emoji.money}**`
                        ].join("\n")
                    )
                ]
            });
        }

        // ==================================================
        // STONE SELECT
        // ==================================================

        let stoneRemaining =
            Math.ceil(
                STONE_SELECT_TIME / 1000
            );

        const stoneMessage =
            await message.reply({
                embeds: [
                    createStoneEmbed(
                        base,
                        rod,
                        price,
                        baseSuccessRate,
                        user,
                        stoneRemaining
                    )
                ],
                components:
                    createStoneSelectMenu(
                        user,
                        ownerID
                    )
            });

        // ==================================================
        // STONE COUNTDOWN
        // ==================================================

        const stoneCountdown =
            setInterval(async () => {

                stoneRemaining--;

                if (
                    stoneRemaining <= 0
                ) {
                    clearInterval(
                        stoneCountdown
                    );
                    return;
                }

                try {
                    await stoneMessage.edit({
                        embeds: [
                            createStoneEmbed(
                                base,
                                rod,
                                price,
                                baseSuccessRate,
                                user,
                                stoneRemaining
                            )
                        ],
                        components:
                            createStoneSelectMenu(
                                user,
                                ownerID
                            )
                    });
                } catch {}

            }, 1000);

        // ==================================================
        // WAIT STONE
        // ==================================================

        let stoneInteraction;

        try {

            stoneInteraction =
                await stoneMessage.awaitMessageComponent({

                    filter: interaction =>
                        interaction.user.id === ownerID &&
                        interaction.customId ===
                            `upgrade_stone_select_${ownerID}`,

                    time:
                        STONE_SELECT_TIME
                });

        } catch {

            clearInterval(
                stoneCountdown
            );

            return stoneMessage.edit({
                embeds: [
                    createCancelEmbed(
                        "⏰ Hết thời gian chọn Rate Stone."
                    )
                ],
                components: []
            });
        }

        clearInterval(
            stoneCountdown
        );

        // ==================================================
        // SELECT STONE
        // ==================================================

        let selectedStones =
            Number(
                stoneInteraction.values?.[0]
            );

        if (
            !Number.isInteger(
                selectedStones
            )
        ) {
            selectedStones = 0;
        }

        const selectedStoneAvailable =
            getRateStoneCount(user);

        // ==================================================
        // VALIDATE
        // ==================================================

        if (
            selectedStones < 0 ||
            selectedStones > MAX_RATE_STONES ||
            selectedStones > selectedStoneAvailable
        ) {
            return stoneInteraction.update({
                embeds: [
                    createEmbed(
                        COLORS.error,
                        "❌ KHÔNG ĐỦ RATE STONE",
                        [
                            `🪨 Chọn **${selectedStones}** · Có **${selectedStoneAvailable}**`,
                            "",
                            "> “Bạn không có đủ đá để đặt cược cho lần cường hóa này.”",
                            "",
                            "💰 Tiền không mất · 🪨 Đá không mất"
                        ].join("\n")
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
        // CONFIRM
        // ==================================================

        let confirmRemaining =
            Math.ceil(
                CONFIRM_TIME / 1000
            );

        await stoneInteraction.update({
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
                    confirmRemaining
                )
            ],
            components:
                createConfirmButtons(
                    ownerID
                )
        });

        // ==================================================
        // CONFIRM COUNTDOWN
        // ==================================================

        const confirmCountdown =
            setInterval(async () => {

                confirmRemaining--;

                if (
                    confirmRemaining <= 0
                ) {
                    clearInterval(
                        confirmCountdown
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
                                confirmRemaining
                            )
                        ],
                        components:
                            createConfirmButtons(
                                ownerID
                            )
                    });
                } catch {}

            }, 1000);

        // ==================================================
        // WAIT CONFIRM
        // ==================================================

        let confirmInteraction;

        try {

            confirmInteraction =
                await stoneMessage.awaitMessageComponent({

                    filter: interaction =>
                        interaction.user.id === ownerID &&
                        (
                            interaction.customId ===
                                `upgrade_confirm_${ownerID}` ||
                            interaction.customId ===
                                `upgrade_cancel_${ownerID}`
                        ),

                    time:
                        CONFIRM_TIME
                });

        } catch {

            clearInterval(
                confirmCountdown
            );

            return stoneMessage.edit({
                embeds: [
                    createCancelEmbed(
                        "Hết thời gian xác nhận nâng cấp."
                    )
                ],
                components: []
            });
        }

        clearInterval(
            confirmCountdown
        );

        // ==================================================
        // CANCEL
        // ==================================================

        if (
            confirmInteraction.customId ===
            `upgrade_cancel_${ownerID}`
        ) {
            return confirmInteraction.update({
                embeds: [
                    createCancelEmbed(
                        "Bạn đã hủy quá trình cường hóa."
                    )
                ],
                components: []
            });
        }

        // ==================================================
        // CONFIRMED
        // ==================================================

        await confirmInteraction.update({
            embeds: [
                createPreparingEmbed(
                    base,
                    rod,
                    price,
                    selectedStones,
                    finalSuccessRate,
                    "🎭 ĐÃ XÁC NHẬN",
                    "“Màn trình diễn sắp bắt đầu... hãy giữ vững niềm tin.”"
                )
            ],
            components: []
        });

        // ==================================================
        // INSURANCE
        // ==================================================

        let useInsurance = false;

        const hasRisk =
            risk.downgrade > 0 ||
            risk.destroy > 0;

        const insuranceCount =
            Number(user.insurance || 0);

        if (
            hasRisk &&
            insuranceCount > 0
        ) {

            let insuranceRemaining =
                Math.ceil(
                    INSURANCE_TIME / 1000
                );

            const makeInsuranceEmbed =
                () => createEmbed(
                    COLORS.insurance,
                    "🎫 BẢO HIỂM",
                    [
                        rodText(base, rod),
                        "",
                        "> “Một chút bảo vệ... có lẽ chuyến đi này sẽ bớt đau hơn.”",
                        "",
                        `⚠️ ${getRiskText(risk)}`,
                        `🎫 **${Number(user.insurance || 0)} vé** · ⏳ **${insuranceRemaining}s**`
                    ].join("\n")
                );

            await stoneMessage.edit({
                embeds: [
                    makeInsuranceEmbed()
                ],
                components:
                    createInsuranceButtons(
                        ownerID,
                        insuranceCount
                    )
            });

            const insuranceCountdown =
                setInterval(async () => {

                    insuranceRemaining--;

                    if (
                        insuranceRemaining <= 0
                    ) {
                        clearInterval(
                            insuranceCountdown
                        );
                        return;
                    }

                    try {
                        await stoneMessage.edit({
                            embeds: [
                                makeInsuranceEmbed()
                            ],
                            components:
                                createInsuranceButtons(
                                    ownerID,
                                    insuranceCount
                                )
                        });
                    } catch {}

                }, 1000);

            try {

                const insuranceInteraction =
                    await stoneMessage.awaitMessageComponent({

                        filter: interaction =>
                            interaction.user.id === ownerID &&
                            (
                                interaction.customId ===
                                    `upgrade_insurance_yes_${ownerID}` ||
                                interaction.customId ===
                                    `upgrade_insurance_no_${ownerID}` ||
                                interaction.customId ===
                                    `upgrade_insurance_cancel_${ownerID}`
                            ),

                        time:
                            INSURANCE_TIME
                    });

                clearInterval(
                    insuranceCountdown
                );

                // ==================================================
                // CANCEL INSURANCE
                // ==================================================

                if (
                    insuranceInteraction.customId ===
                    `upgrade_insurance_cancel_${ownerID}`
                ) {
                    return insuranceInteraction.update({
                        embeds: [
                            createCancelEmbed(
                                "Bạn đã hủy ở bước bảo hiểm."
                            )
                        ],
                        components: []
                    });
                }

                // ==================================================
                // USE INSURANCE
                // ==================================================

                useInsurance =
                    insuranceInteraction.customId ===
                    `upgrade_insurance_yes_${ownerID}`;

                await insuranceInteraction.update({
                    embeds: [
                        createPreparingEmbed(
                            base,
                            rod,
                            price,
                            selectedStones,
                            finalSuccessRate,
                            useInsurance
                                ? "🛡️ ĐÃ CHỌN BẢO HIỂM"
                                : "⚔️ KHÔNG DÙNG BẢO HIỂM",
                            useInsurance
                                ? "“Nếu vận may quay lưng, tấm vé này sẽ bảo vệ bạn.”"
                                : "“Bạn đã chọn bước vào trận chiến mà không có lá chắn.”"
                        )
                    ],
                    components: []
                });

            } catch {

                clearInterval(
                    insuranceCountdown
                );

                useInsurance = false;

                await stoneMessage.edit({
                    embeds: [
                        createPreparingEmbed(
                            base,
                            rod,
                            price,
                            selectedStones,
                            finalSuccessRate,
                            "⚔️ KHÔNG DÙNG BẢO HIỂM",
                            "“Thời gian đã hết. Hãy để vận may quyết định.”"
                        )
                    ],
                    components: []
                });
            }
        }

        // ==================================================
        // COUNTDOWN
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

            try {

                await stoneMessage.edit({
                    embeds: [
                        createEmbed(
                            COLORS.preparing,
                            `🎭 CƯỜNG HÓA · ${seconds}`,
                            [
                                rodText(
                                    base,
                                    rod
                                ),
                                "",
                                `📈 \`+${rod.level}\` → **+${rod.level + 1}**  ·  🎯 **${formatRate(finalSuccessRate)}%**`,
                                `💰 **${formatMoney(price)} ${emoji.money}**  ·  🪨 **${selectedStones}**`,
                                "",
                                `> ${getBlessing()}`,
                                "",
                                `✨ **${seconds}...**`
                            ].join("\n")
                        )
                    ],
                    components: []
                });

            } catch {}
        }

        // ==================================================
        // RE-CHECK MONEY
        // ==================================================

        const latestMoney =
            Number(user.money || 0);

        if (
            latestMoney < price
        ) {
            return stoneMessage.edit({
                embeds: [
                    createEmbed(
                        COLORS.error,
                        "❌ KHÔNG ĐỦ TIỀN",
                        [
                            `💸 Cần **${formatMoney(price)} ${emoji.money}**`,
                            `💳 Có **${formatMoney(latestMoney)} ${emoji.money}**`,
                            "",
                            "> “Số dư đã thay đổi trong lúc chờ đợi.”",
                            "",
                            "Tiền chưa bị trừ · 🪨 Đá chưa bị trừ."
                        ].join("\n")
                    )
                ],
                components: []
            });
        }

        // ==================================================
        // RE-CHECK STONE
        // ==================================================

        const finalStoneCount =
            getRateStoneCount(user);

        if (
            selectedStones >
            finalStoneCount
        ) {
            return stoneMessage.edit({
                embeds: [
                    createEmbed(
                        COLORS.error,
                        "❌ KHÔNG ĐỦ RATE STONE",
                        [
                            `🪨 Cần **${selectedStones}** · Có **${finalStoneCount}**`,
                            "",
                            "> “Một phần tài nguyên đã được sử dụng ở nơi khác.”",
                            "",
                            "💰 Tiền chưa bị trừ · 🪨 Đá chưa bị trừ."
                        ].join("\n")
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
            Math.random() * 100;

        const success =
            roll < finalSuccessRate;

        let resultText = "";
        let color = COLORS.fail;

        // ==================================================
        // SUCCESS
        // ==================================================

        if (success) {

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
                Number(rod.luck) +
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
                COLORS.success;

            resultText = [
                "✨ **CƯỜNG HÓA THÀNH CÔNG**",
                `> ${randomText(SUCCESS_QUOTES)}`,
                "",
                `📈 \`+${startLevel}\` → **+${rod.level}**`,
                `🍀 ${formatLuck(startLuck)} → **${formatLuck(rod.luck)}**`,
                title
                    ? `👑 **${title}**`
                    : ""
            ]
                .filter(Boolean)
                .join("\n");
        }

        // ==================================================
        // FAIL
        // ==================================================

        else {

            let downgrade = false;
            let destroy = false;

            // ==================================================
            // DESTROY
            // ==================================================

            if (
                risk.destroy > 0
            ) {
                destroy =
                    Math.random() <
                    risk.destroy;
            }

            // ==================================================
            // DOWNGRADE
            // ==================================================

            if (
                !destroy &&
                risk.downgrade > 0
            ) {
                downgrade =
                    Math.random() <
                    risk.downgrade;
            }

            // ==================================================
            // INSURANCE
            // ==================================================

            if (
                useInsurance &&
                (downgrade || destroy)
            ) {

                user.insurance =
                    Math.max(
                        0,
                        Number(
                            user.insurance || 0
                        ) - 1
                    );

                color =
                    COLORS.insurance;

                resultText = [
                    "🛡️ **BẢO HIỂM ĐÃ BẢO VỆ CẦN!**",
                    `> “Vận may đã quay lưng, nhưng bạn vẫn còn một cơ hội.”`,
                    "",
                    `🎣 Cấp vẫn **+${rod.level}**`,
                    `🍀 Luck **${formatLuck(rod.luck)}**`,
                    `🎫 Vé còn **${user.insurance}**`
                ].join("\n");
            }

            // ==================================================
            // DESTROY
            // ==================================================

            else if (destroy) {

                rod.uses = 0;
                rod.destroyed = true;

                color =
                    COLORS.destroy;

                resultText = [
                    "💥 **CẦN CÂU ĐÃ GÃY!**",
                    `> ${randomText(DESTROY_QUOTES)}`,
                    "",
                    `🎣 Cấp **+${rod.level}**`,
                    `🍀 Luck **${formatLuck(rod.luck)}**`,
                    `⚖️ Độ bền **0/${rod.maxUses}**`,
                    "",
                    "🛠️ Hãy sửa chữa cần để tiếp tục."
                ].join("\n");
            }

            // ==================================================
            // DOWNGRADE
            // ==================================================

            else if (downgrade) {

                const oldLevel =
                    rod.level;

                rod.level =
                    Math.max(
                        0,
                        rod.level - 1
                    );

                color =
                    COLORS.downgrade;

                resultText = [
                    "⬇️ **CƯỜNG HÓA THẤT BẠI**",
                    `> ${randomText(DOWNGRADE_QUOTES)}`,
                    "",
                    `📉 \`+${oldLevel}\` → **+${rod.level}**`,
                    `🍀 Luck **${formatLuck(rod.luck)}**`
                ].join("\n");
            }

            // ==================================================
            // NORMAL FAIL
            // ==================================================

            else {

                color =
                    COLORS.fail;

                resultText = [
                    "❌ **CƯỜNG HÓA THẤT BẠI**",
                    `> ${randomText(FAIL_QUOTES)}`,
                    "",
                    `🎣 Cấp vẫn **+${rod.level}**`,
                    `🍀 Luck **${formatLuck(rod.luck)}**`
                ].join("\n");
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
            getRateStoneCount(user);

        // ==================================================
        // FINAL TITLE
        // ==================================================

        let finalTitle =
            "🎭 KẾT QUẢ CƯỜNG HÓA";

        if (success) {
            finalTitle =
                "✨ CƯỜNG HÓA THÀNH CÔNG";
        }

        else if (
            rod.destroyed
        ) {
            finalTitle =
                "💥 CẦN CÂU ĐÃ GÃY";
        }

        else if (
            color === COLORS.downgrade
        ) {
            finalTitle =
                "⬇️ CƯỜNG HÓA THẤT BẠI";
        }

        else if (
            color === COLORS.insurance
        ) {
            finalTitle =
                "🛡️ BẢO HIỂM ĐÃ KÍCH HOẠT";
        }

        // ==================================================
        // FINAL EMBED
        // ==================================================

        const finalEmbed =
            createEmbed(
                color,
                finalTitle,
                [
                    rodText(base, rod),
                    "",
                    resultText,
                    "",
                    `🎯 Tỉ lệ: **${formatRate(baseSuccessRate)}%** + 🪨 **${formatRate(stoneBonus)}%** = **${formatRate(finalSuccessRate)}%**`,
                    `💰 **-${formatMoney(price)} ${emoji.money}**  ·  💳 Còn **${formatMoney(user.money)}**`,
                    `🪨 Đã dùng **${selectedStones}**  ·  Còn **${remainingStones}**`,
                    "",
                    `> ${getBlessing()}`
                ].join("\n")
            );

        // ==================================================
        // TIMESTAMP
        // ==================================================

        finalEmbed.setTimestamp();

        // ==================================================
        // FINAL UPDATE
        // ==================================================

        return stoneMessage.edit({
            embeds: [
                finalEmbed
            ],
            components: []
        });
    }
};
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
            base.luck || 1;

    }

    return Number(rod.luck) || 0;

}


// ======================================================
// FORMAT LUCK
// ======================================================

function formatLuck(value) {

    value =
        Number(value) || 0;

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
// LẤY SUCCESS RATE
// ======================================================

function getSuccessRate(level) {

    const rate =
        upgrade?.success?.[level];

    if (
        rate !== undefined
    ) {

        return Number(rate);

    }

    // Fallback nếu config thiếu level
    return Math.max(
        10,
        100 - level * 5
    );

}


// ======================================================
// KHỞI TẠO ROD DATA
// ======================================================

function normalizeRod(
    rod,
    base
) {

    rod.level =
        Number(rod.level) || 0;

    rod.luck =
        Number(rod.luck);

    if (
        !Number.isFinite(
            rod.luck
        )
    ) {

        rod.luck =
            base.luck || 1;

    }

    rod.maxUses =
        Number(rod.maxUses) ||
        base.uses ||
        1;

    rod.uses =
        Math.max(
            0,
            Number(rod.uses) || 0
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
// TẠO HEADER
// ======================================================

function rodHeader(
    base,
    rod
) {

    return (
        `${base.emoji} ${base.name} ` +
        `\`+${rod.level}\` ` +
        `Độ bền \`${rod.uses}/${rod.maxUses}\` ` +
        `Luck ${formatLuck(rod.luck)}`
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
                    base.luck || 1,

                uses:
                    base.uses || 1,

                maxUses:
                    base.uses || 1,

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


        const successRate =
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
        // BẢO HIỂM
        // ==================================================

        const hasRisk =
            rod.level >= DOWNGRADE_LEVEL;

        let useInsurance = false;

        let insuranceMessage = null;


        if (
            hasRisk &&
            Number(user.insurance || 0) > 0
        ) {

            insuranceMessage =
                await message.reply({

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

                                `🎫 Vé bảo hiểm ${user.insurance}\n` +
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

        }


        // ==================================================
        // EMBED UPGRADING
        // ==================================================

        const suspense =
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

                    `🎲 Tỉ lệ thành công ${successRate}%\n` +
                    `💸 Chi phí ${formatMoney(price)} ${emoji.money}\n\n` +

                    `Đang cường hóa...\n` +
                    `Hãy chờ kết quả.`

                )

                .setFooter({
                    text:
                        "✦ Fishing Adventure · Upgrade"
                });


        if (
            insuranceMessage
        ) {

            await insuranceMessage.edit({

                embeds: [
                    suspense
                ],

                components: []

            });

        } else {

            insuranceMessage =
                await message.reply({

                    embeds: [
                        suspense
                    ]

                });

        }


        // ==================================================
        // CHỜ
        // ==================================================

        await new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    3000
                )
        );


        // ==================================================
        // TRỪ TIỀN
        // ==================================================

        const startLevel =
            rod.level;

        user.money -=
            price;


        // ==================================================
        // RANDOM
        // ==================================================

        const roll =
            Math.random() * 100;


        let resultText = "";

        let color =
            "#ffcc66";


        // ==================================================
        // SUCCESS
        // ==================================================

        if (
            roll <
            successRate
        ) {

            rod.level =
                Math.min(
                    MAX_LEVEL,
                    rod.level + 1
                );


            rod.luck +=
                Number(
                    upgrade.luckPerLevel ||
                    0.1
                );


            const title =
                rodTitles?.[
                    rod.level
                ];


            color =
                "#8affb2";


            resultText =

                `✨ Cường hóa thành công!\n` +

                `Cấp \`+${rod.level}\`` +
                (
                    title
                        ? ` · ${title}`
                        : ""
                ) +

                `\n` +

                `Luck ${formatLuck(
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

                    `🎫 Cường hóa thất bại nhưng bảo hiểm đã bảo vệ cần!\n` +

                    `Cấp vẫn \`+${rod.level}\`\n` +

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

                    `💥 Cường hóa thất bại, cần bị gãy!\n` +

                    `Cấp còn \`+${rod.level}\`\n` +

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

                    `⬇️ Cường hóa thất bại, cần bị giảm cấp!\n` +

                    `Cấp còn \`+${rod.level}\`\n\n` +

                    `Xu đã mất, hãy thử lại.`;

            }


            // ==============================================
            // NORMAL FAIL
            // ==============================================

            else {

                color =
                    "#ffcc66";


                resultText =

                    `❌ Cường hóa thất bại.\n` +

                    `Cấp vẫn \`+${rod.level}\`\n\n` +

                    `Xu đã mất, hãy thử lại.`;

            }

        }


        // ==================================================
        // SAVE
        // ==================================================

        save();


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

                    `${rodHeader(
                        base,
                        {
                            ...rod,
                            level: startLevel
                        }
                    )}\n` +

                    `→ ${base.emoji} ${base.name} ` +
                    `\`+${rod.level}\` ` +
                    `Độ bền \`${rod.uses}/${rod.maxUses}\` ` +
                    `Luck ${formatLuck(rod.luck)}\n\n` +

                    `🎲 Thành công ${successRate}%\n` +
                    `💸 Chi phí ${formatMoney(price)} ${emoji.money}\n\n` +

                    `${resultText}\n\n` +

                    `💰 Số dư ${formatMoney(
                        user.money
                    )} ${emoji.money}`

                )

                .setFooter({

                    text:
                        "✦ Fishing Adventure · Upgrade"

                })

                .setTimestamp();


        await insuranceMessage.edit({

            embeds: [
                finalEmbed
            ],

            components: []

        });

    }

};
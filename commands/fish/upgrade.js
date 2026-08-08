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
// CẤU HÌNH
// ======================================================

const MAX_LEVEL = 15;
const DOWNGRADE_LEVEL = 5;
const DESTROY_LEVEL = 10;

const DOWNGRADE_CHANCE = 0.9;
const DOWNGRADE_CHANCE_LV10 = 0.5;
const DESTROY_CHANCE = 0.5;


// ======================================================
// GIÁ CƯỜNG HÓA
// ======================================================

function upgradeCost(base, level) {

    return Math.floor(
        base.price *
        (level + 1) *
        0.5
    );

}


// ======================================================
// EMBED THÔNG TIN
// ======================================================

function createInfo(
    base,
    rod,
    price,
    successRate,
    money
) {

    return (

        `${base.emoji} ${base.name} · ` +
        `⭐ +${rod.level} · ` +
        `+${rod.luck || 0} 🍀 · ` +
        `🎯 ${rod.uses}/${rod.maxUses}\n\n` +

        `> 🎲 Thành công: ${successRate}%\n` +
        `> 💸 Chi phí: ${formatMoney(price)} ${emoji.money}\n` +
        `> 💰 Số dư: ${formatMoney(money)} ${emoji.money}`

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
        // CẦN ĐANG DÙNG
        // ==================================================

        const id =
            user.can?.dangDung;


        if (!id) {

            return message.reply(
                "╰・❌ Bạn chưa trang bị cần câu"
            );

        }


        const base =
            rods[id];

        const rod =
            user.rodData?.[id];


        if (!base || !rod) {

            return message.reply(
                "╰・❌ Không tìm thấy dữ liệu cần"
            );

        }


        rod.level =
            rod.level || 0;

        rod.luck =
            rod.luck || 0;

        rod.maxUses =
            rod.maxUses ||
            base.uses ||
            1;

        rod.uses =
            Math.max(
                0,
                rod.uses || 0
            );


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

                        .setColor("#ff4d67")

                        .setTitle(
                            "💥 `ROD BROKEN`"
                        )

                        .setDescription(

                            `${base.emoji} ${base.name}\n\n` +

                            `> ⭐ Cấp: +${rod.level}\n` +
                            `> 🎯 Độ bền: ${rod.uses}/${rod.maxUses}\n\n` +

                            `╰・Cần đã bị phá hủy.\n` +
                            `Hãy sửa chữa trước khi cường hóa.`

                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure"
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

                        .setColor("#ffd43b")

                        .setTitle(
                            "✨ `MAX LEVEL`"
                        )

                        .setDescription(

                            `${base.emoji} ${base.name} · ` +
                            `⭐ +${rod.level} · ` +
                            `+${rod.luck} 🍀 · ` +
                            `🎯 ${rod.uses}/${rod.maxUses}\n\n` +

                            `╰・Cần đã đạt cấp cường hóa tối đa.`

                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure"
                        })

                ]

            });

        }


        // ==================================================
        // GIÁ
        // ==================================================

        const price =
            upgradeCost(
                base,
                rod.level
            );


        const successRate =
            upgrade.success?.[
                rod.level
            ] || 0;


        // ==================================================
        // KHÔNG ĐỦ TIỀN
        // ==================================================

        if (
            user.money < price
        ) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor("#ff6b81")

                        .setTitle(
                            "💰 `NOT ENOUGH MONEY`"
                        )

                        .setDescription(

                            `${base.emoji} ${base.name} · ` +
                            `⭐ +${rod.level} · ` +
                            `🎯 ${rod.uses}/${rod.maxUses}\n\n` +

                            `> 💸 Cần: ${formatMoney(price)} ${emoji.money}\n` +
                            `> 💰 Bạn có: ${formatMoney(user.money)} ${emoji.money}\n` +
                            `> ❌ Thiếu: ${formatMoney(price - user.money)} ${emoji.money}\n\n` +

                            `╰・Không đủ tiền để cường hóa.`

                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure"
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
        let msg = null;


        if (
            hasRisk &&
            (user.insurance || 0) > 0
        ) {

            const warning =
                rod.level >= DESTROY_LEVEL

                    ?

                    "⚠️ Thất bại có thể giảm cấp và có 50% khả năng làm gãy cần. Độ bền càng thấp, nguy cơ giảm cấp càng cao."

                    :

                    "⚠️ Thất bại có 90% khả năng giảm cấp.";


            const row =
                new ActionRowBuilder()
                    .addComponents(

                        new ButtonBuilder()

                            .setCustomId(
                                "upgrade_ins_yes"
                            )

                            .setLabel(
                                `Dùng vé bảo hiểm (${user.insurance})`
                            )

                            .setEmoji("🎫")

                            .setStyle(
                                ButtonStyle.Success
                            ),

                        new ButtonBuilder()

                            .setCustomId(
                                "upgrade_ins_no"
                            )

                            .setLabel(
                                "Không dùng"
                            )

                            .setEmoji("❌")

                            .setStyle(
                                ButtonStyle.Secondary
                            )

                    );


            msg =
                await message.reply({

                    embeds: [

                        new EmbedBuilder()

                            .setColor("#ffd166")

                            .setTitle(
                                "🎫 `INSURANCE`"
                            )

                            .setDescription(

                                `${base.emoji} ${base.name} · ` +
                                `⭐ +${rod.level} · ` +
                                `🎯 ${rod.uses}/${rod.maxUses}\n\n` +

                                `${warning}\n\n` +

                                `> 🎫 Vé hiện có: ${user.insurance}\n` +
                                `> 💡 Vé chỉ bị trừ khi thực sự bảo vệ bạn.\n\n` +

                                `╰・Bạn có 20 giây để lựa chọn.`

                            )

                            .setFooter({
                                text:
                                    "✦ Fishing Adventure"
                            })

                    ],

                    components: [
                        row
                    ]

                });


            useInsurance =
                await new Promise(
                    resolve => {

                        const collector =
                            msg.createMessageComponentCollector({

                                filter:
                                    interaction =>
                                        interaction.user.id ===
                                        message.author.id,

                                time:
                                    20000,

                                max: 1

                            });


                        collector.on(
                            "collect",
                            async interaction => {

                                await interaction.deferUpdate();

                                resolve(
                                    interaction.customId ===
                                    "upgrade_ins_yes"
                                );

                            }
                        );


                        collector.on(
                            "end",
                            collected => {

                                if (
                                    collected.size === 0
                                ) {

                                    resolve(false);

                                }

                            }
                        );

                    }
                );

        }


        // ==================================================
        // EMBED ĐANG CƯỜNG HÓA
        // ==================================================

        const suspenseEmbed =
            new EmbedBuilder()

                .setColor("#7ddcff")

                .setTitle(
                    "🎲 `UPGRADING`"
                )

                .setDescription(

                    `${base.emoji} ${base.name} · ` +
                    `⭐ +${rod.level} · ` +
                    `+${rod.luck} 🍀 · ` +
                    `🎯 ${rod.uses}/${rod.maxUses}\n\n` +

                    `> 🎲 Tỉ lệ thành công: ${successRate}%\n` +
                    `> 💸 Chi phí: ${formatMoney(price)} ${emoji.money}\n\n` +

                    `╰・Đang cường hóa...\n` +
                    `✦ Hãy chờ kết quả.`

                )

                .setFooter({
                    text:
                        "✦ Fishing Adventure"
                });


        if (msg) {

            await msg.edit({

                embeds: [
                    suspenseEmbed
                ],

                components: []

            });

        } else {

            msg =
                await message.reply({

                    embeds: [
                        suspenseEmbed
                    ]

                });

        }


        // ==================================================
        // THỜI GIAN HỒI HỘP
        // ==================================================

        await new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    5000
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
            Math.random() *
            100;


        let resultText = "";
        let color = "#ffcc66";


        // ==================================================
        // THÀNH CÔNG
        // ==================================================

        if (
            roll < successRate
        ) {

            rod.level++;

            rod.luck +=
                upgrade.luckPerLevel || 0;


            const title =
                rodTitles?.[
                    rod.level
                ]
                    ? ` · ${rodTitles[rod.level]}`
                    : "";


            color =
                "#8affb2";


            resultText =

                `✨ Cường hóa thành công!\n` +
                `> ⭐ Cấp mới: +${rod.level}${title}\n` +
                `> 🍀 Luck: +${rod.luck}`;

        }


        // ==================================================
        // THẤT BẠI
        // ==================================================

        else {

            let downgrade = false;
            let destroy = false;


            // ==============================================
            // LEVEL 10+
            // ==============================================

            if (
                rod.level >= DESTROY_LEVEL
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
                rod.level >= DOWNGRADE_LEVEL
            ) {

                downgrade =
                    Math.random() <
                    DOWNGRADE_CHANCE;

            }


            // ==============================================
            // BẢO HIỂM
            // ==============================================

            if (
                useInsurance &&
                (
                    downgrade ||
                    destroy
                )
            ) {

                user.insurance--;

                color =
                    "#66ccff";


                resultText =

                    `🎫 Cường hóa thất bại nhưng vé bảo hiểm đã bảo vệ cần!\n` +
                    `> ⭐ Vẫn +${rod.level}\n` +
                    `> 🎫 Vé còn: ${user.insurance}`;

            }


            // ==============================================
            // GÃY + GIẢM CẤP
            // ==============================================

            else if (
                destroy
            ) {

                rod.level =
                    Math.max(
                        0,
                        rod.level - 1
                    );

                rod.uses = 0;

                rod.destroyed =
                    true;


                color =
                    "#ff4d67";


                resultText =

                    `💥 Cường hóa thất bại, cần bị gãy!\n` +
                    `> ⭐ Cấp còn: +${rod.level}\n` +
                    `> 🎯 Độ bền: 0/${rod.maxUses}\n\n` +
                    `╰・Hãy sửa chữa để sử dụng lại.`;

            }


            // ==============================================
            // GIẢM CẤP
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
                    `> ⭐ Cấp còn: +${rod.level}\n\n` +
                    `╰・Xu đã mất, hãy thử lại.`;

            }


            // ==============================================
            // THẤT BẠI BÌNH THƯỜNG
            // ==============================================

            else {

                color =
                    "#ffcc66";


                resultText =

                    `❌ Cường hóa thất bại\n` +
                    `> ⭐ Vẫn +${rod.level}\n\n` +
                    `╰・Xu đã mất, hãy thử lại.`;

            }

        }


        // ==================================================
        // LƯU
        // ==================================================

        save();


        // ==================================================
        // KẾT QUẢ
        // ==================================================

        const finalEmbed =
            new EmbedBuilder()

                .setColor(
                    color
                )

                .setTitle(
                    "✨ `ROD UPGRADE`"
                )

                .setDescription(

                    `${base.emoji} ${base.name} · ` +
                    `⭐ +${startLevel} → +${rod.level}\n\n` +

                    `> 🎲 Thành công: ${successRate}%\n` +
                    `> 💸 Chi phí: ${formatMoney(price)} ${emoji.money}\n\n` +

                    `${resultText}\n\n` +

                    `━━━━━━━━━━━━━━━━━━\n` +

                    `🎣 Cần hiện tại\n` +
                    `> ⭐ +${rod.level} · ` +
                    `+${rod.luck} 🍀 · ` +
                    `🎯 ${rod.uses}/${rod.maxUses}\n` +

                    `> 💰 Số dư: ${formatMoney(user.money)} ${emoji.money}`

                )

                .setFooter({
                    text:
                        "✦ Fishing Adventure · Upgrade"
                })

                .setTimestamp();


        await msg.edit({

            embeds: [
                finalEmbed
            ],

            components: []

        });

    }

};
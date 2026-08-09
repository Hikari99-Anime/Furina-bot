const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const {
    baits,
    keys,
    insurance,
    fishList,
    emoji,
    formatMoney
} = require("../../config");

const {
    getUser
} = require("../../data");

// ======================================================
// CONFIG
// ======================================================

const COLOR = "#9b59ff";

const SEPARATOR =
    "୨୧ ───────── ୨୧";

const FOOTER = {
    text:
        "✦ Fishing Adventure · Inventory"
};

// ======================================================
// TÍNH TỔNG CÁ
// ======================================================

function getFishData(user) {

    let fishText = "";

    let fishCount = 0;

    let totalKg = 0;

    let fishValue = 0;

    const list =
        Array.isArray(fishList)
            ? fishList
            : [];

    for (
        const fish of list
    ) {

        const fishes =
            user.fish?.[
                fish.id
            ];

        if (
            !Array.isArray(fishes) ||
            fishes.length === 0
        ) {
            continue;
        }

        let weight = 0;

        for (
            const value of fishes
        ) {

            const kg =
                Number(value);

            if (
                Number.isFinite(kg)
            ) {

                weight += kg;

                totalKg += kg;
            }
        }

        fishCount +=
            fishes.length;

        const price =
            Number(
                fish.sellPrice ??
                fish.sell ??
                fish.price ??
                0
            );

        if (
            Number.isFinite(price)
        ) {

            fishValue +=
                weight * price;
        }

        fishText +=
            `${fish.emoji || "🐟"} ` +
            `${fish.name} x${fishes.length}\n`;
    }

    if (!fishText) {

        fishText =
            "*Chưa có cá nào.*";
    }

    return {

        fishText,

        fishCount,

        totalKg,

        fishValue:
            Math.floor(
                fishValue
            )

    };
}

// ======================================================
// MỒI
// ======================================================

function getBaitText(user) {

    let text = "";

    for (
        const id in (baits || {})
    ) {

        const item =
            baits[id];

        const amount =
            Number(
                user.moi?.[id] || 0
            );

        if (
            amount <= 0
        ) {
            continue;
        }

        text +=
            `${item.emoji || "🪱"} ` +
            `${item.name} x${amount}\n`;
    }

    return (
        text ||
        "*Không có mồi.*"
    );
}

// ======================================================
// CHÌA KHÓA
// ======================================================

function getKeyText(user) {

    let text = "";

    for (
        const id in (keys || {})
    ) {

        const item =
            keys[id];

        const amount =
            Number(
                user.keys?.[id] || 0
            );

        if (
            amount <= 0
        ) {
            continue;
        }

        text +=
            `${item.emoji || "🔑"} ` +
            `${item.name} x${amount}\n`;
    }

    return (
        text ||
        "*Không có chìa khóa.*"
    );
}

// ======================================================
// BẢO HIỂM
// ======================================================

function getInsuranceText(user) {

    let text = "";

    // --------------------------------------------------
    // DẠNG:
    //
    // insurance: {
    //     basic: {...}
    // }
    // --------------------------------------------------

    if (
        insurance &&
        typeof insurance === "object"
    ) {

        for (
            const id in insurance
        ) {

            const item =
                insurance[id];

            let amount = 0;

            if (
                user.insurance &&
                typeof user.insurance === "object"
            ) {

                amount =
                    Number(
                        user.insurance[id] || 0
                    );
            }

            if (
                amount <= 0
            ) {
                continue;
            }

            text +=
                `${item.emoji || "🛡️"} ` +
                `${item.name} x${amount}\n`;
        }
    }

    // --------------------------------------------------
    // DATA CŨ:
    //
    // user.insurance = 2
    // --------------------------------------------------

    if (
        typeof user.insurance === "number" &&
        user.insurance > 0
    ) {

        text =
            `🛡️ Bảo hiểm x${user.insurance}`;
    }

    return (
        text ||
        "*Không có bảo hiểm.*"
    );
}

// ======================================================
// TẠO EMBED BALO 1
// ======================================================

function createBagOneEmbed(
    user,
    message
) {

    const fish =
        getFishData(
            user
        );

    const balance =
        Number(
            user.money || 0
        );

    return new EmbedBuilder()

        .setColor(
            COLOR
        )

        .setAuthor({

            name:
                `${message.author.username} · Inventory`,

            iconURL:
                message.author.displayAvatarURL({
                    extension: "png",
                    size: 128
                })

        })

        .setTitle(
            "🎒 `BALO 1`"
        )

        .setDescription(

            `🐟 **CÁ**\n\n` +

            `${fish.fishText}\n` +

            `${SEPARATOR}\n\n` +

            `🐟 **${fish.fishCount}** con\n` +

            `⚖️ **${fish.totalKg.toFixed(2)} KG**\n` +

            `💰 **${formatMoney(
                fish.fishValue
            )} ${emoji.money}**\n\n` +

            `${SEPARATOR}\n\n` +

            `💳 ${formatMoney(
                balance
            )} ${emoji.money}`

        )

        .setFooter(
            FOOTER
        )

        .setTimestamp();
}

// ======================================================
// TẠO EMBED BALO 2
// ======================================================

function createBagTwoEmbed(
    user,
    message
) {

    const baitText =
        getBaitText(
            user
        );

    const keyText =
        getKeyText(
            user
        );

    const insuranceText =
        getInsuranceText(
            user
        );

    const balance =
        Number(
            user.money || 0
        );

    return new EmbedBuilder()

        .setColor(
            COLOR
        )

        .setAuthor({

            name:
                `${message.author.username} · Inventory`,

            iconURL:
                message.author.displayAvatarURL({
                    extension: "png",
                    size: 128
                })

        })

        .setTitle(
            "📦 `BALO 2`"
        )

        .setDescription(

            `🪱 **MỒI**\n\n` +

            `${baitText}\n\n` +

            `${SEPARATOR}\n\n` +

            `🔑 **CHÌA KHÓA**\n\n` +

            `${keyText}\n\n` +

            `${SEPARATOR}\n\n` +

            `🛡️ **BẢO HIỂM**\n\n` +

            `${insuranceText}\n\n` +

            `${SEPARATOR}\n\n` +

            `💳 ${formatMoney(
                balance
            )} ${emoji.money}`

        )

        .setFooter(
            FOOTER
        )

        .setTimestamp();
}

// ======================================================
// BUTTON
// ======================================================

function createBagButtons(
    currentBag,
    userId
) {

    const row =
        new ActionRowBuilder();

    // ==================================================
    // BALO 1
    // ==================================================

    row.addComponents(

        new ButtonBuilder()

            .setCustomId(
                `inventory_bag_1_${userId}`
            )

            .setLabel(
                "Balo 1"
            )

            .setEmoji(
                "🎒"
            )

            .setStyle(

                currentBag === 1
                    ? ButtonStyle.Primary
                    : ButtonStyle.Secondary

            )

    );

    // ==================================================
    // BALO 2
    // ==================================================

    row.addComponents(

        new ButtonBuilder()

            .setCustomId(
                `inventory_bag_2_${userId}`
            )

            .setLabel(
                "Balo 2"
            )

            .setEmoji(
                "📦"
            )

            .setStyle(

                currentBag === 2
                    ? ButtonStyle.Primary
                    : ButtonStyle.Secondary

            )

    );

    return row;
}

// ======================================================
// MODULE
// ======================================================

module.exports = {

    name: "inventory",

    aliases: [
        "inv",
        "kho"
    ],

    async execute(message) {

        // ==================================================
        // USER
        // ==================================================

        const user =
            getUser(
                message.author.id
            );

        if (!user) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor(
                            "#ff6b81"
                        )

                        .setTitle(
                            "❌ `NO PLAYER DATA`"
                        )

                        .setDescription(
                            "Không thể tải dữ liệu kho đồ của bạn."
                        )

                        .setFooter(
                            FOOTER
                        )

                ]

            });
        }

        // ==================================================
        // ĐẢM BẢO DATA
        // ==================================================

        if (!user.fish) {

            user.fish = {};

        }

        if (!user.moi) {

            user.moi = {};

        }

        if (!user.keys) {

            user.keys = {};

        }

        // ==================================================
        // BALO MẶC ĐỊNH
        // ==================================================

        let currentBag = 1;

        // ==================================================
        // EMBED
        // ==================================================

        const embed =
            createBagOneEmbed(
                user,
                message
            );

        // ==================================================
        // BUTTON
        // ==================================================

        const row =
            createBagButtons(
                currentBag,
                message.author.id
            );

        // ==================================================
        // GỬI
        // ==================================================

        const msg =
            await message.reply({

                embeds: [
                    embed
                ],

                components: [
                    row
                ]

            });

        // ==================================================
        // COLLECTOR
        // ==================================================

        const collector =
            msg.createMessageComponentCollector({

                time:
                    60000

            });

        // ==================================================
        // BUTTON COLLECT
        // ==================================================

        collector.on(
            "collect",
            async interaction => {

                // ==========================================
                // CHECK USER
                // ==========================================

                if (
                    interaction.user.id !==
                    message.author.id
                ) {

                    return interaction.reply({

                        content:
                            "❌ Đây không phải kho đồ của bạn.",

                        ephemeral:
                            true

                    });

                }

                // ==========================================
                // ID
                // ==========================================

                const parts =
                    interaction.customId.split("_");

                const selectedBag =
                    Number(
                        parts[2]
                    );

                // ==========================================
                // CHECK BALO
                // ==========================================

                if (
                    selectedBag !== 1 &&
                    selectedBag !== 2
                ) {

                    return interaction.reply({

                        content:
                            "❌ Không tìm thấy balo.",

                        ephemeral:
                            true

                    });

                }

                // ==========================================
                // ĐỔI BALO
                // ==========================================

                currentBag =
                    selectedBag;

                // ==========================================
                // EMBED MỚI
                // ==========================================

                const newEmbed =
                    currentBag === 1

                        ? createBagOneEmbed(
                            user,
                            message
                        )

                        : createBagTwoEmbed(
                            user,
                            message
                        );

                // ==========================================
                // UPDATE
                // ==========================================

                return interaction.update({

                    embeds: [
                        newEmbed
                    ],

                    components: [

                        createBagButtons(
                            currentBag,
                            message.author.id
                        )

                    ]

                });

            }
        );

        // ==================================================
        // END
        // ==================================================

        collector.on(
            "end",
            async () => {

                try {

                    await msg.edit({

                        components: []

                    });

                } catch {}

            }
        );

    }

};
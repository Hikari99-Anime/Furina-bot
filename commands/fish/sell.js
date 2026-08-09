const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require("discord.js");

const {
    fishList,
    emoji,
    formatMoney,
    prefix
} = require("../../config");

const {
    getUser,
    save
} = require("../../data");

// ======================================================
// CẤU HÌNH
// ======================================================

const COLOR = "#A0E7E5";

const CUSTOM = {
    SEARCH: "sell_search",
    AMOUNT: "sell_amount",
    ALL: "sell_all",
    CLOSE: "sell_close",

    BACK: "sell_back",
    CONFIRM_ALL: "sell_confirm_all",
    CANCEL: "sell_cancel",

    AMOUNT_1: "sell_amount_1",
    AMOUNT_5: "sell_amount_5",
    AMOUNT_10: "sell_amount_10",
    AMOUNT_ALL: "sell_amount_all",
    AMOUNT_CUSTOM: "sell_amount_custom"
};

// ======================================================
// GIÁ MẶC ĐỊNH THEO RARITY
// ======================================================

function getRarityPrice(rarity) {

    switch (
        String(rarity || "common").toLowerCase()
    ) {

        case "common":
            return 100;

        case "uncommon":
            return 180;

        case "rare":
            return 350;

        case "epic":
            return 700;

        case "legendary":
            return 1500;

        case "mythical":
            return 3000;

        default:
            return 100;
    }
}

// ======================================================
// GIÁ BÁN 1 KG
// ======================================================

function getFishPrice(fish) {

    const sellPrice =
        Number(
            fish.sellPrice ??
            fish.sell ??
            fish.price
        );

    if (
        Number.isFinite(sellPrice) &&
        sellPrice > 0
    ) {

        return sellPrice;
    }

    return getRarityPrice(
        fish.rarity
    );
}

// ======================================================
// KIỂM TRA CÁ
// ======================================================

function isRealFish(fish) {

    return (
        fish &&
        fish.isFish !== false
    );
}

// ======================================================
// LẤY INVENTORY
// ======================================================

function getInventoryFish(user) {

    const result = [];

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

        if (
            !isRealFish(fishInfo)
        ) {
            continue;
        }

        const fishes =
            userFish[fishId];

        if (
            !Array.isArray(fishes) ||
            fishes.length <= 0
        ) {
            continue;
        }

        result.push({

            fish: fishInfo,

            fishId,

            fishes

        });
    }

    return result;
}

// ======================================================
// TỔNG CÁ
// ======================================================

function getTotalFish(user) {

    return getInventoryFish(user)
        .reduce(
            (
                total,
                item
            ) =>
                total +
                item.fishes.length,
            0
        );
}

// ======================================================
// TỔNG KG
// ======================================================

function getTotalKg(user) {

    let total = 0;

    const inventory =
        getInventoryFish(user);

    for (
        const item of inventory
    ) {

        for (
            const weight of item.fishes
        ) {

            const kg =
                Number(weight);

            if (
                Number.isFinite(kg)
            ) {

                total += kg;
            }
        }
    }

    return Number(
        total.toFixed(2)
    );
}

// ======================================================
// TỔNG GIÁ TRỊ
// ======================================================

function getEstimatedValue(user) {

    let total = 0;

    const inventory =
        getInventoryFish(user);

    for (
        const item of inventory
    ) {

        const price =
            getFishPrice(
                item.fish
            );

        for (
            const weight of item.fishes
        ) {

            const kg =
                Number(weight);

            if (
                Number.isFinite(kg)
            ) {

                total +=
                    kg * price;
            }
        }
    }

    return Math.floor(total);
}

// ======================================================
// FORMAT MAIN EMBED
// ======================================================

function createMainEmbed(
    user,
    message
) {

    const totalFish =
        getTotalFish(user);

    const totalKg =
        getTotalKg(user);

    const estimated =
        getEstimatedValue(user);

    return new EmbedBuilder()

        .setColor(
            COLOR
        )

        .setAuthor({

            name:
                `${message.author.username} · Fish Market`,

            iconURL:
                message.author.displayAvatarURL({
                    extension: "png",
                    size: 128
                })

        })

        .setDescription(

            `୨୧ ───────── ୨୧\n\n` +

            `💰 **FISH MARKET**\n\n` +

            `🐟 Cá trong túi: **${totalFish} con**\n` +

            `⚖️ Tổng cân nặng: **${totalKg.toFixed(2)} KG**\n` +

            `💵 Giá trị ước tính: **${formatMoney(
                estimated
            )} ${emoji.money}**\n\n` +

            `Chọn thao tác bạn muốn thực hiện.\n\n` +

            `୨୧ ───────── ୨୧`

        )

        .setFooter({

            text:
                "✦ Fishing Adventure · Fish Market"

        })

        .setTimestamp();
}

// ======================================================
// MAIN BUTTONS
// ======================================================

function createMainButtons() {

    return [

        new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()

                    .setCustomId(
                        CUSTOM.SEARCH
                    )

                    .setLabel(
                        "Tìm cá"
                    )

                    .setEmoji(
                        "🔎"
                    )

                    .setStyle(
                        ButtonStyle.Primary
                    ),

                new ButtonBuilder()

                    .setCustomId(
                        CUSTOM.AMOUNT
                    )

                    .setLabel(
                        "Bán số lượng"
                    )

                    .setEmoji(
                        "📦"
                    )

                    .setStyle(
                        ButtonStyle.Secondary
                    )

            ),

        new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()

                    .setCustomId(
                        CUSTOM.ALL
                    )

                    .setLabel(
                        "Bán tất cả"
                    )

                    .setEmoji(
                        "💰"
                    )

                    .setStyle(
                        ButtonStyle.Success
                    ),

                new ButtonBuilder()

                    .setCustomId(
                        CUSTOM.CLOSE
                    )

                    .setLabel(
                        "Đóng"
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
// SEARCH MODAL
// ======================================================

function createSearchModal() {

    const modal =
        new ModalBuilder()

            .setCustomId(
                CUSTOM.SEARCH
            )

            .setTitle(
                "🔎 Tìm cá"
            );

    const input =
        new TextInputBuilder()

            .setCustomId(
                "fish_query"
            )

            .setLabel(
                "Tên hoặc ID cá"
            )

            .setPlaceholder(
                "Ví dụ: Cá Mập hoặc 12"
            )

            .setStyle(
                TextInputStyle.Short
            )

            .setRequired(
                true
            )

            .setMaxLength(
                100
            );

    modal.addComponents(

        new ActionRowBuilder()
            .addComponents(
                input
            )

    );

    return modal;
}

// ======================================================
// TÌM CÁ
// ======================================================

function searchFish(
    user,
    query
) {

    const inventory =
        getInventoryFish(user);

    const text =
        String(
            query || ""
        )
            .trim()
            .toLowerCase();

    if (!text) {
        return [];
    }

    // ID chính xác
    const exactId =
        inventory.filter(
            item =>
                String(
                    item.fishId
                ) === text
        );

    if (
        exactId.length
    ) {

        return exactId;
    }

    // Tên chứa từ khóa
    const results =
        inventory.filter(
            item => {

                const name =
                    String(
                        item.fish.name || ""
                    )
                        .toLowerCase();

                const id =
                    String(
                        item.fishId
                    )
                        .toLowerCase();

                return (
                    name.includes(text) ||
                    id.includes(text)
                );
            }
        );

    // Tên chính xác được ưu tiên
    results.sort(
        (a, b) => {

            const aName =
                String(
                    a.fish.name || ""
                )
                    .toLowerCase();

            const bName =
                String(
                    b.fish.name || ""
                )
                    .toLowerCase();

            const aExact =
                aName === text;

            const bExact =
                bName === text;

            if (
                aExact &&
                !bExact
            ) {
                return -1;
            }

            if (
                !aExact &&
                bExact
            ) {
                return 1;
            }

            return (
                b.fishes.length -
                a.fishes.length
            );
        }
    );

    return results.slice(
        0,
        25
    );
}

// ======================================================
// EMBED KẾT QUẢ TÌM KIẾM
// ======================================================

function createSearchResultEmbed(
    query,
    results,
    message
) {

    let text = "";

    if (
        results.length
    ) {

        text =
            results
                .map(
                    item => {

                        const fish =
                            item.fish;

                        const price =
                            getFishPrice(
                                fish
                            );

                        return (
                            `${fish.emoji || "🐟"} ` +
                            `**${fish.name}**\n` +
                            `> ID: \`${item.fishId}\` · ` +
                            `Có: **${item.fishes.length}** · ` +
                            `${formatMoney(price)} xu/KG`
                        );

                    }
                )
                .join(
                    "\n\n"
                );

    } else {

        text =
            "❌ Không tìm thấy cá phù hợp trong túi.";
    }

    return new EmbedBuilder()

        .setColor(
            results.length
                ? COLOR
                : "#ff6b81"
        )

        .setAuthor({

            name:
                `${message.author.username} · Fish Search`,

            iconURL:
                message.author.displayAvatarURL({
                    extension: "png",
                    size: 128
                })

        })

        .setDescription(

            `୨୧ ───────── ୨୧\n\n` +

            `🔎 Kết quả cho: **${query}**\n\n` +

            text +

            `\n\n୨୧ ───────── ୨୧`

        )

        .setFooter({

            text:
                results.length
                    ? "✦ Chọn cá bên dưới để tiếp tục"
                    : "✦ Thử tên cá hoặc ID khác"

        });
}

// ======================================================
// SELECT KẾT QUẢ
// ======================================================

function createFishSelect(
    results,
    userId
) {

    const menu =
        new StringSelectMenuBuilder()

            .setCustomId(
                `sell_select_${userId}`
            )

            .setPlaceholder(
                "🐟 Chọn loại cá muốn bán..."
            );

    for (
        const item of results.slice(
            0,
            25
        )
    ) {

        const fish =
            item.fish;

        const price =
            getFishPrice(
                fish
            );

        menu.addOptions({

            label:
                String(
                    fish.name
                ).slice(
                    0,
                    100
                ),

            description:
                `Có ${item.fishes.length} con · ${formatMoney(price)} xu/KG`
                    .slice(
                        0,
                        100
                    ),

            value:
                String(
                    item.fishId
                ),

            emoji:
                fish.emoji || "🐟"

        });
    }

    return new ActionRowBuilder()
        .addComponents(
            menu
        );
}

// ======================================================
// NÚT QUAY LẠI
// ======================================================

function createBackButton() {

    return new ActionRowBuilder()
        .addComponents(

            new ButtonBuilder()

                .setCustomId(
                    CUSTOM.BACK
                )

                .setLabel(
                    "Quay lại"
                )

                .setEmoji(
                    "⬅️"
                )

                .setStyle(
                    ButtonStyle.Secondary
                )

        );
}

// ======================================================
// EMBED CHỌN SỐ LƯỢNG
// ======================================================

function createFishAmountEmbed(
    item,
    message
) {

    const fish =
        item.fish;

    const price =
        getFishPrice(
            fish
        );

    let totalKg = 0;

    for (
        const weight of item.fishes
    ) {

        const kg =
            Number(weight);

        if (
            Number.isFinite(kg)
        ) {

            totalKg += kg;
        }
    }

    return new EmbedBuilder()

        .setColor(
            COLOR
        )

        .setAuthor({

            name:
                `${message.author.username} · Fish Market`,

            iconURL:
                message.author.displayAvatarURL({
                    extension: "png",
                    size: 128
                })

        })

        .setDescription(

            `୨୧ ───────── ୨୧\n\n` +

            `${fish.emoji || "🐟"} **${fish.name}**\n\n` +

            `📦 Đang có: **${item.fishes.length} con**\n` +

            `⚖️ Tổng: **${totalKg.toFixed(2)} KG**\n` +

            `💵 Giá: **${formatMoney(price)} xu/KG**\n\n` +

            `Chọn số lượng muốn bán.\n\n` +

            `୨୧ ───────── ୨୧`

        )

        .setFooter({

            text:
                `ID cá: ${item.fishId}`

        });
}

// ======================================================
// BUTTON CHỌN SỐ LƯỢNG
// ======================================================

function createAmountButtons(
    fishId,
    userId,
    max
) {

    const row1 =
        new ActionRowBuilder();

    const presets = [

        {
            id:
                CUSTOM.AMOUNT_1,
            label:
                "1",
            value:
                1
        },

        {
            id:
                CUSTOM.AMOUNT_5,
            label:
                "5",
            value:
                5
        },

        {
            id:
                CUSTOM.AMOUNT_10,
            label:
                "10",
            value:
                10
        },

        {
            id:
                CUSTOM.AMOUNT_ALL,
            label:
                "Tất cả",
            value:
                max
        }

    ];

    for (
        const preset of presets
    ) {

        row1.addComponents(

            new ButtonBuilder()

                .setCustomId(
                    `${preset.id}_${userId}_${fishId}`
                )

                .setLabel(
                    preset.label
                )

                .setStyle(
                    ButtonStyle.Primary
                )

                .setDisabled(
                    preset.value > max
                )

        );
    }

    const row2 =
        new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()

                    .setCustomId(
                        `${CUSTOM.AMOUNT_CUSTOM}_${userId}_${fishId}`
                    )

                    .setLabel(
                        "Nhập số lượng"
                    )

                    .setEmoji(
                        "✏️"
                    )

                    .setStyle(
                        ButtonStyle.Secondary
                    ),

                new ButtonBuilder()

                    .setCustomId(
                        `${CUSTOM.BACK}_${userId}`
                    )

                    .setLabel(
                        "Quay lại"
                    )

                    .setEmoji(
                        "⬅️"
                    )

                    .setStyle(
                        ButtonStyle.Secondary
                    )

            );

    return [
        row1,
        row2
    ];
}

// ======================================================
// MODAL NHẬP SỐ LƯỢNG
// ======================================================

function createAmountModal(
    userId,
    fishId
) {

    const modal =
        new ModalBuilder()

            .setCustomId(
                `sell_custom_amount_${userId}_${fishId}`
            )

            .setTitle(
                "📦 Số lượng cá"
            );

    const input =
        new TextInputBuilder()

            .setCustomId(
                "amount"
            )

            .setLabel(
                "Số lượng muốn bán"
            )

            .setPlaceholder(
                "Ví dụ: 5"
            )

            .setStyle(
                TextInputStyle.Short
            )

            .setRequired(
                true
            )

            .setMinLength(
                1
            )

            .setMaxLength(
                10
            );

    modal.addComponents(

        new ActionRowBuilder()
            .addComponents(
                input
            )

    );

    return modal;
}

// ======================================================
// BÁN 1 LOẠI CÁ
// ======================================================

function sellSpecificFish(
    user,
    fishId,
    amount
) {

    const fishes =
        user.fish?.[fishId];

    if (
        !Array.isArray(fishes) ||
        fishes.length === 0
    ) {

        return {
            ok: false,
            reason: "not_found"
        };
    }

    if (
        !Number.isInteger(amount) ||
        amount <= 0
    ) {

        return {
            ok: false,
            reason: "invalid_amount"
        };
    }

    if (
        amount >
        fishes.length
    ) {

        return {
            ok: false,
            reason: "not_enough",
            available:
                fishes.length
        };
    }

    const fish =
        fishList.find(
            item =>
                String(item.id) ===
                String(fishId)
        );

    if (
        !fish
    ) {

        return {
            ok: false,
            reason: "not_found"
        };
    }

    const pricePerKg =
        getFishPrice(
            fish
        );

    let totalKg = 0;

    const soldFish = [];

    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const index =
            fishes.length -
            1 -
            i;

        const weight =
            Number(
                fishes[index]
            );

        if (
            !Number.isFinite(weight)
        ) {
            continue;
        }

        totalKg +=
            weight;

        soldFish.push(
            weight
        );
    }

    const totalMoney =
        Math.floor(
            totalKg *
            pricePerKg
        );

    fishes.splice(
        fishes.length -
        amount,
        amount
    );

    if (
        fishes.length === 0
    ) {

        delete user.fish[
            fishId
        ];
    }

    user.money =
        Number(
            user.money || 0
        ) +
        totalMoney;

    save();

    return {

        ok: true,

        fish,

        fishId,

        amount:
            soldFish.length,

        totalKg,

        pricePerKg,

        totalMoney,

        balance:
            user.money

    };
}

// ======================================================
// BÁN NHIỀU CÁ
// ======================================================

function sellManyFish(
    user,
    amount
) {

    const inventory =
        getInventoryFish(user);

    if (
        !inventory.length
    ) {

        return {
            ok: false,
            reason: "no_fish"
        };
    }

    if (
        !Number.isInteger(amount) ||
        amount <= 0
    ) {

        return {
            ok: false,
            reason: "invalid_amount"
        };
    }

    const totalAvailable =
        getTotalFish(user);

    if (
        amount >
        totalAvailable
    ) {

        return {
            ok: false,
            reason: "not_enough",
            available:
                totalAvailable
        };
    }

    let remaining =
        amount;

    let totalFishSold =
        0;

    let totalKg =
        0;

    let totalMoney =
        0;

    const soldSummary = [];

    const sortedInventory =
        [...inventory].sort(
            (a, b) =>
                getFishPrice(a.fish) -
                getFishPrice(b.fish)
        );

    for (
        const item of sortedInventory
    ) {

        if (
            remaining <= 0
        ) {
            break;
        }

        const fishes =
            item.fishes;

        const sellCount =
            Math.min(
                fishes.length,
                remaining
            );

        if (
            sellCount <= 0
        ) {
            continue;
        }

        const price =
            getFishPrice(
                item.fish
            );

        let itemKg = 0;

        for (
            let i = 0;
            i < sellCount;
            i++
        ) {

            const weight =
                Number(
                    fishes[
                        fishes.length -
                        1 -
                        i
                    ]
                );

            if (
                Number.isFinite(weight)
            ) {

                itemKg +=
                    weight;
            }
        }

        const itemMoney =
            Math.floor(
                itemKg *
                price
            );

        fishes.splice(
            fishes.length -
            sellCount,
            sellCount
        );

        if (
            fishes.length === 0
        ) {

            delete user.fish[
                item.fishId
            ];
        }

        totalFishSold +=
            sellCount;

        totalKg +=
            itemKg;

        totalMoney +=
            itemMoney;

        soldSummary.push({

            fish:
                item.fish,

            count:
                sellCount,

            kg:
                itemKg,

            money:
                itemMoney

        });

        remaining -=
            sellCount;
    }

    totalMoney =
        Math.floor(
            totalMoney
        );

    user.money =
        Number(
            user.money || 0
        ) +
        totalMoney;

    save();

    return {

        ok: true,

        totalFishSold,

        totalKg,

        totalMoney,

        soldSummary,

        balance:
            user.money

    };
}

// ======================================================
// EMBED KẾT QUẢ BÁN 1 LOẠI
// ======================================================

function createSpecificResultEmbed(
    result
) {

    return new EmbedBuilder()

        .setColor(
            "#8affb2"
        )

        .setTitle(
            "💰 `SELL COMPLETE`"
        )

        .setDescription(

            `୨୧ ───────── ୨୧\n\n` +

            `${result.fish.emoji || "🐟"} ` +
            `**${result.fish.name}**\n\n` +

            `📦 Số lượng: **${result.amount} con**\n` +

            `⚖️ Tổng KG: **${result.totalKg.toFixed(2)} KG**\n` +

            `💵 Giá: **${formatMoney(
                result.pricePerKg
            )} xu/KG**\n\n` +

            `💰 Nhận được: **+${formatMoney(
                result.totalMoney
            )} ${emoji.money}**\n` +

            `💳 Số dư: **${formatMoney(
                result.balance
            )} ${emoji.money}**\n\n` +

            `୨୧ ───────── ୨୧`

        )

        .setFooter({

            text:
                "✦ Fishing Adventure · Fish Market"

        })

        .setTimestamp();
}

// ======================================================
// EMBED KẾT QUẢ BÁN NHIỀU
// ======================================================

function createManyResultEmbed(
    result
) {

    const summary =
        result.soldSummary
            .map(
                item =>
                    `${item.fish.emoji || "🐟"} ` +
                    `**${item.fish.name}** ×${item.count} ` +
                    `· ${item.kg.toFixed(2)} KG`
            )
            .join("\n");

    return new EmbedBuilder()

        .setColor(
            "#8affb2"
        )

        .setTitle(
            "💰 `SELL COMPLETE`"
        )

        .setDescription(

            `୨୧ ───────── ୨୧\n\n` +

            `🐟 Đã bán: **${result.totalFishSold} con cá**\n\n` +

            `${summary}\n\n` +

            `⚖️ Tổng cân nặng: **${result.totalKg.toFixed(2)} KG**\n` +

            `💰 Tiền nhận: **+${formatMoney(
                result.totalMoney
            )} ${emoji.money}**\n` +

            `💳 Số dư: **${formatMoney(
                result.balance
            )} ${emoji.money}**\n\n` +

            `୨୧ ───────── ୨୧`

        )

        .setFooter({

            text:
                "✦ Fishing Adventure · Fish Market"

        })

        .setTimestamp();
}

// ======================================================
// MODULE
// ======================================================

module.exports = {

    name:
        "sell",

    aliases: [
        "ban",
        "sellfish",
        "ban_ca"
    ],

    async execute(
        message,
        args
    ) {

        const user =
            getUser(
                message.author.id
            );

        if (!user) {

            return message.reply(
                "❌ Không tìm thấy dữ liệu người chơi."
            );
        }

        user.fish =
            user.fish || {};

        user.money =
            Number(
                user.money || 0
            );

        const inventory =
            getInventoryFish(user);

        if (
            !inventory.length
        ) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor(
                            "#ff6b81"
                        )

                        .setDescription(

                            `୨୧ ───────── ୨୧\n\n` +

                            `🐟 **NO FISH**\n\n` +

                            `Bạn không có cá để bán.\n\n` +

                            `🎣 Dùng \`${prefix}fish\` để đi câu.\n\n` +

                            `୨୧ ───────── ୨୧`

                        )

                        .setFooter({

                            text:
                                "✦ Fishing Adventure"

                        })

                ]

            });
        }

        // ==================================================
        // !sell ID AMOUNT
        // ==================================================

        if (
            args?.length >= 2
        ) {

            const fishId =
                String(
                    args[0]
                );

            const amount =
                Number(
                    args[1]
                );

            if (
                !Number.isInteger(amount) ||
                amount <= 0
            ) {

                return message.reply(
                    `❌ Số lượng không hợp lệ.\nVí dụ: \`${prefix}sell 12 5\``
                );
            }

            const result =
                sellSpecificFish(
                    user,
                    fishId,
                    amount
                );

            if (
                !result.ok
            ) {

                if (
                    result.reason ===
                    "not_found"
                ) {

                    return message.reply(
                        `❌ Bạn không có cá ID \`${fishId}\`.`
                    );
                }

                if (
                    result.reason ===
                    "not_enough"
                ) {

                    return message.reply(
                        `❌ Bạn chỉ có **${result.available}** con cá này.`
                    );
                }

                return message.reply(
                    "❌ Không thể bán cá."
                );
            }

            return message.reply({

                embeds: [
                    createSpecificResultEmbed(
                        result
                    )
                ]

            });
        }

        // ==================================================
        // !sell ID
        // ==================================================

        if (
            args?.length === 1
        ) {

            const first =
                String(
                    args[0]
                );

            // !sell 12
            // Nếu ID tồn tại → bán toàn bộ ID đó
            const fishExists =
                inventory.some(
                    item =>
                        String(
                            item.fishId
                        ) === first
                );

            if (
                fishExists
            ) {

                const item =
                    inventory.find(
                        item =>
                            String(
                                item.fishId
                            ) === first
                    );

                const result =
                    sellSpecificFish(
                        user,
                        first,
                        item.fishes.length
                    );

                if (
                    result.ok
                ) {

                    return message.reply({

                        embeds: [
                            createSpecificResultEmbed(
                                result
                            )
                        ]

                    });
                }
            }

            // !sell 10
            // Nếu không phải ID đang có → bán 10 con
            if (
                /^\d+$/.test(first)
            ) {

                const amount =
                    Number(first);

                const result =
                    sellManyFish(
                        user,
                        amount
                    );

                if (
                    !result.ok
                ) {

                    if (
                        result.reason ===
                        "not_enough"
                    ) {

                        return message.reply(
                            `❌ Bạn chỉ có **${result.available}** con cá.`
                        );
                    }

                    return message.reply(
                        "❌ Không thể bán cá."
                    );
                }

                return message.reply({

                    embeds: [
                        createManyResultEmbed(
                            result
                        )
                    ]

                });
            }
        }

        // ==================================================
        // !sell
        // ==================================================

        const msg =
            await message.reply({

                embeds: [
                    createMainEmbed(
                        user,
                        message
                    )
                ],

                components:
                    createMainButtons()

            });

        // ==================================================
        // COLLECTOR
        // ==================================================

        const collector =
            msg.createMessageComponentCollector({

                time:
                    120000

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
                            "❌ Đây không phải bảng bán cá của bạn.",

                        ephemeral:
                            true

                    });
                }

                // ==========================================
                // TÌM CÁ
                // ==========================================

                if (
                    interaction.customId ===
                    CUSTOM.SEARCH
                ) {

                    return interaction.showModal(
                        createSearchModal()
                    );
                }

                // ==========================================
                // BÁN THEO SỐ LƯỢNG
                // ==========================================

                if (
                    interaction.customId ===
                    CUSTOM.AMOUNT
                ) {

                    const modal =
                        new ModalBuilder()

                            .setCustomId(
                                `sell_many_amount_${message.author.id}`
                            )

                            .setTitle(
                                "📦 Bán số lượng"
                            );

                    const input =
                        new TextInputBuilder()

                            .setCustomId(
                                "amount"
                            )

                            .setLabel(
                                "Số lượng cá muốn bán"
                            )

                            .setPlaceholder(
                                "Ví dụ: 25"
                            )

                            .setStyle(
                                TextInputStyle.Short
                            )

                            .setRequired(
                                true
                            )

                            .setMaxLength(
                                10
                            );

                    modal.addComponents(

                        new ActionRowBuilder()
                            .addComponents(
                                input
                            )

                    );

                    return interaction.showModal(
                        modal
                    );
                }

                // ==========================================
                // BÁN TẤT CẢ
                // ==========================================

                if (
                    interaction.customId ===
                    CUSTOM.ALL
                ) {

                    const totalFish =
                        getTotalFish(user);

                    const totalKg =
                        getTotalKg(user);

                    const estimated =
                        getEstimatedValue(user);

                    const row =
                        new ActionRowBuilder()
                            .addComponents(

                                new ButtonBuilder()

                                    .setCustomId(
                                        CUSTOM.CONFIRM_ALL
                                    )

                                    .setLabel(
                                        "Xác nhận bán"
                                    )

                                    .setEmoji(
                                        "✅"
                                    )

                                    .setStyle(
                                        ButtonStyle.Danger
                                    ),

                                new ButtonBuilder()

                                    .setCustomId(
                                        CUSTOM.CANCEL
                                    )

                                    .setLabel(
                                        "Hủy"
                                    )

                                    .setEmoji(
                                        "❌"
                                    )

                                    .setStyle(
                                        ButtonStyle.Secondary
                                    )

                            );

                    return interaction.update({

                        embeds: [

                            new EmbedBuilder()

                                .setColor(
                                    "#ffd166"
                                )

                                .setDescription(

                                    `୨୧ ───────── ୨୧\n\n` +

                                    `⚠️ **XÁC NHẬN BÁN TOÀN BỘ**\n\n` +

                                    `🐟 Số cá: **${totalFish} con**\n` +

                                    `⚖️ Tổng: **${totalKg.toFixed(2)} KG**\n` +

                                    `💰 Giá trị hiện tại: **${formatMoney(
                                        estimated
                                    )} ${emoji.money}**\n\n` +

                                    `Hành động này sẽ bán toàn bộ cá trong túi.\n\n` +

                                    `୨୧ ───────── ୨୧`

                                )

                                .setFooter({

                                    text:
                                        "✦ Kiểm tra kỹ trước khi xác nhận"

                                })

                        ],

                        components: [
                            row
                        ]

                    });
                }

                // ==========================================
                // XÁC NHẬN BÁN ALL
                // ==========================================

                if (
                    interaction.customId ===
                    CUSTOM.CONFIRM_ALL
                ) {

                    const result =
                        sellManyFish(
                            user,
                            getTotalFish(user)
                        );

                    if (
                        !result.ok
                    ) {

                        return interaction.update({

                            embeds: [

                                new EmbedBuilder()

                                    .setColor(
                                        "#ff6b81"
                                    )

                                    .setDescription(
                                        "❌ Không thể bán cá."
                                    )

                            ],

                            components: []

                        });
                    }

                    collector.stop(
                        "completed"
                    );

                    return interaction.update({

                        embeds: [

                            createManyResultEmbed(
                                result
                            )

                        ],

                        components: []

                    });
                }

                // ==========================================
                // HỦY
                // ==========================================

                if (
                    interaction.customId ===
                    CUSTOM.CANCEL
                ) {

                    return interaction.update({

                        embeds: [

                            createMainEmbed(
                                user,
                                message
                            )

                        ],

                        components:
                            createMainButtons()

                    });
                }

                // ==========================================
                // ĐÓNG
                // ==========================================

                if (
                    interaction.customId ===
                    CUSTOM.CLOSE
                ) {

                    collector.stop(
                        "closed"
                    );

                    return interaction.update({

                        embeds: [

                            new EmbedBuilder()

                                .setColor(
                                    "#5865F2"
                                )

                                .setDescription(
                                    "👋 Đã đóng **Fish Market**."
                                )

                        ],

                        components: []

                    });
                }

                // ==========================================
                // QUAY LẠI
                // ==========================================

                if (
                    interaction.customId ===
                    CUSTOM.BACK ||
                    interaction.customId.startsWith(
                        `${CUSTOM.BACK}_`
                    )
                ) {

                    return interaction.update({

                        embeds: [

                            createMainEmbed(
                                user,
                                message
                            )

                        ],

                        components:
                            createMainButtons()

                    });
                }

                // ==========================================
                // SELECT CÁ
                // ==========================================

                if (
                    interaction.customId.startsWith(
                        "sell_select_"
                    )
                ) {

                    const fishId =
                        interaction.values[0];

                    const inventoryNow =
                        getInventoryFish(user);

                    const item =
                        inventoryNow.find(
                            item =>
                                String(
                                    item.fishId
                                ) ===
                                String(
                                    fishId
                                )
                        );

                    if (
                        !item
                    ) {

                        return interaction.reply({

                            content:
                                "❌ Cá này không còn trong túi.",

                            ephemeral:
                                true

                        });
                    }

                    return interaction.update({

                        embeds: [

                            createFishAmountEmbed(
                                item,
                                message
                            )

                        ],

                        components:
                            createAmountButtons(
                                fishId,
                                message.author.id,
                                item.fishes.length
                            )

                    });
                }

                // ==========================================
                // CHỌN SỐ LƯỢNG
                // ==========================================

                if (
                    interaction.customId.startsWith(
                        CUSTOM.AMOUNT_1
                    ) ||
                    interaction.customId.startsWith(
                        CUSTOM.AMOUNT_5
                    ) ||
                    interaction.customId.startsWith(
                        CUSTOM.AMOUNT_10
                    ) ||
                    interaction.customId.startsWith(
                        CUSTOM.AMOUNT_ALL
                    )
                ) {

                    const parts =
                        interaction.customId.split(
                            "_"
                        );

                    const fishId =
                        parts[
                            parts.length - 1
                        ];

                    let amount = 1;

                    if (
                        interaction.customId.startsWith(
                            CUSTOM.AMOUNT_5
                        )
                    ) {
                        amount = 5;
                    }

                    if (
                        interaction.customId.startsWith(
                            CUSTOM.AMOUNT_10
                        )
                    ) {
                        amount = 10;
                    }

                    if (
                        interaction.customId.startsWith(
                            CUSTOM.AMOUNT_ALL
                        )
                    ) {

                        const fishes =
                            user.fish?.[
                                fishId
                            ];

                        amount =
                            Array.isArray(fishes)
                                ? fishes.length
                                : 0;
                    }

                    const result =
                        sellSpecificFish(
                            user,
                            fishId,
                            amount
                        );

                    if (
                        !result.ok
                    ) {

                        return interaction.reply({

                            content:
                                result.reason === "not_enough"
                                    ? `❌ Bạn chỉ còn ${result.available} con.`
                                    : "❌ Không thể bán cá.",

                            ephemeral:
                                true

                        });
                    }

                    collector.stop(
                        "completed"
                    );

                    return interaction.update({

                        embeds: [

                            createSpecificResultEmbed(
                                result
                            )

                        ],

                        components: []

                    });
                }

                // ==========================================
                // NHẬP SỐ LƯỢNG CHO 1 LOẠI
                // ==========================================

                if (
                    interaction.customId.startsWith(
                        `${CUSTOM.AMOUNT_CUSTOM}_`
                    )
                ) {

                    const parts =
                        interaction.customId.split(
                            "_"
                        );

                    const fishId =
                        parts[
                            parts.length - 1
                        ];

                    return interaction.showModal(

                        createAmountModal(
                            message.author.id,
                            fishId
                        )

                    );
                }

            }
        );

        // ==================================================
        // MODAL SUBMIT
        // ==================================================

        const modalCollector =
            message.channel.createMessageComponentCollector({

                time:
                    120000

            });

        // Không dùng collector này cho modal.
        // Modal interaction sẽ được bắt bằng interactionCreate
        // trong bot chính nếu không xử lý ở command collector.
        //
        // Vì vậy ta dùng message.client listener tạm thời.
        const modalHandler =
            async interaction => {

                try {

                    if (
                        !interaction.isModalSubmit()
                    ) {
                        return;
                    }

                    if (
                        interaction.user.id !==
                        message.author.id
                    ) {
                        return;
                    }

                    const customId =
                        interaction.customId;

                    // ======================================
                    // SEARCH
                    // ======================================

                    if (
                        customId ===
                        CUSTOM.SEARCH
                    ) {

                        const query =
                            interaction.fields.getTextInputValue(
                                "fish_query"
                            );

                        const results =
                            searchFish(
                                user,
                                query
                            );

                        if (
                            !results.length
                        ) {

                            return interaction.reply({

                                embeds: [

                                    createSearchResultEmbed(
                                        query,
                                        [],
                                        message
                                    )

                                ],

                                components: [
                                    createBackButton()
                                ],

                                ephemeral: true

                            });
                        }

                        return interaction.reply({

                            embeds: [

                                createSearchResultEmbed(
                                    query,
                                    results,
                                    message
                                )

                            ],

                            components: [

                                createFishSelect(
                                    results,
                                    message.author.id
                                ),

                                createBackButton()

                            ],

                            ephemeral: true

                        });
                    }

                    // ======================================
                    // BÁN NHIỀU
                    // ======================================

                    if (
                        customId.startsWith(
                            `sell_many_amount_${message.author.id}`
                        )
                    ) {

                        const amountText =
                            interaction.fields.getTextInputValue(
                                "amount"
                            );

                        const amount =
                            Number(
                                amountText
                            );

                        if (
                            !Number.isInteger(amount) ||
                            amount <= 0
                        ) {

                            return interaction.reply({

                                content:
                                    "❌ Số lượng không hợp lệ.",

                                ephemeral:
                                    true

                            });
                        }

                        const result =
                            sellManyFish(
                                user,
                                amount
                            );

                        if (
                            !result.ok
                        ) {

                            if (
                                result.reason ===
                                "not_enough"
                            ) {

                                return interaction.reply({

                                    content:
                                        `❌ Bạn chỉ có ${result.available} con cá.`,

                                    ephemeral:
                                        true

                                });
                            }

                            return interaction.reply({

                                content:
                                    "❌ Không thể bán cá.",

                                ephemeral:
                                    true

                            });
                        }

                        collector.stop(
                            "completed"
                        );

                        return interaction.reply({

                            embeds: [

                                createManyResultEmbed(
                                    result
                                )

                            ]

                        });
                    }

                    // ======================================
                    // NHẬP SỐ LƯỢNG 1 LOẠI
                    // ======================================

                    if (
                        customId.startsWith(
                            `sell_custom_amount_${message.author.id}_`
                        )
                    ) {

                        const parts =
                            customId.split(
                                "_"
                            );

                        const fishId =
                            parts[
                                parts.length - 1
                            ];

                        const amountText =
                            interaction.fields.getTextInputValue(
                                "amount"
                            );

                        const amount =
                            Number(
                                amountText
                            );

                        if (
                            !Number.isInteger(amount) ||
                            amount <= 0
                        ) {

                            return interaction.reply({

                                content:
                                    "❌ Số lượng không hợp lệ.",

                                ephemeral:
                                    true

                            });
                        }

                        const result =
                            sellSpecificFish(
                                user,
                                fishId,
                                amount
                            );

                        if (
                            !result.ok
                        ) {

                            if (
                                result.reason ===
                                "not_found"
                            ) {

                                return interaction.reply({

                                    content:
                                        "❌ Cá này không còn trong túi.",

                                    ephemeral:
                                        true

                                });
                            }

                            if (
                                result.reason ===
                                "not_enough"
                            ) {

                                return interaction.reply({

                                    content:
                                        `❌ Bạn chỉ còn ${result.available} con cá này.`,

                                    ephemeral:
                                        true

                                });
                            }

                            return interaction.reply({

                                content:
                                    "❌ Không thể bán cá.",

                                ephemeral:
                                    true

                            });
                        }

                        collector.stop(
                            "completed"
                        );

                        return interaction.reply({

                            embeds: [

                                createSpecificResultEmbed(
                                    result
                                )

                            ]

                        });
                    }

                } catch (
                    error
                ) {

                    console.error(
                        "[SELL MODAL]",
                        error
                    );
                }
            };

        message.client.on(
            "interactionCreate",
            modalHandler
        );

        collector.on(
            "end",
            async () => {

                message.client.removeListener(
                    "interactionCreate",
                    modalHandler
                );

                try {

                    await msg.edit({

                        components: []

                    });

                } catch {}

            }
        );

        modalCollector.stop();
    }
};
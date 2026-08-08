const {
    EmbedBuilder
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

    /*
     * Ưu tiên:
     *
     * fish.sellPrice
     * fish.price
     *
     * Nếu không có thì dùng rarity.
     */

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
// KIỂM TRA CÁ HỢP LỆ
// ======================================================

function isRealFish(fish) {

    return (
        fish &&
        fish.isFish !== false
    );
}

// ======================================================
// LẤY CÁ TRONG TÚI
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

            fish:
                fishInfo,

            fishId,

            fishes

        });
    }

    return result;
}

// ======================================================
// TÍNH SỐ CÁ
// ======================================================

function getTotalFish(user) {

    let total = 0;

    const inventory =
        getInventoryFish(user);

    for (
        const item of inventory
    ) {

        total +=
            item.fishes.length;
    }

    return total;
}

// ======================================================
// TÍNH TỔNG KG
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
// MODULE
// ======================================================

module.exports = {

    name: "sell",

    aliases: [
        "ban",
        "sellfish",
        "ban_ca"
    ],

    async execute(
        message,
        args
    ) {

        // ==================================================
        // USER
        // ==================================================

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

        // ==================================================
        // INVENTORY
        // ==================================================

        const inventory =
            getInventoryFish(user);

        if (
            inventory.length === 0
        ) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor(
                            "#ff6b81"
                        )

                        .setTitle(
                            "🐟 `NO FISH`"
                        )

                        .setDescription(

                            "Bạn không có cá để bán.\n\n" +

                            `🎣 Dùng \`${prefix}fish\` để đi câu.`
                        )

                        .setFooter({

                            text:
                                "✦ Fishing Adventure"

                        })
                ]
            });
        }

        // ==================================================
        // ARGUMENT
        // ==================================================

        /*
         *
         * !sell
         * => bán toàn bộ
         *
         * !sell 10
         * => bán 10 con
         *
         * !sell 12 10
         * => bán 10 con cá ID 12
         *
         */

        let fishId = null;

        let amount = null;

        // ==================================================
        // !SELL ID AMOUNT
        // ==================================================

        if (
            args?.length >= 2
        ) {

            fishId =
                String(
                    args[0]
                );

            amount =
                Number(
                    args[1]
                );

            if (
                !Number.isInteger(
                    amount
                ) ||
                amount <= 0
            ) {

                return message.reply({

                    embeds: [

                        new EmbedBuilder()

                            .setColor(
                                "#ff6b81"
                            )

                            .setTitle(
                                "❌ `INVALID AMOUNT`"
                            )

                            .setDescription(

                                `Số lượng không hợp lệ.\n\n` +

                                `Ví dụ:\n` +
                                `\`${prefix}sell 12 5\``

                            )

                            .setFooter({

                                text:
                                    "✦ Fishing Adventure"

                            })
                    ]
                });
            }
        }

        // ==================================================
        // !SELL ID
        // ==================================================

        else if (
            args?.length === 1
        ) {

            const first =
                String(
                    args[0]
                );

            /*
             * Nếu là số:
             *
             * !sell 10
             *
             * => bán 10 con
             *
             * Nếu không phải số:
             *
             * !sell cod
             *
             * => bán toàn bộ cá ID cod
             */

            if (
                /^\d+$/.test(first)
            ) {

                amount =
                    Number(first);

            } else {

                fishId =
                    first;
            }

            if (
                amount !== null &&
                (
                    !Number.isInteger(
                        amount
                    ) ||
                    amount <= 0
                )
            ) {

                return message.reply({

                    embeds: [

                        new EmbedBuilder()

                            .setColor(
                                "#ff6b81"
                            )

                            .setTitle(
                                "❌ `INVALID AMOUNT`"
                            )

                            .setDescription(
                                "Số lượng cá không hợp lệ."
                            )

                            .setFooter({

                                text:
                                    "✦ Fishing Adventure"

                            })
                    ]
                });
            }
        }

        // ==================================================
        // BÁN CÁ CỤ THỂ
        // ==================================================

        if (
            fishId !== null
        ) {

            const inventoryItem =
                inventory.find(
                    item =>
                        String(
                            item.fishId
                        ) ===
                        String(fishId)
                );

            if (
                !inventoryItem
            ) {

                return message.reply({

                    embeds: [

                        new EmbedBuilder()

                            .setColor(
                                "#ff6b81"
                            )

                            .setTitle(
                                "🐟 `FISH NOT FOUND`"
                            )

                            .setDescription(

                                `Bạn không có cá ID \`${fishId}\`.\n\n` +

                                `💡 Dùng \`${prefix}fishlist\` hoặc lệnh xem túi cá để kiểm tra.`

                            )

                            .setFooter({

                                text:
                                    "✦ Fishing Adventure"

                            })
                    ]
                });
            }

            const fishes =
                inventoryItem.fishes;

            // ==================================================
            // SỐ LƯỢNG BÁN
            // ==================================================

            const sellAmount =
                amount === null
                    ? fishes.length
                    : amount;

            if (
                sellAmount >
                fishes.length
            ) {

                return message.reply({

                    embeds: [

                        new EmbedBuilder()

                            .setColor(
                                "#ffd166"
                            )

                            .setTitle(
                                "❌ `NOT ENOUGH FISH`"
                            )

                            .setDescription(

                                `Bạn chỉ có **${fishes.length}** ${inventoryItem.fish.name}.\n` +

                                `Muốn bán: **${sellAmount}**`

                            )

                            .setFooter({

                                text:
                                    "✦ Fishing Adventure"

                            })
                    ]
                });
            }

            // ==================================================
            // TÍNH TIỀN
            // ==================================================

            const pricePerKg =
                getFishPrice(
                    inventoryItem.fish
                );

            let totalKg = 0;

            let totalMoney = 0;

            const soldFish = [];

            /*
             * Lấy từ cuối mảng.
             *
             * Không ảnh hưởng tới thứ tự
             * cá còn lại.
             */

            for (
                let i = 0;
                i < sellAmount;
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
                    !Number.isFinite(
                        weight
                    )
                ) {
                    continue;
                }

                totalKg +=
                    weight;

                totalMoney +=
                    weight *
                    pricePerKg;

                soldFish.push(
                    weight
                );
            }

            totalMoney =
                Math.floor(
                    totalMoney
                );

            // ==================================================
            // XÓA CÁ
            // ==================================================

            fishes.splice(
                fishes.length -
                sellAmount,
                sellAmount
            );

            // ==================================================
            // XÓA ARRAY RỖNG
            // ==================================================

            if (
                fishes.length === 0
            ) {

                delete user.fish[
                    inventoryItem.fishId
                ];
            }

            // ==================================================
            // CỘNG TIỀN
            // ==================================================

            user.money +=
                totalMoney;

            // ==================================================
            // SAVE
            // ==================================================

            save();

            // ==================================================
            // RESULT
            // ==================================================

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor(
                            "#A0E7E5"
                        )

                        .setTitle(
                            "💰 `SELL COMPLETE`"
                        )

                        .setDescription(

                            `🐟 Cá: **${inventoryItem.fish.emoji || "🐟"} ${inventoryItem.fish.name}**\n` +

                            `📦 Số lượng: **${soldFish.length} con**\n` +

                            `⚖️ Tổng KG: **${totalKg.toFixed(2)} KG**\n` +

                            `💵 Giá: **${formatMoney(pricePerKg)} xu/KG**\n\n` +

                            `💰 Nhận được: **+${formatMoney(totalMoney)} ${emoji.money}**\n` +

                            `💳 Số dư: **${formatMoney(user.money)} ${emoji.money}**`

                        )

                        .setFooter({

                            text:
                                "✦ Fishing Adventure · Fish Market"

                        })

                        .setTimestamp()

                ]
            });
        }

        // ==================================================
        // BÁN TOÀN BỘ / BÁN NHIỀU CÁ
        // ==================================================

        /*
         * !sell
         * => bán toàn bộ
         *
         * !sell 10
         * => bán 10 con
         *
         * Ưu tiên cá rẻ trước.
         */

        let remaining =
            amount === null
                ? Infinity
                : amount;

        let totalFishSold = 0;

        let totalKg = 0;

        let totalMoney = 0;

        const soldSummary = [];

        // ==================================================
        // SORT THEO GIÁ
        // ==================================================

        const sortedInventory =
            [...inventory].sort(
                (a, b) => {

                    return (
                        getFishPrice(
                            a.fish
                        ) -
                        getFishPrice(
                            b.fish
                        )
                    );

                }
            );

        // ==================================================
        // BÁN
        // ==================================================

        for (
            const item
            of sortedInventory
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

            const pricePerKg =
                getFishPrice(
                    item.fish
                );

            let itemKg = 0;

            let itemMoney = 0;

            // ==================================================
            // LẤY CÁ TỪ CUỐI
            // ==================================================

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
                    !Number.isFinite(
                        weight
                    )
                ) {
                    continue;
                }

                itemKg +=
                    weight;

                itemMoney +=
                    weight *
                    pricePerKg;
            }

            itemMoney =
                Math.floor(
                    itemMoney
                );

            // ==================================================
            // XÓA
            // ==================================================

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

            // ==================================================
            // SUMMARY
            // ==================================================

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

        // ==================================================
        // KHÔNG BÁN ĐƯỢC
        // ==================================================

        if (
            totalFishSold <= 0
        ) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor(
                            "#ff6b81"
                        )

                        .setTitle(
                            "❌ `SELL FAILED`"
                        )

                        .setDescription(
                            "Không có cá hợp lệ để bán."
                        )

                        .setFooter({

                            text:
                                "✦ Fishing Adventure"

                        })
                ]
            });
        }

        // ==================================================
        // FIX TIỀN
        // ==================================================

        totalMoney =
            Math.floor(
                totalMoney
            );

        // ==================================================
        // CỘNG TIỀN
        // ==================================================

        user.money +=
            totalMoney;

        // ==================================================
        // SAVE
        // ==================================================

        save();

        // ==================================================
        // SUMMARY TEXT
        // ==================================================

        const summaryText =
            soldSummary
                .map(
                    item =>

                        `${item.fish.emoji || "🐟"} ` +
                        `${item.fish.name} x${item.count} ` +
                        `· ${item.kg.toFixed(2)} KG ` +
                        `· ${formatMoney(item.money)} xu`
                )
                .join("\n");

        // ==================================================
        // RESULT
        // ==================================================

        return message.reply({

            embeds: [

                new EmbedBuilder()

                    .setColor(
                        "#A0E7E5"
                    )

                    .setTitle(
                        "💰 `SELL COMPLETE`"
                    )

                    .setDescription(

                        `🐟 **Đã bán ${totalFishSold} con cá**\n\n` +

                        `${summaryText}\n\n` +

                        `⚖️ Tổng cân nặng: **${totalKg.toFixed(2)} KG**\n\n` +

                        `💰 Tiền nhận: **+${formatMoney(totalMoney)} ${emoji.money}**\n` +

                        `💳 Số dư: **${formatMoney(user.money)} ${emoji.money}**`

                    )

                    .setFooter({

                        text:
                            "✦ Fishing Adventure · Fish Market"

                    })

                    .setTimestamp()

            ]
        });
    }
};
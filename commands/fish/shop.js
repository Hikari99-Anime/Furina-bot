const {
    EmbedBuilder
} = require("discord.js");

const {
    rods,
    baits,
    keys,
    insurance,
    rateStone,
    emoji,
    formatMoney,
    prefix
} = require("../../config");

const {
    getUser,
    save
} = require("../../data");

// ======================================================
// PURCHASE
// ======================================================

function purchase(
    user,
    id,
    amount
) {

    // ==================================================
    // CHECK AMOUNT
    // ==================================================

    if (
        !Number.isInteger(amount) ||
        amount <= 0
    ) {

        return {
            ok: false,
            reason:
                "╰・❌ Số lượng không hợp lệ"
        };
    }

    // ==================================================
    // TÌM ITEM
    // ==================================================

    let item;
    let type;

    // --------------------------------------------------
    // ROD
    // --------------------------------------------------

    if (
        rods?.[id]
    ) {

        item =
            rods[id];

        type =
            "rod";
    }

    // --------------------------------------------------
    // BAIT
    // --------------------------------------------------

    else if (
        baits?.[id]
    ) {

        item =
            baits[id];

        type =
            "bait";
    }

    // --------------------------------------------------
    // KEY
    // --------------------------------------------------

    else if (
        keys?.[id]
    ) {

        item =
            keys[id];

        type =
            "key";
    }

    // --------------------------------------------------
    // INSURANCE
    // --------------------------------------------------

    else if (
        insurance?.[id]
    ) {

        item =
            insurance[id];

        type =
            "insurance";
    }

    // --------------------------------------------------
    // RATE STONE
    // --------------------------------------------------

    else if (
        rateStone?.[id]
    ) {

        item =
            rateStone[id];

        type =
            "rateStone";
    }

    // ==================================================
    // KHÔNG TÌM THẤY
    // ==================================================

    else {

        return {
            ok: false,
            reason:
                "╰・❌ Không tìm thấy vật phẩm"
        };
    }

    // ==================================================
    // CẦN CÂU
    // ==================================================

    if (
        type === "rod"
    ) {

        if (
            amount !== 1
        ) {

            return {
                ok: false,
                reason:
                    "╰・❌ Cần câu chỉ mua được 1 cái mỗi lần"
            };
        }

        const daSoHuu =
            user.can &&
            user.can.danhSach &&
            user.can.danhSach[id];

        const daGay =
            daSoHuu &&
            user.rodData &&
            user.rodData[id] &&
            user.rodData[id].destroyed;

        if (
            daSoHuu &&
            !daGay
        ) {

            return {
                ok: false,
                reason:
                    "╰・❌ Bạn đã sở hữu cần này rồi"
            };
        }
    }

    // ==================================================
    // GIÁ
    // ==================================================

    const price =
        Number(item.price || 0) *
        amount;

    // ==================================================
    // CHECK MONEY
    // ==================================================

    if (
        Number(user.money || 0) <
        price
    ) {

        return {
            ok: false,

            reason:
                `╰・❌ Bạn cần ${formatMoney(price)} ${emoji.money} để mua`,

            price
        };
    }

    // ==================================================
    // TRỪ TIỀN
    // ==================================================

    user.money -=
        price;

    // ==================================================
    // MUA CẦN
    // ==================================================

    if (
        type === "rod"
    ) {

        if (
            !user.can
        ) {

            user.can = {

                dangDung: null,

                danhSach: {}

            };
        }

        if (
            !user.can.danhSach
        ) {

            user.can.danhSach = {};
        }

        if (
            !user.rodData
        ) {

            user.rodData = {};
        }

        user.can.danhSach[id] =
            1;

        user.rodData[id] = {

            level:
                0,

            luck:
                Number(
                    item.luck
                ) || 1,

            uses:
                Number(
                    item.uses
                ) || 1,

            maxUses:
                Number(
                    item.uses
                ) || 1,

            destroyed:
                false

        };

        if (
            !user.can.dangDung
        ) {

            user.can.dangDung =
                id;
        }
    }

    // ==================================================
    // MUA MỒI
    // ==================================================

    if (
        type === "bait"
    ) {

        if (
            !user.moi
        ) {

            user.moi = {};
        }

        user.moi[id] =
            (
                Number(
                    user.moi[id]
                ) || 0
            ) +
            amount;
    }

    // ==================================================
    // MUA KEY
    // ==================================================

    if (
        type === "key"
    ) {

        if (
            !user.keys
        ) {

            user.keys = {};
        }

        user.keys[id] =
            (
                Number(
                    user.keys[id]
                ) || 0
            ) +
            amount;
    }

    // ==================================================
    // MUA BẢO HIỂM
    // ==================================================

    if (
        type === "insurance"
    ) {

        user.insurance =
            (
                Number(
                    user.insurance
                ) || 0
            ) +
            amount;
    }

    // ==================================================
    // MUA ĐÁ TĂNG RATE
    // ==================================================

    if (
        type === "rateStone"
    ) {

        if (
            !user.rateStone
        ) {

            user.rateStone = {

                count:
                    0,

                uses:
                    0

            };
        }

        // Nếu data cũ chỉ là số
        if (
            typeof user.rateStone ===
            "number"
        ) {

            user.rateStone = {

                count:
                    Number(
                        user.rateStone
                    ) || 0,

                uses:
                    0

            };
        }

        user.rateStone.count =
            (
                Number(
                    user.rateStone.count
                ) || 0
            ) +
            amount;

        // Nếu chưa có đá đang dùng
        // thì viên đầu tiên có 5 lượt
        if (
            Number(
                user.rateStone.uses
            ) <= 0
        ) {

            user.rateStone.uses =
                Number(
                    item.uses
                ) || 5;
        }
    }

    // ==================================================
    // SAVE
    // ==================================================

    save();

    // ==================================================
    // RESULT
    // ==================================================

    return {

        ok:
            true,

        item,

        type,

        price

    };
}

// ======================================================
// MODULE
// ======================================================

module.exports = {

    name:
        "buy",

    aliases: [
        "b"
    ],

    purchase,

    async execute(
        message,
        args
    ) {

        const user =
            getUser(
                message.author.id
            );

        const id =
            args?.[0];

        const amount =
            Number(
                args?.[1] || 1
            );

        // ==================================================
        // NO ID
        // ==================================================

        if (
            !id
        ) {

            return message.reply({

                content:
                    `╰・❌ Dùng: ${prefix}buy <id> <số lượng>`

            });
        }

        // ==================================================
        // PURCHASE
        // ==================================================

        const result =
            purchase(
                user,
                id,
                amount
            );

        if (
            !result.ok
        ) {

            return message.reply(
                result.reason
            );
        }

        const {
            item,
            type,
            price
        } =
            result;

        // ==================================================
        // EXTRA TEXT
        // ==================================================

        let extraText =
            "";

        if (
            type ===
            "rateStone"
        ) {

            extraText =
                `\n🪨 Mỗi viên có **5 lượt**` +
                `\n📈 Mỗi lượt tăng **+5% tỉ lệ**`;
        }

        // ==================================================
        // EMBED
        // ==================================================

        const embed =
            new EmbedBuilder()

                .setColor(
                    "#9affb0"
                )

                .setTitle(
                    "╭・🛒 Mua thành công"
                )

                .setDescription(

                    `${item.emoji} ${item.name}\n\n` +

                    `╭・📦 Số lượng: x${amount}\n` +

                    `╭・💸 Đã trả: ${formatMoney(
                        price
                    )} ${emoji.money}\n` +

                    `╰・💰 Số dư: ${formatMoney(
                        user.money
                    )} ${emoji.money}` +

                    extraText

                )

                .setFooter({

                    text:
                        "✦ Fishing Adventure"

                });

        return message.reply({

            embeds: [
                embed
            ]

        });
    }
};
const {
    rods,
    baits,
    keys,
    insurance,
    rateStone,
    emoji,
    formatMoney
} = require("../../config");

const {
    getUser,
    save
} = require("../../data");

// ======================================================
// HELPERS
// ======================================================

function num(value, fallback = 0) {
    const n = Number(value);

    return Number.isFinite(n)
        ? n
        : fallback;
}

function getPrice(item) {
    return Math.max(
        0,
        num(item?.price, 0)
    );
}

function getUses(item) {
    return Math.max(
        1,
        num(item?.uses, 1)
    );
}

function getMoney(user) {
    return Math.max(
        0,
        num(user?.money, 0)
    );
}

// ======================================================
// FIND ITEM
// ======================================================

function findItem(id) {

    if (!id) {
        return null;
    }

    // --------------------------------------------------
    // ROD
    // --------------------------------------------------

    if (rods?.[id]) {
        return {
            item: rods[id],
            type: "rod"
        };
    }

    // --------------------------------------------------
    // BAIT
    // --------------------------------------------------

    if (baits?.[id]) {
        return {
            item: baits[id],
            type: "bait"
        };
    }

    // --------------------------------------------------
    // KEY
    // --------------------------------------------------

    if (keys?.[id]) {
        return {
            item: keys[id],
            type: "key"
        };
    }

    // --------------------------------------------------
    // INSURANCE
    // --------------------------------------------------

    if (insurance?.[id]) {
        return {
            item: insurance[id],
            type: "insurance"
        };
    }

    // --------------------------------------------------
    // RATE STONE
    // --------------------------------------------------

    if (rateStone?.[id]) {
        return {
            item: rateStone[id],
            type: "rateStone"
        };
    }

    return null;
}

// ======================================================
// ITEM NAME
// ======================================================

function itemName(
    item,
    id
) {
    return (
        item?.name ||
        id
    );
}

function itemEmoji(
    item
) {
    return (
        item?.emoji ||
        "📦"
    );
}

// ======================================================
// PURCHASE
// ======================================================

function purchase(
    user,
    id,
    amount
) {

    // ==================================================
    // USER
    // ==================================================

    if (!user) {
        return {
            ok: false,
            reason:
                "╰・❌ Không tìm thấy dữ liệu người chơi"
        };
    }

    // ==================================================
    // AMOUNT
    // ==================================================

    amount =
        Number(amount);

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
    // FIND ITEM
    // ==================================================

    const found =
        findItem(id);

    if (!found) {

        return {
            ok: false,
            reason:
                "╰・❌ Không tìm thấy vật phẩm"
        };
    }

    const {
        item,
        type
    } = found;

    // ==================================================
    // ROD CHECK
    // ==================================================

    if (
        type === "rod"
    ) {

        // Cần chỉ mua từng cái
        if (
            amount !== 1
        ) {

            return {
                ok: false,
                reason:
                    "╰・❌ Cần câu chỉ mua được 1 cái mỗi lần"
            };
        }

        user.can ??= {};
        user.can.danhSach ??= {};
        user.rodData ??= {};

        const owned =
            Boolean(
                user.can.danhSach[id]
            );

        const oldRod =
            user.rodData[id];

        // ------------------------------------------------
        // KIỂM TRA CẦN ĐÃ GÃY
        // ------------------------------------------------

        const broken =
            owned &&
            (
                oldRod?.destroyed === true ||
                num(
                    oldRod?.uses,
                    0
                ) <= 0
            );

        // ------------------------------------------------
        // ĐÃ CÓ VÀ CHƯA GÃY
        // ------------------------------------------------

        if (
            owned &&
            !broken
        ) {

            return {
                ok: false,
                reason:
                    "╰・❌ Bạn đã sở hữu cần này rồi, chỉ có thể mua lại khi cần bị hỏng (độ bền = 0)"
            };
        }
    }

    // ==================================================
    // PRICE
    // ==================================================

    const unitPrice =
        getPrice(item);

    const price =
        unitPrice *
        amount;

    // ==================================================
    // MONEY
    // ==================================================

    const money =
        getMoney(user);

    if (
        money <
        price
    ) {

        return {
            ok: false,

            reason:
                `╰・❌ Bạn cần ${formatMoney(price)} ${emoji.money} để mua`,

            price,

            unitPrice,

            amount
        };
    }

    // ==================================================
    // TRỪ TIỀN
    // ==================================================

    user.money =
        money -
        price;

    // ==================================================
    // ROD
    // ==================================================

    if (
        type === "rod"
    ) {

        user.can ??= {};

        user.can.dangDung ??= null;

        user.can.danhSach ??= {};

        user.rodData ??= {};

        // ------------------------------------------------
        // ĐÁNH DẤU SỞ HỮU
        // ------------------------------------------------

        user.can.danhSach[id] =
            1;

        const maxUses =
            getUses(item);

        const oldRod =
            user.rodData[id];

        // ------------------------------------------------
        // MUA LẠI CẦN ĐÃ GÃY
        // ------------------------------------------------

        if (
            oldRod
        ) {

            // Giữ nguyên cấp
            oldRod.level =
                Math.max(
                    0,
                    num(
                        oldRod.level,
                        0
                    )
                );

            // Giữ nguyên luck
            oldRod.luck =
                Math.max(
                    0,
                    num(
                        oldRod.luck,
                        item.luck ?? 0
                    )
                );

            // Hồi full độ bền
            oldRod.uses =
                maxUses;

            oldRod.maxUses =
                maxUses;

            oldRod.destroyed =
                false;
        }

        // ------------------------------------------------
        // CẦN MỚI
        // ------------------------------------------------

        else {

            user.rodData[id] = {

                level:
                    0,

                luck:
                    Math.max(
                        0,
                        num(
                            item.luck,
                            0
                        )
                    ),

                uses:
                    maxUses,

                maxUses:
                    maxUses,

                destroyed:
                    false
            };
        }

        // ------------------------------------------------
        // TỰ ĐỘNG TRANG BỊ NẾU CHƯA CÓ
        // ------------------------------------------------

        if (
            !user.can.dangDung
        ) {

            user.can.dangDung =
                id;
        }
    }

    // ==================================================
    // BAIT
    // ==================================================

    else if (
        type === "bait"
    ) {

        user.moi ??= {};

        user.moi[id] =
            num(
                user.moi[id],
                0
            ) +
            amount;
    }

    // ==================================================
    // KEY
    // ==================================================

    else if (
        type === "key"
    ) {

        user.keys ??= {};

        user.keys[id] =
            num(
                user.keys[id],
                0
            ) +
            amount;
    }

    // ==================================================
    // INSURANCE
    // ==================================================

    else if (
        type === "insurance"
    ) {

        user.insurance =
            num(
                user.insurance,
                0
            ) +
            amount;
    }

    // ==================================================
    // RATE STONE
    // ==================================================

    else if (
        type === "rateStone"
    ) {

        user.items ??= {};

        // Dùng chung với:
        // commands/fish/upgrade.js
        // RATE_STONE_ID = "da_rate"

        user.items.da_rate =
            num(
                user.items.da_rate,
                0
            ) +
            amount;
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

        id,

        amount,

        price,

        unitPrice
    };
}

// ======================================================
// COMMAND
// ======================================================

module.exports = {

    name: "buy",

    aliases: [
        "b",
        "fbuy"
    ],

    // ==================================================
    // EXECUTE
    // ==================================================

    async execute(
        message,
        args
    ) {

        try {

            // ==================================================
            // USER
            // ==================================================

            const userID =
                message.author.id;

            const user =
                getUser(
                    userID
                );

            if (!user) {

                return message.reply(
                    "❌ Không tìm thấy dữ liệu người chơi."
                );
            }

            // ==================================================
            // ARGUMENT
            // ==================================================

            const id =
                args?.[0];

            if (!id) {

                return message.reply(
                    [
                        "╭・🛒 **MUA VẬT PHẨM**",
                        "│",
                        "│ Cú pháp:",
                        "│ `buy <id> <số lượng>`",
                        "│",
                        "│ Ví dụ:",
                        "│ `buy moi_thuong 10`",
                        "│ `buy can_1 1`",
                        "╰・💡 Bạn cũng có thể mua trực tiếp bằng nút trong shop."
                    ].join("\n")
                );
            }

            // ==================================================
            // AMOUNT
            // ==================================================

            let amount = 1;

            if (
                args?.[1] !== undefined
            ) {

                amount =
                    Number(
                        args[1]
                    );
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

            // ==================================================
            // FAILED
            // ==================================================

            if (!result.ok) {

                return message.reply(
                    result.reason
                );
            }

            // ==================================================
            // SUCCESS DATA
            // ==================================================

            const item =
                result.item;

            const name =
                itemName(
                    item,
                    id
                );

            const icon =
                itemEmoji(
                    item
                );

            const remainingMoney =
                getMoney(
                    user
                );

            // ==================================================
            // ROD SUCCESS
            // ==================================================

            if (
                result.type === "rod"
            ) {

                const rod =
                    user.rodData?.[id];

                return message.reply({

                    content:
                        [
                            "╭・🎣 **MUA CẦN THÀNH CÔNG**",
                            "│",
                            `│ ${icon} **${name}**`,
                            `│ ⭐ Cấp: **${num(rod?.level, 0)}**`,
                            `│ 🍀 Luck: **${num(rod?.luck, 0)}**`,
                            `│ 🛠️ Độ bền: **${num(rod?.uses, 0)}/${num(rod?.maxUses, 0)}**`,
                            "│",
                            `│ 💰 Đã trả: **${formatMoney(result.price)}** ${emoji.money}`,
                            `│ 💳 Còn lại: **${formatMoney(remainingMoney)}** ${emoji.money}`,
                            "╰・🎣 Cần đã được thêm vào kho."
                        ].join("\n")
                });
            }

            // ==================================================
            // NORMAL ITEM SUCCESS
            // ==================================================

            return message.reply({

                content:
                    [
                        "╭・🛒 **MUA HÀNG THÀNH CÔNG**",
                        "│",
                        `│ ${icon} **${name}** x${result.amount}`,
                        "│",
                        `│ 💰 Đã trả: **${formatMoney(result.price)}** ${emoji.money}`,
                        `│ 💳 Còn lại: **${formatMoney(remainingMoney)}** ${emoji.money}`,
                        "╰・✅ Vật phẩm đã được thêm vào túi."
                    ].join("\n")
            });

        } catch (error) {

            console.error(
                "❌ BUY COMMAND ERROR:",
                error
            );

            try {

                return message.reply(
                    "❌ Đã xảy ra lỗi khi mua vật phẩm."
                );

            } catch {}
        }
    },

    // ==================================================
    // EXPORT PURCHASE
    // ==================================================

    purchase
};
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

        const rodDataCu =
            user.rodData &&
            user.rodData[id];

        const daGay =
            daSoHuu &&
            rodDataCu &&
            (
                rodDataCu.destroyed ||
                Number(rodDataCu.uses) <= 0
            );

        if (
            daSoHuu &&
            !daGay
        ) {

            return {
                ok: false,
                reason:
                    "╰・❌ Bạn đã sở hữu cần này rồi, chỉ có thể mua lại khi cần bị hỏng (độ bền = 0)"
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

        const rodDataCu =
            user.rodData[id];

        if (
            rodDataCu
        ) {

            // Mua lại cần đã hỏng: giữ nguyên cấp độ & luck, chỉ hồi độ bền
            rodDataCu.uses =
                Number(
                    item.uses
                ) || 1;

            rodDataCu.maxUses =
                Number(
                    item.uses
                ) || 1;

            rodDataCu.destroyed =
                false;

        } else {

            // Chưa từng sở hữu: khởi tạo mặc định
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
        }

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

        // Dùng chung ô lưu trữ với commands/fish/upgrade.js (RATE_STONE_ID = "da_rate")
        if (
            !user.items
        ) {

            user.items = {};
        }

        user.items.da_rate =
            (
                Number(
                    user.items.da_rate
                ) || 0
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

        price

    };
}

// ======================================================
// MODULE
//
// Không còn là lệnh gõ tay (fbuy/fb) — mua vật phẩm giờ
// chỉ thực hiện qua nút bấm trong fshop. purchase() vẫn
// được export vì index.js (xử lý nút bấm shop) cần dùng.
// ======================================================

module.exports = {

    purchase

};
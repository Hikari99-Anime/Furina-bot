const fs = require("fs");
const path = require("path");

const { rods } = require("./config");

// ======================================================
// DATA FILE
// ======================================================

const filePath = path.join(
    __dirname,
    "data.json"
);

let data = {};

// ======================================================
// LOAD DATA
// ======================================================

if (fs.existsSync(filePath)) {

    try {

        data = JSON.parse(
            fs.readFileSync(
                filePath,
                "utf8"
            )
        );

        console.log("✅ DATA LOADED");

    } catch (err) {

        console.log(
            "⚠️ Data lỗi, tạo dữ liệu mới."
        );

        data = {};

    }

}

// ======================================================
// SAVE DATA
// ======================================================

function save() {

    try {

        fs.writeFileSync(
            filePath,
            JSON.stringify(
                data,
                null,
                2
            )
        );

        console.log(
            "💾 DATA SAVED"
        );

    } catch (err) {

        console.log(
            "❌ SAVE ERROR:",
            err
        );

    }

}

// ======================================================
// TẠO USER MỚI
// ======================================================

function createUser() {

    return {

        money: 10000,

        level: 1,

        exp: 0,

        can: {

            dangDung: null,

            danhSach: {}

        },

        moi: {

            worm: 10

        },

        fish: {},

        keys: {},

        chests: {},

        insurance: 0,

        inv: {},

        daily: {

            last: 0,

            streak: 0

        },

        quest: {

            date: "",

            list: [],

            claim: false

        },

        rodData: {},

        stats: {

            catch: 0,

            sell: 0,

            kg: 0

        }

    };

}

// ======================================================
// GET USER
// ======================================================

function getUser(userID) {

    if (!data[userID]) {

        data[userID] =
            createUser();

        save();

    }

    const user =
        data[userID];

    // ==================================================
    // FIX MONEY
    // ==================================================

    if (
        typeof user.money !== "number" ||
        Number.isNaN(user.money)
    ) {

        user.money = 10000;

    }

    // ==================================================
    // FIX LEVEL
    // ==================================================

    if (
        typeof user.level !== "number"
    ) {

        user.level = 1;

    }

    if (
        typeof user.exp !== "number"
    ) {

        user.exp = 0;

    }

    // ==================================================
    // FIX CẦN
    // ==================================================

    if (!user.can) {

        user.can = {

            dangDung: null,

            danhSach: {}

        };

    }

    if (
        typeof user.can.danhSach !== "object" ||
        user.can.danhSach === null
    ) {

        user.can.danhSach = {};

    }

    // ==================================================
    // FIX MỒI
    // ==================================================

    if (!user.moi) {

        user.moi = {

            worm: 10

        };

    }

    // ==================================================
    // MIGRATE MỒI CŨ
    // ==================================================

    if (
        Number(user.moi.moithuong) > 0
    ) {

        user.moi.worm =
            (Number(user.moi.worm) || 0) +
            Number(user.moi.moithuong);

        user.moi.moithuong = 0;

    }

    if (
        Number(user.moi.moibac) > 0
    ) {

        user.moi.shrimp =
            (Number(user.moi.shrimp) || 0) +
            Number(user.moi.moibac);

        user.moi.moibac = 0;

    }

    if (
        Number(user.moi.moivang) > 0
    ) {

        user.moi.golden_bait =
            (Number(user.moi.golden_bait) || 0) +
            Number(user.moi.moivang);

        user.moi.moivang = 0;

    }

    // ==================================================
    // FIX FISH
    // ==================================================

    if (!user.fish) {

        user.fish = {};

    }

    // ==================================================
    // FIX KEYS
    // ==================================================

    if (!user.keys) {

        user.keys = {};

    }

    // ==================================================
    // FIX CHESTS
    // ==================================================

    if (!user.chests) {

        user.chests = {};

    }

    // ==================================================
    // FIX INSURANCE
    // ==================================================

    if (
        typeof user.insurance !== "number"
    ) {

        user.insurance = 0;

    }

    // ==================================================
    // FIX INVENTORY
    // ==================================================

    if (!user.inv) {

        user.inv = {};

    }

    // ==================================================
    // FIX ROD DATA
    // ==================================================

    if (!user.rodData) {

        user.rodData = {};

    }

    // ==================================================
    // KIỂM TRA CẦN ĐANG DÙNG
    // ==================================================

    if (
        user.can.dangDung &&
        !user.rodData[user.can.dangDung]
    ) {

        const base =
            rods?.[
                user.can.dangDung
            ];

        if (base) {

            user.rodData[
                user.can.dangDung
            ] = {

                level: 0,

                luck:
                    Number(
                        base.luck || 0
                    ),

                uses:
                    Number(
                        base.uses || 0
                    ),

                maxUses:
                    Number(
                        base.uses || 0
                    ),

                destroyed: false

            };

        } else {

            user.can.dangDung =
                null;

        }

        save();

    }

    // ==================================================
    // FIX DAILY
    // ==================================================

    if (
        typeof user.daily === "number"
    ) {

        user.daily = {

            last:
                user.daily,

            streak: 0

        };

    }

    if (!user.daily) {

        user.daily = {

            last: 0,

            streak: 0

        };

    }

    if (
        typeof user.daily.last !== "number"
    ) {

        user.daily.last = 0;

    }

    if (
        typeof user.daily.streak !== "number"
    ) {

        user.daily.streak = 0;

    }

    // ==================================================
    // FIX QUEST
    // ==================================================

    if (!user.quest) {

        user.quest = {

            date: "",

            list: [],

            claim: false

        };

    }

    if (
        typeof user.quest.date !== "string"
    ) {

        user.quest.date = "";

    }

    if (
        !Array.isArray(
            user.quest.list
        )
    ) {

        user.quest.list = [];

    }

    if (
        typeof user.quest.claim !== "boolean"
    ) {

        user.quest.claim = false;

    }

    // ==================================================
    // FIX STATS
    // ==================================================

    if (!user.stats) {

        user.stats = {

            catch: 0,

            sell: 0,

            kg: 0

        };

    }

    if (
        typeof user.stats.catch !== "number"
    ) {

        user.stats.catch = 0;

    }

    if (
        typeof user.stats.sell !== "number"
    ) {

        user.stats.sell = 0;

    }

    if (
        typeof user.stats.kg !== "number"
    ) {

        user.stats.kg = 0;

    }

    return user;

}

// ======================================================
// EXPORT
// ======================================================

module.exports = {

    getUser,

    save,

    data

};
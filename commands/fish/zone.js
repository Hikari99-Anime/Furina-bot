const {
    EmbedBuilder
} = require("discord.js");

const {
    fishingZones
} = require("../../config");

// ======================================================
// DIVIDER
// ======================================================

const DIVIDER =
    "୨୧ ───────── ୨୧";

// ======================================================
// FOOTER
// ======================================================

const FOOTER =
    "✦ Fishing Adventure · Fishing Zone";

// ======================================================
// LỜI CHÚC / TEXT THEO VÙNG
// ======================================================

const ZONE_QUOTES = {

    tropical:
        "Hãy tận hưởng những con sóng dịu dàng này.",

    cold:
        "Giữ ấm nhé, những chú cá nơi đây rất đáng giá.",

    swamp:
        "Cẩn thận với đầm lầy... nơi này luôn ẩn chứa điều bất ngờ.",

    deep:
        "Biển sâu đang chờ đợi những ngư dân gan dạ.",

    volcano:
        "Furina chúc phúc cho chuyến câu của bạn giữa biển lửa."

};

// ======================================================
// LẤY KEY VÙNG
// ======================================================

function getZoneKey(zone) {

    if (!zone) {
        return "tropical";
    }

    for (
        const key of Object.keys(fishingZones || {})
    ) {

        if (
            fishingZones[key] === zone
        ) {

            return key;
        }
    }

    return "tropical";
}

// ======================================================
// RANDOM VÙNG MỖI 4 GIỜ
// ======================================================

function getCurrentZone() {

    const now =
        new Date();

    // ==================================================
    // CHỦ NHẬT → VOLCANO
    // ==================================================

    if (
        now.getDay() === 0 &&
        fishingZones.volcano
    ) {

        return fishingZones.volcano;
    }

    // ==================================================
    // CÁC VÙNG BÌNH THƯỜNG
    // ==================================================

    const zones = [

        fishingZones.tropical,
        fishingZones.cold,
        fishingZones.swamp,
        fishingZones.deep

    ].filter(Boolean);

    if (
        zones.length === 0
    ) {

        return null;
    }

    /*
     * Mỗi vùng hoạt động 4 giờ:
     *
     * 00:00 → 04:00
     * 04:00 → 08:00
     * 08:00 → 12:00
     * 12:00 → 16:00
     * 16:00 → 20:00
     * 20:00 → 00:00
     *
     * Random dựa trên ngày + khung giờ.
     *
     * Vì không dùng Math.random() trực tiếp
     * nên bot restart cũng không làm đổi vùng.
     */

    const slot =
        Math.floor(
            now.getHours() / 4
        );

    // Số ngày tính từ Unix Epoch
    const day =
        Math.floor(
            now.getTime() / 86400000
        );

    // Seed cố định cho từng khung 4 giờ
    let seed =
        day * 6 +
        slot;

    // Pseudo-random
    seed =
        (seed * 9301 + 49297) % 233280;

    const index =
        Math.floor(
            (seed / 233280) *
            zones.length
        );

    return zones[index];
}

// ======================================================
// THỜI GIAN ĐẾN LẦN ĐỔI TIẾP
// ======================================================

function getNextChange() {

    const now =
        new Date();

    const currentHour =
        now.getHours();

    /*
     * Các mốc đổi vùng:
     *
     * 00:00
     * 04:00
     * 08:00
     * 12:00
     * 16:00
     * 20:00
     */

    const nextHour =
        (
            Math.floor(
                currentHour / 4
            ) + 1
        ) * 4;

    const next =
        new Date(now);

    // ==================================================
    // QUA NGÀY MỚI
    // ==================================================

    if (
        nextHour >= 24
    ) {

        next.setDate(
            next.getDate() + 1
        );

        next.setHours(
            0,
            0,
            0,
            0
        );

    } else {

        next.setHours(
            nextHour,
            0,
            0,
            0
        );
    }

    // ==================================================
    // TÍNH THỜI GIAN CÒN LẠI
    // ==================================================

    const diff =
        Math.max(
            0,
            next.getTime() -
            now.getTime()
        );

    const totalMinutes =
        Math.floor(
            diff / 60000
        );

    const hours =
        Math.floor(
            totalMinutes / 60
        );

    const minutes =
        totalMinutes % 60;

    if (
        hours <= 0
    ) {

        return `${minutes} phút`;
    }

    return `${hours} giờ ${minutes} phút`;
}

// ======================================================
// MODULE
// ======================================================

module.exports = {

    name: "zone",

    aliases: [
        "vung",
        "khu"
    ],

    async execute(message) {

        // ==================================================
        // ZONE
        // ==================================================

        const zone =
            getCurrentZone();

        if (!zone) {

            return message.reply(
                "❌ Không tìm thấy khu vực câu cá."
            );
        }

        // ==================================================
        // DATA
        // ==================================================

        const zoneKey =
            getZoneKey(zone);

        const fishCount =
            Array.isArray(zone.fish)
                ? zone.fish.length
                : 0;

        const nextChange =
            getNextChange();

        const nowTimestamp =
            Math.floor(
                Date.now() / 1000
            );

        const quote =
            ZONE_QUOTES[zoneKey] ||
            "Chúc bạn có một chuyến câu thật may mắn.";

        // ==================================================
        // EMBED
        // ==================================================

        const embed =
            new EmbedBuilder()

                .setColor(
                    zone.color ||
                    "#7DDCFF"
                )

                .setTitle(
                    `${DIVIDER}`
                )

                .setDescription(

                    `🌊 **${zone.name || "FISHING ZONE"}**\n` +

                    (
                        zone.description
                            ? `*${zone.description}*\n\n`
                            : "\n"
                    ) +

                    `🐟 Cá: **${fishCount} loại**\n` +

                    `⏰ Đổi vùng: **${nextChange}**\n` +

                    `🕐 Hiện tại: <t:${nowTimestamp}:R>\n\n` +

                    `*“${quote}”*\n\n` +

                    `${DIVIDER}`

                )

                .setFooter({
                    text:
                        FOOTER
                })

                .setTimestamp();

        // ==================================================
        // ẢNH
        // ==================================================

        if (
            zone.image
        ) {

            embed.setImage(
                zone.image
            );
        }

        // ==================================================
        // REPLY
        // ==================================================

        return message.reply({

            embeds: [
                embed
            ]

        });
    }
};
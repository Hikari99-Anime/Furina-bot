const {
    EmbedBuilder
} = require("discord.js");

const {
    fishingZones
} = require("../../config");

// ======================================================
// LẤY VÙNG HIỆN TẠI
// ======================================================

function getCurrentZone() {

    const now =
        new Date();

    // Chủ nhật → Núi lửa
    if (
        now.getDay() === 0
    ) {
        return fishingZones.volcano;
    }

    const zones = [
        fishingZones.tropical,
        fishingZones.cold,
        fishingZones.swamp,
        fishingZones.deep
    ];

    const index =
        Math.floor(
            now.getHours() / 6
        );

    return zones[
        index % zones.length
    ];
}

// ======================================================
// THỜI GIAN ĐỔI VÙNG
// ======================================================

function getNextChange() {

    const now =
        new Date();

    const nextHour =
        (
            Math.floor(
                now.getHours() / 6
            ) + 1
        ) * 6;

    let hours =
        nextHour -
        now.getHours();

    let minutes =
        60 -
        now.getMinutes();

    if (
        now.getMinutes() === 0
    ) {
        minutes = 0;
    }

    if (
        minutes === 60
    ) {
        minutes = 0;
        hours++;
    }

    if (
        hours >= 24
    ) {
        hours -= 24;
    }

    if (
        hours === 0 &&
        minutes === 0
    ) {
        return "Sắp đổi";
    }

    if (
        hours > 0
    ) {
        return `${hours} giờ ${minutes} phút`;
    }

    return `${minutes} phút`;
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

        const zone =
            getCurrentZone();

        if (!zone) {

            return message.reply(
                "❌ Không tìm thấy khu vực câu cá."
            );

        }

        const fishCount =
            Array.isArray(zone.fish)
                ? zone.fish.length
                : 0;

        const nextChange =
            getNextChange();

        // ==================================================
        // EMBED THÔNG TIN
        // ==================================================

        const infoEmbed =
            new EmbedBuilder()

                .setColor("#7ddcff")

                .setTitle(
                    "🌍 `FISHING ZONE`"
                )

                .setDescription(

                    `${zone.name}\n` +
                    `${zone.description}\n\n` +

                    `🐟 Cá: ${fishCount} loại\n` +
                    `⏰ Đổi vùng: ${nextChange}\n` +
                    `🕐 Hiện tại: <t:${Math.floor(Date.now() / 1000)}:R>\n\n` +

                    `✦ *Hãy chọn thời điểm thích hợp để câu cá.*`

                )

                .setFooter({
                    text:
                        "✦ Fishing Adventure · Fishing Zone"
                })

                .setTimestamp();

        // ==================================================
        // EMBED ẢNH
        // ==================================================

        const imageEmbed =
            new EmbedBuilder()
                .setColor("#7ddcff");

        if (
            zone.image
        ) {

            imageEmbed.setImage(
                zone.image
            );

        }

        // ==================================================
        // GỬI
        // ==================================================

        return message.reply({

            embeds: [

                infoEmbed,
                imageEmbed

            ]

        });
    }
};
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

    const now = new Date();

    // Chủ nhật → Núi lửa
    if (now.getDay() === 0)
        return fishingZones.volcano;

    const zones = [
        fishingZones.tropical,
        fishingZones.cold,
        fishingZones.swamp,
        fishingZones.deep
    ];

    const index =
        Math.floor(now.getHours() / 6);

    return zones[index % zones.length];
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

        const now =
            new Date();

        // Mốc đổi vùng tiếp theo
        const nextHour =
            (Math.floor(now.getHours() / 6) + 1) * 6;

        const remain =
            nextHour - now.getHours();

        const embed =
            new EmbedBuilder()

                .setColor("#7ddcff")

                .setTitle(
                    "🌍 KHU VỰC CÂU CÁ"
                )

                .setDescription(
                    `${zone.name}\n` +
                    `${zone.description}\n\n` +

                    `🐟 Cá: ${zone.fish.length} loại\n` +
                    `⏰ Đổi vùng: ${remain} giờ\n` +
                    `🕐 Thời gian: <t:${Math.floor(Date.now() / 1000)}:R>`
                )

                .setImage(
                    zone.image
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
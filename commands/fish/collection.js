const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const {
    fishList,
    fishingZones
} = require("../../config");

const {
    getUser
} = require("../../data");

const zoneColors = {
    tropical: "#2ecc71",
    cold: "#3498db",
    swamp: "#1abc9c",
    deep: "#9b59b6",
    volcano: "#e74c3c"
};

const zoneEmojis = {
    tropical: "🌴",
    cold: "❄️",
    swamp: "🌿",
    deep: "🌌",
    volcano: "🌋"
};

module.exports = {
    name: "collection",

    aliases: [
        "coll",
        "bosuutap",
        "bst"
    ],

    async execute(message) {

        const user = getUser(
            message.author.id
        );

        const fishMap = new Map(
            fishList.map(f => [
                f.id,
                f
            ])
        );

        const zoneIds = Object.keys(
            fishingZones
        );

        // =========================
        // TIẾN ĐỘ TỔNG
        // =========================

        let total = 0;
        let caught = 0;

        for (const zoneId of zoneIds) {

            const zone =
                fishingZones[zoneId];

            for (const fishId of zone.fish || []) {

                if (!fishMap.has(fishId))
                    continue;

                total++;

                if (
                    (user.fish?.[fishId] || []).length
                ) {
                    caught++;
                }
            }
        }

        const percent = total
            ? Math.floor(caught / total * 100)
            : 0;

        const barSize = 15;

        const filled = Math.round(
            percent / 100 * barSize
        );

        const progress =
            "█".repeat(filled) +
            "░".repeat(barSize - filled);

        let status = "🌱 Người mới";

        if (percent >= 25)
            status = "🎣 Ngư dân tập sự";

        if (percent >= 50)
            status = "🌊 Nhà thám hiểm";

        if (percent >= 75)
            status = "🏆 Bậc thầy sưu tầm";

        if (percent >= 100)
            status = "👑 Huyền thoại";

        // =========================
        // EMBED CHÍNH
        // =========================

        function mainEmbed() {

            return new EmbedBuilder()
                .setColor("#9b59ff")
                .setTitle("╭・📖 BỘ SƯU TẬP CÁ")
                .setDescription(
                    `🐟 Tiến độ\n` +
                    `\`${progress}\` ${percent}%\n` +
                    `${caught}/${total} loài đã khám phá\n\n` +

                    `🏆 Danh hiệu: ${status}\n` +
                    `🗺️ Khu vực: ${zoneIds.length}\n\n` +

                    `💡 Chọn khu vực bên dưới để xem chi tiết.\n` +
                    `⬛ Chưa bắt  •  🐟 Đã bắt`
                )
                .setFooter({
                    text: "✦ Fishing Adventure"
                });
        }

        // =========================
        // EMBED VÙNG
        // =========================

        function zoneEmbed(zoneId) {

            const zone =
                fishingZones[zoneId];

            if (!zone)
                return null;

            let totalFish = 0;
            let caughtFish = 0;
            let fishText = "";

            for (const fishId of zone.fish || []) {

                const fish =
                    fishMap.get(fishId);

                if (!fish)
                    continue;

                totalFish++;

                const owned =
                    user.fish?.[fishId] || [];

                if (owned.length) {

                    caughtFish++;

                    fishText +=
                        `${fish.emoji} `;

                } else {

                    fishText +=
                        `⬛ `;

                }
            }

            const percent = totalFish
                ? Math.floor(
                    caughtFish /
                    totalFish *
                    100
                )
                : 0;

            const size = 12;

            const filled = Math.round(
                percent / 100 * size
            );

            const progress =
                "█".repeat(filled) +
                "░".repeat(size - filled);

            let status =
                "🔒 Chưa khám phá";

            if (percent >= 25)
                status = "🎣 Đang khám phá";

            if (percent >= 50)
                status = "🌊 Khá thành thạo";

            if (percent >= 75)
                status = "🏆 Gần hoàn thành";

            if (percent >= 100)
                status = "👑 Đã hoàn thành";

            return new EmbedBuilder()
                .setColor(
                    zoneColors[zoneId] ||
                    "#9b59ff"
                )
                .setTitle(
                    `${zoneEmojis[zoneId] || "🐟"} ${zone.name}`
                )
                .setDescription(
                    `📖 ${zone.description}\n\n` +

                    `📊 Tiến độ\n` +
                    `\`${progress}\` ${percent}%\n` +
                    `${caughtFish}/${totalFish} loài\n` +
                    `${status}\n\n` +

                    `🐟 Bộ sưu tập\n` +
                    `${fishText || "⬛"}\n\n` +

                    `⬛ Chưa bắt  •  🐟 Đã bắt`
                )
                .setImage(
                    getImage(zone.image)
                )
                .setFooter({
                    text: "✦ Fishing Adventure"
                });
        }

        // =========================
        // XỬ LÝ IMAGE
        // =========================

        function getImage(image) {

            if (!image)
                return null;

            if (
                image.startsWith("[") &&
                image.includes("](")
            ) {

                return image.match(
                    /\((https?:\/\/[^)]+)\)/
                )?.[1] || null;
            }

            return image;
        }

        // =========================
        // NÚT VÙNG
        // =========================

        function buttons(selected = null) {

            return new ActionRowBuilder()
                .addComponents(

                    zoneIds.map(zoneId => {

                        const zone =
                            fishingZones[zoneId];

                        let label =
                            zone.name
                                .replace(
                                    /^(🌴|❄️|🌿|🌌|🌋)\s*/,
                                    ""
                                )
                                .replace(
                                    /^Vùng\s*/,
                                    ""
                                );

                        return new ButtonBuilder()
                            .setCustomId(
                                `collection_${message.author.id}_${zoneId}`
                            )
                            .setLabel(label)
                            .setEmoji(
                                zoneEmojis[zoneId] ||
                                "🐟"
                            )
                            .setStyle(
                                zoneId === selected
                                    ? ButtonStyle.Success
                                    : ButtonStyle.Secondary
                            );
                    })
                );
        }

        // =========================
        // GỬI
        // =========================

        const reply =
            await message.reply({

                embeds: [
                    mainEmbed()
                ],

                components: [
                    buttons()
                ]

            });

        // =========================
        // COLLECTOR
        // =========================

        const collector =
            reply.createMessageComponentCollector({
                time: 180000
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
                            "❌ Đây không phải bộ sưu tập của bạn!",
                        ephemeral: true
                    });
                }

                const prefix =
                    `collection_${message.author.id}_`;

                const zoneId =
                    interaction.customId.replace(
                        prefix,
                        ""
                    );

                const embed =
                    zoneEmbed(zoneId);

                if (!embed) {

                    return interaction.reply({
                        content:
                            "❌ Không tìm thấy khu vực!",
                        ephemeral: true
                    });
                }

                await interaction.update({

                    embeds: [
                        embed
                    ],

                    components: [
                        buttons(zoneId)
                    ]

                });
            }
        );

        // =========================
        // HẾT THỜI GIAN
        // =========================

        collector.on(
            "end",
            async () => {

                try {
                    await reply.edit({
                        components: []
                    });
                } catch {}
            }
        );
    }
};

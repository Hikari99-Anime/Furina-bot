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

// ======================================================
// MÀU KHU VỰC
// ======================================================

const zoneColors = {
    tropical: "#2ecc71",
    cold: "#3498db",
    swamp: "#1abc9c",
    deep: "#9b59b6",
    volcano: "#e74c3c"
};

// ======================================================
// EMOJI KHU VỰC
// ======================================================

const zoneEmojis = {
    tropical: "🌴",
    cold: "❄️",
    swamp: "🌿",
    deep: "🌌",
    volcano: "🌋"
};

// ======================================================
// FORMAT PHẦN TRĂM
// ======================================================

function formatPercent(value) {
    const number = Number(value) || 0;

    return Math.max(
        0,
        Math.min(
            100,
            Math.round(number)
        )
    );
}

// ======================================================
// PROGRESS BAR
// ======================================================

function createProgressBar(
    percent,
    size = 15
) {

    const safePercent =
        formatPercent(percent);

    const filled =
        Math.round(
            safePercent / 100 * size
        );

    return (
        "█".repeat(filled) +
        "░".repeat(
            Math.max(
                0,
                size - filled
            )
        )
    );
}

// ======================================================
// IMAGE
// ======================================================

function getImage(image) {

    if (!image) {
        return null;
    }

    if (
        typeof image !== "string"
    ) {
        return null;
    }

    image =
        image.trim();

    if (!image) {
        return null;
    }

    // Markdown image:
    // [Tên](https://...)
    if (
        image.startsWith("[") &&
        image.includes("](")
    ) {

        const match =
            image.match(
                /\((https?:\/\/[^)]+)\)/
            );

        return match?.[1] || null;
    }

    // URL bình thường
    if (
        /^https?:\/\/.+/i.test(
            image
        )
    ) {

        return image;
    }

    return null;
}

// ======================================================
// LẤY TÊN KHU VỰC
// ======================================================

function getZoneName(
    zone,
    zoneId
) {

    if (
        zone?.name
    ) {

        return zone.name
            .replace(
                /^(🌴|❄️|🌿|🌌|🌋)\s*/u,
                ""
            )
            .replace(
                /^Vùng\s*/u,
                ""
            )
            .trim();
    }

    return (
        zoneId
            .charAt(0)
            .toUpperCase() +
        zoneId.slice(1)
    );
}

// ======================================================
// MODULE
// ======================================================

module.exports = {

    name: "collection",

    aliases: [
        "coll",
        "bosuutap",
        "bst"
    ],

    async execute(message) {

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

        // ==================================================
        // KIỂM TRA DATA
        // ==================================================

        const safeFishList =
            Array.isArray(
                fishList
            )
                ? fishList
                : [];

        const safeZones =
            fishingZones &&
            typeof fishingZones === "object"
                ? fishingZones
                : {};

        // ==================================================
        // MAP CÁ
        // ==================================================

        const fishMap =
            new Map();

        for (
            const fish
            of safeFishList
        ) {

            if (
                !fish ||
                !fish.id
            ) {
                continue;
            }

            fishMap.set(
                fish.id,
                fish
            );
        }

        // ==================================================
        // DANH SÁCH KHU VỰC
        // ==================================================

        const zoneIds =
            Object.keys(
                safeZones
            );

        if (
            zoneIds.length === 0
        ) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor(
                            "#ff6b81"
                        )

                        .setTitle(
                            "📖 `BỘ SƯU TẬP`"
                        )

                        .setDescription(
                            "❌ Hiện chưa có khu vực câu cá."
                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure"
                        })
                ]

            });
        }

        // ==================================================
        // TÍNH TIẾN ĐỘ TỔNG
        // ==================================================

        let total = 0;
        let caught = 0;

        // Dùng Set để tránh tính trùng
        // nếu một con cá xuất hiện ở nhiều khu.
        const countedFish =
            new Set();

        for (
            const zoneId
            of zoneIds
        ) {

            const zone =
                safeZones[zoneId];

            if (
                !zone ||
                !Array.isArray(
                    zone.fish
                )
            ) {
                continue;
            }

            for (
                const fishId
                of zone.fish
            ) {

                if (
                    countedFish.has(
                        fishId
                    )
                ) {
                    continue;
                }

                if (
                    !fishMap.has(
                        fishId
                    )
                ) {
                    continue;
                }

                countedFish.add(
                    fishId
                );

                total++;

                const owned =
                    user.fish?.[
                        fishId
                    ];

                if (
                    Array.isArray(
                        owned
                    ) &&
                    owned.length > 0
                ) {

                    caught++;
                }
            }
        }

        // ==================================================
        // PHẦN TRĂM
        // ==================================================

        const percent =
            total > 0
                ? formatPercent(
                    caught /
                    total *
                    100
                )
                : 0;

        // ==================================================
        // PROGRESS
        // ==================================================

        const progress =
            createProgressBar(
                percent,
                15
            );

        // ==================================================
        // DANH HIỆU
        // ==================================================

        let status =
            "🌱 Người mới";

        if (
            percent >= 25
        ) {

            status =
                "🎣 Ngư dân tập sự";
        }

        if (
            percent >= 50
        ) {

            status =
                "🌊 Nhà thám hiểm";
        }

        if (
            percent >= 75
        ) {

            status =
                "🏆 Bậc thầy sưu tầm";
        }

        if (
            percent >= 100
        ) {

            status =
                "👑 Huyền thoại";
        }

        // ==================================================
        // EMBED CHÍNH
        // ==================================================

        function mainEmbed() {

            return new EmbedBuilder()

                .setColor(
                    "#9b59ff"
                )

                .setTitle(
                    "╭・📖 BỘ SƯU TẬP CÁ"
                )

                .setDescription(

                    `🐟 **Tiến độ bộ sưu tập**\n` +

                    `\`${progress}\` **${percent}%**\n` +

                    `**${caught}/${total}** loài đã khám phá\n\n` +

                    `🏆 **Danh hiệu:** ${status}\n` +

                    `🗺️ **Khu vực:** ${zoneIds.length}\n\n` +

                    `💡 Chọn khu vực bên dưới để xem chi tiết.\n\n` +

                    `⬛ Chưa bắt  •  🐟 Đã bắt`
                )

                .setFooter({
                    text:
                        "✦ Fishing Adventure"
                });
        }

        // ==================================================
        // EMBED KHU VỰC
        // ==================================================

        function zoneEmbed(
            zoneId
        ) {

            const zone =
                safeZones[
                    zoneId
                ];

            if (!zone) {
                return null;
            }

            // ----------------------------------------------
            // DANH SÁCH CÁ
            // ----------------------------------------------

            const zoneFishIds =
                Array.isArray(
                    zone.fish
                )
                    ? [
                        ...new Set(
                            zone.fish
                        )
                    ]
                    : [];

            let totalFish = 0;
            let caughtFish = 0;

            let fishText = "";

            for (
                const fishId
                of zoneFishIds
            ) {

                const fish =
                    fishMap.get(
                        fishId
                    );

                if (!fish) {
                    continue;
                }

                totalFish++;

                const owned =
                    user.fish?.[
                        fishId
                    ];

                const hasFish =
                    Array.isArray(
                        owned
                    ) &&
                    owned.length > 0;

                if (
                    hasFish
                ) {

                    caughtFish++;

                    fishText +=
                        `${fish.emoji || "🐟"} `;

                } else {

                    fishText +=
                        "⬛ ";
                }
            }

            // ----------------------------------------------
            // PHẦN TRĂM
            // ----------------------------------------------

            const percent =
                totalFish > 0
                    ? formatPercent(
                        caughtFish /
                        totalFish *
                        100
                    )
                    : 0;

            // ----------------------------------------------
            // PROGRESS
            // ----------------------------------------------

            const progress =
                createProgressBar(
                    percent,
                    12
                );

            // ----------------------------------------------
            // TRẠNG THÁI
            // ----------------------------------------------

            let status =
                "🔒 Chưa khám phá";

            if (
                percent >= 25
            ) {

                status =
                    "🎣 Đang khám phá";
            }

            if (
                percent >= 50
            ) {

                status =
                    "🌊 Khá thành thạo";
            }

            if (
                percent >= 75
            ) {

                status =
                    "🏆 Gần hoàn thành";
            }

            if (
                percent >= 100
            ) {

                status =
                    "👑 Đã hoàn thành";
            }

            // ----------------------------------------------
            // DESCRIPTION
            // ----------------------------------------------

            const description =
                zone.description ||
                "Chưa có mô tả khu vực.";

            return new EmbedBuilder()

                .setColor(
                    zoneColors[
                        zoneId
                    ] ||
                    "#9b59ff"
                )

                .setTitle(
                    `${zoneEmojis[zoneId] || "🐟"} ${getZoneName(
                        zone,
                        zoneId
                    )}`
                )

                .setDescription(

                    `📖 ${description}\n\n` +

                    `📊 **Tiến độ**\n` +

                    `\`${progress}\` **${percent}%**\n` +

                    `**${caughtFish}/${totalFish}** loài\n` +

                    `${status}\n\n` +

                    `🐟 **Bộ sưu tập**\n` +

                    `${fishText || "⬛"}\n\n` +

                    `⬛ Chưa bắt  •  🐟 Đã bắt`
                )

                .setImage(
                    getImage(
                        zone.image
                    )
                )

                .setFooter({
                    text:
                        "✦ Fishing Adventure"
                });
        }

        // ==================================================
        // NÚT KHU VỰC
        // ==================================================

        function buttons(
            selected = null
        ) {

            const rows = [];

            /*
             * Discord giới hạn:
             * - 5 button / row
             *
             * Tách khu vực thành nhiều row
             * để không lỗi nếu có > 5 khu.
             */

            for (
                let i = 0;
                i < zoneIds.length;
                i += 5
            ) {

                const currentZones =
                    zoneIds.slice(
                        i,
                        i + 5
                    );

                const row =
                    new ActionRowBuilder();

                for (
                    const zoneId
                    of currentZones
                ) {

                    const zone =
                        safeZones[
                            zoneId
                        ];

                    const label =
                        getZoneName(
                            zone,
                            zoneId
                        ).slice(
                            0,
                            80
                        );

                    row.addComponents(

                        new ButtonBuilder()

                            .setCustomId(
                                `collection_${message.author.id}_${zoneId}`
                            )

                            .setLabel(
                                label
                            )

                            .setEmoji(
                                zoneEmojis[
                                    zoneId
                                ] ||
                                "🐟"
                            )

                            .setStyle(

                                zoneId === selected
                                    ? ButtonStyle.Success
                                    : ButtonStyle.Secondary

                            )
                    );
                }

                rows.push(
                    row
                );

                /*
                 * Discord chỉ cho tối đa 5 ActionRow.
                 * Nếu có quá 25 khu thì dừng để tránh lỗi.
                 */

                if (
                    rows.length >= 5
                ) {
                    break;
                }
            }

            return rows;
        }

        // ==================================================
        // GỬI MESSAGE
        // ==================================================

        const reply =
            await message.reply({

                embeds: [
                    mainEmbed()
                ],

                components:
                    buttons()

            });

        // ==================================================
        // COLLECTOR
        // ==================================================

        const collector =
            reply.createMessageComponentCollector({

                time:
                    180000

            });

        // ==================================================
        // CLICK BUTTON
        // ==================================================

        collector.on(
            "collect",
            async interaction => {

                // ------------------------------------------
                // CHỈ CHỦ MESSAGE
                // ------------------------------------------

                if (
                    interaction.user.id !==
                    message.author.id
                ) {

                    return interaction.reply({

                        content:
                            "❌ Đây không phải bộ sưu tập của bạn!",

                        ephemeral:
                            true

                    });
                }

                // ------------------------------------------
                // PREFIX
                // ------------------------------------------

                const prefix =
                    `collection_${message.author.id}_`;

                // ------------------------------------------
                // LẤY ZONE ID
                // ------------------------------------------

                const zoneId =
                    interaction.customId.replace(
                        prefix,
                        ""
                    );

                // ------------------------------------------
                // KIỂM TRA
                // ------------------------------------------

                if (
                    !safeZones[
                        zoneId
                    ]
                ) {

                    return interaction.reply({

                        content:
                            "❌ Không tìm thấy khu vực!",

                        ephemeral:
                            true

                    });
                }

                // ------------------------------------------
                // TẠO EMBED
                // ------------------------------------------

                const embed =
                    zoneEmbed(
                        zoneId
                    );

                if (!embed) {

                    return interaction.reply({

                        content:
                            "❌ Không thể hiển thị khu vực này!",

                        ephemeral:
                            true

                    });
                }

                // ------------------------------------------
                // UPDATE
                // ------------------------------------------

                try {

                    await interaction.update({

                        embeds: [
                            embed
                        ],

                        components:
                            buttons(
                                zoneId
                            )

                    });

                } catch {

                    // Interaction có thể hết hạn
                }
            }
        );

        // ==================================================
        // HẾT THỜI GIAN
        // ==================================================

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
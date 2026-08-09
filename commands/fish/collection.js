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
// 🎨 MÀU KHU VỰC
// ======================================================

const zoneColors = {
    tropical: "#2ECC71",
    cold: "#3498DB",
    swamp: "#1ABC9C",
    deep: "#9B59B6",
    volcano: "#E74C3C"
};

// ======================================================
// 🌊 EMOJI KHU VỰC
// ======================================================

const zoneEmojis = {
    tropical: "🌴",
    cold: "❄️",
    swamp: "🌿",
    deep: "🌌",
    volcano: "🌋"
};

// ======================================================
// 🎨 MÀU CHÍNH
// ======================================================

const MAIN_COLOR = "#9B59FF";

// ======================================================
// 📊 FORMAT PHẦN TRĂM
// ======================================================

function formatPercent(value) {

    const number =
        Number(value) || 0;

    return Math.max(
        0,
        Math.min(
            100,
            Math.round(number)
        )
    );
}

// ======================================================
// 📊 PROGRESS BAR
// ======================================================

function createProgressBar(
    percent,
    size = 15
) {

    const safePercent =
        formatPercent(percent);

    const filled =
        Math.round(
            safePercent /
            100 *
            size
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
// 🖼️ IMAGE
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

    // Markdown:
    // [Tên](https://...)

    if (
        image.startsWith("[") &&
        image.includes("](")
    ) {

        const match =
            image.match(
                /\((https?:\/\/[^)]+)\)/
            );

        return (
            match?.[1] ||
            null
        );
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
// 🗺️ TÊN KHU VỰC
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
// 🌊 EMOJI KHU VỰC
// ======================================================

function getZoneEmoji(
    zoneId
) {

    return (
        zoneEmojis[
            zoneId
        ] ||
        "🐟"
    );
}

// ======================================================
// 🎨 MÀU KHU VỰC
// ======================================================

function getZoneColor(
    zoneId
) {

    return (
        zoneColors[
            zoneId
        ] ||
        MAIN_COLOR
    );
}

// ======================================================
// 🏆 DANH HIỆU TỔNG
// ======================================================

function getCollectionStatus(
    percent
) {

    if (
        percent >= 100
    ) {

        return "👑 Huyền thoại";
    }

    if (
        percent >= 75
    ) {

        return "🏆 Bậc thầy sưu tầm";
    }

    if (
        percent >= 50
    ) {

        return "🌊 Nhà thám hiểm";
    }

    if (
        percent >= 25
    ) {

        return "🎣 Ngư dân tập sự";
    }

    return "🌱 Người mới";
}

// ======================================================
// 🗺️ STATUS KHU VỰC
// ======================================================

function getZoneStatus(
    percent
) {

    if (
        percent >= 100
    ) {

        return "👑 Đã hoàn thành";
    }

    if (
        percent >= 75
    ) {

        return "🏆 Gần hoàn thành";
    }

    if (
        percent >= 50
    ) {

        return "🌊 Khá thành thạo";
    }

    if (
        percent >= 25
    ) {

        return "🎣 Đang khám phá";
    }

    return "🔒 Chưa khám phá";
}

// ======================================================
// 📖 KIỂM TRA COLLECTION
// ======================================================

function hasCollected(
    user,
    fishId
) {

    // ----------------------------------------------
    // DATA MỚI
    // ----------------------------------------------

    if (
        user.collection &&
        user.collection[fishId] === true
    ) {

        return true;
    }

    // ----------------------------------------------
    // TƯƠNG THÍCH DATA CŨ
    // ----------------------------------------------
    /*
     * Nếu người chơi đã bắt cá từ trước khi có
     * hệ thống collection mới thì vẫn cho phép
     * Collection nhận diện cá đó.
     *
     * Tuy nhiên sau khi sell cá cũ thì dữ liệu cũ
     * sẽ không thể biết được nữa nếu chưa migrate.
     */

    const oldFish =
        user.fish?.[
            fishId
        ];

    return (
        Array.isArray(
            oldFish
        ) &&
        oldFish.length > 0
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
        // 👤 USER
        // ==================================================

        const user =
            getUser(
                message.author.id
            );

        if (!user) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor(
                            "#FF6B81"
                        )

                        .setTitle(
                            "❌ KHÔNG TÌM THẤY DỮ LIỆU"
                        )

                        .setDescription(
                            "Không thể tìm thấy dữ liệu người chơi của bạn."
                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure"
                        })

                ]

            });
        }

        // ==================================================
        // 📖 ĐẢM BẢO COLLECTION
        // ==================================================

        user.collection =
            user.collection || {};

        // ==================================================
        // 🐟 FISH LIST AN TOÀN
        // ==================================================

        const safeFishList =
            Array.isArray(
                fishList
            )
                ? fishList
                : [];

        // ==================================================
        // 🗺️ ZONE AN TOÀN
        // ==================================================

        const safeZones =
            fishingZones &&
            typeof fishingZones === "object"
                ? fishingZones
                : {};

        const zoneIds =
            Object.keys(
                safeZones
            );

        // ==================================================
        // ❌ KHÔNG CÓ KHU VỰC
        // ==================================================

        if (
            zoneIds.length === 0
        ) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor(
                            "#FF6B81"
                        )

                        .setTitle(
                            "📖 BỘ SƯU TẬP CÁ"
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
        // 🐟 MAP CÁ
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
        // 📊 TÍNH TỔNG BỘ SƯU TẬP
        // ==================================================

        let total = 0;
        let caught = 0;

        const countedFish =
            new Set();

        for (
            const zoneId
            of zoneIds
        ) {

            const zone =
                safeZones[
                    zoneId
                ];

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

                // ------------------------------------------
                // TRÁNH TÍNH TRÙNG
                // ------------------------------------------

                if (
                    countedFish.has(
                        fishId
                    )
                ) {

                    continue;
                }

                // ------------------------------------------
                // CÁ KHÔNG TỒN TẠI
                // ------------------------------------------

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

                // ------------------------------------------
                // KIỂM TRA COLLECTION
                // ------------------------------------------

                if (
                    hasCollected(
                        user,
                        fishId
                    )
                ) {

                    caught++;
                }
            }
        }

        // ==================================================
        // 📈 PHẦN TRĂM TỔNG
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
        // 📊 PROGRESS
        // ==================================================

        const progress =
            createProgressBar(
                percent,
                15
            );

        // ==================================================
        // 🏆 DANH HIỆU
        // ==================================================

        const status =
            getCollectionStatus(
                percent
            );

        // ==================================================
        // 🏠 EMBED TRANG TỔNG QUAN
        // ==================================================

        function mainEmbed() {

            return new EmbedBuilder()

                .setColor(
                    MAIN_COLOR
                )

                .setTitle(
                    "╭・📖 BỘ SƯU TẬP CÁ"
                )

                .setDescription(

                    `*Hành trình khám phá đại dương của bạn...* 🌊\n\n` +

                    `୨୧ ───────── ୨୧\n\n` +

                    `🐟 **TIẾN ĐỘ BỘ SƯU TẬP**\n\n` +

                    `\`${progress}\` **${percent}%**\n\n` +

                    `📚 **${caught}/${total}** loài đã khám phá\n\n` +

                    `🏆 **Danh hiệu:** ${status}\n` +

                    `🗺️ **Khu vực:** ${zoneIds.length}\n\n` +

                    `୨୧ ───────── ୨୧\n\n` +

                    `💡 **Chọn một khu vực bên dưới**\n` +

                    `để xem chi tiết những sinh vật bạn đã khám phá.\n\n` +

                    `🐟 Đã bắt  •  ⬛ Chưa bắt`

                )

                .setFooter({

                    text:
                        "✦ Fishing Adventure · Bộ sưu tập"

                });
        }

        // ==================================================
        // 🗺️ EMBED KHU VỰC
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
            // 🐟 DANH SÁCH CÁ
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

            const fishLines = [];

            // ----------------------------------------------
            // LOOP CÁ
            // ----------------------------------------------

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

                // ------------------------------------------
                // 📖 COLLECTION
                // ------------------------------------------

                const hasFish =
                    hasCollected(
                        user,
                        fishId
                    );

                if (
                    hasFish
                ) {

                    caughtFish++;

                    fishLines.push(

                        `${fish.emoji || "🐟"} **${fish.name || fishId}**`

                    );

                } else {

                    fishLines.push(

                        `⬛ **???**`

                    );
                }
            }

            // ----------------------------------------------
            // %
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
                    15
                );

            // ----------------------------------------------
            // STATUS
            // ----------------------------------------------

            const status =
                getZoneStatus(
                    percent
                );

            // ----------------------------------------------
            // NAME
            // ----------------------------------------------

            const zoneName =
                getZoneName(
                    zone,
                    zoneId
                );

            const zoneEmoji =
                getZoneEmoji(
                    zoneId
                );

            // ----------------------------------------------
            // DESCRIPTION
            // ----------------------------------------------

            const description =
                zone.description ||
                "Chưa có mô tả khu vực.";

            // ----------------------------------------------
            // EMBED
            // ----------------------------------------------

            const embed =
                new EmbedBuilder()

                    .setColor(
                        getZoneColor(
                            zoneId
                        )
                    )

                    .setTitle(

                        `${zoneEmoji} ${zoneName}`

                    )

                    .setDescription(

                        `*${description}*\n\n` +

                        `୨୧ ───────── ୨୧\n\n` +

                        `📊 **TIẾN ĐỘ KHÁM PHÁ**\n\n` +

                        `\`${progress}\` **${percent}%**\n\n` +

                        `🐟 **${caughtFish}/${totalFish}** loài đã bắt\n` +

                        `${status}\n\n` +

                        `୨୧ ───────── ୨୧\n\n` +

                        `🐟 **BỘ SƯU TẬP**\n\n` +

                        (
                            fishLines.length
                                ? fishLines.join("\n")
                                : "⬛ Chưa có dữ liệu cá."
                        ) +

                        `\n\n୨୧ ───────── ୨୧\n\n` +

                        `🐟 Đã bắt  •  ⬛ Chưa bắt`

                    )

                    .setFooter({

                        text:
                            "✦ Fishing Adventure · Bộ sưu tập"

                    });

            // ----------------------------------------------
            // IMAGE
            // ----------------------------------------------

            const image =
                getImage(
                    zone.image
                );

            if (image) {

                embed.setImage(
                    image
                );
            }

            return embed;
        }

        // ==================================================
        // 🔘 NÚT KHU VỰC
        // ==================================================

        function buttons(
            selected = null
        ) {

            const rows = [];

            for (
                let i = 0;
                i < zoneIds.length &&
                rows.length < 5;
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
                                getZoneEmoji(
                                    zoneId
                                )
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
            }

            return rows;
        }

        // ==================================================
        // 📩 GỬI TRANG CHÍNH
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
        // 🎛️ COLLECTOR
        // ==================================================

        const collector =
            reply.createMessageComponentCollector({

                time:
                    180000

            });

        // ==================================================
        // 🖱️ CLICK
        // ==================================================

        collector.on(

            "collect",

            async interaction => {

                try {

                    // --------------------------------------
                    // 🔒 CHỈ CHỦ LỆNH
                    // --------------------------------------

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

                    // --------------------------------------
                    // 🔙 NÚT TRANG CHỦ
                    // --------------------------------------

                    if (
                        interaction.customId ===
                        `collection_home_${message.author.id}`
                    ) {

                        return interaction.update({

                            embeds: [

                                mainEmbed()

                            ],

                            components:

                                buttons()

                        });
                    }

                    // --------------------------------------
                    // PREFIX
                    // --------------------------------------

                    const buttonPrefix =
                        `collection_${message.author.id}_`;

                    // --------------------------------------
                    // KHÔNG PHẢI COLLECTION
                    // --------------------------------------

                    if (
                        !interaction.customId.startsWith(
                            buttonPrefix
                        )
                    ) {

                        return;
                    }

                    // --------------------------------------
                    // ZONE ID
                    // --------------------------------------

                    const zoneId =
                        interaction.customId.replace(
                            buttonPrefix,
                            ""
                        );

                    // --------------------------------------
                    // CHECK ZONE
                    // --------------------------------------

                    if (
                        !safeZones[
                            zoneId
                        ]
                    ) {

                        return interaction.reply({

                            content:
                                "❌ Không tìm thấy khu vực này!",

                            ephemeral:
                                true

                        });
                    }

                    // --------------------------------------
                    // CREATE EMBED
                    // --------------------------------------

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

                    // --------------------------------------
                    // UPDATE
                    // --------------------------------------

                    await interaction.update({

                        embeds: [

                            embed

                        ],

                        components:

                            buttons(
                                zoneId
                            )

                    });

                }

                catch (err) {

                    console.error(
                        "❌ COLLECTION BUTTON ERROR:",
                        err
                    );

                    try {

                        if (
                            !interaction.replied &&
                            !interaction.deferred
                        ) {

                            await interaction.reply({

                                content:
                                    "❌ Có lỗi khi hiển thị bộ sưu tập.",

                                ephemeral:
                                    true

                            });
                        }

                    }

                    catch {}

                }

            }

        );

        // ==================================================
        // ⏰ HẾT THỜI GIAN
        // ==================================================

        collector.on(

            "end",

            async () => {

                try {

                    await reply.edit({

                        components: []

                    });

                }

                catch {}

            }

        );
    }
};
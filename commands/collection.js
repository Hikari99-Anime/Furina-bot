const {
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder
} = require("discord.js");

const {
    fishList,
    fishingZones
} = require("../config");

const {
    getUser
} = require("../data");


module.exports = {

    name: "collection",

    aliases: [
        "coll",
        "bosuutap",
        "bst"
    ],


    async execute(message) {

        const user =
            getUser(
                message.author.id
            );


        // ==========================================
        // MAP CÁ
        // ==========================================

        const fishMap =
            new Map(
                fishList.map(
                    fish => [
                        fish.id,
                        fish
                    ]
                )
            );


        const zoneIds =
            Object.keys(
                fishingZones
            );


        // ==========================================
        // MÀU EMBED THEO VÙNG
        // ==========================================

        const zoneColors = {

            tropical:
                "#2ecc71", // 🟢 xanh lá

            cold:
                "#3498db", // 🔵 xanh dương

            swamp:
                "#1abc9c", // 🟢 xanh ngọc

            deep:
                "#9b59b6", // 🟣 tím

            volcano:
                "#e74c3c" // 🔴 đỏ

        };


        // ==========================================
        // TỔNG BỘ SƯU TẬP
        // ==========================================

        let totalFish = 0;

        let caughtFish = 0;


        for (
            const zoneId
            of zoneIds
        ) {

            const zone =
                fishingZones[
                    zoneId
                ];


            for (
                const fishId
                of zone.fish || []
            ) {

                if (
                    !fishMap.has(
                        fishId
                    )
                )
                    continue;


                totalFish++;


                const fishOwned =
                    user.fish?.[
                        fishId
                    ] || [];


                if (
                    fishOwned.length > 0
                ) {

                    caughtFish++;

                }

            }

        }


        // ==========================================
        // TIẾN ĐỘ TỔNG
        // ==========================================

        const totalPercent =
            totalFish > 0

                ? Math.floor(
                    caughtFish /
                    totalFish *
                    100
                )

                : 0;


        const barSize = 15;


        const filled =
            Math.round(
                totalPercent /
                100 *
                barSize
            );


        const progressBar =
            "█".repeat(
                filled
            ) +

            "░".repeat(
                barSize -
                filled
            );


        // ==========================================
        // TRẠNG THÁI
        // ==========================================

        let status =
            "🌱 Người mới";


        if (
            totalPercent >= 25
        )
            status =
                "🎣 Ngư dân tập sự";


        if (
            totalPercent >= 50
        )
            status =
                "🌊 Nhà thám hiểm";


        if (
            totalPercent >= 75
        )
            status =
                "🏆 Bậc thầy sưu tầm";


        if (
            totalPercent >= 100
        )
            status =
                "👑 Huyền thoại";


        // ==========================================
        // EMBED CHÍNH
        // ==========================================

        function createMainEmbed() {

            return new EmbedBuilder()

                .setColor(
                    "#9b59ff"
                )

                .setTitle(
                    "📖 BỘ SƯU TẬP CÁ"
                )

                .setDescription(

                    `🐟 Tiến độ bộ sưu tập\n` +
                    `\`${progressBar}\` ` +
                    `**${totalPercent}%**\n` +
                    `${caughtFish}/${totalFish} ` +
                    `loài đã khám phá\n\n` +
                    `🏆 Danh Hiệu: ` +
                    `${status}\n` +
                    `🗺️ Khu vực: ` +
                    `${zoneIds.length}\n` +
                    `🐟 Đã khám phá: ` +
                    `${caughtFish}/${totalFish}\n\n` +

                    `💡 Hướng dẫn\n` +
                    `Chọn một khu vực bên dưới ` +
                    `để kiểm tra bộ sưu tập cá.\n\n` +
                    `⬛ Chưa bắt  •  🐟 Đã bắt`

                )

                .setFooter({

                    text:
                        "🎣 Fish Collection // Sheryl"

                });

        }


        // ==========================================
        // EMBED TỪNG VÙNG
        // ==========================================

        function createZoneEmbed(
            zoneId
        ) {

            const zone =
                fishingZones[
                    zoneId
                ];


            if (!zone)
                return null;


            // ======================================
            // LẤY MÀU VÙNG
            // ======================================

            const embedColor =
                zoneColors[
                    zoneId
                ] || "#9b59ff";


            let total = 0;

            let caught = 0;

            let fishLine = "";


            // ======================================
            // DANH SÁCH CÁ
            // ======================================

            for (
                const fishId
                of zone.fish || []
            ) {

                const fish =
                    fishMap.get(
                        fishId
                    );


                if (!fish)
                    continue;


                total++;


                const owned =
                    user.fish?.[
                        fishId
                    ] || [];


                if (
                    owned.length > 0
                ) {

                    caught++;


                    fishLine +=
                        `${fish.emoji} `;

                } else {

                    fishLine +=
                        "⬛ ";

                }

            }


            // ======================================
            // TIẾN ĐỘ VÙNG
            // ======================================

            const percent =
                total > 0

                    ? Math.floor(
                        caught /
                        total *
                        100
                    )

                    : 0;


            const size = 12;


            const filled =
                Math.round(
                    percent /
                    100 *
                    size
                );


            const progressBar =
                "█".repeat(
                    filled
                ) +

                "░".repeat(
                    size -
                    filled
                );


            // ======================================
            // TRẠNG THÁI
            // ======================================

            let zoneStatus =
                "🔒 Chưa khám phá";


            if (
                percent >= 25
            )
                zoneStatus =
                    "🎣 Đang khám phá";


            if (
                percent >= 50
            )
                zoneStatus =
                    "🌊 Khá thành thạo";


            if (
                percent >= 75
            )
                zoneStatus =
                    "🏆 Gần hoàn thành";


            if (
                percent >= 100
            )
                zoneStatus =
                    "👑 Đã hoàn thành";


            // ======================================
            // XỬ LÝ ẢNH
            // ======================================

            let image =
                zone.image || null;


            /*
             * Nếu config có dạng:
             *
             * [https://abc.com/image.png](https://abc.com/image.png)
             *
             * thì lấy URL bên trong.
             */

            if (
                image &&
                image.startsWith("[") &&
                image.includes("](")
            ) {

                image =
                    image.match(
                        /\((https?:\/\/[^)]+)\)/
                    )?.[1] || null;

            }


            // ======================================
            // TẠO EMBED
            // ======================================

            const embed =
                new EmbedBuilder()

                    // MÀU DỌC BÊN TRÁI
                    .setColor(
                        embedColor
                    )

                    .setTitle(
                        zone.name
                    )

                    .setDescription(

                        `> ${zone.description}\n\n` +

                        `📊 Tiến độ\n` +
                        `\`${progressBar}\` ` +
                        `${percent}%\n` +

                        `${caught}/${total} ` +
                        `loài đã khám phá\n` +
                        `${zoneStatus}\n\n` +
                        `🐟 Bộ sưu tập\n` +
                        `${fishLine.trim()}\n\n` +
                        `⬛ Chưa bắt  •  🐟 Đã bắt`

                    )

                    .setFooter({

                        text:
                            "🎣 Fish Collection // Sheryl"

                    });


            // ======================================
            // ẢNH VÙNG
            // ======================================

            if (image) {

                embed.setImage(
                    image
                );

            }


            return embed;

        }


        // ==========================================
        // EMOJI VÙNG
        // ==========================================

        const zoneEmojis = {

            tropical:
                "🌴",

            cold:
                "❄️",

            swamp:
                "🌿",

            deep:
                "🌌",

            volcano:
                "🌋"

        };


        // ==========================================
        // TẠO NÚT VÙNG
        // ==========================================

        function createButtons(
            selectedZone = null
        ) {

            const buttons = [];


            for (
                const zoneId
                of zoneIds
            ) {

                const zone =
                    fishingZones[
                        zoneId
                    ];


                let label =
                    zone.name;


                // Bỏ emoji + chữ "Vùng"

                label =
                    label

                        .replace(
                            "🌴 ",
                            ""
                        )

                        .replace(
                            "❄️ ",
                            ""
                        )

                        .replace(
                            "🌿 ",
                            ""
                        )

                        .replace(
                            "🌌 ",
                            ""
                        )

                        .replace(
                            "🌋 ",
                            ""
                        )

                        .replace(
                            "Vùng ",
                            ""
                        );


                buttons.push(

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
                            ] || "🐟"
                        )

                        .setStyle(

                            zoneId === selectedZone

                                ? ButtonStyle.Success

                                : ButtonStyle.Secondary

                        )

                );

            }


            return new ActionRowBuilder()
                .addComponents(
                    buttons
                );

        }


        // ==========================================
        // GỬI EMBED BAN ĐẦU
        // ==========================================

        const reply =
            await message.reply({

                embeds: [

                    createMainEmbed()

                ],

                components: [

                    createButtons()

                ]

            });


        // ==========================================
        // COLLECTOR
        // ==========================================

        const collector =
            reply.createMessageComponentCollector({

                time:
                    180000

            });


        collector.on(
            "collect",
            async interaction => {

                // ==================================
                // CHỈ CHO CHỦ BỘ SƯU TẬP
                // ==================================

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


                // ==================================
                // LẤY ID VÙNG
                // ==================================

                const prefix =
                    `collection_${message.author.id}_`;


                const zoneId =
                    interaction.customId.replace(
                        prefix,
                        ""
                    );


                // ==================================
                // TẠO EMBED VÙNG
                // ==================================

                const zoneEmbed =
                    createZoneEmbed(
                        zoneId
                    );


                if (!zoneEmbed) {

                    return interaction.reply({

                        content:
                            "❌ Không tìm thấy khu vực!",

                        ephemeral:
                            true

                    });

                }


                // ==================================
                // THAY EMBED CHÍNH
                // ==================================

                await interaction.update({

                    embeds: [

                        zoneEmbed

                    ],

                    components: [

                        createButtons(
                            zoneId
                        )

                    ]

                });

            }
        );


        // ==========================================
        // HẾT THỜI GIAN
        // ==========================================

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

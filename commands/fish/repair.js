const {
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder
} = require("discord.js");

const {
    rods,
    emoji,
    formatMoney
} = require("../../config");

const {
    getUser,
    save
} = require("../../data");


// ======================================================
// FORMAT THỜI GIAN
// ======================================================

function formatTime(seconds) {

    seconds = Math.max(
        0,
        Math.ceil(seconds)
    );

    const hours =
        Math.floor(seconds / 3600);

    const minutes =
        Math.floor(
            (seconds % 3600) / 60
        );

    const secs =
        seconds % 60;


    if (hours > 0) {

        return `${hours} giờ ${minutes} phút`;

    }

    if (minutes > 0) {

        return `${minutes} phút ${secs} giây`;

    }

    return `${secs} giây`;
}


// ======================================================
// TÍNH THỜI GIAN SỬA
// ======================================================

function getRepairTime(base, rod) {

    const maxUses =
        rod.maxUses ||
        base.uses ||
        1;

    const uses =
        Math.max(
            0,
            rod.uses || 0
        );


    // ==============================================
    // TỶ LỆ ĐỘ BỀN ĐÃ MẤT
    // ==============================================

    const lostRatio =
        Math.max(
            0,
            Math.min(
                1,
                1 - (uses / maxUses)
            )
        );


    // ==============================================
    // CẤP CẦN
    //
    // ⭐  = 5 phút
    // ⭐⭐ = 10 phút
    // ⭐⭐⭐ = 15 phút
    // ⭐⭐⭐⭐ = 20 phút
    // ⭐⭐⭐⭐⭐ = 25 phút
    // ==============================================

    const star =
        base.star || 1;


    const baseTime =
        star * 300;


    // ==============================================
    // CÀNG HỎNG → CÀNG LÂU
    // ==============================================

    const damageMultiplier =
        1 + (lostRatio * 2);


    let seconds =
        Math.ceil(
            baseTime *
            damageMultiplier
        );


    // ==============================================
    // GÃY HOÀN TOÀN
    //
    // Gãy = sửa lâu nhất
    // ==============================================

    if (
        rod.destroyed ||
        uses <= 0
    ) {

        seconds =
            Math.ceil(
                baseTime * 4
            );

    }


    // Tối thiểu 5 phút

    if (seconds < 300)
        seconds = 300;


    return seconds;
}


// ======================================================
// TÍNH GIÁ SỬA
// ======================================================

function getRepairPrice(base, rod) {

    const maxUses =
        rod.maxUses ||
        base.uses ||
        1;

    const uses =
        Math.max(
            0,
            rod.uses || 0
        );


    // ==============================================
    // CẦN GÃY
    // = GIÁ MUA MỚI
    // ==============================================

    if (
        rod.destroyed ||
        uses <= 0
    ) {

        return base.price;

    }


    // ==============================================
    // TỶ LỆ HƯ HỎNG
    // ==============================================

    const lostRatio =
        Math.max(
            0,
            Math.min(
                1,
                1 - (uses / maxUses)
            )
        );


    // Hư càng nhiều → giá càng cao

    let price =
        Math.floor(
            base.price *
            Math.pow(
                lostRatio,
                0.75
            )
        );


    // Giá tối thiểu

    if (price < 1000)
        price = 1000;


    // Không vượt quá giá cần

    if (price > base.price)
        price = base.price;


    return price;
}


// ======================================================
// HOÀN TẤT SỬA
// ======================================================

async function finishRepair(
    client,
    userId
) {

    try {

        const user =
            getUser(userId);


        if (
            !user ||
            !user.repair ||
            !user.repair.rodId
        ) {

            return;

        }


        const repairId =
            user.repair.rodId;


        const base =
            rods[repairId];


        if (!base) {

            delete user.repair;

            save();

            return;

        }


        const rod =
            user.rodData?.[repairId];


        if (!rod) {

            delete user.repair;

            save();

            return;

        }


        // ==========================================
        // HỒI ĐẦY ĐỘ BỀN
        // ==========================================

        rod.maxUses =
            rod.maxUses ||
            base.uses;

        rod.uses =
            rod.maxUses;

        rod.destroyed =
            false;


        // ==========================================
        // XÓA TRẠNG THÁI SỬA
        // ==========================================

        delete user.repair;


        save();


        // ==========================================
        // TÌM CHANNEL ĐỂ GỬI THÔNG BÁO
        // ==========================================

        const channelId =
            user.repairChannel;


        let channel = null;


        if (channelId) {

            channel =
                await client.channels
                    .fetch(channelId)
                    .catch(
                        () => null
                    );

        }


        // ==========================================
        // NẾU KHÔNG TÌM ĐƯỢC CHANNEL
        // THỬ DM
        // ==========================================

        if (!channel) {

            const discordUser =
                await client.users
                    .fetch(userId)
                    .catch(
                        () => null
                    );


            if (!discordUser)
                return;


            const embed =
                createFinishedEmbed(
                    discordUser,
                    base,
                    rod
                );


            await discordUser.send({

                embeds: [
                    embed
                ]

            }).catch(
                () => {}
            );


            return;

        }


        // ==========================================
        // EMBED HOÀN TẤT
        // ==========================================

        const discordUser =
            await client.users
                .fetch(userId)
                .catch(
                    () => null
                );


        if (!discordUser)
            return;


        const embed =
            createFinishedEmbed(
                discordUser,
                base,
                rod
            );


        // ==========================================
        // PING NGƯỜI CHƠI
        // ==========================================

        await channel.send({

            content:
                `<@${userId}>`,

            embeds: [
                embed
            ]

        });


    } catch (error) {

        console.error(
            "❌ Lỗi hoàn tất sửa cần:",
            error
        );

    }

}


// ======================================================
// EMBED HOÀN TẤT
// ======================================================

function createFinishedEmbed(
    discordUser,
    base,
    rod
) {

    const maxUses =
        rod.maxUses ||
        base.uses;


    return new EmbedBuilder()

        .setColor(
            "#72e6c1"
        )

        .setAuthor({

            name:
                `${discordUser.username} · Workshop`,

            iconURL:
                discordUser.displayAvatarURL({
                    extension: "png",
                    size: 128
                })

        })

        .setTitle(
            "✨ Cần câu đã sửa xong!"
        )

        .setDescription(

            `${base.emoji} **${base.name}**\n\n` +

            `━━━━━━━━━━━━━━━━━━\n\n` +

            `🎯 Độ bền\n` +

            `\`${"█".repeat(16)}\` **100%**\n` +

            `**${maxUses}/${maxUses}**\n\n` +

            `🔧 Trạng thái: **Sẵn sàng**\n\n` +

            `━━━━━━━━━━━━━━━━━━\n\n` +

            `🎣 Cần câu đã được phục hồi hoàn toàn.\n` +

            `Bạn có thể trang bị và tiếp tục câu cá!`

        )

        .setFooter({

            text:
                "Fishing Adventure · Workshop"

        })

        .setTimestamp();

}


// ======================================================
// MODULE
// ======================================================

module.exports = {

    name: "repair",

    aliases: [
        "fix",
        "sua"
    ],


    async execute(message) {

        const user =
            getUser(
                message.author.id
            );


        // ==================================================
        // KIỂM TRA SỬA CŨ
        // ==================================================

        if (
            user.repair &&
            user.repair.rodId
        ) {

            const endAt =
                Number(
                    user.repair.endAt
                );


            // Nếu sửa đã xong nhưng bot chưa xử lý

            if (
                endAt &&
                Date.now() >= endAt
            ) {

                await finishRepair(
                    message.client,
                    message.author.id
                );

            }

        }


        // ==================================================
        // ĐANG SỬA
        // ==================================================

        if (
            user.repair &&
            user.repair.rodId
        ) {

            const repairId =
                user.repair.rodId;


            const base =
                rods[repairId];


            const remaining =
                Math.max(
                    0,
                    Number(
                        user.repair.endAt
                    ) -
                    Date.now()
                );


            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor(
                            "#f5a623"
                        )

                        .setAuthor({

                            name:
                                `${message.author.username} · Workshop`,

                            iconURL:
                                message.author.displayAvatarURL({
                                    extension: "png",
                                    size: 128
                                })

                        })

                        .setTitle(
                            "🔧 Cần đang được sửa"
                        )

                        .setDescription(

                            `${base?.emoji || "🎣"} **${base?.name || "Cần câu"}**\n\n` +

                            `🔧 Trạng thái: **Đang sửa chữa**\n` +

                            `⏳ Còn lại: **${formatTime(
                                remaining / 1000
                            )}**\n\n` +

                            `💡 Bạn có thể trang bị **cần khác** ` +
                            `trong lúc chờ sửa.`

                        )

                        .setFooter({

                            text:
                                "Fishing Adventure · Workshop"

                        })

                ]

            });

        }


        // ==================================================
        // LẤY CẦN ĐANG DÙNG
        // ==================================================

        const id =
            user.can?.dangDung;


        if (!id) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor(
                            "#ff6b81"
                        )

                        .setAuthor({

                            name:
                                `${message.author.username} · Workshop`,

                            iconURL:
                                message.author.displayAvatarURL({
                                    extension: "png",
                                    size: 128
                                })

                        })

                        .setTitle(
                            "🎣 Chưa trang bị cần"
                        )

                        .setDescription(
                            "Bạn chưa trang bị cần câu.\n\n" +
                            "Hãy trang bị một chiếc cần trước khi sửa."
                        )

                        .setFooter({

                            text:
                                "Fishing Adventure · Workshop"

                        })

                ]

            });

        }


        // ==================================================
        // THÔNG TIN CẦN
        // ==================================================

        const base =
            rods[id];


        if (!base) {

            return message.reply({

                content:
                    "❌ Không tìm thấy loại cần."

            });

        }


        const rod =
            user.rodData?.[id];


        if (!rod) {

            return message.reply({

                content:
                    "❌ Không tìm thấy dữ liệu cần."

            });

        }


        // Đảm bảo maxUses tồn tại

        if (!rod.maxUses) {

            rod.maxUses =
                base.uses;

        }


        // ==================================================
        // TÍNH TOÁN
        // ==================================================

        const price =
            getRepairPrice(
                base,
                rod
            );


        const repairSeconds =
            getRepairTime(
                base,
                rod
            );


        const ratio =
            Math.max(
                0,
                Math.min(
                    1,
                    rod.uses /
                    rod.maxUses
                )
            );


        const percent =
            Math.floor(
                ratio * 100
            );


        const size = 16;


        const filled =
            Math.round(
                ratio * size
            );


        const bar =
            "█".repeat(
                filled
            ) +

            "░".repeat(
                size - filled
            );


        // ==================================================
        // TRẠNG THÁI
        // ==================================================

        let status =
            "🟢 Tốt";

        let color =
            "#72e6c1";


        if (percent <= 75) {

            status =
                "🟡 Đang hao mòn";

            color =
                "#ffd166";

        }


        if (percent <= 50) {

            status =
                "🟠 Cần bảo dưỡng";

            color =
                "#ff9f68";

        }


        if (percent <= 25) {

            status =
                "🔴 Rất yếu";

            color =
                "#ff6b81";

        }


        if (
            rod.destroyed ||
            rod.uses <= 0
        ) {

            status =
                "💥 Đã gãy";

            color =
                "#ff4d67";

        }


        // ==================================================
        // EMBED THÔNG TIN
        // ==================================================

        function createRepairEmbed() {

            return new EmbedBuilder()

                .setColor(
                    color
                )

                .setAuthor({

                    name:
                        `${message.author.username} · Workshop`,

                    iconURL:
                        message.author.displayAvatarURL({
                            extension: "png",
                            size: 128
                        })

                })

                .setTitle(
                    "🔧 Sửa chữa cần câu"
                )

                .setDescription(

                    `${base.emoji} **${base.name}**\n` +

                    `${"⭐".repeat(
                        base.star || 1
                    )}\n\n` +

                    `${status}\n` +

                    `\`${bar}\` **${percent}%**\n` +

                    `🎯 ${rod.uses}/${rod.maxUses} độ bền`

                )

                .addFields(

                    {

                        name:
                            "💸 Phí sửa",

                        value:
                            `${formatMoney(price)} ${emoji.money}`,

                        inline:
                            true

                    },

                    {

                        name:
                            "⏳ Thời gian",

                        value:
                            formatTime(
                                repairSeconds
                            ),

                        inline:
                            true

                    },

                    {

                        name:
                            "💰 Số dư",

                        value:
                            `${formatMoney(user.money)} ${emoji.money}`,

                        inline:
                            true

                    },

                    {

                        name:
                            "🎣 Độ bền tối đa",

                        value:
                            `${rod.maxUses}`,

                        inline:
                            true

                    },

                    {

                        name:
                            "🍀 May mắn",

                        value:
                            `+${base.luck || 0}`,

                        inline:
                            true

                    },

                    {

                        name:
                            "⭐ Cấp cần",

                        value:
                            `${base.star || 1}`,

                        inline:
                            true

                    }

                )

                .setFooter({

                    text:
                        "💡 Cần càng hỏng → sửa càng lâu"

                });

        }


        // ==================================================
        // NÚT
        // ==================================================

        const repairButton =
            new ButtonBuilder()

                .setCustomId(
                    `repair_start_${message.author.id}`
                )

                .setLabel(
                    "Sửa cần"
                )

                .setEmoji(
                    "🔧"
                )

                .setStyle(
                    ButtonStyle.Primary
                );


        const cancelButton =
            new ButtonBuilder()

                .setCustomId(
                    `repair_cancel_${message.author.id}`
                )

                .setLabel(
                    "Hủy"
                )

                .setEmoji(
                    "❌"
                )

                .setStyle(
                    ButtonStyle.Secondary
                );


        const row =
            new ActionRowBuilder()
                .addComponents(
                    repairButton,
                    cancelButton
                );


        // ==================================================
        // GỬI EMBED
        // ==================================================

        const reply =
            await message.reply({

                embeds: [
                    createRepairEmbed()
                ],

                components: [
                    row
                ]

            });


        // ==================================================
        // COLLECTOR
        // ==================================================

        const collector =
            reply.createMessageComponentCollector({

                time:
                    120000

            });


        collector.on(
            "collect",
            async interaction => {

                // ==========================================
                // KIỂM TRA USER
                // ==========================================

                if (
                    interaction.user.id !==
                    message.author.id
                ) {

                    return interaction.reply({

                        content:
                            "❌ Đây không phải bảng sửa cần của bạn!",

                        ephemeral:
                            true

                    });

                }


                // ==========================================
                // HỦY
                // ==========================================

                if (
                    interaction.customId ===
                    `repair_cancel_${message.author.id}`
                ) {

                    collector.stop(
                        "cancel"
                    );


                    return interaction.update({

                        embeds: [

                            new EmbedBuilder()

                                .setColor(
                                    "#777777"
                                )

                                .setTitle(
                                    "❌ Đã hủy sửa chữa"
                                )

                                .setDescription(

                                    `${base.emoji} **${base.name}**\n\n` +

                                    "Không có thay đổi nào được thực hiện."

                                )

                                .setFooter({

                                    text:
                                        "Fishing Adventure"

                                })

                        ],

                        components: []

                    });

                }


                // ==========================================
                // BẤM SỬA
                // ==========================================

                if (
                    interaction.customId ===
                    `repair_start_${message.author.id}`
                ) {

                    // Cần đã đầy

                    if (
                        rod.uses >= rod.maxUses &&
                        !rod.destroyed
                    ) {

                        return interaction.update({

                            embeds: [

                                new EmbedBuilder()

                                    .setColor(
                                        "#72e6c1"
                                    )

                                    .setTitle(
                                        "✨ Cần vẫn còn tốt"
                                    )

                                    .setDescription(

                                        `${base.emoji} **${base.name}**\n\n` +

                                        `\`${"█".repeat(16)}\` **100%**\n\n` +

                                        `🎯 ${rod.uses}/${rod.maxUses}\n\n` +

                                        "Cần chưa cần sửa."

                                    )

                            ],

                            components: []

                        });

                    }


                    // Không đủ tiền

                    if (
                        user.money <
                        price
                    ) {

                        return interaction.reply({

                            content:
                                `❌ Bạn cần ${formatMoney(price)} ${emoji.money} để sửa.`,

                            ephemeral:
                                true

                        });

                    }


                    // ======================================
                    // XÁC NHẬN
                    // ======================================

                    const confirm =
                        new ButtonBuilder()

                            .setCustomId(
                                `repair_confirm_${message.author.id}`
                            )

                            .setLabel(
                                "Chấp nhận"
                            )

                            .setEmoji(
                                "✅"
                            )

                            .setStyle(
                                ButtonStyle.Success
                            );


                    const back =
                        new ButtonBuilder()

                            .setCustomId(
                                `repair_back_${message.author.id}`
                            )

                            .setLabel(
                                "Hủy"
                            )

                            .setEmoji(
                                "❌"
                            )

                            .setStyle(
                                ButtonStyle.Danger
                            );


                    return interaction.update({

                        embeds: [

                            new EmbedBuilder()

                                .setColor(
                                    "#9b7cff"
                                )

                                .setAuthor({

                                    name:
                                        `${message.author.username} · Workshop`,

                                    iconURL:
                                        message.author.displayAvatarURL({
                                            extension: "png",
                                            size: 128
                                        })

                                })

                                .setTitle(
                                    "🔧 Xác nhận sửa"
                                )

                                .setDescription(

                                    `${base.emoji} **${base.name}**\n\n` +

                                    `🎯 Độ bền: **${rod.uses}/${rod.maxUses}**\n` +

                                    `💸 Chi phí: **${formatMoney(price)} ${emoji.money}**\n` +

                                    `⏳ Thời gian: **${formatTime(
                                        repairSeconds
                                    )}**\n\n` +

                                    `💡 Trong thời gian sửa, bạn có thể ` +

                                    `trang bị **cần khác** để tiếp tục câu.\n\n` +

                                    `Xác nhận bắt đầu sửa?`

                                )

                                .setFooter({

                                    text:
                                        "Cần sẽ được sửa trong thời gian trên"

                                })

                        ],

                        components: [

                            new ActionRowBuilder()
                                .addComponents(
                                    confirm,
                                    back
                                )

                        ]

                    });

                }


                // ==========================================
                // QUAY LẠI
                // ==========================================

                if (
                    interaction.customId ===
                    `repair_back_${message.author.id}`
                ) {

                    return interaction.update({

                        embeds: [
                            createRepairEmbed()
                        ],

                        components: [
                            row
                        ]

                    });

                }


                // ==========================================
                // CHẤP NHẬN
                // ==========================================

                if (
                    interaction.customId ===
                    `repair_confirm_${message.author.id}`
                ) {

                    // Kiểm tra tiền lần cuối

                    if (
                        user.money <
                        price
                    ) {

                        return interaction.reply({

                            content:
                                "❌ Bạn không còn đủ tiền.",

                            ephemeral:
                                true

                        });

                    }


                    // ======================================
                    // TRỪ TIỀN
                    // ======================================

                    user.money -=
                        price;


                    // ======================================
                    // TÍNH THỜI GIAN
                    // ======================================

                    const endAt =
                        Date.now() +
                        (
                            repairSeconds *
                            1000
                        );


                    // ======================================
                    // LƯU TRẠNG THÁI SỬA
                    // ======================================

                    user.repair = {

                        rodId:
                            id,

                        endAt:
                            endAt

                    };


                    // LƯU CHANNEL
                    // để sau này bot biết gửi thông báo ở đâu

                    user.repairChannel =
                        message.channel.id;


                    // ======================================
                    // THÁO CẦN ĐANG DÙNG
                    // ======================================

                    if (
                        user.can &&
                        user.can.dangDung === id
                    ) {

                        user.can.dangDung =
                            null;

                    }


                    save();


                    // ======================================
                    // TẠO TIMER
                    // ======================================

                    setTimeout(
                        async () => {

                            await finishRepair(

                                message.client,

                                message.author.id

                            );

                        },

                        repairSeconds * 1000

                    );


                    collector.stop(
                        "repairing"
                    );


                    // ======================================
                    // EMBED ĐANG SỬA
                    // ======================================

                    return interaction.update({

                        embeds: [

                            new EmbedBuilder()

                                .setColor(
                                    "#f5a623"
                                )

                                .setAuthor({

                                    name:
                                        `${message.author.username} · Workshop`,

                                    iconURL:
                                        message.author.displayAvatarURL({
                                            extension: "png",
                                            size: 128
                                        })

                                })

                                .setTitle(
                                    "🔧 Đang sửa cần"
                                )

                                .setDescription(

                                    `${base.emoji} **${base.name}**\n\n` +

                                    `🎯 Độ bền: **${rod.uses}/${rod.maxUses}**\n\n` +

                                    `💸 Đã thanh toán: **${formatMoney(price)} ${emoji.money}**\n` +

                                    `⏳ Thời gian sửa: **${formatTime(
                                        repairSeconds
                                    )}**\n\n` +

                                    `🔧 Cần đang được sửa...\n\n` +

                                    `Bạn có thể trang bị **cần khác** ` +

                                    `và tiếp tục câu cá.\n\n` +

                                    `✨ Khi hoàn tất, cần sẽ tự động hồi ` +

                                    `**${rod.maxUses}/${rod.maxUses}** độ bền.`

                                )

                                .setFooter({

                                    text:
                                        "Fishing Adventure · Workshop"

                                })

                        ],

                        components: []

                    });

                }

            }
        );


        // ==================================================
        // HẾT THỜI GIAN COLLECTOR
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
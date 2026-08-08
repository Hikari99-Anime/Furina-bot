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
// FORMAT TIME
// ======================================================

function formatTime(seconds) {

    seconds = Math.max(
        0,
        Math.ceil(seconds)
    );

    const minutes =
        Math.floor(seconds / 60);

    const secs =
        seconds % 60;

    if (minutes > 0)
        return `${minutes} phút ${secs} giây`;

    return `${secs} giây`;
}


// ======================================================
// THỜI GIAN SỬA TỐI ĐA THEO CẤP CẦN
//
// ⭐      = 1 phút
// ⭐⭐     = 2 phút
// ⭐⭐⭐    = 3 phút
// ⭐⭐⭐⭐   = 4 phút
// ⭐⭐⭐⭐⭐  = 5 phút
// ======================================================

function getMaxRepairTime(base) {

    const star =
        Math.max(
            1,
            Math.min(
                5,
                base.star || 1
            )
        );

    return star * 60;
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

    // Cần gãy → không sửa
    if (
        rod.destroyed ||
        uses <= 0
    ) {
        return 0;
    }

    const lostRatio =
        Math.max(
            0,
            Math.min(
                1,
                1 - (uses / maxUses)
            )
        );

    const maxTime =
        getMaxRepairTime(base);

    // Hỏng nhẹ vẫn sửa nhanh
    // Tối thiểu 10 giây
    return Math.ceil(
        10 +
        lostRatio *
        (maxTime - 10)
    );
}


// ======================================================
// TÍNH PHÍ SỬA THƯỜNG
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

    // Gãy hoàn toàn → không sửa
    if (
        rod.destroyed ||
        uses <= 0
    ) {
        return 0;
    }

    const lostRatio =
        Math.max(
            0,
            Math.min(
                1,
                1 - (uses / maxUses)
            )
        );

    let price =
        Math.floor(
            base.price *
            Math.pow(
                lostRatio,
                0.75
            )
        );

    // Có hỏng thì tối thiểu 1.000
    if (price < 1000)
        price = 1000;

    return Math.min(
        price,
        base.price
    );
}


// ======================================================
// TÍNH PHÍ SỬA NHANH
//
// Sửa nhanh = phí sửa thường
//             + 5% giá cần
//             + 50 tiền / phút
//
// Không vượt quá 80% giá cần mới.
// ======================================================

function getQuickRepairPrice(
    base,
    repairPrice,
    repairSeconds
) {

    const valueFee =
        Math.floor(
            base.price * 0.05
        );

    const timeFee =
        Math.ceil(
            repairSeconds / 60
        ) * 50;

    const price =
        repairPrice +
        valueFee +
        timeFee;

    return Math.min(
        Math.max(
            price,
            repairPrice + 1
        ),
        Math.floor(
            base.price * 0.8
        )
    );
}


// ======================================================
// EMBED SỬA XONG
// ======================================================

function createFinishedEmbed(
    discordUser,
    base,
    rod
) {

    const maxUses =
        rod.maxUses ||
        base.uses ||
        1;

    return new EmbedBuilder()

        .setColor("#8affb2")

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
            "🔧 `REPAIR COMPLETE`"
        )

        .setDescription(

            `*Cần câu đã được sửa xong.*\n` +
            `*Độ bền đã được phục hồi hoàn toàn.*\n\n` +

            `${base.emoji} ${base.name}\n\n` +

            `> 🎯 Độ bền: ${maxUses}/${maxUses}\n` +
            `> 🔧 Trạng thái: Sẵn sàng\n\n` +

            `✦ *Bạn có thể tiếp tục câu cá.*`

        )

        .setFooter({
            text:
                "✦ Fishing Adventure · Workshop"
        })

        .setTimestamp();
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
            delete user.repairChannel;

            save();

            return;
        }

        const rod =
            user.rodData?.[repairId];

        if (!rod) {

            delete user.repair;
            delete user.repairChannel;

            save();

            return;
        }

        // Lấy channel TRƯỚC khi xóa trạng thái repair
        const channelId =
            user.repairChannel;

        // Hồi đầy độ bền
        rod.maxUses =
            rod.maxUses ||
            base.uses ||
            1;

        rod.uses =
            rod.maxUses;

        rod.destroyed =
            false;

        delete user.repair;
        delete user.repairChannel;

        save();

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

        // Gửi về channel cũ
        if (channelId) {

            const channel =
                await client.channels
                    .fetch(channelId)
                    .catch(
                        () => null
                    );

            if (
                channel &&
                channel.isTextBased()
            ) {

                await channel.send({

                    content:
                        `<@${userId}>`,

                    embeds: [
                        embed
                    ]

                }).catch(
                    () => {}
                );

                return;
            }
        }

        // Không gửi được channel → DM
        await discordUser
            .send({
                embeds: [
                    embed
                ]
            })
            .catch(
                () => {}
            );

    } catch (error) {

        console.error(
            "❌ Lỗi hoàn tất sửa cần:",
            error
        );

    }
}


// ======================================================
// EMBED CẦN ĐANG SỬA
// ======================================================

function createRepairingEmbed(
    message,
    base,
    rod,
    price,
    repairSeconds,
    quickPrice
) {

    return new EmbedBuilder()

        .setColor("#f5a623")

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
            "🔧 `REPAIRING`"
        )

        .setDescription(

            `${base.emoji} ${base.name}\n\n` +

            `> 🎯 Độ bền: ${rod.uses}/${rod.maxUses}\n` +
            `> 💸 Phí sửa: ${formatMoney(price)} ${emoji.money}\n` +
            `> ⚡ Sửa nhanh: ${formatMoney(quickPrice)} ${emoji.money}\n` +
            `> ⏳ Thời gian: ${formatTime(repairSeconds)}\n\n` +

            `🔧 Trạng thái: Đang sửa\n\n` +

            `💡 Bạn có thể trang bị cần khác ` +
            `trong lúc chờ sửa.`

        )

        .setFooter({
            text:
                "✦ Fishing Adventure · Workshop"
        });
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
        // KIỂM TRA REPAIR CŨ
        // ==================================================

        if (
            user.repair &&
            user.repair.rodId
        ) {

            const endAt =
                Number(
                    user.repair.endAt
                );

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

                        .setColor("#f5a623")

                        .setTitle(
                            "🔧 `REPAIRING`"
                        )

                        .setDescription(

                            `${base?.emoji || "🎣"} ` +
                            `${base?.name || "Cần câu"}\n\n` +

                            `> 🔧 Trạng thái: Đang sửa\n` +
                            `> ⏳ Còn lại: ${formatTime(
                                remaining / 1000
                            )}\n\n` +

                            `💡 Bạn có thể trang bị cần khác ` +
                            `trong lúc chờ sửa.`

                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure · Workshop"
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

                        .setColor("#ff6b81")

                        .setTitle(
                            "🎣 `NO ROD EQUIPPED`"
                        )

                        .setDescription(

                            `Bạn chưa trang bị cần câu.\n\n` +

                            `> 💡 Hãy trang bị một chiếc cần ` +
                            `trước khi sửa.`

                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure"
                        })

                ]

            });
        }


        // ==================================================
        // LẤY THÔNG TIN CẦN
        // ==================================================

        const base =
            rods[id];

        if (!base) {

            return message.reply(
                "╰・❌ Không tìm thấy loại cần."
            );
        }

        const rod =
            user.rodData?.[id];

        if (!rod) {

            return message.reply(
                "╰・❌ Không tìm thấy dữ liệu cần."
            );
        }


        rod.maxUses =
            rod.maxUses ||
            base.uses ||
            1;


        // ==================================================
        // CẦN ĐÃ GÃY
        // ==================================================

        if (
            rod.destroyed ||
            rod.uses <= 0
        ) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor("#ff4d67")

                        .setTitle(
                            "💥 `ROD BROKEN`"
                        )

                        .setDescription(

                            `${base.emoji} ${base.name}\n\n` +

                            `> 🎯 Độ bền: 0/${rod.maxUses}\n` +
                            `> 🔧 Trạng thái: Đã gãy\n\n` +

                            `Cần câu đã hỏng hoàn toàn.\n` +
                            `Việc sửa chữa không còn hiệu quả.\n\n` +

                            `💡 Khuyến nghị: Mua cần mới ` +
                            `để tiếp tục câu cá.`

                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure"
                        })

                ]

            });
        }


        // ==================================================
        // CẦN CÒN ĐẦY
        // ==================================================

        if (
            rod.uses >= rod.maxUses
        ) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor("#8affb2")

                        .setTitle(
                            "✨ `ROD IS READY`"
                        )

                        .setDescription(

                            `${base.emoji} ${base.name}\n\n` +

                            `> 🎯 Độ bền: ${rod.uses}/${rod.maxUses}\n` +
                            `> 🔧 Trạng thái: Sẵn sàng\n\n` +

                            `Cần câu vẫn còn tốt.\n` +
                            `Không cần sửa chữa.`

                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure"
                        })

                ]

            });
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

        const quickPrice =
            getQuickRepairPrice(
                base,
                price,
                repairSeconds
            );


        // ==================================================
        // EMBED THÔNG TIN
        // ==================================================

        function createRepairEmbed() {

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

            const size =
                16;

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

            return new EmbedBuilder()

                .setColor("#ffd166")

                .setTitle(
                    "🔧 `ROD REPAIR`"
                )

                .setDescription(

                    `${base.emoji} ${base.name}\n` +

                    `${"⭐".repeat(
                        base.star || 1
                    )}\n\n` +

                    `\`${bar}\` ${percent}%\n` +

                    `> 🎯 Độ bền: ${rod.uses}/${rod.maxUses}\n` +
                    `> 💸 Sửa thường: ${formatMoney(price)} ${emoji.money}\n` +
                    `> ⏳ Thời gian: ${formatTime(repairSeconds)}\n` +
                    `> ⚡ Sửa nhanh: ${formatMoney(quickPrice)} ${emoji.money}\n` +
                    `> 💰 Số dư: ${formatMoney(user.money)} ${emoji.money}\n\n` +

                    `✦ *Cần càng hỏng, thời gian và phí sửa càng cao.*`

                )

                .setFooter({
                    text:
                        "✦ Fishing Adventure · Workshop"
                });
        }


        // ==================================================
        // BUTTON
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

        const quickButton =
            new ButtonBuilder()

                .setCustomId(
                    `repair_quick_${message.author.id}`
                )

                .setLabel(
                    "Sửa nhanh"
                )

                .setEmoji(
                    "⚡"
                )

                .setStyle(
                    ButtonStyle.Success
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
                    quickButton,
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
                time: 120000
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

                                .setColor("#777777")

                                .setTitle(
                                    "❌ `REPAIR CANCELLED`"
                                )

                                .setDescription(

                                    `${base.emoji} ${base.name}\n\n` +

                                    `Không có thay đổi nào được thực hiện.`

                                )

                                .setFooter({
                                    text:
                                        "✦ Fishing Adventure"
                                })

                        ],

                        components: []

                    });
                }


                // ==========================================
                // SỬA NHANH
                // ==========================================

                if (
                    interaction.customId ===
                    `repair_quick_${message.author.id}`
                ) {

                    if (
                        user.money <
                        quickPrice
                    ) {

                        return interaction.reply({

                            content:
                                `❌ Bạn cần ${formatMoney(quickPrice)} ${emoji.money} để sửa nhanh.`,

                            ephemeral:
                                true

                        });
                    }

                    const confirm =
                        new ButtonBuilder()

                            .setCustomId(
                                `repair_quick_confirm_${message.author.id}`
                            )

                            .setLabel(
                                "Sửa ngay"
                            )

                            .setEmoji(
                                "⚡"
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
                                "Quay lại"
                            )

                            .setEmoji(
                                "↩️"
                            )

                            .setStyle(
                                ButtonStyle.Secondary
                            );

                    return interaction.update({

                        embeds: [

                            new EmbedBuilder()

                                .setColor("#ffd166")

                                .setTitle(
                                    "⚡ `QUICK REPAIR`"
                                )

                                .setDescription(

                                    `${base.emoji} ${base.name}\n\n` +

                                    `> 🎯 Độ bền: ${rod.uses}/${rod.maxUses}\n` +
                                    `> 💸 Sửa thường: ${formatMoney(price)} ${emoji.money}\n` +
                                    `> ⚡ Sửa nhanh: ${formatMoney(quickPrice)} ${emoji.money}\n` +
                                    `> ⏳ Thời gian: Hoàn tất ngay\n\n` +

                                    `*Sửa nhanh bỏ qua toàn bộ thời gian chờ.*\n\n` +

                                    `✦ Xác nhận sửa ngay?`

                                )

                                .setFooter({
                                    text:
                                        "✦ Fishing Adventure · Workshop"
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
                // BẮT ĐẦU SỬA THƯỜNG
                // ==========================================

                if (
                    interaction.customId ===
                    `repair_start_${message.author.id}`
                ) {

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

                    const confirm =
                        new ButtonBuilder()

                            .setCustomId(
                                `repair_confirm_${message.author.id}`
                            )

                            .setLabel(
                                "Xác nhận"
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
                                "Quay lại"
                            )

                            .setEmoji(
                                "↩️"
                            )

                            .setStyle(
                                ButtonStyle.Secondary
                            );

                    return interaction.update({

                        embeds: [

                            new EmbedBuilder()

                                .setColor("#9b7cff")

                                .setTitle(
                                    "🔧 `CONFIRM REPAIR`"
                                )

                                .setDescription(

                                    `${base.emoji} ${base.name}\n\n` +

                                    `> 🎯 Độ bền: ${rod.uses}/${rod.maxUses}\n` +
                                    `> 💸 Chi phí: ${formatMoney(price)} ${emoji.money}\n` +
                                    `> ⏳ Thời gian: ${formatTime(repairSeconds)}\n\n` +

                                    `💡 Bạn có thể trang bị cần khác ` +
                                    `trong lúc chờ.\n\n` +

                                    `✦ Xác nhận bắt đầu sửa?`

                                )

                                .setFooter({
                                    text:
                                        "✦ Fishing Adventure · Workshop"
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
                // XÁC NHẬN SỬA THƯỜNG
                // ==========================================

                if (
                    interaction.customId ===
                    `repair_confirm_${message.author.id}`
                ) {

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

                    user.money -=
                        price;

                    const endAt =
                        Date.now() +
                        repairSeconds * 1000;

                    user.repair = {

                        rodId:
                            id,

                        endAt:
                            endAt

                    };

                    user.repairChannel =
                        message.channel.id;

                    // Tháo cần đang dùng
                    if (
                        user.can?.dangDung === id
                    ) {

                        user.can.dangDung =
                            null;

                    }

                    save();

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

                    return interaction.update({

                        embeds: [

                            createRepairingEmbed(
                                message,
                                base,
                                rod,
                                price,
                                repairSeconds,
                                quickPrice
                            )

                        ],

                        components: []

                    });
                }


                // ==========================================
                // XÁC NHẬN SỬA NHANH
                // ==========================================

                if (
                    interaction.customId ===
                    `repair_quick_confirm_${message.author.id}`
                ) {

                    if (
                        user.money <
                        quickPrice
                    ) {

                        return interaction.reply({

                            content:
                                "❌ Bạn không còn đủ tiền để sửa nhanh.",

                            ephemeral:
                                true

                        });
                    }

                    user.money -=
                        quickPrice;

                    rod.maxUses =
                        rod.maxUses ||
                        base.uses ||
                        1;

                    rod.uses =
                        rod.maxUses;

                    rod.destroyed =
                        false;

                    // Nếu đang dùng cần này
                    if (
                        user.can?.dangDung === id
                    ) {

                        user.can.dangDung =
                            null;

                    }

                    delete user.repair;
                    delete user.repairChannel;

                    save();

                    collector.stop(
                        "quick_repair"
                    );

                    return interaction.update({

                        embeds: [

                            new EmbedBuilder()

                                .setColor("#8affb2")

                                .setTitle(
                                    "⚡ `QUICK REPAIR COMPLETE`"
                                )

                                .setDescription(

                                    `*Cần câu đã được sửa nhanh thành công.*\n\n` +

                                    `${base.emoji} ${base.name}\n\n` +

                                    `> 🎯 Độ bền: ${rod.uses}/${rod.maxUses}\n` +
                                    `> ⚡ Đã thanh toán: ${formatMoney(quickPrice)} ${emoji.money}\n` +
                                    `> ⏳ Thời gian: Hoàn tất ngay\n` +
                                    `> 🔧 Trạng thái: Sẵn sàng\n\n` +

                                    `✦ *Cần câu đã được phục hồi hoàn toàn.*`

                                )

                                .setFooter({
                                    text:
                                        "✦ Fishing Adventure · Workshop"
                                })

                                .setTimestamp()

                        ],

                        components: []

                    });
                }

            }
        );


        // ==================================================
        // COLLECTOR END
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
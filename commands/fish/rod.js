const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const {
    rods
} = require("../../config");

const {
    getUser,
    save
} = require("../../data");

// ======================================================
// EMOJI CUSTOM CẦN CÂU
// ======================================================

const rodEmojis = {
    wood: "<:cancau_1:1534625089088393358>",
    iron: "<:cancau_2:1534635569219633212>",
    gold: "<:cancau_3:1534625401119445170>",
    diamond: "<:cancau_4:1534635400793165965>"
};

// ======================================================
// FORMAT LEVEL
// ======================================================

function formatLevel(level) {

    level = Number(level) || 0;

    return `\`+${level}\``;
}

// ======================================================
// FORMAT LUCK
// ======================================================

function formatLuck(luck) {

    luck = Number(luck);

    if (!Number.isFinite(luck))
        luck = 1;

    // Không hiện 1.2000000000000002
    return Number(
        luck.toFixed(2)
    );
}

// ======================================================
// FORMAT ROD
// ======================================================

function formatRod(id, user) {

    const base =
        rods[id];

    if (!base)
        return null;

    const rod =
        user.rodData?.[id];

    if (!rod)
        return null;

    const maxUses =
        Number(
            rod.maxUses ||
            base.uses ||
            100
        );

    const uses =
        Math.max(
            0,
            Math.min(
                maxUses,
                Number(
                    rod.uses ?? maxUses
                )
            )
        );

    const level =
        Number(
            rod.level
        ) || 0;

    const luck =
        Number(
            rod.luck ??
            base.luck ??
            1
        );

    const active =
        user.can?.dangDung === id
            ? "🟢"
            : "⚪";

    const customEmoji =
        rodEmojis[id] ||
        base.emoji ||
        "🎣";

    return (
        `${active} ` +
        `${customEmoji} ` +
        `${base.name} ` +
        `${formatLevel(level)} ` +
        `Độ bền (${uses}/${maxUses}) ` +
        `Luck ${formatLuck(luck)}`
    );
}

// ======================================================
// MODULE
// ======================================================

module.exports = {

    name: "rod",

    aliases: [
        "can",
        "cancau"
    ],

    async execute(message) {

        const user =
            getUser(
                message.author.id
            );

        // ==================================================
        // LẤY DANH SÁCH CẦN
        // ==================================================

        const list =
            Object.keys(
                user.can?.danhSach || {}
            );

        if (!list.length) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor("#ff6b81")

                        .setTitle(
                            "🎣 `ROD COLLECTION`"
                        )

                        .setDescription(
                            "Bạn chưa sở hữu cần câu."
                        )

                        .setFooter({
                            text:
                                "✦ Fishing Adventure"
                        })

                ]

            });
        }

        // ==================================================
        // HIỂN THỊ CẦN
        // ==================================================

        const rodLines = [];

        for (const id of list) {

            const line =
                formatRod(
                    id,
                    user
                );

            if (line)
                rodLines.push(line);
        }

        if (!rodLines.length) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor("#ff6b81")

                        .setTitle(
                            "🎣 `ROD COLLECTION`"
                        )

                        .setDescription(
                            "Không tìm thấy dữ liệu cần câu."
                        )

                ]

            });
        }

        // ==================================================
        // BUTTON
        // ==================================================

        const buttons = [];

        for (
            const id of list.slice(0, 5)
        ) {

            const base =
                rods[id];

            if (!base)
                continue;

            const customEmoji =
                rodEmojis[id] ||
                base.emoji ||
                "🎣";

            const button =
                new ButtonBuilder()

                    .setCustomId(
                        `equip_${id}`
                    )

                    .setLabel(
                        base.name
                    )

                    .setStyle(
                        ButtonStyle.Primary
                    );

            // Emoji custom phải dùng object
            // để Discord nhận ID emoji chính xác
            if (
                rodEmojis[id]
            ) {

                const emojiId =
                    rodEmojis[id]
                        .match(
                            /:(?:[^:]+):(\d+)/
                        );

                if (emojiId) {

                    button.setEmoji({
                        id:
                            emojiId[1]
                    });

                }

            } else {

                button.setEmoji(
                    customEmoji
                );

            }

            buttons.push(
                button
            );
        }

        const rows = [];

        for (
            let i = 0;
            i < buttons.length;
            i += 5
        ) {

            rows.push(

                new ActionRowBuilder()
                    .addComponents(
                        buttons.slice(
                            i,
                            i + 5
                        )
                    )

            );
        }

        // ==================================================
        // EMBED
        // ==================================================

        const embed =
            new EmbedBuilder()

                .setColor("#89ddff")

                .setTitle(
                    "🎣 `ROD COLLECTION`"
                )

                .setDescription(

                    `*Bộ sưu tập cần câu của bạn.*\n\n` +

                    rodLines.join("\n") +

                    `\n\n🟢 Đang trang bị · ⚪ Chưa trang bị`

                )

                .setFooter({
                    text:
                        "✦ Fishing Adventure"
                });

        // ==================================================
        // GỬI
        // ==================================================

        const msg =
            await message.reply({

                embeds: [
                    embed
                ],

                components:
                    rows

            });

        // ==================================================
        // COLLECTOR
        // ==================================================

        const collector =
            msg.createMessageComponentCollector({

                time:
                    60000

            });

        collector.on(
            "collect",
            async interaction => {

                // ==========================================
                // KIỂM TRA NGƯỜI DÙNG
                // ==========================================

                if (
                    interaction.user.id !==
                    message.author.id
                ) {

                    return interaction.reply({

                        content:
                            "❌ Đây không phải bảng cần câu của bạn.",

                        ephemeral:
                            true

                    });
                }

                // ==========================================
                // LẤY ID
                // ==========================================

                const id =
                    interaction.customId.replace(
                        "equip_",
                        ""
                    );

                // ==========================================
                // KIỂM TRA SỞ HỮU
                // ==========================================

                if (
                    !user.can?.danhSach?.[id]
                ) {

                    return interaction.reply({

                        content:
                            "❌ Bạn chưa sở hữu cần này.",

                        ephemeral:
                            true

                    });
                }

                const base =
                    rods[id];

                const rod =
                    user.rodData?.[id];

                if (
                    !base ||
                    !rod
                ) {

                    return interaction.reply({

                        content:
                            "❌ Không tìm thấy dữ liệu cần.",

                        ephemeral:
                            true

                    });
                }

                // ==========================================
                // TRANG BỊ
                // ==========================================

                user.can.dangDung =
                    id;

                save();

                // ==========================================
                // THÔNG TIN CẦN
                // ==========================================

                const maxUses =
                    Number(
                        rod.maxUses ||
                        base.uses ||
                        100
                    );

                const uses =
                    Math.max(
                        0,
                        Math.min(
                            maxUses,
                            Number(
                                rod.uses ??
                                maxUses
                            )
                        )
                    );

                const level =
                    Number(
                        rod.level
                    ) || 0;

                const luck =
                    Number(
                        rod.luck ??
                        base.luck ??
                        1
                    );

                const customEmoji =
                    rodEmojis[id] ||
                    base.emoji ||
                    "🎣";

                // ==========================================
                // UPDATE
                // ==========================================

                return interaction.update({

                    embeds: [

                        new EmbedBuilder()

                            .setColor("#8affb2")

                            .setTitle(
                                "🎣 `ROD EQUIPPED`"
                            )

                            .setDescription(

                                `${customEmoji} ${base.name} ${formatLevel(level)} ` +
                                `Độ bền (${uses}/${maxUses}) ` +
                                `Luck ${formatLuck(luck)}\n\n` +

                                `🟢 Cần câu đã được trang bị.\n` +
                                `Sẵn sàng cho chuyến câu tiếp theo.`

                            )

                            .setFooter({
                                text:
                                    "✦ Fishing Adventure"
                            })

                    ],

                    components: []

                });

            }
        );

        // ==================================================
        // HẾT THỜI GIAN
        // ==================================================

        collector.on(
            "end",
            async () => {

                try {

                    await msg.edit({

                        components: []

                    });

                } catch {}

            }
        );
    }
};
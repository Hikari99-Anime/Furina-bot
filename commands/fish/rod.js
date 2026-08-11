const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const {
    rods,
    rodTitles
} = require("../../config");

const {
    getUser,
    save
} = require("../../data");

// ======================================================
// SEPARATOR
// ======================================================

const SEPARATOR =
    `\n\n୨୧ ───────── ୨୧\n\n`;

// ======================================================
// LẤY DỮ LIỆU CẦN
// ======================================================

function getRodData(user, id) {

    if (!user.rodData)
        user.rodData = {};

    if (!user.rodData[id]) {

        const base = rods[id];

        if (!base)
            return null;

        user.rodData[id] = {

            level: 0,

            luck:
                base.luck || 1,

            uses:
                base.uses || 1,

            maxUses:
                base.uses || 1,

            destroyed:
                false

        };
    }

    const rod =
        user.rodData[id];

    const base =
        rods[id];

    if (!base)
        return null;

    // ==================================================
    // CHUẨN HÓA LEVEL
    // ==================================================

    rod.level =
        Number(rod.level) || 0;

    // ==================================================
    // CHUẨN HÓA LUCK
    // ==================================================

    rod.luck =
        Number(rod.luck) ||
        base.luck ||
        1;

    // ==================================================
    // ĐỘ BỀN TỐI ĐA
    // ==================================================

    const configMaxUses =
        Math.max(
            1,
            Number(base.uses) || 1
        );

    const oldMaxUses =
        Number(rod.maxUses) || 0;

    let currentUses =
        Number(rod.uses);

    // ==================================================
    // DATA CŨ KHÔNG CÓ USES
    // ==================================================

    if (
        !Number.isFinite(
            currentUses
        )
    ) {

        currentUses =
            configMaxUses;
    }

    // ==================================================
    // MIGRATE MAX USES
    // ==================================================

    if (
        oldMaxUses > 0 &&
        oldMaxUses !== configMaxUses
    ) {

        currentUses =
            currentUses >= oldMaxUses
                ? configMaxUses
                : Math.min(
                    currentUses,
                    configMaxUses
                );
    }

    // ==================================================
    // CLAMP USES
    // ==================================================

    rod.uses =
        Math.max(
            0,
            Math.min(
                currentUses,
                configMaxUses
            )
        );

    rod.maxUses =
        configMaxUses;

    // ==================================================
    // DESTROYED
    // ==================================================

    if (
        typeof rod.destroyed !==
        "boolean"
    ) {

        rod.destroyed =
            rod.uses <= 0;
    }

    return rod;
}

// ======================================================
// SẮP XẾP CẦN
// ======================================================

function sortRodIds(ids) {

    const order =
        Object.keys(
            rods
        );

    return [
        ...ids
    ].sort(
        (a, b) =>
            order.indexOf(a) -
            order.indexOf(b)
    );
}

// ======================================================
// FORMAT LUCK
// ======================================================

function formatLuck(luck) {

    luck =
        Number(luck) || 0;

    if (
        Number.isInteger(
            luck
        )
    ) {

        return String(
            luck
        );
    }

    return luck
        .toFixed(1)
        .replace(
            /\.0$/,
            ""
        );
}

// ======================================================
// FORMAT CẦN
// ======================================================

function createRodLine(
    id,
    user
) {

    const base =
        rods[id];

    if (!base)
        return "";

    const rod =
        getRodData(
            user,
            id
        );

    if (!rod)
        return "";

    const equipped =
        user.can?.dangDung === id
            ? "🟢"
            : "🔴";

    const status =
        rod.destroyed ||
        rod.uses <= 0
            ? "💥"
            : "";

    const level =
        `+${rod.level}`;

    const durability =
        `${rod.uses}/${rod.maxUses}`;

    const luck =
        formatLuck(
            rod.luck
        );

    const title =
        rodTitles?.[
            rod.level
        ]
            ? ` · ${rodTitles[rod.level]}`
            : "";

    return (
        `${equipped} ${base.emoji || "🎣"} ` +
        `${base.name} \`${level}\`` +
        `${status ? ` ${status}` : ""}` +
        ` · Độ bền \`${durability}\`` +
        ` · 🍀 Luck ${luck}` +
        `${title}`
    );
}

// ======================================================
// EMBED COLLECTION
// ======================================================

function createRodEmbed(
    user,
    message
) {

    const list =
        sortRodIds(
            Object.keys(
                user.can?.danhSach || {}
            ).filter(
                id =>
                    rods[id]
            )
        );

    let text = "";

    for (
        const id of list
    ) {

        text +=
            createRodLine(
                id,
                user
            ) +
            "\n";
    }

    text =
        text.trim();

    if (!text) {

        text =
            "Bạn chưa có cần câu.";
    }

    const currentId =
        user.can?.dangDung;

    const current =
        rods[currentId];

    const currentRod =
        currentId
            ? getRodData(
                user,
                currentId
            )
            : null;

    const currentText =
        current
            ? (
                `${current.emoji || "🎣"} ` +
                `${current.name} ` +
                `\`+${currentRod?.level || 0}\``
            )
            : "Chưa có";

    return new EmbedBuilder()

        .setColor(
            "#89ddff"
        )

        .setAuthor({

            name:
                `${message.author.username} · Fishing`,

            iconURL:
                message.author.displayAvatarURL({
                    extension: "png",
                    size: 128
                })

        })

        .setTitle(
            "🎣 ROD COLLECTION"
        )

        .setDescription(

            `Kho cần câu của bạn.` +

            SEPARATOR +

            `${text}` +

            SEPARATOR +

            `🎣 Đang dùng: ${currentText}`

        )

        .setFooter({

            text:
                "✦ Fishing Adventure · Rod Collection"

        })

        .setTimestamp();
}

// ======================================================
// EMBED KHÔNG CÓ CẦN
// ======================================================

function createNoRodEmbed() {

    return new EmbedBuilder()

        .setColor(
            "#ff6b81"
        )

        .setTitle(
            "🎣 NO ROD"
        )

        .setDescription(

            `Bạn chưa có cần câu.` +

            SEPARATOR +

            `Hãy mua cần câu tại shop để bắt đầu câu cá.`

        )

        .setFooter({

            text:
                "✦ Fishing Adventure"

        });
}

// ======================================================
// EMBED CẦN ĐÃ TRANG BỊ
// ======================================================

function createEquippedEmbed(
    message,
    base,
    rod
) {

    const title =
        rodTitles?.[
            rod.level
        ]
            ? ` · ${rodTitles[rod.level]}`
            : "";

    return new EmbedBuilder()

        .setColor(
            "#8affb2"
        )

        .setAuthor({

            name:
                `${message.author.username} · Fishing`,

            iconURL:
                message.author.displayAvatarURL({
                    extension: "png",
                    size: 128
                })

        })

        .setTitle(
            "🎣 ROD EQUIPPED"
        )

        .setDescription(

            `${base.emoji || "🎣"} ${base.name} ` +
            `\`+${rod.level}\`` +

            SEPARATOR +

            `🎯 Độ bền: \`${rod.uses}/${rod.maxUses}\`\n` +
            `🍀 Luck: ${formatLuck(rod.luck)}` +
            `${title}` +

            SEPARATOR +

            `🟢 Cần câu đã được trang bị.\n` +
            `Sẵn sàng cho chuyến câu tiếp theo.`

        )

        .setFooter({

            text:
                "✦ Fishing Adventure · Rod"

        })

        .setTimestamp();
}

// ======================================================
// MODULE
// ======================================================

module.exports = {

    name:
        "rod",

    aliases: [
        "can",
        "cancau"
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

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor(
                            "#ff6b81"
                        )

                        .setTitle(
                            "❌ Không tìm thấy người chơi"
                        )

                        .setDescription(

                            `Không thể tải dữ liệu người chơi.`

                        )

                        .setFooter({

                            text:
                                "✦ Fishing Adventure"

                        })

                ]

            });
        }

        // ==================================================
        // ĐẢM BẢO DATA
        // ==================================================

        if (!user.can)
            user.can = {};

        if (!user.can.danhSach)
            user.can.danhSach = {};

        if (!user.rodData)
            user.rodData = {};

        // ==================================================
        // DANH SÁCH CẦN
        // ==================================================

        const list =
            sortRodIds(
                Object.keys(
                    user.can.danhSach
                ).filter(
                    id =>
                        rods[id]
                )
            );

        // ==================================================
        // KHÔNG CÓ CẦN
        // ==================================================

        if (!list.length) {

            return message.reply({

                embeds: [
                    createNoRodEmbed()
                ]

            });
        }

        // ==================================================
        // KHỞI TẠO DATA
        // ==================================================

        for (
            const id of list
        ) {

            getRodData(
                user,
                id
            );
        }

        save();

        // ==================================================
        // BUTTON
        // ==================================================

        const row =
            new ActionRowBuilder();

        // Discord tối đa 5 button / row
        for (
            const id of list.slice(
                0,
                5
            )
        ) {

            const base =
                rods[id];

            const rod =
                getRodData(
                    user,
                    id
                );

            if (!base || !rod)
                continue;

            const disabled =
                rod.destroyed ||
                rod.uses <= 0;

            row.addComponents(

                new ButtonBuilder()

                    .setCustomId(
                        `equip_${id}_${message.author.id}`
                    )

                    .setLabel(
                        base.name
                    )

                    .setEmoji(
                        base.emoji || "🎣"
                    )

                    .setStyle(
                        ButtonStyle.Primary
                    )

                    .setDisabled(
                        disabled
                    )

            );
        }

        // ==================================================
        // GỬI EMBED
        // ==================================================

        const msg =
            await message.reply({

                embeds: [

                    createRodEmbed(
                        user,
                        message
                    )

                ],

                components:
                    row.components.length
                        ? [row]
                        : []

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
                // USER
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
                // CUSTOM ID
                // ==========================================

                const parts =
                    interaction.customId.split(
                        "_"
                    );

                const id =
                    parts[1];

                // ==========================================
                // CHECK ID
                // ==========================================

                if (
                    !id ||
                    !rods[id]
                ) {

                    return interaction.reply({

                        content:
                            "❌ Không tìm thấy cần câu.",

                        ephemeral:
                            true

                    });
                }

                // ==========================================
                // CHECK SỞ HỮU
                // ==========================================

                if (
                    !user.can.danhSach[id]
                ) {

                    return interaction.reply({

                        content:
                            "❌ Bạn chưa sở hữu cần này.",

                        ephemeral:
                            true

                    });
                }

                // ==========================================
                // DATA
                // ==========================================

                const rod =
                    getRodData(
                        user,
                        id
                    );

                const base =
                    rods[id];

                if (!rod) {

                    return interaction.reply({

                        content:
                            "❌ Không tìm thấy dữ liệu cần.",

                        ephemeral:
                            true

                    });
                }

                // ==========================================
                // CẦN GÃY
                // ==========================================

                if (
                    rod.destroyed ||
                    rod.uses <= 0
                ) {

                    return interaction.reply({

                        content:
                            "💥 Cần này đang bị gãy. Hãy sửa trước khi trang bị.",

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
                // UPDATE
                // ==========================================

                return interaction.update({

                    embeds: [

                        createEquippedEmbed(
                            message,
                            base,
                            rod
                        )

                    ],

                    components: []

                });

            }
        );

        // ==================================================
        // KẾT THÚC COLLECTOR
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
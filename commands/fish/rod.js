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

            luck: base.luck || 1,

            uses: base.uses || 1,

            maxUses: base.uses || 1,

            destroyed: false

        };

    }

    const rod =
        user.rodData[id];

    const base =
        rods[id];

    // Đảm bảo dữ liệu cũ không lỗi
    rod.level =
        Number(rod.level) || 0;

    rod.luck =
        Number(rod.luck) || base.luck || 1;

    rod.maxUses =
        Number(rod.maxUses) ||
        base.uses ||
        1;

    rod.uses =
        Math.max(
            0,
            Number(rod.uses) || 0
        );

    if (
        rod.uses >
        rod.maxUses
    ) {

        rod.uses =
            rod.maxUses;

    }

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
// FORMAT LUCK
// ======================================================

function formatLuck(luck) {

    luck =
        Number(luck) || 0;

    if (
        Number.isInteger(luck)
    ) {

        return String(luck);

    }

    return luck
        .toFixed(1)
        .replace(/\.0$/, "");

}


// ======================================================
// TẠO DÒNG CẦN
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

    const level =
        `\`+${rod.level}\``;

    const durability =
        `\`${rod.uses}/${rod.maxUses}\``;

    const luck =
        formatLuck(
            rod.luck
        );

    return (
        `${equipped} ${base.emoji} ` +
        `${base.name} ${level} ` +
        `Độ bền ${durability} ` +
        `Luck ${luck}`
    );
}


// ======================================================
// TẠO EMBED
// ======================================================

function createRodEmbed(
    user,
    message
) {

    const list =
        Object.keys(
            user.can?.danhSach || {}
        ).filter(
            id => rods[id]
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

    if (!text)
        text =
            "Bạn chưa có cần câu.";

    const currentId =
        user.can?.dangDung;

    const current =
        rods[currentId];

    const currentText =
        current
            ? `${current.emoji} ${current.name}`
            : "Chưa có";

    return new EmbedBuilder()

        .setColor("#89ddff")

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
            "🎣 `ROD COLLECTION`"
        )

        .setDescription(

            `*Kho cần câu của bạn.*\n\n` +

            `${text}\n\n` +

            `🎣 Đang dùng: ${currentText}`

        )

        .setFooter({

            text:
                "✦ Fishing Adventure · Rod Collection"

        })

        .setTimestamp();
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
            Object.keys(
                user.can.danhSach
            ).filter(
                id => rods[id]
            );


        if (!list.length) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor(
                            "#ff6b81"
                        )

                        .setTitle(
                            "🎣 `NO ROD`"
                        )

                        .setDescription(

                            `Bạn chưa có cần câu.\n\n` +

                            `Hãy mua cần câu tại shop ` +
                            `để bắt đầu câu cá.`

                        )

                        .setFooter({

                            text:
                                "✦ Fishing Adventure"

                        })

                ]

            });

        }


        // ==================================================
        // KHỞI TẠO DATA CẦN
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


        // MỞ TỐI ĐA 5 CẦN
        for (
            const id of list.slice(0, 5)
        ) {

            const base =
                rods[id];

            row.addComponents(

                new ButtonBuilder()

                    .setCustomId(
                        `equip_${id}_${message.author.id}`
                    )

                    .setLabel(
                        base.name
                    )

                    .setEmoji(
                        base.emoji
                    )

                    .setStyle(
                        ButtonStyle.Primary
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
                // KIỂM TRA USER
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

                const parts =
                    interaction.customId.split("_");

                const id =
                    parts[1];


                // ==========================================
                // KIỂM TRA CẦN
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
                // LẤY DATA
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
                // TITLE
                // ==========================================

                const title =
                    rodTitles?.[
                        rod.level
                    ]
                        ? ` · ${rodTitles[rod.level]}`
                        : "";


                // ==========================================
                // UPDATE
                // ==========================================

                return interaction.update({

                    embeds: [

                        new EmbedBuilder()

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
                                "🎣 `ROD EQUIPPED`"
                            )

                            .setDescription(

                                `${base.emoji} ${base.name} ` +
                                `\`+${rod.level}\` ` +
                                `Độ bền \`${rod.uses}/${rod.maxUses}\` ` +
                                `Luck ${formatLuck(rod.luck)}` +
                                `${title}\n\n` +

                                `🟢 Cần câu đã được trang bị.\n` +
                                `Sẵn sàng cho chuyến câu tiếp theo.`

                            )

                            .setFooter({

                                text:
                                    "✦ Fishing Adventure · Rod"

                            })

                            .setTimestamp()

                    ],

                    components: []

                });

            }
        );


        // ==================================================
        // KẾT THÚC
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
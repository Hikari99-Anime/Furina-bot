const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require("discord.js");

const {
    emoji,
    formatMoney,
    prefix
} = require("../../config");

const {
    getUser,
    save
} = require("../../data.js");

// ======================================================
// CONFIG
// ======================================================

const SEPARATOR =
    "୨୧ ───────── ୨୧";

const FOOTER = {
    text:
        "✦ Fishing Adventure · Transfer"
};

// ======================================================
// EMBED
// ======================================================

function createEmbed(
    color,
    title,
    description
) {

    return new EmbedBuilder()

        .setColor(color)

        .setTitle(title)

        .setDescription(

            `${SEPARATOR}\n\n` +
            description +
            `\n\n${SEPARATOR}`

        )

        .setFooter(
            FOOTER
        )

        .setTimestamp();

}

// ======================================================
// BUTTON
// ======================================================

function createMoneyButtons(
    userId
) {

    return new ActionRowBuilder()

        .addComponents(

            new ButtonBuilder()

                .setCustomId(
                    `give_10000_${userId}`
                )

                .setLabel("10K")

                .setEmoji("💵")

                .setStyle(
                    ButtonStyle.Secondary
                ),

            new ButtonBuilder()

                .setCustomId(
                    `give_25000_${userId}`
                )

                .setLabel("25K")

                .setEmoji("💵")

                .setStyle(
                    ButtonStyle.Secondary
                ),

            new ButtonBuilder()

                .setCustomId(
                    `give_50000_${userId}`
                )

                .setLabel("50K")

                .setEmoji("💵")

                .setStyle(
                    ButtonStyle.Primary
                ),

            new ButtonBuilder()

                .setCustomId(
                    `give_100000_${userId}`
                )

                .setLabel("100K")

                .setEmoji("💰")

                .setStyle(
                    ButtonStyle.Primary
                )

        );

}

// ======================================================
// BUTTON NHẬP SỐ
// ======================================================

function createInputButton(
    userId
) {

    return new ActionRowBuilder()

        .addComponents(

            new ButtonBuilder()

                .setCustomId(
                    `give_custom_${userId}`
                )

                .setLabel(
                    "Nhập số tiền"
                )

                .setEmoji("✏️")

                .setStyle(
                    ButtonStyle.Success
                )

        );

}

// ======================================================
// KIỂM TRA + CHUYỂN TIỀN
// ======================================================

async function transferMoney(
    interaction,
    target,
    amount
) {

    // ==================================================
    // AMOUNT
    // ==================================================

    if (
        !Number.isSafeInteger(amount) ||
        amount <= 0
    ) {

        return interaction.reply({

            embeds: [

                createEmbed(

                    "#ff6b81",

                    "❌ `SỐ TIỀN KHÔNG HỢP LỆ`",

                    `Số tiền phải là số nguyên lớn hơn 0.\n\n` +

                    `“Furina mong bạn nhập một con số hợp lệ nhé!”`

                )

            ],

            ephemeral: true

        });

    }

    // ==================================================
    // USER
    // ==================================================

    const sender =
        getUser(
            interaction.user.id
        );

    const receiver =
        getUser(
            target.id
        );

    if (
        !sender ||
        !receiver
    ) {

        return interaction.reply({

            embeds: [

                createEmbed(

                    "#ff6b81",

                    "❌ `LỖI DỮ LIỆU`",

                    `Không tìm thấy dữ liệu người chơi.`

                )

            ],

            ephemeral: true

        });

    }

    // ==================================================
    // CHECK MONEY
    // ==================================================

    const senderMoney =
        Number(
            sender.money || 0
        );

    if (
        senderMoney < amount
    ) {

        return interaction.reply({

            embeds: [

                createEmbed(

                    "#ff6b81",

                    "❌ `KHÔNG ĐỦ FCOIN`",

                    `💰 Cần: ${formatMoney(amount)} ${emoji.money}\n` +
                    `💳 Số dư: ${formatMoney(senderMoney)} ${emoji.money}\n\n` +

                    `“Furina khuyên bạn đi câu thêm vài con cá trước nhé!”`

                )

            ],

            ephemeral: true

        });

    }

    // ==================================================
    // TRANSFER
    // ==================================================

    sender.money -=
        amount;

    receiver.money +=
        amount;

    save();

    // ==================================================
    // SUCCESS
    // ==================================================

    return interaction.update({

        embeds: [

            createEmbed(

                "#86EFAC",

                "💸 `CHUYỂN TIỀN THÀNH CÔNG`",

                `👤 Người gửi: ${interaction.user}\n` +
                `🎀 Người nhận: ${target}\n\n` +

                `💰 Số tiền: ${formatMoney(amount)} ${emoji.money}\n` +
                `💳 Số dư của bạn: ${formatMoney(sender.money)} ${emoji.money}\n\n` +

                `“Furina chúc hai bạn luôn rủng rỉnh Fcoin ` +
                `và có thật nhiều may mắn!”`

            )

        ],

        components: []

    });

}

// ======================================================
// MODULE
// ======================================================

module.exports = {

    name: "givemoney",

    aliases: [
        "give",
        "transfer",
        "chuyentien"
    ],

    async execute(
        message,
        args
    ) {

        // ==================================================
        // TARGET
        // ==================================================

        const target =
            message.mentions.users.first();

        if (!target) {

            return message.reply({

                embeds: [

                    createEmbed(

                        "#ff6b81",

                        "❌ `THIẾU NGƯỜI NHẬN`",

                        `Cách dùng:\n\n` +
                        `\`${prefix}givemoney @user\`\n\n` +
                        `Sau đó chọn số tiền muốn chuyển.`

                    )

                ]

            });

        }

        // ==================================================
        // SELF
        // ==================================================

        if (
            target.id ===
            message.author.id
        ) {

            return message.reply({

                embeds: [

                    createEmbed(

                        "#ff6b81",

                        "❌ `KHÔNG THỂ CHUYỂN TIỀN`",

                        `Bạn không thể chuyển tiền cho chính mình.\n\n` +

                        `“Furina nghĩ rằng bạn nên tìm một người bạn để gửi tiền thì hơn!”`

                    )

                ]

            });

        }

        // ==================================================
        // BOT
        // ==================================================

        if (
            target.bot
        ) {

            return message.reply({

                embeds: [

                    createEmbed(

                        "#ff6b81",

                        "❌ `KHÔNG THỂ CHUYỂN TIỀN`",

                        `Không thể chuyển tiền cho bot.\n\n` +

                        `“Tiền của bạn nên được trao cho một nhà mạo hiểm thực sự!”`

                    )

                ]

            });

        }

        // ==================================================
        // NẾU ĐÃ NHẬP SỐ TIỀN
        // ==================================================

        const directAmount =
            Number(
                args.find(
                    arg =>
                        !arg.startsWith("<@")
                )
            );

        if (
            Number.isSafeInteger(
                directAmount
            ) &&
            directAmount > 0
        ) {

            return transferMoney(

                {

                    user: message.author,

                    reply: options =>
                        message.reply(options),

                    update: options =>
                        message.reply(options)

                },

                target,

                directAmount

            );

        }

        // ==================================================
        // MENU CHỌN TIỀN
        // ==================================================

        const embed =
            createEmbed(

                "#86BDF5",

                "💸 `CHUYỂN FCOIN`",

                `🎀 Người nhận: ${target}\n\n` +

                `💵 Chọn số tiền muốn chuyển:\n\n` +

                `10K · 25K · 50K · 100K\n` +

                `✏️ Hoặc nhập số tiền tùy chọn.\n\n` +

                `“Furina sẽ chờ xem bạn hào phóng đến mức nào!”`

            );

        const row1 =
            createMoneyButtons(
                message.author.id
            );

        const row2 =
            createInputButton(
                message.author.id
            );

        const msg =
            await message.reply({

                embeds: [
                    embed
                ],

                components: [
                    row1,
                    row2
                ]

            });

        // ==================================================
        // COLLECTOR
        // ==================================================

        const collector =
            msg.createMessageComponentCollector({

                time: 60000

            });

        collector.on(
            "collect",
            async interaction => {

                // ==========================================
                // CHECK USER
                // ==========================================

                if (
                    interaction.user.id !==
                    message.author.id
                ) {

                    return interaction.reply({

                        embeds: [

                            createEmbed(

                                "#ff6b81",

                                "❌ `KHÔNG PHẢI MENU CỦA BẠN`",

                                `Chỉ người sử dụng lệnh này mới có thể chọn số tiền.`

                            )

                        ],

                        ephemeral: true

                    });

                }

                // ==========================================
                // CUSTOM INPUT
                // ==========================================

                if (
                    interaction.customId ===
                    `give_custom_${message.author.id}`
                ) {

                    const modal =
                        new ModalBuilder()

                            .setCustomId(
                                `give_modal_${message.author.id}_${target.id}`
                            )

                            .setTitle(
                                "💸 Nhập số tiền"
                            );

                    const input =
                        new TextInputBuilder()

                            .setCustomId(
                                "amount"
                            )

                            .setLabel(
                                "Số Fcoin muốn chuyển"
                            )

                            .setPlaceholder(
                                "Ví dụ: 250000"
                            )

                            .setStyle(
                                TextInputStyle.Short
                            )

                            .setRequired(true)

                            .setMinLength(1)

                            .setMaxLength(15);

                    const row =
                        new ActionRowBuilder()
                            .addComponents(
                                input
                            );

                    modal.addComponents(
                        row
                    );

                    return interaction.showModal(
                        modal
                    );

                }

                // ==========================================
                // BUTTON TIỀN
                // ==========================================

                const match =
                    interaction.customId.match(
                        /^give_(\d+)_/
                    );

                if (!match) {
                    return;
                }

                const amount =
                    Number(
                        match[1]
                    );

                return transferMoney(
                    interaction,
                    target,
                    amount
                );

            }
        );

        // ==================================================
        // MODAL
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

        // ==================================================
        // MODAL HANDLER
        //
        // Lưu ý:
        // Modal không nằm trong button collector.
        // Ta tạo listener riêng cho interaction.
        // ==================================================

        const modalHandler =
            async interaction => {

                if (
                    !interaction.isModalSubmit()
                ) {
                    return;
                }

                const prefixId =
                    `give_modal_${message.author.id}_${target.id}`;

                if (
                    interaction.customId !==
                    prefixId
                ) {
                    return;
                }

                const value =
                    interaction.fields.getTextInputValue(
                        "amount"
                    );

                const amount =
                    Number(
                        value
                            .replace(/,/g, "")
                            .replace(/\./g, "")
                            .trim()
                    );

                await transferMoney(
                    interaction,
                    target,
                    amount
                );

                message.client.off(
                    "interactionCreate",
                    modalHandler
                );

            };

        message.client.on(
            "interactionCreate",
            modalHandler
        );

        // ==================================================
        // CLEAN MODAL LISTENER
        // ==================================================

        collector.on(
            "end",
            () => {

                message.client.off(
                    "interactionCreate",
                    modalHandler
                );

            }
        );

    }

};
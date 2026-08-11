require("dotenv").config();

const {
    chests,
    keys,
    insurance,
    rods,
    baits,
    rateStone,
    emoji,
    formatMoney,
    prefix
} = require("./config");

const PREFIX =
    String(prefix || "f").toLowerCase();

const noitu =
    require("./games/noitugame");

const {
    updateStatus
} = require("./status");

const {
    resumeEnabledFeeds
} = require("./danbooru-autopost");

const {
    getUser
} = require("./data");

const {
    purchase
} = require("./commands/fish/buy");

const {
    getSession,
    speakText
} = require("./utils/tts");

const {
    Client,
    GatewayIntentBits,
    Collection,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require("discord.js");

const fs =
    require("fs");


// ==========================================
// CLIENT
// ==========================================

const client =
    new Client({

        intents: [

            GatewayIntentBits.Guilds,

            GatewayIntentBits.GuildMessages,

            GatewayIntentBits.MessageContent,

            GatewayIntentBits.GuildVoiceStates

        ]

    });


// ==========================================
// COMMAND LOADER
// ==========================================

client.commands =
    new Collection();

function loadCommands(folder) {

    if (!fs.existsSync(folder))
        return;

    const files =
        fs.readdirSync(folder);

    for (
        const file
        of files
    ) {

        const path =
            `${folder}/${file}`;

        try {

            // ==================================
            // FOLDER
            // ==================================

            if (
                fs.statSync(path).isDirectory()
            ) {

                loadCommands(path);

                continue;

            }


            // ==================================
            // ONLY JS
            // ==================================

            if (
                !file.endsWith(".js")
            ) {

                continue;

            }


            // ==================================
            // LOAD
            // ==================================

            const command =
                require(`./${path}`);


            // ==================================
            // VALIDATE
            // ==================================

            if (
                !command.name ||
                !command.execute
            ) {

                console.log(
                    "⚠️ Bỏ qua command:",
                    path
                );

                continue;

            }


            // ==================================
            // COMMAND
            // ==================================

            client.commands.set(

                command.name.toLowerCase(),

                command

            );


            // ==================================
            // ALIASES
            // ==================================

            if (
                Array.isArray(command.aliases)
            ) {

                for (
                    const alias
                    of command.aliases
                ) {

                    if (!alias)
                        continue;

                    client.commands.set(

                        String(alias).toLowerCase(),

                        command

                    );

                }

            }


            console.log(
                "✅ Loaded:",
                command.name
            );

        }

        catch (err) {

            console.log(
                "❌ Load lỗi:",
                path
            );

            console.error(err);

        }

    }

}

loadCommands("commands");


// ==========================================
// READY
// ==========================================

client.once(

    "ready",

    async () => {

        await noitu
            .restoreGames(client)
            .catch(err => {

                console.log(
                    "❌ Lỗi khôi phục ván nối từ:",
                    err
                );

            });


        console.log(
            "=============================="
        );

        console.log(
            `🤖 ${client.user.tag} ONLINE`
        );

        console.log(
            `📁 Commands: ${client.commands.size}`
        );

        console.log(
            `🎁 Chest: ${
                Object.keys(chests || {}).length
            }`
        );

        console.log(
            `🔑 Key: ${
                Object.keys(keys || {}).length
            }`
        );

        console.log(
            `🎣 Rod: ${
                Object.keys(rods || {}).length
            }`
        );

        console.log(
            `🪱 Bait: ${
                Object.keys(baits || {}).length
            }`
        );

        console.log(
            `🪨 Rate Stone: ${
                Object.keys(rateStone || {}).length
            }`
        );

        console.log(
            `⚡ Prefix: ${PREFIX}`
        );

        console.log(
            "=============================="
        );


        await updateStatus(
            client,
            "online"
        );


        resumeEnabledFeeds(
            client
        );

    }

);


// ==========================================
// STATUS - KẾT NỐI DISCORD
// ==========================================

client.on(
    "shardDisconnect",
    () => updateStatus(client, "disconnected")
);

client.on(
    "shardReconnecting",
    () => updateStatus(client, "reconnecting")
);

client.on(
    "shardResume",
    () => updateStatus(client, "resumed")
);


// ==========================================
// STATUS - TẮT / RESTART (DEPLOY)
// ==========================================

async function gracefulShutdown() {

    try {

        await updateStatus(
            client,
            "restarting"
        );

    }

    catch {}

    process.exit(0);

}

process.on(
    "SIGINT",
    gracefulShutdown
);

process.on(
    "SIGTERM",
    gracefulShutdown
);


// ==========================================
// PREFIX COMMAND
// ==========================================

client.on(

    "messageCreate",

    async message => {

        try {

            // ==================================
            // BOT
            // ==================================

            if (
                message.author.bot
            ) {

                return;

            }


            // ==================================
            // NOI TU
            // ==================================

            if (
                await noitu.handleMessage(message)
            ) {

                return;

            }


            // ==================================
            // CONTENT
            // ==================================

            const content =
                message.content.trim();

            if (!content)
                return;


            // ==================================
            // TTS - ĐỌC TIN NHẮN TRONG VOICE
            // ==================================

            if (message.guild) {

                const session =
                    getSession(message.guild.id);

                if (
                    session &&
                    session.textChannelId === message.channel.id &&
                    !content
                        .toLowerCase()
                        .startsWith(PREFIX)
                ) {

                    speakText(
                        message.guild.id,
                        message.cleanContent
                    );

                    return;

                }

            }


            // ==================================
            // PREFIX
            // ==================================

            if (
                !content
                    .toLowerCase()
                    .startsWith(PREFIX)
            ) {

                return;

            }


            // ==================================
            // REMOVE PREFIX
            // ==================================

            const commandText =
                content
                    .slice(PREFIX.length)
                    .trim();

            if (!commandText)
                return;


            // ==================================
            // ARGUMENTS
            // ==================================

            const parts =
                commandText.split(/\s+/);

            const cmd =
                parts
                    .shift()
                    .toLowerCase();

            const args =
                parts;


            // ==================================
            // FIND COMMAND
            // ==================================

            const command =
                client.commands.get(cmd);

            if (!command)
                return;


            // ==================================
            // EXECUTE
            // ==================================

            await command.execute(

                message,

                args,

                client

            );

        }

        catch (err) {

            console.error(
                "❌ COMMAND ERROR:"
            );

            console.error(err);


            try {

                await message.reply(
                    "❌ Lệnh xảy ra lỗi."
                );

            }

            catch {}

        }

    }

);


// ==========================================
// SHOP STYLE
// ==========================================

function shopFooter(name) {

    return {

        text:
            `✦ Ocean Adventure · ${name}`

    };

}


// ==========================================
// MAIN SHOP EMBED
// ==========================================

function createShopEmbed(user) {

    const balance =
        Number(
            user?.money || 0
        );


    return (

        new EmbedBuilder()

            .setColor("#A7D8F5")

            .setTitle(
                "🛒 FISHING MARKET"
            )

            .setDescription(

                `*Một góc nhỏ giữa đại dương, nơi bạn chuẩn bị cho chuyến ra khơi...* 🌊\n\n` +

                `୨୧ ───────── ୨୧\n\n` +

                `🎣 Cần câu · Trang bị chính cho hành trình\n` +
                `🪱 Mồi câu · Tăng cơ hội gặp cá hiếm\n` +
                `🎟️ Chìa khóa & Bảo hiểm · Mở kho báu và bảo vệ cần\n` +
                `🪨 Đá tăng tỉ lệ · Hỗ trợ cường hóa\n\n` +

                `୨୧ ───────── ୨୧\n\n` +

                `💰 Số dư: ${formatMoney(balance)} ${emoji.money}\n\n` +

                `*Chọn một danh mục để xem những món đồ đang chờ bạn.* ✨`

            )

            .setFooter(
                shopFooter("Cửa hàng")
            )

    );

}


// ==========================================
// MAIN SHOP BUTTONS
// ==========================================

function createMainShopRow() {

    return (

        new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()

                    .setCustomId(
                        "shop_rod"
                    )

                    .setLabel(
                        "🎣 Cần câu"
                    )

                    .setStyle(
                        ButtonStyle.Primary
                    ),


                new ButtonBuilder()

                    .setCustomId(
                        "shop_bait"
                    )

                    .setLabel(
                        "🪱 Mồi câu"
                    )

                    .setStyle(
                        ButtonStyle.Success
                    ),


                new ButtonBuilder()

                    .setCustomId(
                        "shop_key"
                    )

                    .setLabel(
                        "🎟️ Kho báu"
                    )

                    .setStyle(
                        ButtonStyle.Secondary
                    ),


                new ButtonBuilder()

                    .setCustomId(
                        "shop_stone"
                    )

                    .setLabel(
                        "🪨 Đá tỉ lệ"
                    )

                    .setStyle(
                        ButtonStyle.Secondary
                    )

            )

    );

}


// ==========================================
// BACK BUTTON
// ==========================================

function createBackRow() {

    return (

        new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()

                    .setCustomId(
                        "shop_back"
                    )

                    .setLabel(
                        "↩ Quay lại"
                    )

                    .setStyle(
                        ButtonStyle.Secondary
                    )

            )

    );

}


// ==========================================
// ITEM BUTTON ROWS
// ==========================================

function createItemRows(
    ids,
    getItem,
    style
) {

    const rows = [];


    for (
        let i = 0;
        i < ids.length;
        i += 5
    ) {

        const chunk =
            ids.slice(
                i,
                i + 5
            );


        const row =
            new ActionRowBuilder();


        for (
            const id
            of chunk
        ) {

            const item =
                getItem(id);


            row.addComponents(

                new ButtonBuilder()

                    .setCustomId(
                        `buy_${id}`
                    )

                    .setLabel(
                        item.name
                    )

                    .setStyle(
                        style
                    )

            );

        }


        rows.push(row);

    }


    rows.push(
        createBackRow()
    );


    return rows;

}


// ==========================================
// INTERACTION
// SHOP / BUTTON / MODAL
// ==========================================

client.on(

    "interactionCreate",

    async interaction => {

        try {

            // ==================================
            // BUTTON
            // ==================================

            if (
                interaction.isButton()
            ) {

                const id =
                    interaction.customId;


                // ==================================
                // BACK TO SHOP
                // ==================================

                if (
                    id === "shop_back"
                ) {

                    const user =
                        getUser(
                            interaction.user.id
                        );


                    return interaction.update({

                        embeds: [

                            createShopEmbed(
                                user
                            )

                        ],

                        components: [

                            createMainShopRow()

                        ]

                    });

                }


                // ==================================
                // ROD SHOP
                // ==================================

                if (
                    id === "shop_rod"
                ) {

                    const user =
                        getUser(
                            interaction.user.id
                        );


                    const balance =
                        Number(
                            user?.money || 0
                        );


                    const rodIds =
                        Object.keys(
                            rods || {}
                        );


                    const description =
                        rodIds.length

                            ? rodIds
                                .map(rid => {

                                    const r =
                                        rods[rid];


                                    return (
                                        `${r.emoji || "🎣"} ` +
                                        `**${r.name}** · ` +
                                        `${formatMoney(r.price)} ${emoji.money}` +
                                        ` · 🍀 ${r.luck}` +
                                        ` · ♡ ${r.uses}`
                                    );

                                })
                                .join("\n")

                            : "*Hiện chưa có cần câu nào.*";


                    const embed =
                        new EmbedBuilder()

                            .setColor("#93C5FD")

                            .setTitle(
                                "🎣 CỬA HÀNG CẦN CÂU"
                            )

                            .setDescription(

                                `*Những người bạn đồng hành cho chuyến đi xa...* 🌊\n\n` +

                                `୨୧ ───────── ୨୧\n\n` +

                                `${description}\n\n` +

                                `୨୧ ───────── ୨୧\n\n` +

                                `💰 Số dư: ${formatMoney(balance)} ${emoji.money}\n` +
                                `*Chọn một chiếc cần để xem thông tin và mua.* ✨`

                            )

                            .setFooter(
                                shopFooter(
                                    "Cần câu"
                                )
                            );


                    const rows =
                        createItemRows(

                            rodIds,

                            rid =>
                                rods[rid],

                            ButtonStyle.Primary

                        );


                    return interaction.update({

                        embeds: [
                            embed
                        ],

                        components:
                            rows

                    });

                }


                // ==================================
                // BAIT SHOP
                // ==================================

                if (
                    id === "shop_bait"
                ) {

                    const user =
                        getUser(
                            interaction.user.id
                        );


                    const balance =
                        Number(
                            user?.money || 0
                        );


                    const baitIds =
                        Object.keys(
                            baits || {}
                        );


                    const description =
                        baitIds.length

                            ? baitIds
                                .map(bid => {

                                    const b =
                                        baits[bid];


                                    return (
                                        `${b.emoji || "🪱"} ` +
                                        `**${b.name}** · ` +
                                        `${formatMoney(b.price)} ${emoji.money}`
                                    );

                                })
                                .join("\n")

                            : "*Hiện chưa có loại mồi nào.*";


                    const embed =
                        new EmbedBuilder()

                            .setColor("#9DE5B0")

                            .setTitle(
                                "🪱 CỬA HÀNG MỒI CÂU"
                            )

                            .setDescription(

                                `*Những món mồi nhỏ bé nhưng có thể mang về một bất ngờ lớn...* 🫧\n\n` +

                                `୨୧ ───────── ୨୧\n\n` +

                                `${description}\n\n` +

                                `୨୧ ───────── ୨୧\n\n` +

                                `💰 Số dư: ${formatMoney(balance)} ${emoji.money}\n` +
                                `*Chọn mồi rồi nhập số lượng bạn muốn mua.* ✨`

                            )

                            .setFooter(
                                shopFooter(
                                    "Mồi câu"
                                )
                            );


                    const rows =
                        createItemRows(

                            baitIds,

                            bid =>
                                baits[bid],

                            ButtonStyle.Success

                        );


                    return interaction.update({

                        embeds: [
                            embed
                        ],

                        components:
                            rows

                    });

                }


                // ==================================
                // KEY + INSURANCE
                // ==================================

                if (
                    id === "shop_key"
                ) {

                    const user =
                        getUser(
                            interaction.user.id
                        );


                    const balance =
                        Number(
                            user?.money || 0
                        );


                    const keyIds =
                        Object.keys(
                            keys || {}
                        );


                    const insuranceIds =
                        Object.keys(
                            insurance || {}
                        );


                    const sections = [];


                    if (
                        keyIds.length
                    ) {

                        const keyText =
                            keyIds
                                .map(kid => {

                                    const k =
                                        keys[kid];


                                    return (
                                        `${k.emoji || "🎟️"} ` +
                                        `**${k.name}** · ` +
                                        `${formatMoney(k.price)} ${emoji.money}`
                                    );

                                })
                                .join("\n");


                        sections.push(

                            `🎟️ **Chìa khóa**\n${keyText}`

                        );

                    }


                    if (
                        insuranceIds.length
                    ) {

                        const insuranceText =
                            insuranceIds
                                .map(iid => {

                                    const item =
                                        insurance[iid];


                                    return (
                                        `${item.emoji || "🪽"} ` +
                                        `**${item.name}** · ` +
                                        `${formatMoney(item.price)} ${emoji.money}`
                                    );

                                })
                                .join("\n");


                        sections.push(

                            `🪽 **Bảo hiểm**\n${insuranceText}`

                        );

                    }


                    const embed =
                        new EmbedBuilder()

                            .setColor("#C4B5FD")

                            .setTitle(
                                "🎟️ KHO BÁU & BẢO HIỂM"
                            )

                            .setDescription(

                                `*Một chút may mắn, một chút bình yên giữa biển cả...* 🌙\n\n` +

                                `୨୧ ───────── ୨୧\n\n` +

                                `${
                                    sections.length
                                        ? sections.join("\n\n")
                                        : "*Hiện chưa có vật phẩm nào.*"
                                }\n\n` +

                                `୨୧ ───────── ୨୧\n\n` +

                                `💰 Số dư: ${formatMoney(balance)} ${emoji.money}\n` +
                                `*Chọn vật phẩm rồi nhập số lượng muốn mua.* ✨`

                            )

                            .setFooter(
                                shopFooter(
                                    "Kho báu & Bảo hiểm"
                                )
                            );


                    const allIds = [

                        ...keyIds,

                        ...insuranceIds

                    ];


                    const rows =
                        createItemRows(

                            allIds,

                            itemId =>

                                keys[itemId] ||
                                insurance[itemId],

                            ButtonStyle.Secondary

                        );


                    return interaction.update({

                        embeds: [
                            embed
                        ],

                        components:
                            rows

                    });

                }


                // ==================================
                // RATE STONE SHOP
                // ==================================

                if (
                    id === "shop_stone"
                ) {

                    const user =
                        getUser(
                            interaction.user.id
                        );


                    const balance =
                        Number(
                            user?.money || 0
                        );


                    const stoneIds =
                        Object.keys(
                            rateStone || {}
                        );


                    const description =
                        stoneIds.length

                            ? stoneIds
                                .map(sid => {

                                    const s =
                                        rateStone[sid];


                                    return (
                                        `${s.emoji || "🪨"} ` +
                                        `**${s.name}** · ` +
                                        `${formatMoney(s.price)} ${emoji.money}` +
                                        ` · 🪨 ${s.uses}` +
                                        ` · 📈 +${s.rate}%`
                                    );

                                })
                                .join("\n")

                            : "*Hiện chưa có đá tăng tỉ lệ nào.*";


                    const embed =
                        new EmbedBuilder()

                            .setColor("#C4B5FD")

                            .setTitle(
                                "🪨 ĐÁ TĂNG TỈ LỆ"
                            )

                            .setDescription(

                                `*Những viên đá mang theo chút may mắn của biển sâu...* ✨\n\n` +

                                `୨୧ ───────── ୨୧\n\n` +

                                `${description}\n\n` +

                                `୨୧ ───────── ୨୧\n\n` +

                                `💰 Số dư: ${formatMoney(balance)} ${emoji.money}\n` +
                                `*Chọn đá rồi nhập số lượng muốn mua.* 🌙`

                            )

                            .setFooter(
                                shopFooter(
                                    "Đá tăng tỉ lệ"
                                )
                            );


                    const rows =
                        createItemRows(

                            stoneIds,

                            sid =>
                                rateStone[sid],

                            ButtonStyle.Secondary

                        );


                    return interaction.update({

                        embeds: [
                            embed
                        ],

                        components:
                            rows

                    });

                }


                // ==================================
                // BUY BUTTON
                // ==================================

                if (
                    id.startsWith("buy_")
                ) {

                    const itemID =
                        id.replace(
                            "buy_",
                            ""
                        );


                    // ==================================
                    // ROD
                    // Không cần nhập số lượng
                    // ==================================

                    if (
                        rods?.[itemID]
                    ) {

                        const rod =
                            rods[itemID];


                        const embed =
                            new EmbedBuilder()

                                .setColor("#93C5FD")

                                .setTitle(
                                    "🎣 XÁC NHẬN MUA CẦN"
                                )

                                .setDescription(

                                    `*Một người bạn đồng hành mới đang chờ bạn...* 🌊\n\n` +

                                    `୨୧ ───────── ୨୧\n\n` +

                                    `${rod.emoji || "🎣"} **${rod.name}**\n` +

                                    `💰 Giá: ${formatMoney(rod.price)} ${emoji.money}\n` +
                                    `🍀 Luck: ${rod.luck}\n` +
                                    `♡ Độ bền: ${rod.uses}\n\n` +

                                    `୨୧ ───────── ୨୧\n\n` +

                                    `Bạn có chắc muốn mua chiếc cần này không? ✨`

                                )

                                .setFooter({

                                    text:
                                        "✦ Ocean Adventure · Xác nhận mua"

                                });


                        const row =
                            new ActionRowBuilder()
                                .addComponents(

                                    new ButtonBuilder()

                                        .setCustomId(
                                            `confirm_buy_${itemID}`
                                        )

                                        .setLabel(
                                            "✅ Mua cần"
                                        )

                                        .setStyle(
                                            ButtonStyle.Success
                                        ),


                                    new ButtonBuilder()

                                        .setCustomId(
                                            "cancel_buy"
                                        )

                                        .setLabel(
                                            "❌ Hủy"
                                        )

                                        .setStyle(
                                            ButtonStyle.Danger
                                        )

                                );


                        return interaction.update({

                            embeds: [
                                embed
                            ],

                            components: [
                                row
                            ]

                        });

                    }


                    // ==================================
                    // ITEM KHÁC
                    // Nhập số lượng
                    // ==================================

                    const modal =
                        new ModalBuilder()

                            .setCustomId(
                                `modal_${itemID}`
                            )

                            .setTitle(
                                "🛒 Nhập số lượng mua"
                            );


                    const input =
                        new TextInputBuilder()

                            .setCustomId(
                                "amount"
                            )

                            .setLabel(
                                "Số lượng"
                            )

                            .setStyle(
                                TextInputStyle.Short
                            )

                            .setPlaceholder(
                                "Ví dụ: 1"
                            )

                            .setRequired(true);


                    modal.addComponents(

                        new ActionRowBuilder()
                            .addComponents(
                                input
                            )

                    );


                    return interaction.showModal(
                        modal
                    );

                }


                // ==================================
                // CONFIRM BUY ROD
                // ==================================

                if (
                    id.startsWith(
                        "confirm_buy_"
                    )
                ) {

                    const itemID =
                        id.replace(
                            "confirm_buy_",
                            ""
                        );


                    const rod =
                        rods?.[itemID];


                    // ==================================
                    // CHECK ROD
                    // ==================================

                    if (!rod) {

                        return interaction.update({

                            content:
                                "❌ Không tìm thấy cần câu này.",

                            embeds: [],

                            components: []

                        });

                    }


                    const user =
                        getUser(
                            interaction.user.id
                        );


                    // ==================================
                    // PURCHASE 1 ROD
                    // ==================================

                    const result =
                        purchase(

                            user,

                            itemID,

                            1

                        );


                    // ==================================
                    // FAILED
                    // ==================================

                    if (!result.ok) {

                        return interaction.update({

                            content:
                                result.reason,

                            embeds: [],

                            components: []

                        });

                    }


                    // ==================================
                    // SUCCESS
                    // ==================================

                    const embed =
                        new EmbedBuilder()

                            .setColor("#86EFAC")

                            .setTitle(
                                "🎣 MUA CẦN THÀNH CÔNG"
                            )

                            .setDescription(

                                `*Một chuyến phiêu lưu mới sắp bắt đầu...* 🌊\n\n` +

                                `୨୧ ───────── ୨୧\n\n` +

                                `${rod.emoji || "🎣"} **${rod.name}**\n` +

                                `💸 Đã trả: ${formatMoney(result.price)} ${emoji.money}\n` +
                                `💰 Số dư: ${formatMoney(user.money)} ${emoji.money}\n\n` +

                                `୨୧ ───────── ୨୧\n\n` +

                                `*Chiếc cần đã được thêm vào bộ sưu tập của bạn.* ✨`

                            )

                            .setFooter({

                                text:
                                    "✦ Ocean Adventure · Mua thành công"

                            });


                    return interaction.update({

                        embeds: [
                            embed
                        ],

                        components: []

                    });

                }


                // ==================================
                // CANCEL BUY
                // ==================================

                if (
                    id === "cancel_buy"
                ) {

                    const user =
                        getUser(
                            interaction.user.id
                        );


                    return interaction.update({

                        embeds: [

                            createShopEmbed(
                                user
                            )

                        ],

                        components: [

                            createMainShopRow()

                        ]

                    });

                }

            }


            // ==================================
            // SHOP MODAL
            // ==================================

            if (
                interaction.isModalSubmit()
            ) {

                if (
                    interaction.customId
                        .startsWith("modal_")
                ) {

                    const itemID =
                        interaction.customId
                            .replace(
                                "modal_",
                                ""
                            );


                    const amount =
                        Number(

                            interaction.fields
                                .getTextInputValue(
                                    "amount"
                                )

                        );


                    // ==================================
                    // CHECK AMOUNT
                    // ==================================

                    if (
                        !Number.isInteger(amount) ||
                        amount <= 0
                    ) {

                        return interaction.reply({

                            content:
                                "❌ Số lượng không hợp lệ.",

                            ephemeral: true

                        });

                    }


                    const user =
                        getUser(
                            interaction.user.id
                        );


                    // ==================================
                    // PURCHASE
                    // ==================================

                    const result =
                        purchase(

                            user,

                            itemID,

                            amount

                        );


                    // ==================================
                    // FAILED
                    // ==================================

                    if (!result.ok) {

                        return interaction.reply({

                            content:
                                result.reason,

                            ephemeral: true

                        });

                    }


                    // ==================================
                    // SUCCESS
                    // ==================================

                    return interaction.reply({

                        content:

                            `୨୧ ───────── ୨୧\n\n` +

                            `🛍️ **Mua thành công**\n\n` +

                            `${result.item.emoji || "✦"} ` +
                            `${result.item.name} ×${amount}\n` +

                            `💸 Đã trả: ` +
                            `${formatMoney(result.price)} ` +
                            `${emoji.money}\n` +

                            `💰 Số dư: ` +
                            `${formatMoney(user.money)} ` +
                            `${emoji.money}\n\n` +

                            `୨୧ ───────── ୨୧`,

                        ephemeral: true

                    });

                }

            }

        }

        catch (err) {

            console.error(
                "❌ INTERACTION ERROR:"
            );

            console.error(err);

        }

    }

);


// ==========================================
// SLASH + TÀI XỈU MODAL
// ==========================================

client.on(

    "interactionCreate",

    async interaction => {

        try {

            // ==================================
            // PING
            // ==================================

            if (
                interaction.isChatInputCommand() &&
                interaction.commandName === "ping"
            ) {

                return interaction.reply(
                    "🏓 Pong! Bot đang online."
                );

            }


            // ==================================
            // TÀI XỈU BET
            // ==================================

            if (
                interaction.isModalSubmit() &&
                interaction.customId
                    .startsWith("txbet_")
            ) {

                const {
                    addBet,
                    getGame,
                    hasBetType,
                    totalBetOf
                } =
                    require(
                        "./games/taixiugame"
                    );


                const {
                    getUser
                } =
                    require(
                        "./database"
                    );


                const type =
                    interaction.customId
                        .replace(
                            "txbet_",
                            ""
                        );


                const amount =
                    Number(

                        interaction.fields
                            .getTextInputValue(
                                "money"
                            )

                    );


                // ==================================
                // CHECK MONEY
                // ==================================

                if (
                    !Number.isInteger(amount) ||
                    amount <= 0
                ) {

                    return interaction.reply({

                        content:
                            "❌ Số tiền cược không hợp lệ",

                        flags: 64

                    });

                }


                let number =
                    null;


                // ==================================
                // NUMBER BET
                // ==================================

                if (
                    type === "so"
                ) {

                    number =
                        Number(

                            interaction.fields
                                .getTextInputValue(
                                    "sonum"
                                )

                        );


                    if (
                        !Number.isInteger(number) ||
                        number < 3 ||
                        number > 18
                    ) {

                        return interaction.reply({

                            content:
                                "❌ Số dự đoán phải từ 3 đến 18",

                            flags: 64

                        });

                    }

                }


                // ==================================
                // CHECK GAME
                // ==================================

                if (
                    !getGame()
                ) {

                    return interaction.reply({

                        content:
                            "❌ Ván tài xỉu đã kết thúc",

                        flags: 64

                    });

                }


                // ==================================
                // CHECK DUPLICATE
                // ==================================

                if (
                    hasBetType(

                        interaction.user.id,

                        type

                    )
                ) {

                    return interaction.reply({

                        content:
                            "❌ Bạn đã cược cửa này rồi",

                        flags: 64

                    });

                }


                const user =
                    getUser(
                        interaction.user.id
                    );


                const daCuoc =
                    totalBetOf(
                        interaction.user.id
                    );


                // ==================================
                // CHECK BALANCE
                // ==================================

                if (
                    user.money <
                    daCuoc + amount
                ) {

                    return interaction.reply({

                        content:
                            "❌ Không đủ tiền",

                        flags: 64

                    });

                }


                // ==================================
                // BET LABEL
                // ==================================

                const label =

                    type === "tai"
                        ? "🔴 TÀI"

                    : type === "xiu"
                        ? "🔵 XỈU"

                    : type === "chan"
                        ? "⚫ CHẴN"

                    : type === "le"
                        ? "⚪ LẺ"

                    : `🔢 SỐ ${number}`;


                // ==================================
                // ADD BET
                // ==================================

                addBet({

                    id:
                        interaction.user.id,

                    type,

                    number,

                    money:
                        amount

                });


                return interaction.reply({

                    content:
                        `✅ Đã đặt cược **${amount.toLocaleString()} xu** vào **${label}**`,

                    flags: 64

                });

            }

        }

        catch (err) {

            console.error(
                "❌ INTERACTION ERROR:"
            );

            console.error(err);

        }

    }

);


// ==========================================
// LOGIN
// ==========================================

client.login(
    process.env.TOKEN
);
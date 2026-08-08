require("dotenv").config();

const {
    chests,
    keys,
    insurance,
    rods,
    baits,
    emoji,
    formatMoney,
    prefix
} = require("./config");

const PREFIX = String(prefix || "f").toLowerCase();

const noitu = require("./games/noitugame");

const {
    getUser
} = require("./data");

const {
    purchase
} = require("./commands/fish/buy");

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

const fs = require("fs");


// ==========================================
// CLIENT
// ==========================================

const client = new Client({

    intents: [

        GatewayIntentBits.Guilds,

        GatewayIntentBits.GuildMessages,

        GatewayIntentBits.MessageContent

    ]

});


// ==========================================
// COMMAND LOADER
// ==========================================

client.commands = new Collection();


function loadCommands(folder) {

    if (!fs.existsSync(folder))
        return;


    const files = fs.readdirSync(folder);


    for (const file of files) {

        const path = `${folder}/${file}`;


        try {

            // ==============================
            // FOLDER
            // ==============================

            if (fs.statSync(path).isDirectory()) {

                loadCommands(path);

                continue;

            }


            // ==============================
            // ONLY JS
            // ==============================

            if (!file.endsWith(".js"))
                continue;


            // ==============================
            // LOAD
            // ==============================

            const command =
                require(`./${path}`);


            // ==============================
            // VALIDATE
            // ==============================

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


            // ==============================
            // COMMAND
            // ==============================

            client.commands.set(

                command.name.toLowerCase(),

                command

            );


            // ==============================
            // ALIASES
            // ==============================

            if (Array.isArray(command.aliases)) {

                for (const alias of command.aliases) {

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

    () => {

        console.log("==============================");

        console.log(

            `🤖 ${client.user.tag} ONLINE`

        );

        console.log(

            `📁 Commands: ${client.commands.size}`

        );

        console.log(

            `🎁 Chest: ${Object.keys(chests || {}).length}`

        );

        console.log(

            `🔑 Key: ${Object.keys(keys || {}).length}`

        );

        console.log(

            `🎣 Rod: ${Object.keys(rods || {}).length}`

        );

        console.log(

            `🪱 Bait: ${Object.keys(baits || {}).length}`

        );

        console.log(

            `⚡ Prefix: ${PREFIX}`

        );

        console.log("==============================");

    }

);


// ==========================================
// PREFIX COMMAND
// ==========================================

client.on(

    "messageCreate",

    async message => {

        try {

            // ==============================
            // BOT
            // ==============================

            if (message.author.bot)
                return;


            // ==============================
            // NOITU
            // ==============================

            if (
                await noitu.handleMessage(message)
            ) {

                return;

            }


            // ==============================
            // CONTENT
            // ==============================

            const content =
                message.content.trim();


            if (!content)
                return;


            // ==============================
            // PREFIX
            // ==============================

            if (
                !content
                    .toLowerCase()
                    .startsWith(PREFIX)
            ) {

                return;

            }


            // ==============================
            // REMOVE PREFIX
            // ==============================

            const commandText =
                content
                    .slice(PREFIX.length)
                    .trim();


            if (!commandText)
                return;


            // ==============================
            // ARGUMENTS
            // ==============================

            const parts =
                commandText.split(/\s+/);


            const cmd =
                parts
                    .shift()
                    .toLowerCase();


            const args = parts;


            // ==============================
            // FIND COMMAND
            // ==============================

            const command =
                client.commands.get(cmd);


            if (!command)
                return;


            // ==============================
            // EXECUTE
            // ==============================

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

            if (interaction.isButton()) {


                // ==============================
                // ROD SHOP
                // ==============================

                if (
                    interaction.customId ===
                    "shop_rod"
                ) {

                    const rodIds =
                        Object.keys(rods);


                    const embed =
                        new EmbedBuilder()

                            .setColor("#60A5FA")

                            .setTitle(
                                "╭・🎣 ROD COLLECTION"
                            )

                            .setDescription(

                                rodIds
                                    .map(rid => {

                                        const r =
                                            rods[rid];

                                        return (
                                            `${r.emoji} **${r.name}**\n` +
                                            `💰 ${formatMoney(r.price)} ${emoji.money} · 🍀 Luck ${r.luck}`
                                        );

                                    })
                                    .join(
                                        "\n\n━━━━━━━━━━━━\n\n"
                                    )

                            );


                    const row =
                        new ActionRowBuilder();


                    for (
                        const rid of rodIds
                    ) {

                        row.addComponents(

                            new ButtonBuilder()

                                .setCustomId(
                                    `buy_${rid}`
                                )

                                .setLabel(
                                    rods[rid].name
                                )

                                .setStyle(
                                    ButtonStyle.Primary
                                )

                        );

                    }


                    return interaction.reply({

                        embeds: [
                            embed
                        ],

                        components: [
                            row
                        ],

                        ephemeral: true

                    });

                }


                // ==============================
                // BUY BUTTON
                // ==============================

                if (
                    interaction.customId
                        .startsWith("buy_")
                ) {

                    const item =
                        interaction.customId
                            .replace(
                                "buy_",
                                ""
                            );


                    const modal =
                        new ModalBuilder()

                            .setCustomId(
                                `modal_${item}`
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


                // ==============================
                // BAIT SHOP
                // ==============================

                if (
                    interaction.customId ===
                    "shop_bait"
                ) {

                    const baitIds =
                        Object.keys(baits);


                    const embed =
                        new EmbedBuilder()

                            .setColor("#86EFAC")

                            .setTitle(
                                "╭・🪱 BAIT MARKET"
                            )

                            .setDescription(

                                baitIds
                                    .map(bid => {

                                        const b =
                                            baits[bid];

                                        return (
                                            `${b.emoji} **${b.name}**\n` +
                                            `💰 ${formatMoney(b.price)} ${emoji.money}`
                                        );

                                    })
                                    .join(
                                        "\n\n━━━━━━━━━━━━\n\n"
                                    )

                            );


                    const row =
                        new ActionRowBuilder();


                    for (
                        const bid of baitIds
                    ) {

                        row.addComponents(

                            new ButtonBuilder()

                                .setCustomId(
                                    `buy_${bid}`
                                )

                                .setLabel(
                                    baits[bid].name
                                )

                                .setStyle(
                                    ButtonStyle.Success
                                )

                        );

                    }


                    return interaction.reply({

                        embeds: [
                            embed
                        ],

                        components: [
                            row
                        ],

                        ephemeral: true

                    });

                }


                // ==============================
                // KEY + INSURANCE
                // ==============================

                if (
                    interaction.customId ===
                    "shop_key"
                ) {

                    const keyIds =
                        Object.keys(keys);


                    const insuranceIds =
                        Object.keys(insurance);


                    const allIds = [
                        ...keyIds,
                        ...insuranceIds
                    ];


                    const embed =
                        new EmbedBuilder()

                            .setColor("#FACC15")

                            .setTitle(
                                "╭・🎟️ TREASURE & INSURANCE MARKET"
                            )

                            .setDescription(

                                keyIds

                                    .map(kid => {

                                        const k =
                                            keys[kid];

                                        return (
                                            `${k.emoji} **${k.name}**\n` +
                                            `💰 ${formatMoney(k.price)} ${emoji.money}`
                                        );

                                    })

                                    .concat(

                                        insuranceIds
                                            .map(iid => {

                                                const it =
                                                    insurance[iid];

                                                return (
                                                    `${it.emoji} **${it.name}**\n` +
                                                    `💰 ${formatMoney(it.price)} ${emoji.money}`
                                                );

                                            })

                                    )

                                    .join(
                                        "\n\n━━━━━━━━━━━━\n\n"
                                    )

                            );


                    const rows = [];


                    for (
                        let i = 0;
                        i < allIds.length;
                        i += 5
                    ) {

                        const chunk =
                            allIds.slice(
                                i,
                                i + 5
                            );


                        const row =
                            new ActionRowBuilder();


                        for (
                            const id of chunk
                        ) {

                            const item =
                                keys[id] ||
                                insurance[id];


                            row.addComponents(

                                new ButtonBuilder()

                                    .setCustomId(
                                        `buy_${id}`
                                    )

                                    .setLabel(
                                        item.name
                                    )

                                    .setStyle(

                                        keys[id]
                                            ? ButtonStyle.Secondary
                                            : ButtonStyle.Success

                                    )

                            );

                        }


                        rows.push(row);

                    }


                    return interaction.reply({

                        embeds: [
                            embed
                        ],

                        components:
                            rows,

                        ephemeral: true

                    });

                }

            }


            // ==================================
            // MODAL
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


                    const result =
                        purchase(
                            user,
                            itemID,
                            amount
                        );


                    if (!result.ok) {

                        return interaction.reply({

                            content:
                                result.reason,

                            ephemeral: true

                        });

                    }


                    return interaction.reply({

                        content:

                            `✅ **Mua thành công**\n\n` +

                            `${result.item.emoji} ` +
                            `${result.item.name} x${amount}\n\n` +

                            `💸 Đã trả: ` +
                            `${formatMoney(result.price)} ` +
                            `${emoji.money}\n\n` +

                            `💰 Số dư: ` +
                            `${formatMoney(user.money)} ` +
                            `${emoji.money}`,

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

            // ==============================
            // PING
            // ==============================

            if (
                interaction.isChatInputCommand() &&
                interaction.commandName === "ping"
            ) {

                return interaction.reply(
                    "🏓 Pong! Bot đang online."
                );

            }


            // ==============================
            // TÀI XỈU BET
            // ==============================

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


                let number = null;


                if (type === "so") {

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


                if (!getGame()) {

                    return interaction.reply({

                        content:
                            "❌ Ván tài xỉu đã kết thúc",

                        flags: 64

                    });

                }


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
const {
    prefix,
    emoji,
    formatMoney,
    baits,
    keys,
    fishList
} = require("../../config");

const {
    getUser,
    save,
    data
} = require("../../data");


// ======================================================
// ADMIN COMMAND
// ======================================================

module.exports = {

    name: "admin",

    async execute(
        message,
        args
    ) {

        try {

            // ==================================================
            // OWNER ID
            // ==================================================

            const OWNER_ID =
                String(
                    process.env.OWNER_ID || ""
                ).trim();


            if (!OWNER_ID) {

                return message.reply(
                    "╰・❌ Chưa cấu hình OWNER_ID trong .env"
                );

            }


            // ==================================================
            // CHECK OWNER
            // ==================================================

            if (
                message.author.id !==
                OWNER_ID
            ) {

                return message.reply(
                    "╰・❌ Bạn không có quyền sử dụng lệnh Admin."
                );

            }


            // ==================================================
            // TYPE
            // ==================================================

            const type =
                String(
                    args[0] || ""
                )
                    .trim()
                    .toLowerCase();


            // ==================================================
            // HELP
            // ==================================================

            if (!type) {

                return message.reply({

                    content:

                        `╰・🛠️ **ADMIN PANEL**\n\n` +

                        `💰 \`${prefix}admin addmoney @user 10000\`\n` +

                        `🎣 \`${prefix}admin addbait @user golden_bait 10\`\n` +

                        `🔑 \`${prefix}admin addkey @user key_5 1\`\n` +

                        `🐟 \`${prefix}admin addfish @user camap 5\`\n` +

                        `♻️ \`${prefix}admin reset @user\``

                });

            }


            // ==================================================
            // TARGET
            // ==================================================

            const target =
                message.mentions.users.first();


            if (!target) {

                return message.reply(
                    "╰・❌ Hãy tag người chơi."
                );

            }


            // ==================================================
            // GET USER
            // ==================================================

            const user =
                getUser(
                    target.id
                );


            if (!user) {

                return message.reply(
                    "╰・❌ Không tìm thấy dữ liệu người chơi."
                );

            }


            // ==================================================
            // ADD MONEY
            // ==================================================

            if (
                type === "addmoney"
            ) {

                const amount =
                    Number(
                        args[2]
                    );


                if (
                    !Number.isSafeInteger(
                        amount
                    ) ||
                    amount <= 0
                ) {

                    return message.reply(
                        "╰・❌ Số xu phải là số nguyên lớn hơn 0."
                    );

                }


                const oldMoney =
                    Number(
                        user.money || 0
                    );


                user.money =
                    oldMoney +
                    amount;


                save();


                return message.reply({

                    content:

                        `╰・✅ **ĐÃ CỘNG XU**\n\n` +

                        `👤 Người nhận: ${target}\n` +

                        `💰 Số xu: **+${formatMoney(amount)} ${emoji.money}**\n` +

                        `💵 Số dư mới: **${formatMoney(user.money)} ${emoji.money}**`

                });

            }


            // ==================================================
            // ADD BAIT
            // ==================================================

            if (
                type === "addbait"
            ) {

                const id =
                    String(
                        args[2] || ""
                    )
                        .trim();


                const amount =
                    Number(
                        args[3]
                    );


                if (
                    !baits[id]
                ) {

                    return message.reply(
                        "╰・❌ Sai ID mồi."
                    );

                }


                if (
                    !Number.isSafeInteger(
                        amount
                    ) ||
                    amount <= 0
                ) {

                    return message.reply(
                        "╰・❌ Số lượng mồi phải là số nguyên lớn hơn 0."
                    );

                }


                if (
                    !user.moi ||
                    typeof user.moi !== "object"
                ) {

                    user.moi = {};

                }


                const oldAmount =
                    Number(
                        user.moi[id] || 0
                    );


                user.moi[id] =
                    oldAmount +
                    amount;


                save();


                return message.reply({

                    content:

                        `╰・✅ **ĐÃ THÊM MỒI**\n\n` +

                        `👤 Người nhận: ${target}\n` +

                        `${baits[id].emoji} Mồi: **${baits[id].name}**\n` +

                        `📦 Số lượng: **+${amount}**\n` +

                        `📦 Tổng hiện tại: **${user.moi[id]}**`

                });

            }


            // ==================================================
            // ADD KEY
            // ==================================================

            if (
                type === "addkey"
            ) {

                const id =
                    String(
                        args[2] || ""
                    )
                        .trim();


                const amount =
                    Number(
                        args[3]
                    );


                if (
                    !keys[id]
                ) {

                    return message.reply(
                        "╰・❌ Sai ID key."
                    );

                }


                if (
                    !Number.isSafeInteger(
                        amount
                    ) ||
                    amount <= 0
                ) {

                    return message.reply(
                        "╰・❌ Số lượng key phải là số nguyên lớn hơn 0."
                    );

                }


                if (
                    !user.keys ||
                    typeof user.keys !== "object"
                ) {

                    user.keys = {};

                }


                const oldAmount =
                    Number(
                        user.keys[id] || 0
                    );


                user.keys[id] =
                    oldAmount +
                    amount;


                save();


                return message.reply({

                    content:

                        `╰・✅ **ĐÃ THÊM KEY**\n\n` +

                        `👤 Người nhận: ${target}\n` +

                        `🔑 Key: **${keys[id].name}**\n` +

                        `📦 Số lượng: **+${amount}**\n` +

                        `📦 Tổng hiện tại: **${user.keys[id]}**`

                });

            }


            // ==================================================
            // ADD FISH
            // ==================================================

            if (
                type === "addfish"
            ) {

                const id =
                    String(
                        args[2] || ""
                    )
                        .trim();


                const amount =
                    Number(
                        args[3]
                    );


                const fish =
                    fishList.find(
                        x =>
                            x.id === id
                    );


                if (!fish) {

                    return message.reply(
                        "╰・❌ Sai ID cá."
                    );

                }


                if (
                    !Number.isSafeInteger(
                        amount
                    ) ||
                    amount <= 0
                ) {

                    return message.reply(
                        "╰・❌ Số lượng cá phải là số nguyên lớn hơn 0."
                    );

                }


                if (
                    !user.fish ||
                    typeof user.fish !== "object"
                ) {

                    user.fish = {};

                }


                if (
                    !Array.isArray(
                        user.fish[id]
                    )
                ) {

                    user.fish[id] = [];

                }


                // Mặc định cá được thêm với cân nặng 10
                for (
                    let i = 0;
                    i < amount;
                    i++
                ) {

                    user.fish[id].push(10);

                }


                save();


                return message.reply({

                    content:

                        `╰・✅ **ĐÃ THÊM CÁ**\n\n` +

                        `👤 Người nhận: ${target}\n` +

                        `🐟 Cá: **${fish.name}**\n` +

                        `📦 Số lượng: **x${amount}**\n` +

                        `📦 Tổng hiện tại: **${user.fish[id].length} con**`

                });

            }


            // ==================================================
            // RESET
            // ==================================================

            if (
                type === "reset"
            ) {

                const fresh = {

                    money: 5000,

                    can: {

                        dangDung: null,

                        danhSach: {}

                    },

                    rodData: {},

                    moi: {

                        worm: 10

                    },

                    fish: {},

                    keys: {}

                };


                data[target.id] =
                    fresh;


                save();


                return message.reply({

                    content:

                        `╰・♻️ **ĐÃ RESET DỮ LIỆU**\n\n` +

                        `👤 Người chơi: ${target}\n\n` +

                        `💰 Tiền: **5,000**\n` +

                        `🪱 Mồi worm: **10**\n` +

                        `🎣 Cần câu: **Đã reset**\n` +

                        `🐟 Cá: **Đã reset**\n` +

                        `🔑 Key: **Đã reset**`

                });

            }


            // ==================================================
            // UNKNOWN COMMAND
            // ==================================================

            return message.reply({

                content:

                    `╰・❌ Lệnh Admin không tồn tại.\n\n` +

                    `Dùng \`${prefix}admin\` để xem danh sách lệnh.`

            });

        }

        catch (error) {

            console.error(
                "❌ ADMIN ERROR:",
                error
            );


            return message.reply(
                "╰・❌ Đã xảy ra lỗi khi thực hiện lệnh Admin."
            );

        }

    }

};

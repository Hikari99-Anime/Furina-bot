const fs = require("fs");
const path = require("path");

const {
    EmbedBuilder
} = require("discord.js");

const {
    getUser,
    save
} = require("../../data");

// ======================================================
// FILE GIFT CODE
// ======================================================

const filePath = path.join(
    __dirname,
    "../../giftcodes.json"
);

// ======================================================
// CONFIG EMBED
// ======================================================

const SEPARATOR =
    "୨୧ ───────── ୨୧";

const FOOTER = {
    text:
        "✦ Furina-sama · Gift Code"
};

// ======================================================
// LOAD
// ======================================================

function loadCodes() {

    if (!fs.existsSync(filePath)) {

        try {

            fs.writeFileSync(
                filePath,
                JSON.stringify(
                    {},
                    null,
                    2
                )
            );

        } catch (err) {

            console.error(
                "❌ Không tạo được giftcodes.json:",
                err
            );

        }

        return {};

    }

    try {

        const raw =
            fs.readFileSync(
                filePath,
                "utf8"
            );

        if (!raw.trim()) {

            return {};

        }

        return JSON.parse(raw);

    } catch (err) {

        console.error(
            "❌ Lỗi đọc giftcodes.json:",
            err
        );

        return {};

    }

}

// ======================================================
// SAVE
// ======================================================

function saveCodes(codes) {

    try {

        fs.writeFileSync(
            filePath,
            JSON.stringify(
                codes,
                null,
                2
            )
        );

        return true;

    } catch (err) {

        console.error(
            "❌ Lỗi lưu giftcodes.json:",
            err
        );

        return false;

    }

}

// ======================================================
// ADMIN
// ======================================================

function isAdmin(message) {

    return (
        message.member &&
        message.member.permissions.has(
            "Administrator"
        )
    );

}

// ======================================================
// EMBED
// ======================================================

function createEmbed(
    color,
    title,
    description
) {

    return new EmbedBuilder()

        .setColor(
            color
        )

        .setTitle(
            title
        )

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
// COMMAND
// ======================================================

module.exports = {

    name: "giftcode",

    aliases: [
        "code",
        "gc"
    ],

    async execute(
        message,
        args
    ) {

        try {

            const codes =
                loadCodes();

            // ==================================================
            // HELP
            // ==================================================

            if (!args.length) {

                return message.reply({

                    embeds: [

                        createEmbed(

                            "#A7D8F5",

                            "🎁 GIFT CODE",

                            `🎟️ **Nhập code**\n` +
                            `\`fgiftcode <code>\`\n\n` +

                            `🛠️ **Admin tạo code**\n` +
                            `\`fgiftcode add <code> <tiền> <giới hạn>\`\n\n` +

                            `🗑️ **Xóa code**\n` +
                            `\`fgiftcode del <code>\`\n\n` +

                            `📋 **Danh sách code**\n` +
                            `\`fgiftcode list\`\n\n` +

                            `🔎 **Thông tin code**\n` +
                            `\`fgiftcode info <code>\`\n\n` +

                            `💡 Giới hạn \`0\` = không giới hạn.`

                        )

                    ]

                });

            }

            // ==================================================
            // ACTION
            // ==================================================

            const action =
                String(
                    args[0]
                )
                    .trim()
                    .toLowerCase();

            // ==================================================
            // ADD
            //
            // fgiftcode add FURINA2026 50000 100
            // ==================================================

            if (
                action === "add"
            ) {

                if (
                    !isAdmin(message)
                ) {

                    return message.reply({

                        embeds: [

                            createEmbed(

                                "#EF4444",

                                "❌ KHÔNG CÓ QUYỀN",

                                "Bạn cần quyền **Administrator** để tạo giftcode."

                            )

                        ]

                    });

                }

                const code =
                    String(
                        args[1] || ""
                    )
                        .trim()
                        .toUpperCase();

                const reward =
                    Number(
                        args[2]
                    );

                const maxUses =
                    args[3] === undefined
                        ? 0
                        : Number(
                            args[3]
                        );

                // ==================================================
                // CHECK CODE
                // ==================================================

                if (!code) {

                    return message.reply({

                        embeds: [

                            createEmbed(

                                "#EF4444",

                                "❌ THIẾU GIFT CODE",

                                "Cách dùng:\n" +
                                "`fgiftcode add <code> <tiền> <giới hạn>`"

                            )

                        ]

                    });

                }

                // ==================================================
                // CHECK CODE LENGTH
                // ==================================================

                if (
                    code.length < 2 ||
                    code.length > 50
                ) {

                    return message.reply({

                        embeds: [

                            createEmbed(

                                "#EF4444",

                                "❌ CODE KHÔNG HỢP LỆ",

                                "Giftcode phải từ **2 đến 50 ký tự**."

                            )

                        ]

                    });

                }

                // ==================================================
                // CHECK REWARD
                // ==================================================

                if (
                    !Number.isSafeInteger(
                        reward
                    ) ||
                    reward <= 0
                ) {

                    return message.reply({

                        embeds: [

                            createEmbed(

                                "#EF4444",

                                "❌ PHẦN THƯỞNG KHÔNG HỢP LỆ",

                                "Số tiền thưởng phải là số nguyên lớn hơn 0.\n\n" +
                                "Ví dụ:\n" +
                                "`fgiftcode add FURINA2026 50000 100`"

                            )

                        ]

                    });

                }

                // ==================================================
                // CHECK LIMIT
                // ==================================================

                if (
                    !Number.isSafeInteger(
                        maxUses
                    ) ||
                    maxUses < 0
                ) {

                    return message.reply({

                        embeds: [

                            createEmbed(

                                "#EF4444",

                                "❌ GIỚI HẠN KHÔNG HỢP LỆ",

                                "Giới hạn phải là số nguyên từ **0 trở lên**.\n\n" +
                                "`0` = không giới hạn."

                            )

                        ]

                    });

                }

                // ==================================================
                // DUPLICATE
                // ==================================================

                if (
                    codes[code]
                ) {

                    return message.reply({

                        embeds: [

                            createEmbed(

                                "#F59E0B",

                                "⚠️ CODE ĐÃ TỒN TẠI",

                                `Giftcode \`${code}\` đã tồn tại.`

                            )

                        ]

                    });

                }

                // ==================================================
                // CREATE
                // ==================================================

                codes[code] = {

                    reward:
                        reward,

                    maxUses:
                        maxUses,

                    used:
                        [],

                    createdAt:
                        Date.now(),

                    createdBy:
                        message.author.id

                };

                // ==================================================
                // SAVE
                // ==================================================

                if (
                    !saveCodes(
                        codes
                    )
                ) {

                    return message.reply({

                        embeds: [

                            createEmbed(

                                "#EF4444",

                                "❌ LỖI LƯU CODE",

                                "Không thể lưu giftcode vào hệ thống."

                            )

                        ]

                    });

                }

                // ==================================================
                // SUCCESS
                // ==================================================

                return message.reply({

                    embeds: [

                        createEmbed(

                            "#86EFAC",

                            "🎁 TẠO GIFT CODE THÀNH CÔNG",

                            `🏷️ Code: \`${code}\`\n\n` +

                            `💰 Phần thưởng: ` +
                            `${reward.toLocaleString()} Fcoin\n\n` +

                            `👥 Giới hạn: ` +
                            `${
                                maxUses === 0
                                    ? "Không giới hạn"
                                    : `${maxUses} người`
                            }\n\n` +

                            `👤 Người tạo: ${message.author}`

                        )

                    ]

                });

            }

            // ==================================================
            // DELETE
            //
            // fgiftcode del CODE
            // ==================================================

            if (
                action === "del" ||
                action === "delete" ||
                action === "remove"
            ) {

                if (
                    !isAdmin(message)
                ) {

                    return message.reply({

                        embeds: [

                            createEmbed(

                                "#EF4444",

                                "❌ KHÔNG CÓ QUYỀN",

                                "Bạn cần quyền **Administrator**."

                            )

                        ]

                    });

                }

                const code =
                    String(
                        args[1] || ""
                    )
                        .trim()
                        .toUpperCase();

                if (!code) {

                    return message.reply({

                        embeds: [

                            createEmbed(

                                "#EF4444",

                                "❌ THIẾU CODE",

                                "`fgiftcode del <code>`"

                            )

                        ]

                    });

                }

                if (
                    !codes[code]
                ) {

                    return message.reply({

                        embeds: [

                            createEmbed(

                                "#EF4444",

                                "❌ KHÔNG TÌM THẤY",

                                `Không tìm thấy giftcode \`${code}\`.`

                            )

                        ]

                    });

                }

                delete codes[code];

                if (
                    !saveCodes(
                        codes
                    )
                ) {

                    return message.reply({

                        embeds: [

                            createEmbed(

                                "#EF4444",

                                "❌ LỖI",

                                "Không thể lưu thay đổi."

                            )

                        ]

                    });

                }

                return message.reply({

                    embeds: [

                        createEmbed(

                            "#86EFAC",

                            "🗑️ ĐÃ XÓA GIFT CODE",

                            `🏷️ Code: \`${code}\`\n\n` +
                            `Giftcode đã được xóa khỏi hệ thống.`

                        )

                    ]

                });

            }

            // ==================================================
            // LIST
            //
            // fgiftcode list
            // ==================================================

            if (
                action === "list"
            ) {

                if (
                    !isAdmin(message)
                ) {

                    return message.reply({

                        embeds: [

                            createEmbed(

                                "#EF4444",

                                "❌ KHÔNG CÓ QUYỀN",

                                "Bạn cần quyền **Administrator**."

                            )

                        ]

                    });

                }

                const entries =
                    Object.entries(
                        codes
                    );

                if (
                    !entries.length
                ) {

                    return message.reply({

                        embeds: [

                            createEmbed(

                                "#A7D8F5",

                                "🎁 DANH SÁCH GIFT CODE",

                                "Hiện chưa có giftcode nào."

                            )

                        ]

                    });

                }

                const lines = [];

                for (
                    const [
                        code,
                        gift
                    ]
                    of entries
                ) {

                    if (
                        !Array.isArray(
                            gift.used
                        )
                    ) {

                        gift.used = [];

                    }

                    const reward =
                        Number(
                            gift.reward || 0
                        );

                    const maxUses =
                        Number(
                            gift.maxUses || 0
                        );

                    const used =
                        gift.used.length;

                    const limitText =
                        maxUses === 0
                            ? "∞"
                            : maxUses;

                    lines.push(

                        `🎟️ \`${code}\`\n` +

                        `💰 ${reward.toLocaleString()} Fcoin\n` +

                        `👥 ${used}/${limitText} người`

                    );

                }

                return message.reply({

                    embeds: [

                        createEmbed(

                            "#A7D8F5",

                            "🎁 DANH SÁCH GIFT CODE",

                            lines.join(
                                `\n\n${SEPARATOR}\n\n`
                            ) +

                            `\n\n“ Furina chúc bạn may mắn\n` +
                            `và nhận được thật nhiều Fcoin! ”`

                        )

                    ]

                });

            }

            // ==================================================
            // INFO
            //
            // fgiftcode info CODE
            // ==================================================

            if (
                action === "info"
            ) {

                if (
                    !isAdmin(message)
                ) {

                    return message.reply({

                        embeds: [

                            createEmbed(

                                "#EF4444",

                                "❌ KHÔNG CÓ QUYỀN",

                                "Bạn cần quyền **Administrator**."

                            )

                        ]

                    });

                }

                const code =
                    String(
                        args[1] || ""
                    )
                        .trim()
                        .toUpperCase();

                if (!code) {

                    return message.reply({

                        embeds: [

                            createEmbed(

                                "#EF4444",

                                "❌ THIẾU CODE",

                                "`fgiftcode info <code>`"

                            )

                        ]

                    });

                }

                const gift =
                    codes[code];

                if (!gift) {

                    return message.reply({

                        embeds: [

                            createEmbed(

                                "#EF4444",

                                "❌ KHÔNG TÌM THẤY",

                                `Giftcode \`${code}\` không tồn tại.`

                            )

                        ]

                    });

                }

                if (
                    !Array.isArray(
                        gift.used
                    )
                ) {

                    gift.used = [];

                }

                const reward =
                    Number(
                        gift.reward || 0
                    );

                const maxUses =
                    Number(
                        gift.maxUses || 0
                    );

                return message.reply({

                    embeds: [

                        createEmbed(

                            "#C4B5FD",

                            "🔎 THÔNG TIN GIFT CODE",

                            `🏷️ Code: \`${code}\`\n\n` +

                            `💰 Phần thưởng: ` +
                            `${reward.toLocaleString()} Fcoin\n\n` +

                            `👥 Đã sử dụng: ` +
                            `${gift.used.length}/${
                                maxUses === 0
                                    ? "∞"
                                    : maxUses
                            }\n\n` +

                            `📅 Ngày tạo: ` +
                            `<t:${Math.floor(
                                Number(
                                    gift.createdAt ||
                                    Date.now()
                                ) / 1000
                            )}:F>`

                        )

                    ]

                });

            }

            // ==================================================
            // USE CODE
            //
            // fgiftcode FURINA2026
            // ==================================================

            const code =
                String(
                    args[0]
                )
                    .trim()
                    .toUpperCase();

            const gift =
                codes[code];

            // ==================================================
            // NOT FOUND
            // ==================================================

            if (!gift) {

                return message.reply({

                    embeds: [

                        createEmbed(

                            "#EF4444",

                            "❌ GIFT CODE KHÔNG TỒN TẠI",

                            `Giftcode \`${code}\` không tồn tại hoặc đã bị xóa.`

                        )

                    ]

                });

            }

            // ==================================================
            // FIX OLD CODE
            // ==================================================

            if (
                !Array.isArray(
                    gift.used
                )
            ) {

                gift.used = [];

            }

            if (
                typeof gift.maxUses !== "number"
            ) {

                gift.maxUses = 0;

            }

            // ==================================================
            // ALREADY USED
            // ==================================================

            if (
                gift.used.includes(
                    message.author.id
                )
            ) {

                return message.reply({

                    embeds: [

                        createEmbed(

                            "#F59E0B",

                            "⚠️ BẠN ĐÃ NHẬP CODE",

                            `Bạn đã sử dụng giftcode \`${code}\` trước đó.\n\n` +
                            `Mỗi người chỉ được nhận **1 lần**.`

                        )

                    ]

                });

            }

            // ==================================================
            // CHECK LIMIT
            // ==================================================

            if (
                gift.maxUses > 0 &&
                gift.used.length >=
                gift.maxUses
            ) {

                return message.reply({

                    embeds: [

                        createEmbed(

                            "#EF4444",

                            "🎁 GIFT CODE ĐÃ HẾT LƯỢT",

                            `🏷️ Giftcode: \`${code}\`\n\n` +

                            `👥 Giftcode đã đạt giới hạn ` +
                            `**${gift.maxUses} người**.\n\n` +

                            `Rất tiếc, bạn đã đến quá muộn.`

                        )

                    ]

                });

            }

            // ==================================================
            // GET USER
            // ==================================================

            const user =
                getUser(
                    message.author.id
                );

            if (!user) {

                return message.reply({

                    embeds: [

                        createEmbed(

                            "#EF4444",

                            "❌ LỖI DỮ LIỆU",

                            "Không tìm thấy dữ liệu người chơi."

                        )

                    ]

                });

            }

            // ==================================================
            // CHECK REWARD
            // ==================================================

            const reward =
                Number(
                    gift.reward
                );

            if (
                !Number.isSafeInteger(
                    reward
                ) ||
                reward <= 0
            ) {

                return message.reply({

                    embeds: [

                        createEmbed(

                            "#EF4444",

                            "❌ GIFT CODE BỊ LỖI",

                            "Phần thưởng của giftcode không hợp lệ.\n" +
                            "Vui lòng báo Admin."

                        )

                    ]

                });

            }

            // ==================================================
            // ADD MONEY
            // ==================================================

            const oldMoney =
                Number(
                    user.money || 0
                );

            user.money =
                oldMoney +
                reward;

            // ==================================================
            // MARK USED
            // ==================================================

            gift.used.push(
                message.author.id
            );

            // ==================================================
            // SAVE GIFT CODE
            // ==================================================

            if (
                !saveCodes(
                    codes
                )
            ) {

                user.money =
                    oldMoney;

                gift.used =
                    gift.used.filter(
                        id =>
                            id !==
                            message.author.id
                    );

                return message.reply({

                    embeds: [

                        createEmbed(

                            "#EF4444",

                            "❌ KHÔNG THỂ NHẬN THƯỞNG",

                            "Hệ thống không thể lưu giftcode.\n" +
                            "Tiền của bạn **chưa bị trừ hoặc cộng**."

                        )

                    ]

                });

            }

            // ==================================================
            // SAVE USER
            // ==================================================

            save();

            // ==================================================
            // REMAINING
            // ==================================================

            const used =
                gift.used.length;

            const remaining =
                gift.maxUses === 0

                    ? "∞"

                    : Math.max(
                        gift.maxUses -
                        used,
                        0
                    );

            // ==================================================
            // SUCCESS
            // ==================================================

            return message.reply({

                embeds: [

                    createEmbed(

                        "#86EFAC",

                        "🎁 NHẬN GIFT CODE THÀNH CÔNG",

                        `👤 Người nhận: ${message.author}\n\n` +

                        `🏷️ Giftcode: \`${code}\`\n\n` +

                        `💰 Phần thưởng: ` +
                        `+${reward.toLocaleString()} Fcoin\n\n` +

                        `💵 Số dư mới: ` +
                        `${Number(
                            user.money
                        ).toLocaleString()} Fcoin\n\n` +

                        `👥 Lượt sử dụng: ` +
                        `${used}/${
                            gift.maxUses === 0
                                ? "∞"
                                : gift.maxUses
                        }\n\n` +

                        `🎟️ Còn lại: ${remaining} lượt\n\n` +

                        `“ Furina chúc bạn may mắn\n` +
                        `và nhận được thật nhiều Fcoin! ”`

                    )

                ]

            });

        }

        catch (err) {

            console.error(
                "❌ GIFTCODE ERROR:"
            );

            console.error(
                err
            );

            return message.reply({

                embeds: [

                    createEmbed(

                        "#EF4444",

                        "❌ CÓ LỖI XẢY RA",

                        "Không thể xử lý giftcode.\n" +
                        "Hãy kiểm tra console của bot."

                    )

                ]

            });

        }

    }

};
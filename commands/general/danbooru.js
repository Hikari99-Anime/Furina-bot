const {
    EmbedBuilder
} = require("discord.js");

const {
    fetchPosts,
    filterValidPosts,
    buildPostEmbed
} = require("../../utils/danbooru");


// ======================================================
// STYLE
// ======================================================

const SEPARATOR =
    "୨୧ ───────── ୨୧";

const FOOTER = {

    text:
        "✦ Furina-sama · Danbooru"

};


// ======================================================
// EMBED LỖI
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
// CHECK NSFW CHANNEL
// ======================================================

function isNsfwChannel(channel) {

    return !!(

        channel?.nsfw ||
        channel?.parent?.nsfw

    );

}


// ======================================================
// COMMAND
// ======================================================

module.exports = {

    name: "art",

    aliases: [
        "booru",
        "db"
    ],

    async execute(
        message,
        args
    ) {

        try {

            const nsfw =
                isNsfwChannel(
                    message.channel
                );


            const userTags =
                args
                    .map(rawTag => {

                        const tag =
                            String(rawTag || "");

                        if (!tag)
                            return "";


                        const negate =
                            tag.startsWith("-")
                                ? "-"
                                : "";

                        const core =
                            negate
                                ? tag.slice(1)
                                : tag;


                        // ==================================================
                        // GIỮ NGUYÊN META TAG (rating:, order:...)
                        // HOẶC TAG ĐÃ CÓ WILDCARD
                        // ==================================================

                        if (
                            core.includes(":") ||
                            core.includes("*")
                        ) {

                            return tag;

                        }


                        // ==================================================
                        // THÊM WILDCARD ĐỂ KHỚP GẦN ĐÚNG
                        // VD: furina -> furina* (khớp furina_(genshin_impact))
                        // ==================================================

                        return `${negate}${core}*`;

                    })
                    .filter(Boolean)
                    .join(" ")
                    .trim();


            let tags =
                userTags
                    ? `${userTags} order:rank`
                    : "order:rank";


            tags +=
                nsfw
                    ? " -rating:general -rating:sensitive"
                    : " -rating:explicit -rating:questionable";


            const posts =
                await fetchPosts(
                    tags,
                    20
                );


            const valid =
                filterValidPosts(
                    posts,
                    nsfw
                );


            if (!valid.length) {

                return message.reply({

                    embeds: [

                        createEmbed(

                            "#F59E0B",

                            "⚠️ KHÔNG TÌM THẤY ẢNH",

                            (
                                userTags
                                    ? `Không tìm thấy ảnh phù hợp với tag \`${userTags}\`.`
                                    : "Không tìm thấy ảnh phù hợp."
                            ) +

                            (
                                !nsfw
                                    ? `\n\n*Channel này không phải NSFW nên chỉ hiển thị ảnh an toàn.*`
                                    : ""
                            )

                        )

                    ]

                });

            }


            // ==================================================
            // CHỌN NGẪU NHIÊN TRONG TOP
            // ==================================================

            const post =
                valid[

                    Math.floor(
                        Math.random() *
                        valid.length
                    )

                ];


            return message.reply({

                embeds: [

                    buildPostEmbed(
                        post
                    )

                ]

            });

        }

        catch (err) {

            console.error(
                "❌ DANBOORU ERROR:"
            );

            console.error(
                err
            );

            return message.reply({

                embeds: [

                    createEmbed(

                        "#EF4444",

                        "❌ CÓ LỖI XẢY RA",

                        "Không thể lấy ảnh từ Danbooru lúc này.\n" +
                        "Hãy kiểm tra console của bot."

                    )

                ]

            });

        }

    }

};

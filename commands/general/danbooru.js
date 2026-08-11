const {
    EmbedBuilder
} = require("discord.js");

const {
    fetchPosts,
    filterValidPosts,
    buildPostEmbed,
    findBestTags,
    resolveWordTag
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
                    .join(" ")
                    .trim();


            const ratingFilter =
                nsfw
                    ? " -rating:general -rating:sensitive"
                    : " -rating:explicit -rating:questionable";


            let valid = [];


            if (!args.length) {

                // ==================================================
                // KHÔNG CÓ TỪ KHOÁ -> DUYỆT TOP ẢNH BẤT KỲ
                // ==================================================

                const posts =
                    await fetchPosts(
                        `order:rank${ratingFilter}`,
                        20
                    );

                valid =
                    filterValidPosts(
                        posts,
                        nsfw
                    );

            }
            else {

                // ==================================================
                // BƯỚC 1: CẢ CÂU LÀ 1 TÊN CHARACTER/COPYRIGHT
                // (VD: "fart mobius" -> tag character/copyright thật)
                // ==================================================

                const candidates =
                    await findBestTags(
                        args.join(" ")
                    );


                for (const candidate of candidates) {

                    const posts =
                        await fetchPosts(
                            `${candidate} order:rank${ratingFilter}`,
                            20
                        );


                    valid =
                        filterValidPosts(
                            posts,
                            nsfw
                        );


                    if (valid.length)
                        break;

                }


                // ==================================================
                // BƯỚC 2: TỪNG TỪ LÀ 1 TAG RIÊNG (VD: "furina elysia")
                // TRA TỪNG TỪ THÀNH TAG THẬT RỒI AND LẠI.
                //
                // Không dùng wildcard mù cho từ không tra được tag
                // nào - Danbooru sẽ tự BỎ QUA wildcard rỗng thay vì
                // trả 0 kết quả, khiến search AND hoá ra chỉ còn lọc
                // theo (các) từ còn lại và ra ảnh không liên quan gì.
                // ==================================================

                if (!valid.length) {

                    const resolvedParts = [];

                    let unresolvable =
                        false;


                    for (const rawTag of args) {

                        const tag =
                            String(rawTag || "");

                        if (!tag)
                            continue;


                        const negate =
                            tag.startsWith("-")
                                ? "-"
                                : "";

                        const core =
                            negate
                                ? tag.slice(1)
                                : tag;


                        // ==========================================
                        // GIỮ NGUYÊN META TAG / WILDCARD ĐÃ CÓ
                        // ==========================================

                        if (
                            core.includes(":") ||
                            core.includes("*")
                        ) {

                            resolvedParts.push(tag);
                            continue;

                        }


                        const resolved =
                            await resolveWordTag(core);

                        if (!resolved) {

                            unresolvable = true;
                            break;

                        }

                        resolvedParts.push(
                            `${negate}${resolved}`
                        );

                    }


                    if (
                        !unresolvable &&
                        resolvedParts.length
                    ) {

                        const posts =
                            await fetchPosts(
                                `${resolvedParts.join(" ")} order:rank${ratingFilter}`,
                                20
                            );


                        valid =
                            filterValidPosts(
                                posts,
                                nsfw
                            );

                    }

                }

            }


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

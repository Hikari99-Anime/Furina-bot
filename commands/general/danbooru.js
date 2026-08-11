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
// LUÔN CHỈ LẤY ẢNH AN TOÀN (SFW)
//
// Không gửi "-rating:explicit -rating:questionable" lên Danbooru vì
// mỗi rating: cũng tính vào giới hạn số tag cho request ẩn danh
// (dễ bị HTTP 422 khi kết hợp với tag khác). Thay vào đó lấy list
// (mọi rating) về rồi tự lọc lại bằng filterValidPosts() ở dưới.
// ======================================================


// ======================================================
// TRÁNH LẶP ẢNH ĐÃ GỬI TRONG CÙNG CHANNEL
// (channelId -> Set<postId>)
// ======================================================

const shownPostIds = new Map();

function pickUnseenPost(channelId, valid) {

    const shown =
        shownPostIds.get(channelId) ||
        new Set();


    let pool =
        valid.filter(p =>
            !shown.has(p.id)
        );

    if (!pool.length)
        pool = valid;


    const post =
        pool[

            Math.floor(
                Math.random() *
                pool.length
            )

        ];


    shown.add(post.id);
    shownPostIds.set(channelId, shown);

    return post;

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

            const userTags =
                args
                    .join(" ")
                    .trim();


            let valid = [];


            if (!args.length) {

                // ==================================================
                // KHÔNG CÓ TỪ KHOÁ -> DUYỆT TOP ẢNH ĐIỂM CAO NHẤT
                // ==================================================

                const posts =
                    await fetchPosts(
                        "order:score",
                        20
                    );

                valid =
                    filterValidPosts(
                        posts,
                        false
                    );

            }
            else {

                // ==================================================
                // BƯỚC 1: CẢ CÂU LÀ 1 TAG CHARACTER/COPYRIGHT THẬT
                // (VD: "astra yao" -> tag "astra_yao")
                // ==================================================

                const candidates =
                    await findBestTags(
                        args.join(" ")
                    );


                for (const candidate of candidates) {

                    const posts =
                        await fetchPosts(
                            `${candidate} order:score`,
                            20
                        );


                    valid =
                        filterValidPosts(
                            posts,
                            false
                        );


                    if (valid.length)
                        break;

                }


                // ==================================================
                // BƯỚC 2: KHÔNG GHÉP ĐƯỢC 1 TAG CHUNG -> THỬ TỪNG TỪ
                // RIÊNG (VD: "mobius elysia"), NHƯNG VẪN CHỈ DÙNG
                // ĐÚNG 1 TAG CHO MỖI LẦN TÌM - KHÔNG AND NHIỀU TAG.
                // ==================================================

                if (!valid.length) {

                    for (const rawTag of args) {

                        const tag =
                            String(rawTag || "");

                        if (!tag)
                            continue;


                        const core =
                            tag.startsWith("-")
                                ? tag.slice(1)
                                : tag;


                        if (
                            core.includes(":") ||
                            core.includes("*")
                        ) {

                            continue;

                        }


                        const resolved =
                            await resolveWordTag(core);

                        if (!resolved)
                            continue;


                        const posts =
                            await fetchPosts(
                                `${resolved} order:score`,
                                20
                            );


                        valid =
                            filterValidPosts(
                                posts,
                                false
                            );


                        if (valid.length)
                            break;

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

                            `\n\n*Chỉ hiển thị ảnh an toàn (SFW).*`

                        )

                    ]

                });

            }


            // ==================================================
            // CHỌN NGẪU NHIÊN, TRÁNH LẶP ẢNH ĐÃ GỬI TRONG CHANNEL
            // ==================================================

            const post =
                pickUnseenPost(
                    message.channel.id,
                    valid
                );


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

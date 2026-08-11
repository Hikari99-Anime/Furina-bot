const {
    EmbedBuilder
} = require("discord.js");


const USER_AGENT =
    "FurinaBot/1.0 (Discord fishing bot)";

const IMAGE_EXT = [
    "jpg",
    "jpeg",
    "png",
    "gif"
];

const RATING_LABEL = {

    g: "🟢 General",
    s: "🔵 Sensitive",
    q: "🟡 Questionable",
    e: "🔴 Explicit"

};

const TAG_CATEGORY = {

    COPYRIGHT: 3,
    CHARACTER: 4

};


// ======================================================
// TRA TAG THẬT TRÊN DANBOORU (dùng chung cho các hàm dưới)
// ======================================================

async function searchDanbooruTags(query) {

    const normalized =
        String(query || "")
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "_");

    if (!normalized)
        return [];

    try {

        const url =
            `https://danbooru.donmai.us/tags.json` +
            `?search[name_matches]=${encodeURIComponent(`*${normalized}*`)}` +
            `&search[order]=count` +
            `&limit=30`;


        const res =
            await fetch(url, {

                headers: {

                    "User-Agent":
                        USER_AGENT

                }

            });


        if (!res.ok)
            return [];


        const tags =
            await res.json();

        return Array.isArray(tags)
            ? tags
            : [];

    }
    catch (err) {

        console.error(
            "❌ Lỗi tra tag Danbooru:",
            err
        );

        return [];

    }

}


// ======================================================
// TÌM TAG THẬT KHỚP VỚI CÂU TÌM (character trước, copyright sau)
// CHỈ 2 NHÓM NÀY - DÙNG CHO CẢ CÂU (VD: "fart mobius")
// ======================================================

async function findBestTags(query) {

    try {

        const tags =
            await searchDanbooruTags(query);


        const byCount =
            (a, b) =>
                (b.post_count || 0) -
                (a.post_count || 0);


        const characters =
            tags
                .filter(t =>
                    t.category === TAG_CATEGORY.CHARACTER
                )
                .sort(byCount);


        const copyrights =
            tags
                .filter(t =>
                    t.category === TAG_CATEGORY.COPYRIGHT
                )
                .sort(byCount);


        // ==================================================
        // ƯU TIÊN CHARACTER, RỒI ĐẾN COPYRIGHT
        // ==================================================

        return [
            ...characters.slice(0, 3),
            ...copyrights.slice(0, 3)
        ].map(t => t.name);

    }
    catch (err) {

        console.error(
            "❌ Lỗi tra tag Danbooru:",
            err
        );

        return [];

    }

}


// ======================================================
// TÌM 1 TAG THẬT CHO 1 TỪ ĐƠN (mọi nhóm, ưu tiên character/copyright)
// TRẢ VỀ null NẾU TỪ NÀY KHÔNG KHỚP TAG NÀO TRÊN DANBOORU
// - Dùng để tránh gửi wildcard "rỗng" cho Danbooru: Danbooru sẽ tự
//   BỎ QUA wildcard không khớp tag nào thay vì trả về 0 kết quả,
//   khiến search AND nhiều từ hoá ra chỉ còn lọc theo từ còn lại.
// ======================================================

async function resolveWordTag(word) {

    const tags =
        await searchDanbooruTags(word);

    if (!tags.length)
        return null;


    const byCount =
        (a, b) =>
            (b.post_count || 0) -
            (a.post_count || 0);


    const priority =
        t =>

            t.category === TAG_CATEGORY.CHARACTER
                ? 0

            : t.category === TAG_CATEGORY.COPYRIGHT
                ? 1

            : 2;


    const best =
        [...tags]
            .sort((a, b) =>

                priority(a) - priority(b) ||
                byCount(a, b)

            )[0];


    return best?.name || null;

}


// ======================================================
// FETCH POSTS
// ======================================================

async function fetchPosts(
    tags,
    limit = 20,
    page = null
) {

    try {

        const url =
            `https://danbooru.donmai.us/posts.json` +
            `?tags=${encodeURIComponent(tags)}` +
            `&limit=${limit}` +
            (
                page
                    ? `&page=${page}`
                    : ""
            );


        const res =
            await fetch(url, {

                headers: {

                    "User-Agent":
                        USER_AGENT

                }

            });


        if (!res.ok) {

            console.error(
                `❌ Danbooru HTTP ${res.status} · tags="${tags}"`
            );

            return [];

        }


        const posts =
            await res.json();


        return Array.isArray(posts)
            ? posts
            : [];

    }

    catch (err) {

        console.error(
            "❌ Lỗi fetch Danbooru:",
            err
        );

        return [];

    }

}


// ======================================================
// LỌC POST HỢP LỆ
// ======================================================

function filterValidPosts(
    posts,
    nsfw
) {

    return (
        Array.isArray(posts)
            ? posts
            : []
    )
        .filter(p =>

            p.file_url &&

            IMAGE_EXT.includes(
                String(
                    p.file_ext || ""
                ).toLowerCase()
            ) &&

            (
                nsfw

                    ? (
                        p.rating === "q" ||
                        p.rating === "e"
                    )

                    : (
                        p.rating === "g" ||
                        p.rating === "s"
                    )
            )

        );

}


// ======================================================
// EMBED ẢNH
// ======================================================

function buildPostEmbed(post) {

    const ratingLabel =
        RATING_LABEL[post.rating] ||
        post.rating ||
        "?";


    const characters =
        post.tag_string_character

            ? post.tag_string_character
                .split(" ")
                .slice(0, 5)
                .join(", ")

            : null;


    return new EmbedBuilder()

        .setColor("#A7D8F5")

        .setTitle(
            `🖼️ Danbooru #${post.id}`
        )

        .setURL(
            `https://danbooru.donmai.us/posts/${post.id}`
        )

        .setImage(
            post.large_file_url ||
            post.file_url
        )

        .setDescription(

            `⭐ **Score:** ${post.score ?? 0}\n` +
            `🔖 **Rating:** ${ratingLabel}\n` +

            (
                post.tag_string_artist
                    ? `🎨 **Artist:** ${post.tag_string_artist}\n`
                    : ""
            ) +

            (
                characters
                    ? `🧑 **Character:** ${characters}\n`
                    : ""
            )

        )

        .setFooter({
            text: "✦ Furina-sama · Danbooru"
        })

        .setTimestamp();

}


module.exports = {
    fetchPosts,
    filterValidPosts,
    buildPostEmbed,
    findBestTags,
    resolveWordTag
};

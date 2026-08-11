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
// TÌM TAG THẬT KHỚP VỚI CÂU TÌM (character trước, copyright sau)
// ======================================================

async function findBestTags(query) {

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

        if (!Array.isArray(tags))
            return [];


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
    findBestTags
};

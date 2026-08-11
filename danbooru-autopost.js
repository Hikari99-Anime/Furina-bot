const fs =
    require("fs");

const path =
    require("path");

const {
    fetchPosts,
    filterValidPosts,
    buildPostEmbed
} = require("./utils/danbooru");


const STATE_FILE =
    path.join(__dirname, "danbooru_autopost_state.json");

const INTERVAL_MS =
    30 * 60 * 1000;

const MAX_FALLBACK_PAGES =
    10;


// ==========================================
// STATE
// ==========================================

function defaultFeedState() {

    return {

        enabled: false,

        postedIds: [],

        scorePage: 1

    };

}

function readState() {

    try {

        const raw =
            JSON.parse(
                fs.readFileSync(STATE_FILE, "utf8")
            );

        return {

            feeds:
                raw.feeds &&
                typeof raw.feeds === "object"

                    ? raw.feeds

                    : {}

        };

    }

    catch {

        return { feeds: {} };

    }

}

function saveState(state) {

    try {

        fs.writeFileSync(

            STATE_FILE,

            JSON.stringify(state)

        );

    }

    catch (err) {

        console.error(
            "❌ Lỗi lưu danbooru_autopost_state.json:",
            err
        );

    }

}

function getFeedState(state, channelId) {

    if (!state.feeds[channelId]) {

        state.feeds[channelId] =
            defaultFeedState();

    }

    return state.feeds[channelId];

}


// ==========================================
// CHECK NSFW CHANNEL
// ==========================================

function isNsfwChannel(channel) {

    return !!(

        channel?.nsfw ||
        channel?.parent?.nsfw

    );

}


// ==========================================
// LẤY 1 ẢNH CHƯA TỪNG POST
// ==========================================

async function pickUnpostedPost(
    feedState,
    nsfw
) {

    const posted =
        new Set(
            feedState.postedIds || []
        );

    const ratingSuffix =
        nsfw
            ? " -rating:general -rating:sensitive"
            : " -rating:explicit -rating:questionable";


    // ==================================================
    // ƯU TIÊN ORDER:RANK
    // ==================================================

    const rankPosts =
        await fetchPosts(
            `order:rank${ratingSuffix}`,
            100
        );

    const rankValid =
        filterValidPosts(
            rankPosts,
            nsfw
        )
            .filter(p => !posted.has(p.id));

    if (rankValid.length) {

        return rankValid[

            Math.floor(
                Math.random() *
                rankValid.length
            )

        ];

    }


    // ==================================================
    // FALLBACK ORDER:SCORE + PAGE
    // ==================================================

    let page =
        feedState.scorePage || 1;

    for (
        let attempt = 0;
        attempt < MAX_FALLBACK_PAGES;
        attempt++
    ) {

        const scorePosts =
            await fetchPosts(
                `order:score${ratingSuffix}`,
                100,
                page
            );

        const scoreValid =
            filterValidPosts(
                scorePosts,
                nsfw
            )
                .filter(p => !posted.has(p.id));

        if (scoreValid.length) {

            feedState.scorePage =
                page;

            return scoreValid[

                Math.floor(
                    Math.random() *
                    scoreValid.length
                )

            ];

        }


        page++;

    }


    feedState.scorePage =
        page;

    return null;

}


// ==========================================
// POST 1 LẦN VÀO 1 CHANNEL
// ==========================================

async function postOnce(
    client,
    channelId
) {

    try {

        const channel =
            await client.channels
                .fetch(channelId)
                .catch(() => null);

        if (!channel) {

            return {
                ok: false,
                reason: `Không tìm thấy channel (ID: ${channelId}).`
            };

        }


        const nsfw =
            isNsfwChannel(channel);


        const state =
            readState();

        const feedState =
            getFeedState(state, channelId);


        const post =
            await pickUnpostedPost(
                feedState,
                nsfw
            );

        if (!post) {

            saveState(state);

            return {
                ok: false,
                reason: "Không tìm thấy ảnh mới (đã hết ảnh chưa từng post)."
            };

        }


        await channel.send({

            embeds: [

                buildPostEmbed(
                    post
                )

            ]

        });


        feedState.postedIds =
            [
                ...(feedState.postedIds || []),
                post.id
            ];

        saveState(state);


        return {
            ok: true,
            post
        };

    }

    catch (err) {

        console.error(
            `❌ Lỗi auto-post Danbooru (channel ${channelId}):`,
            err
        );

        return {
            ok: false,
            reason: "Có lỗi xảy ra khi đăng ảnh."
        };

    }

}


// ==========================================
// SCHEDULER
// ==========================================

const intervals =
    new Map();

function isFeedRunning(channelId) {

    return intervals.has(channelId);

}

function startFeed(client, channelId) {

    if (isFeedRunning(channelId)) {

        return {
            ok: true,
            alreadyRunning: true
        };

    }


    const handle =
        setInterval(

            () => postOnce(client, channelId),

            INTERVAL_MS

        );

    intervals.set(channelId, handle);


    postOnce(client, channelId)
        .catch(err => {

            console.error(
                `❌ Lỗi post đầu tiên (channel ${channelId}):`,
                err
            );

        });


    return {
        ok: true,
        alreadyRunning: false
    };

}

function stopFeed(channelId) {

    const handle =
        intervals.get(channelId);

    if (!handle) {

        return {
            ok: true,
            wasRunning: false
        };

    }


    clearInterval(handle);

    intervals.delete(channelId);


    return {
        ok: true,
        wasRunning: true
    };

}


// ==========================================
// BẬT / TẮT FEED (PERSIST)
// ==========================================

function setFeedEnabled(client, channelId, enabled) {

    const state =
        readState();

    const feedState =
        getFeedState(state, channelId);

    feedState.enabled =
        enabled;

    saveState(state);


    if (enabled) {

        return startFeed(client, channelId);

    }


    return stopFeed(channelId);

}


// ==========================================
// RESUME SAU KHI DEPLOY/RESTART
// ==========================================

function resumeEnabledFeeds(client) {

    const state =
        readState();

    for (
        const [channelId, feedState]
        of Object.entries(state.feeds)
    ) {

        if (feedState.enabled) {

            startFeed(client, channelId);

        }

    }

}


// ==========================================
// LIỆT KÊ FEED
// ==========================================

function listFeeds() {

    const state =
        readState();

    return Object.entries(state.feeds)
        .map(([channelId, feedState]) => ({

            channelId,

            enabled:
                !!feedState.enabled,

            running:
                isFeedRunning(channelId),

            postedCount:
                (feedState.postedIds || []).length

        }));

}


module.exports = {
    postOnce,
    startFeed,
    stopFeed,
    setFeedEnabled,
    resumeEnabledFeeds,
    isFeedRunning,
    listFeeds
};

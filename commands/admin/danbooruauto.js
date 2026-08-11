const {
    prefix
} = require("../../config");

const {
    isAdmin
} = require("../../admin");

const {
    postOnce,
    setFeedEnabled,
    isFeedRunning,
    listFeeds
} = require("../../danbooru-autopost");


// ======================================================
// COMMAND
// ======================================================

module.exports = {

    name: "danbooruauto",

    aliases: [
        "dbauto"
    ],

    async execute(
        message,
        args
    ) {

        try {

            // ==================================================
            // CHECK ADMIN
            // ==================================================

            if (
                !isAdmin(
                    message.author.id
                )
            ) {

                return message.reply(
                    "╰・❌ Chỉ admin mới được dùng lệnh này."
                );

            }


            const action =
                String(
                    args[0] || ""
                )
                    .trim()
                    .toLowerCase();

            const channelId =
                message.channel.id;


            // ==================================================
            // HELP / STATUS
            // ==================================================

            if (
                !action ||
                action === "status"
            ) {

                const feeds =
                    listFeeds();

                const list =
                    feeds.length

                        ? feeds
                            .map(f =>

                                `• <#${f.channelId}> · ` +
                                `${
                                    f.running
                                        ? "🟢 đang chạy"
                                        : "🔴 đang tắt"
                                } · ` +
                                `${f.postedCount} ảnh đã đăng`

                            )
                            .join("\n")

                        : "*Chưa có feed nào được bật.*";


                return message.reply({

                    content:

                        `╰・🖼️ **DANBOORU AUTO-POST**\n\n` +

                        `\`${prefix}danbooruauto on\` · Bật auto-post cho channel này (30 phút/lần)\n` +
                        `\`${prefix}danbooruauto off\` · Tắt auto-post cho channel này\n` +
                        `\`${prefix}danbooruauto now\` · Đăng ngay 1 ảnh ở channel này (test)\n` +
                        `\`${prefix}danbooruauto status\` · Xem danh sách feed đang bật\n\n` +

                        `📡 Feed hiện tại:\n${list}`

                });

            }


            // ==================================================
            // ON
            // ==================================================

            if (action === "on") {

                if (
                    isFeedRunning(channelId)
                ) {

                    return message.reply(
                        "╰・⚠️ Channel này đang auto-post rồi."
                    );

                }


                setFeedEnabled(

                    message.client,

                    channelId,

                    true

                );


                return message.reply(

                    `╰・✅ Đã bật auto-post cho ${message.channel} ` +
                    `(mỗi 30 phút, đang đăng ảnh đầu tiên...).`

                );

            }


            // ==================================================
            // OFF
            // ==================================================

            if (action === "off") {

                if (
                    !isFeedRunning(channelId)
                ) {

                    return message.reply(
                        "╰・⚠️ Channel này đang tắt sẵn rồi."
                    );

                }


                setFeedEnabled(

                    message.client,

                    channelId,

                    false

                );


                return message.reply(

                    `╰・🛑 Đã tắt auto-post cho ${message.channel}.`

                );

            }


            // ==================================================
            // NOW (TEST)
            // ==================================================

            if (action === "now") {

                await message.reply(
                    "╰・⏳ Đang lấy ảnh..."
                );


                const result =
                    await postOnce(

                        message.client,

                        channelId

                    );


                if (!result.ok) {

                    return message.reply(

                        `╰・❌ ${result.reason}`

                    );

                }


                return message.reply(

                    `╰・✅ Đã đăng ảnh #${result.post.id}.`

                );

            }


            // ==================================================
            // UNKNOWN ACTION
            // ==================================================

            return message.reply(

                `╰・❌ Hành động \`${action}\` không hợp lệ. ` +
                `Dùng \`on\`, \`off\`, \`now\` hoặc \`status\`.`

            );

        }

        catch (err) {

            console.error(
                "❌ DANBOORUAUTO ERROR:"
            );

            console.error(
                err
            );

            return message.reply(
                "╰・❌ Có lỗi xảy ra khi xử lý lệnh."
            );

        }

    }

};

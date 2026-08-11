const WEBHOOK_URL =
    process.env.ERROR_LOG_WEBHOOK_URL;


// ======================================================
// GHÉP NHIỀU console.error() GẦN NHAU THÀNH 1 THÔNG BÁO
// (VD: console.error("❌ XYZ:"); console.error(err); )
// ======================================================

const FLUSH_DELAY_MS = 300;

let buffer = [];
let flushTimer = null;


function stringifyArg(arg) {

    if (arg instanceof Error) {

        return arg.stack || arg.message;

    }

    if (typeof arg === "string") {

        return arg;

    }

    try {

        return JSON.stringify(arg);

    }
    catch {

        return String(arg);

    }

}


async function postToWebhook(text) {

    if (!WEBHOOK_URL || !text.trim())
        return;

    try {

        await fetch(WEBHOOK_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                embeds: [{

                    title: "❌ Bot Error",

                    description:
                        "```\n" +
                        text.slice(0, 3900) +
                        "\n```",

                    color: 0xEF4444,

                    timestamp: new Date().toISOString()

                }]

            })

        });

    }
    catch {

        // Im lặng - không console.error ở đây để tránh lặp vô hạn.

    }

}


function scheduleFlush() {

    if (flushTimer)
        return;

    flushTimer = setTimeout(() => {

        const text =
            buffer.join("\n");

        buffer = [];
        flushTimer = null;

        postToWebhook(text);

    }, FLUSH_DELAY_MS);

}


// ======================================================
// BẬT LOG LỖI RA DISCORD WEBHOOK
// ======================================================

function initErrorLogging() {

    if (!WEBHOOK_URL) {

        console.log(
            "ℹ️ ERROR_LOG_WEBHOOK_URL chưa cấu hình - " +
            "bỏ qua gửi log lỗi ra Discord."
        );

        return;

    }

    const originalError =
        console.error.bind(console);

    console.error = (...args) => {

        originalError(...args);

        buffer.push(
            args.map(stringifyArg).join(" ")
        );

        scheduleFlush();

    };


    process.on("uncaughtException", err => {

        console.error("❌ UNCAUGHT EXCEPTION:", err);

        process.exit(1);

    });

    process.on("unhandledRejection", reason => {

        console.error("❌ UNHANDLED REJECTION:", reason);

    });

}


module.exports = {
    initErrorLogging
};

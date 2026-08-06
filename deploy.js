require("dotenv").config();

const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const commands = [
    new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Kiểm tra bot")
        .toJSON()
];

const rest = new REST({ version: "10" })
    .setToken(process.env.TOKEN);

async function main() {
    try {
        console.log("Đang đăng ký lệnh...");

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            {
                body: commands
            }
        );

        console.log("Đăng ký lệnh thành công!");
    } catch (error) {
        console.error(error);
    }
}

main();
import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import path from "path";

import {getSubCommandFiles, log, sleep} from "../../../modules/jerryUtils.js";


export default {
    data: new SlashCommandBuilder()
        .setName("logs")
        .setDescription("Perform an action with the bot's log files.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("append")
                .setDescription("Appends a string to the active log file.")
                .addStringOption((options) =>
                    options
                        .setName("body")
                        .setDescription("[REQUIRED] The string to append to the log file.")
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("get")
                .setDescription("Sends the latest log file.")
                .addIntegerOption((options) =>
                    options
                        .setName("offset")
                        .setDescription("[OPTIONAL] Number of days to skip starting with the current day going back. Defaults to 0 (today).")
                        .setRequired(false))),
    async execute(client, interaction) {
        // Declaring variables

        // Checks

        // Main
        const __filename = new URL(import.meta.url).pathname;
        const __dirname = path.dirname(__filename);
        const subcommand_files = await getSubCommandFiles(path.resolve(__dirname, "./"), ".subcmd.js");

        for(const file of subcommand_files) {
            if(file.endsWith(interaction.options.getSubcommand() + ".subcmd.js")) {
                await log("append", "hdlr", "├─Handing controls to subcommand file...", "DEBUG");
                (await import(file)).default(client, interaction);
                break;
            }
        }
    }
};

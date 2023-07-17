import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import path from "path";
import URL from "url";

import {logger, sleep} from "../../../modules/jerryUtils.js";


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
        logger.append("debug", "HDLR", "Searching for subcommand file...");
        (await import(`./${interaction.commandName}_${interaction.options.getSubcommand()}.subcmd.js`)).default(client, interaction);
    }
};

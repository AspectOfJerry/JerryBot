import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import path from "path";
import URL from "url";

import {logger, sleep} from "../../../utils/jerryUtils.js";


export default {
    data: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Shows statistics about the bot.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("bot")
                .setDescription("Shows statistics about the bot.")),
    async execute(client, interaction) {
        // Declaring variables

        // Checks

        // Main
        logger.append("debug", "HDLR", "Searching for subcommand file...");
        (await import(`./${interaction.commandName}_${interaction.options.getSubcommand()}.subcmd.js`)).default(client, interaction);
    }
};

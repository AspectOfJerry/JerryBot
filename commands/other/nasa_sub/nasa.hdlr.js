import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";

import {logger, sleep} from "../../../modules/jerryUtils.js";


export default {
    data: new SlashCommandBuilder()
        .setName("nasa")
        .setDescription("Executes a command related with the NASA Open APIs.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("api")
                .setDescription("Makes an API call to NASA's APOD API."))
        .addSubcommand(subcommand =>
            subcommand
                .setName("apod")
                .setDescription("Returns the Astronomy Picture of the Day (APOD) from NASA.")),
    async execute(client, interaction) {
        // Declaring variables

        // Checks

        // Main
        logger.append("debug", "HDLR", "Searching for subcommand file...");
        (await import(`./${interaction.commandName}_${interaction.options.getSubcommand()}.subcmd.js`)).default(client, interaction);
    }
};

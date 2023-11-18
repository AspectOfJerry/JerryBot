import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";

import {logger, sleep} from "../../../utils/jerryUtils.js";


export default {
    data: new SlashCommandBuilder()
    .setName("hypixel")
    .setDescription("Hypixel related commands")
    .addSubcommand(subcommand =>
        subcommand
        .setName("api")
        .setDescription("Makes an API request to Hypixel"))
    // .addSubcommand(subcommand =>
    // subcommand
    // .setName("SUBCMD_NAME")
    // .setDescription("SUBCMD_DESCRIPTION")
    // .addStringOption((options) =>
    //     options
    //         .setName("SUBCMD_OPTION_NAME")
    //         .setDescription("[REQUIRED/OPTIONAL] SUBCMD_OPTION_DESCRIPTION")
    //         .setRequired(true / false))
    // )
    ,
    async execute(client, interaction) {
        // Declaring variables

        // Checks

        // Main
        logger.append("debug", "HDLR", "Searching for subcommand file...");
        (await import(`./${interaction.commandName}_${interaction.options.getSubcommand()}.subcmd.js`)).default(client, interaction);
    }
};

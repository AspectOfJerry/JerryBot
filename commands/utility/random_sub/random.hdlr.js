import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";

import {logger, sleep} from "../../../utils/jerryUtils.js";


export default {
    data: new SlashCommandBuilder()
        .setName("random")
        .setDescription("Commands related to pseudorandom number generators.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("number")
                .setDescription("Generates a random number")
                .addIntegerOption((options) =>
                    options
                        .setName("min")
                        .setDescription("The minimum number. Defaults to 0")
                        .setRequired(false))
                .addIntegerOption((options) =>
                    options
                        .setName("max")
                        .setDescription("The maximum number. Defaults to 100")
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("coinflip")
                .setDescription("Coinflip!")
        ),
    async execute(client, interaction) {
        // Declaring variables

        // Checks

        // Main
        logger.append("debug", "HDLR", "Searching for subcommand file...");
        (await import(`./${interaction.commandName}_${interaction.options.getSubcommand()}.subcmd.js`)).default(client, interaction);
    }
};

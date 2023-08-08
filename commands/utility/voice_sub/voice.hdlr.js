import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent, Interaction} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";

import {logger, sleep} from "../../../utils/jerryUtils.js";


export default {
    data: new SlashCommandBuilder()
        .setName("voice")
        .setDescription("Perform voice channel actions.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("join")
                .setDescription("Joins a voice channel. Defaults to your current voice channel.")
                .addChannelOption((options) =>
                    options
                        .setName("channel")
                        .setDescription("[OPTIONAL] The channel to join. Defaults to your current voice channel.")
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("leave")
                .setDescription("Leaves the voice channel."))
        .addSubcommand(subcommand =>
            subcommand
                .setName("mute")
                .setDescription("Toggles server-mute on the bot."))
        .addSubcommand(subcommand =>
            subcommand
                .setName("deaf")
                .setDescription("Toggles server-deaf on the bot.")),
    async execute(client, interaction) {
        // Declaring variables

        // Checks

        // Main
        logger.append("debug", "HDLR", "Searching for subcommand file...");
        (await import(`./${interaction.commandName}_${interaction.options.getSubcommand()}.subcmd.js`)).default(client, interaction);
    }
};

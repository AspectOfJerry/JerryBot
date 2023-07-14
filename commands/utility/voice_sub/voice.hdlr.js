import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent, Interaction} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} from "@discordjs/voice";
import path from "path";

import {getSubCommandFiles, log, sleep} from "../../../modules/jerryUtils.js";


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

const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent, Interaction} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require("@discordjs/voice");
const Path = require("path");

const {GetSubCommandFiles, Log, Sleep} = require("../../../modules/JerryUtils.js");


module.exports = {
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
        const subcommand_files = await GetSubCommandFiles(Path.resolve(__dirname, "./"), ".subcmd.js");

        for(const file of subcommand_files) {
            if(file.endsWith(interaction.options.getSubcommand() + ".subcmd.js")) {
                await Log("append", "hdlr", "├─Handing controls to subcommand file...", "DEBUG");
                require(file)(client, interaction);
                break;
            }
        }
    }
};

const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const Sleep = require('../../../modules/sleep.js'); // delayInMilliseconds
const Log = require('../../../modules/logger.js'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    data: new SlashCommandBuilder()
        .setName('voice')
        .setDescription("Perform voice channel actions.")
        .addSubcommand(subcommand =>
            subcommand
                .setName('join')
                .setDescription("Joins a voice channel. Defaults to your current voice channel.")
                .addChannelOption((options) =>
                    options
                        .setName('channel')
                        .setDescription("[OPTIONAL]The channel to join. Defaults to your current voice channel.")
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('leave')
                .setDescription("Leaves the voice channel."))
        .addSubcommand(subcommand =>
            subcommand
                .setName('mute')
                .setDescription("Toggles server-mute on the bot."))
        .addSubcommand(subcommand =>
            subcommand
                .setName('deaf')
                .setDescription("Toggles server-deaf on the bot.")),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/voice [...]'.`, 'INFO'); // Logs

        // Declaring variables
        const subcommand = interaction.options.getSubcommand();

        // Main
        switch(subcommand) {
            case 'join': {
                await Log('append', "subcmd_hdlr", `└─'${interaction.user.tag}' executed '/voice join'.`, 'INFO'); // Logs

                // Declaring variables
                const voice_channel = interaction.options.getChannel('channel') || interaction.member.voice.channel;
                await Log('append', interaction.guild.id, `  ├─voice_channel: ${voice_channel.name}`, 'INFO'); // Logs

                // Calling the subcommand file
                await Log('append', "subcmd_hdlr", `└─Handing controls to subcommand file...`, 'DEBUG'); // Logs
                require('./voice_join.subcmd')(client, interaction, voice_channel);
            }
                break;
            case 'leave': {
                await Log('append', "subcmd_hdlr", `└─'${interaction.user.tag}' executed '/voice leave'.`, 'INFO'); // Logs

                // Declaring variables

                // Calling the subcommand file
                await Log('append', "subcmd_hdlr", `└─Handing controls to subcommand file...`, 'DEBUG'); // Logs
                require('./voice_leave.subcmd')(client, interaction);
            }
                break;
            case 'selfmute': {
                await Log('append', "subcmd_hdlr", `└─'${interaction.user.tag}' executed '/voice mute'.`, 'INFO'); // Logs

                // Declaring variables

                // Calling the subcommand file
                await Log('append', "subcmd_hdlr", `└─Handing controls to subcommand file...`, 'DEBUG'); // Logs
                require('./voice_selfmute.subcmd')(client, interaction,);
            }
                break;
            case 'selfdeaf': {
                await Log('append', "subcmd_hdlr", `└─'${interaction.user.tag}' executed '/voice deaf'.`, 'INFO'); // Logs

                // Declaring variables

                // Calling the subcommand file
                await Log('append', "subcmd_hdlr", `└─Handing controls to subcommand file...`, 'DEBUG'); // Logs
                require('./voice_selfdeaf.subcmd')(client, interaction,);
            }
                break;
            default:
                throw "Invalid subcommand.";
        }
    }
};
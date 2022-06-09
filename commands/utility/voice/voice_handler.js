const fs = require('fs');
const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const Sleep = require('../../../modules/sleep'); // delayInMilliseconds;
const Log = require('../../../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─;

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
                        .setRequired(false))
                .addBooleanOption((options) =>
                    options
                        .setName('ephemeral')
                        .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('leave')
                .setDescription("Leaves the voice channel.")
                .addBooleanOption((options) =>
                    options
                        .setName('ephemeral')
                        .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                        .setRequired(false))),
    async execute(client, interaction) {
        await Log(interaction.guild.id, `'${interaction.user.tag}' executed '/voice [...]'.`, 'INFO'); //Logs
        // Declaring variables
        const subcommand = interaction.options.getSubcommand();

        // Code
        switch(subcommand) {
            case 'join': {
                await Log(interaction.guild.id, `└─'${interaction.user.tag}' executed '/voice join'.`, 'INFO'); //Logs

                // Declaring variables
                const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
                await Log(interaction.guild.id, `  ├─ephemeral: ${is_ephemeral}`, 'INFO'); //Logs

                const voice_channel = interaction.options.getChannel('channel') || interaction.member.voice.channel;
                await Log(interaction.guild.id, `  ├─voice_channel: ${voice_channel.name}`, 'INFO'); //Logs

                // Calling the subcommand file
                require('./voice_subcommands/voice_join.subcommand')(client, interaction, is_ephemeral, voice_channel);
            }
                break;
            case 'leave': {
                await Log(interaction.guild.id, `└─'${interaction.user.tag}' executed '/voice leave'.`, 'INFO'); //Logs

                // Declaring variables
                const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
                await Log(interaction.guild.id, `  ├─ephemeral: ${is_ephemeral}`, 'INFO'); //Logs

                // Calling the subcommand file
                require('./voice_subcommands/voice_leave.subcommand')(client, interaction, is_ephemeral);
            }
                break;
            default:
                throw "Invalid subcommand. `voice_handler.js`";
        }
    }
}

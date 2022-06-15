const fs = require('fs');
const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const Sleep = require('../../modules/sleep'); // delayInMilliseconds;
const Log = require('../../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('NAME')
        .setDescription("DESCRIPTION")
        .addSubcommand(subcommand =>
            subcommand
                .setName('SUBCMD1_NAME')
                .setDescription("SUBCMD1_DESCRIPTION")
                .addStringOption((options) =>
                    options
                        .setName('SUBCMD_OPTION_NAME')
                        .setDescription("[REQUIRED / OPTIONAL] SUBCMD_OPTION_DESCRIPTION")
                        .setRequired(true / false))
                .addBooleanOption((options) =>
                    options
                        .setName('ephemeral')
                        .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('SUBCMD2_NAME')
                .setDescription("SUBCMD2_DESCRIPTION")
                .addStringOption((options) =>
                    options
                        .setName('SUBCMD2_OPTION_NAME')
                        .setDescription("[REQUIRED / OPTIONAL] SUBCMD_OPTION_DESCRIPTION")
                        .setRequired(true / false))
                .addBooleanOption((options) =>
                    options
                        .setName('ephemeral')
                        .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                        .setRequired(false))),
    async execute(client, interaction) {
        await Log("read", interaction.guild.id, `'${interaction.user.tag}' executed '/NAME [...]'.`, 'INFO'); // Logs

        // Declaring variables
        const subcommand = interaction.options.getSubcommand();

        // Code
        switch(subcommand) {
            case 'SUBCMD1_NAME': {
                await Log("read", "subcmd_hdlr", `└─'${interaction.user.tag}' executed '/NAME SUBCMD_NAME'.`, 'INFO'); // Logs

                // Declaring variables
                const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
                await Log("read", interaction.guild.id, `  ├─ephemeral: ${is_ephemeral}`, 'INFO'); // Logs

                // Calling the subcommand file
                require('./DIR')(client, interaction, is_ephemeral);
            }
                break;
            case 'SUBCMD2_NAME': {
                await Log("read", "subcmd_hdlr", `└─'${interaction.user.tag}' executed '/NAME SUBCMD_NAME'.`, 'INFO'); // Logs

                // Declaring variables
                const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
                await Log("read", interaction.guild.id, `  ├─ephemeral: ${is_ephemeral}`, 'INFO'); // Logs

                // Calling the subcommand file
                require('./DIR')(client, interaction, is_ephemeral);
            }
                break;
            default:
                throw "Invalid subcommand.";
        }
    }
}
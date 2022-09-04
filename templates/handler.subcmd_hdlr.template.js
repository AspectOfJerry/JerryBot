const fs = require('fs');
const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const Sleep = require('../../modules/sleep'); // delayInMilliseconds
const Log = require('../../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    data: new SlashCommandBuilder()
        .setName('CMD_NAME')
        .setDescription("CMD_DESCRIPTION")
        .addSubcommand(subcommand =>
            subcommand
                .setName('SUBCMD_NAME')
                .setDescription("SUBCMD_DESCRIPTION")
                .addStringOption((options) =>
                    options
                        .setName('SUBCMD_OPTION_NAME')
                        .setDescription("[REQUIRED/OPTIONAL] SUBCMD_OPTION_DESCRIPTION")
                        .setRequired(true / false))
                .addBooleanOption((options) =>
                    options
                        .setName('ephemeral')
                        .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself or not. Defaults to false.")
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('SUBCMD_NAME')
                .setDescription("SUBCMD_DESCRIPTION")
                .addStringOption((options) =>
                    options
                        .setName('SUBCMD_OPTION_NAME')
                        .setDescription("[REQUIRED/OPTIONAL] SUBCMD_OPTION_DESCRIPTION")
                        .setRequired(true / false))
                .addBooleanOption((options) =>
                    options
                        .setName('ephemeral')
                        .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself or not. Defaults to false.")
                        .setRequired(false))),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/CMD_NAME [...]'.`, 'INFO'); // Logs

        // Declaring variables
        const subcommand = interaction.options.getSubcommand();

        // Main
        switch(subcommand) {
            case 'SUBCMD_NAME': {
                await Log('append', "subcmd_hdlr", `└─'${interaction.user.tag}' executed '/CMD_NAME SUBCMD_NAME'.`, 'INFO'); // Logs

                // Declaring variables
                const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
                await Log('append', interaction.guild.id, `  ├─ephemeral: ${is_ephemeral}`, 'INFO'); // Logs

                // Calling the subcommand file
                await Log('append', "subcmd_hdlr", `└─Now handing controls to subcommand file...`, 'WARN'); // Logs
                require('./DIRECTORY_subcommands')(client, interaction, is_ephemeral);
            }
                break;
            case 'SUBCMD_NAME': {
                await Log('append', "subcmd_hdlr", `└─'${interaction.user.tag}' executed '/CMD_NAME SUBCMD_NAME'.`, 'INFO'); // Logs

                // Declaring variables
                const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
                await Log('append', interaction.guild.id, `  ├─ephemeral: ${is_ephemeral}`, 'INFO'); // Logs

                // Calling the subcommand file
                await Log('append', "subcmd_hdlr", `└─Now handing controls to subcommand file...`, 'WARN'); // Logs
                require('./DIRECTORY_subcommands')(client, interaction, is_ephemeral);
            }
                break;
            default:
                throw "Invalid subcommand.";
        }
    }
};

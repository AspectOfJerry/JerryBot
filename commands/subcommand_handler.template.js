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
                .setName('SUBCOMMAND1_NAME')
                .setDescription("SUBCOMMAND1_DESCRIPTION")
                .addStringOption((options) =>
                    options
                        .setName('SUBCOMMAND_OPTION_NAME')
                        .setDescription("[REQUIRED / OPTIONAL] SUBCOMMAND_OPTION_DESCRIPTION")
                        .setRequired(true / false))
                .addBooleanOption((options) =>
                    options
                        .setName('ephemeral')
                        .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('SUBCOMMAND2_NAME')
                .setDescription("SUBCOMMAND2_DESCRIPTION")
                .addStringOption((options) =>
                    options
                        .setName('SUBCOMMAND2_OPTION_NAME')
                        .setDescription("[REQUIRED / OPTIONAL] SUBCOMMAND_OPTION_DESCRIPTION")
                        .setRequired(true / false))
                .addBooleanOption((options) =>
                    options
                        .setName('ephemeral')
                        .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                        .setRequired(false))),
    async execute(client, interaction) {
        await Log(interaction.guild.id, `'${interaction.user.tag}' executed '/NAME [...]'.`, 'INFO'); // Logs
        // Declaring variables
        const subcommand = interaction.options.getSubcommand();
        // Code
        switch(subcommand) {
            case 'SUBCOMMAND1_NAME': {
                await Log(interaction.guild.id, `└─'${interaction.user.tag}' executed '/NAME SUBCOMMAND_NAME'.`, 'INFO'); // Logs

                // Declaring variables
                const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
                await Log(interaction.guild.id, `  ├─ephemeral: ${is_ephemeral}`, 'INFO'); // Logs

                // Calling the subcommand file
                require('./DIR')(client, interaction, is_ephemeral);
            }
                break;
            case 'SUBCOMMAND2_NAME': {
                await Log(interaction.guild.id, `└─'${interaction.user.tag}' executed '/NAME SUBCOMMAND_NAME'.`, 'INFO'); // Logs

                // Declaring variables
                const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
                await Log(interaction.guild.id, `  ├─ephemeral: ${is_ephemeral}`, 'INFO'); // Logs

                // Calling the subcommand file
                require('./DIR')(client, interaction, is_ephemeral);
            }
                break;
            default:
                throw "Invalid subcommand. `NAME.js`";
        }
    }
}

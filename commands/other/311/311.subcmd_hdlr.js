const fs = require('fs');
const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const Sleep = require('../../../modules/sleep'); // delayInMilliseconds
const Log = require('../../../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    data: new SlashCommandBuilder()
        .setName('311')
        .setDescription("Commands for 311.")
        .addSubcommand(subcommand =>
            subcommand
                .setName('schedule')
                .setDescription("Get's today's schedule or select another day.")
                .addBooleanOption((options) =>
                    options
                        .setName('ephemeral')
                        .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible by you or not. Defaults to false.")
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('weather')
                .setDescription("Get today's weather.")
                .addBooleanOption((options) =>
                    options
                        .setName('ephemeral')
                        .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible by you or not. Defaults to false.")
                        .setRequired(false))),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/311 [...]'.`, 'INFO'); // Logs

        // Declaring variables
        const subcommand = interaction.options.getSubcommand();

        // Main
        switch(subcommand) {
            case 'schedule': {
                await Log('append', "subcmd_hdlr", `└─'${interaction.user.tag}' executed '/311 schedule'.`, 'INFO'); // Logs

                // Declaring variables
                const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
                await Log('append', interaction.guild.id, `  ├─ephemeral: ${is_ephemeral}`, 'INFO'); // Logs

                // Calling the subcommand file
                await Log('append', "subcmd_hdlr", `└─Now handing controls to subcommand file...`, 'WARN'); // Logs
                require('./311_schedule.subcmd')(client, interaction, is_ephemeral);
            }
                break;
            case 'weather': {
                await Log('append', "subcmd_hdlr", `└─'${interaction.user.tag}' executed '/311 weather'.`, 'INFO'); // Logs

                // Declaring variables
                const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
                await Log('append', interaction.guild.id, `  ├─ephemeral: ${is_ephemeral}`, 'INFO'); // Logs

                // Calling the subcommand file
                await Log('append', "subcmd_hdlr", `└─Now handing controls to subcommand file...`, 'WARN'); // Logs
                require('./311_weather.subcmd')(client, interaction, is_ephemeral);
            }
                break;
            default:
                throw "Invalid subcommand.";
        }
    }
};

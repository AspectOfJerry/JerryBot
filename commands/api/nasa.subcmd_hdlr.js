const fs = require('fs');
const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const Sleep = require('../../modules/sleep'); // delayInMilliseconds;
const Log = require('../../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nasa')
        .setDescription("Executes a command related with the NASA Open APIs.")
        .addSubcommand(subcommand =>
            subcommand
                .setName('api')
                .setDescription("Makes an API call to NASA's APOD API.")
                .addBooleanOption((options) =>
                    options
                        .setName('ephemeral')
                        .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('apod')
                .setDescription("Returns the Astronomy Picture of the Day (APOD) from NASA.")
                .addBooleanOption((options) =>
                    options
                        .setName('ephemeral')
                        .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                        .setRequired(false))),
    async execute(client, interaction) {
        await Log(interaction.guild.id, `'${interaction.user.tag}' executed '/nasa [...]'.`, 'INFO'); // Logs

        // Declaring variables
        const subcommand = interaction.options.getSubcommand();

        // Code
        switch(subcommand) {
            case 'api': {
                await Log("subcmd_hdlr", `└─'${interaction.user.tag}' executed '/nasa apod'.`, 'INFO'); // Logs

                // Declaring variables
                const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
                await Log(interaction.guild.id, `  ├─ephemeral: ${is_ephemeral}`, 'INFO'); // Logs

                // Calling the subcommand file
                require('./nasa_subcommands/nasa_apod.subcmd')(client, interaction, is_ephemeral);
            }
                break;
            case 'apod': {
                await Log("subcmd_hdlr", `└─'${interaction.user.tag}' executed '/nasa apod'.`, 'INFO'); // Logs

                // Declaring variables
                const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
                await Log(interaction.guild.id, `  ├─ephemeral: ${is_ephemeral}`, 'INFO'); // Logs

                // Calling the subcommand file
                require('./nasa_subcommands/nasa_api.subcmd')(client, interaction, is_ephemeral);
            }
                break;
            default:
                throw "Invalid subcommand.";
        }
    }
}
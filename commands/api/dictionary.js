// https:// api.dictionaryapi.dev/api/v2/entries/en/<word>
const fs = require('fs');
const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');
const fetch = require('node-fetch');

const Sleep = require('../../modules/sleep'); // delayInMilliseconds
const Log = require('../../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dictionary')
        .setDescription("Get the definition of a word.")
        .addStringOption((options) =>
            options
                .setName('string')
                .setDescription("[REQUIRED] the word to define.")
                .setRequired(true))
        .addStringOption((options) =>
            options
                .setName('language')
                .setDescription("[OPTIONAL] the language to define the word in. Defaults to English.")
                .addChoice("English (English)", 'en')
                .addChoice("Français (French)", 'fr')
                .addChoice("Español (Spanish)", 'es')
                .setRequired(false))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                .setRequired(false)),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/dictionary'.`, 'INFO'); // Logs
        // Set minimum execution role
        let MINIMUM_EXECUTION_ROLE;
        switch(interaction.guild.id) {
            case process.env.DISCORD_JERRY_GUILD_ID:
                MINIMUM_EXECUTION_ROLE = null;
                break;
            case process.env.DISCORD_GOLDFISH_GUILD_ID:
                MINIMUM_EXECUTION_ROLE = null;
                break;
            case process.env.DISCORD_CRA_GUILD_ID:
                MINIMUM_EXECUTION_ROLE = null;
                break;
            default:
                await Log('append', interaction.guild.id, "Throwing because of bad permission configuration.", 'ERROR'); // Logs
                throw `Error: Bad permission configuration.`;
        }

        // Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
        await Log('append', interaction.guild.id, `├─ephemeral: ${is_ephemeral}`, 'INFO');

        const word = interaction.options.getString('string');
        const language = interaction.options.getString('language') || 'en';
        // Checks

        // Code
        await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/hello`)
            .then(res => {
                res => res.json();
            }).then(res => {
                console.log(res);
            })

        await interaction.reply({content: "This command is currently unavailable."});
    }
}

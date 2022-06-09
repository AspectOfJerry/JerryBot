const fs = require('fs');
const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const Sleep = require('../../modules/sleep'); //delayInMilliseconds;
const Log = require('../../modules/logger'); //DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription("[DEPRECATED] Please use '/send' instead. Sends a message to the current channel.")
        .addStringOption((options) =>
            options
                .setName('message')
                .setDescription("[REQUIRED] The message to send.")
                .setRequired(true))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to true.")
                .setRequired(false)),
    async execute(client, interaction) {
        await Log(interaction.guild.id, `'${interaction.user.tag}' executed '/say'.`, 'INFO'); //Logs
        //Permission check
        let MINIMUM_EXECUTION_ROLE = undefined;
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
                throw `Error: Bad permission configuration.`;
        }

        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
        await Log(interaction.guild.id, `├─ephemeral: ${is_ephemeral}`, 'INFO'); //Logs

        let message = interaction.options.getString("string");

        //Checks

        //Code
        const deprecation_warning = new MessageEmbed()
            .setColor('RED')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle('DeprecationWarning')
            .setDescription("This command is deprecated. Please use the `/send` command instead.")

        interaction.reply({emebds: [deprecation_warning], ephemeral: is_ephemeral});
        await Log(interaction.guild.id, `└─This command is deprecated, and it is replaced by '/send'`, 'WARN'); //Logs
    }
}

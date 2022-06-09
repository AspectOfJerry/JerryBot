const fs = require('fs');
const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const Sleep = require('../../modules/sleep'); // delayInMilliseconds;
const Log = require('../../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('send')
        .setDescription("Sends a message in a channel")
        .addStringOption((options) =>
            options
                .setName('message')
                .setDescription("[REQUIRED] The message to send.")
                .setRequired(true))
        .addChannelOption((options) =>
            options
                .setName('channel')
                .setDescription("[OPTIONAL] The channel to send the message to. Defaults to the current channel.")
                .setRequired(false))
        .addBooleanOption((options) =>
            options
                .setName('type')
                .setDescription("[OPTIONAL] Whether you want the bot to type for 1 seconds before the message is sent.")
                .setRequired(false))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                .setRequired(false)),
    async execute(client, interaction) {
        await Log(interaction.guild.id, `'${interaction.user.tag}' executed '/send'.`, 'INFO'); // Logs
        // Permission check
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

        // Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
        await Log(interaction.guild.id, `├─ephemeral: ${is_ephemeral}`, 'INFO'); // Logs

        const channel = interaction.options.getChannel('channel') || interaction.channel;
        await Log(interaction.guild.id, `├─channel: '#${channel.name}'`, 'INFO'); // Logs
        const message = interaction.options.getString('message') || true;
        await Log(interaction.guild.id, `├─message: "${message}"`, 'INFO'); // Logs
        const do_typing = interaction.options.getBoolean('type') || false;
        await Log(interaction.guild.id, `├─do_typing: ${do_typing}`, 'INFO'); // Logs

        // Checks
        if(!channel.isText()) {
            const error_require_text_based_channel = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("Error")
                .setURL("https:// discord.js.org/#/docs/discord.js/stable/typedef/TextBasedChannels")
                .setDescription("You need to mention a text-based channel.")

            interaction.reply({embeds: [error_require_text_based_channel], ephemeral: is_ephemeral});
            return;
        }

        // Code
        switch(do_typing) {
            case true:
                await interaction.reply({content: `Sending "${message}" to #${channel} with typing...`, ephemeral: true})

                await channel.sendTyping()
                await Sleep(1000)

                await channel.send({content: `${message}`});
                break; // 
            case false:
                await interaction.reply({content: `Sending "${message}" to #${channel} without typing...`, ephemeral: true})

                await channel.send({content: `${message}`});
                break; // 
        }
    }
}

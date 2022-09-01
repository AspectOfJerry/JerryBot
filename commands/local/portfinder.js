const fs = require('fs');
const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');
const portfinder = require('portfinder');

const Sleep = require('../../modules/sleep'); // delayInMilliseconds
const Log = require('../../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    data: new SlashCommandBuilder()
        .setName('portfinder')
        .setDescription("Sends available TCP ports in the local machine ready to be binded to.")
        .addIntegerOption((options) =>
            options
                .setName('amount')
                .setDescription("[OPTIONAL] The amount of available ports to search for. Defaults to 10.")
                .setRequired(false))
        .addIntegerOption((options) =>
            options
                .setName('start')
                .setDescription("[OPTIONAL] The start port value to search from. Defaults to 8000.")
                .setRequired(false))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                .setRequired(false)),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/portfinder'.`, 'INFO'); // Logs
        const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
        await Log('append', interaction.guild.id, `├─ephemeral: ${is_ephemeral}`, 'INFO'); // Logs
        await interaction.deferReply({ephemeral: is_ephemeral});

        // Set minimum execution role
        switch(interaction.guild.id) {
            case process.env.DISCORD_JERRY_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = "PL1";
                break;
            case process.env.DISCORD_GOLDFISH_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = "Admin";
                break;
            case process.env.DISCORD_CRA_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = "PL1";
                break;
            case process.env.DISCORD_311_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = "PL0";
                break;
            default:
                await Log('append', interaction.guild.id, "Throwing because of bad permission configuration.", 'ERROR'); // Logs
                throw `Error: Bad permission configuration.`;
        }

        // Declaring variables
        const search_amount = interaction.options.getInteger('amount') || 10;
        const start_port = interaction.options.getInteger('start') || 8000;

        let ports = [];
        let nextPort;
        // Checks
        // -----BEGIN ROLE CHECK-----
        if(!interaction.member.roles.cache.find(role => role.name == MINIMUM_EXECUTION_ROLE)) {
            const error_permissions = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("PermissionError")
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.");

            await interaction.editReply({embeds: [error_permissions]});
            return;
        }
        // -----END ROLE CHECK-----

        // Main
        portfinder.basePort = start_port;
        // const available_ports = new MessageEmbed()
        //     .setColor('GREEN')
        //     .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        //     .setTitle(`Available ports starting from ${start_port}`)
        //     .setDescription(`Searched for ${search_amount} ports:\n` +
        //         `[${ports.join(', ')}]`);

        // interaction.editReply({embeds: [available_ports]});
        interaction.editReply({content: "This command is currently unavailable."});
        await Log('append', interaction.guild.id, `└─This command is currently unavailable.`, 'ERROR');
    }
}

const fs = require('fs');
const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const Sleep = require('../../../../modules/sleep'); // delayInMilliseconds
const Log = require('../../../../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = async function (client, interaction, is_ephemeral) {
    await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' executed '/voice leave'.`, 'INFO'); // Logs
    await Log('append', interaction.guild.id, `├─ephemeral: ${is_ephemeral}`, 'INFO'); // Logs
    await interaction.deferReply({ephemeral: is_ephemeral});

    // Set minimum execution role
    switch(interaction.guild.id) {
        case process.env.DISCORD_JERRY_GUILD_ID:
            var MINIMUM_EXECUTION_ROLE = null;
            break;
        case process.env.DISCORD_GOLDFISH_GUILD_ID:
            var MINIMUM_EXECUTION_ROLE = null;
            break;
        case process.env.DISCORD_CRA_GUILD_ID:
            var MINIMUM_EXECUTION_ROLE = null;
            break;
        case process.env.DISCORD_311_GUILD_ID:
            var MINIMUM_EXECUTION_ROLE = null;
            break;
        default:
            await Log('append', interaction.guild.id, "Throwing because of bad permission configuration.", 'ERROR'); // Logs
            throw `Error: Bad permission configuration.`;
    }

    // Declaring variables

    // Checks
    const _connection = getVoiceConnection(interaction.guild.id);
    if(!_connection) {
        const error_not_in_vc = new MessageEmbed()
            .setColor('RED')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle('Error')
            .setDescription("The bot is not in a voice channel.");

        await interaction.editReply({embeds: [error_not_in_vc]});
        return;
    }

    // Main
    const fetching_connection = new MessageEmbed()
        .setColor('YELLOW')
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        .setTitle('VoiceConnection')
        .setDescription("Fetching voice connections in this guild...");

    await interaction.editReply({embeds: [fetching_connection]});

    const connection = getVoiceConnection(interaction.guild.id);

    connection.destroy();

    const connection_destroyed = new MessageEmbed()
        .setColor('FUCHSIA')
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        .setTitle('VoiceConnection')
        .setDescription("__Destroyed__. The connection to the voice channel has been destroyed.");

    await interaction.editReply({embeds: [connection_destroyed]});
}

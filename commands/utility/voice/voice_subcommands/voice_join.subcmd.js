const fs = require('fs');
const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const Sleep = require('../../../../modules/sleep'); // delayInMilliseconds
const Log = require('../../../../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = async function (client, interaction, is_ephemeral, voice_channel) {
    await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' executed '/voice join'.`, 'INFO'); // Logs
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
            throw `Error: Bad permission configuration.`;
    }

    // Declaring variables

    // Checks
    if(!interaction.member.voice.channel && !voice_channel) {
        const error_not_in_vc = new MessageEmbed()
            .setColor('RED')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle('Error')
            .setDescription("You must specify a voice channel for the bot to join if you are not currently in a voice channel.");

        await interaction.reply({embeds: [error_not_in_vc], ephemeral: is_ephemeral});
        return;
    }

    // Code
    const creating_connection = new MessageEmbed()
        .setColor('YELLOW')
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
        .setDescription('Creating a connection...');

    await interaction.reply({embeds: [creating_connection], ephemeral: is_ephemeral});

    const connection = joinVoiceChannel({
        channelId: voice_channel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator
    });

    connection.on(VoiceConnectionStatus.Connecting, async () => {
        const _connection_connecting = new MessageEmbed()
            .setColor('YELLOW')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle('VoiceConnection')
            .setDescription("__Connecting__. The bot is establishing a connection to the voice channel...");

        await interaction.editReply({embeds: [_connection_connecting], ephemeral: is_ephemeral});
        await Log('append', interaction.guild.id, `├─Connecting. Establishing a connection to the voice channel...`, 'INFO'); // Logs
    });
    connection.on(VoiceConnectionStatus.Ready, async () => {
        const _connection_ready = new MessageEmbed()
            .setColor('GREEN')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle('VoiceConnection')
            .setDescription("__Ready__. The connection to the voice channel has been established.");

        await interaction.editReply({embeds: [_connection_ready], ephemeral: is_ephemeral});
        await Log('append', interaction.guild.id, `├─Ready. The connection to the voice channel has been established.`, 'INFO'); // Logs
    });

    const success_join = new MessageEmbed()
        .setColor('GREEN')
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        .setTitle('VoiceConnection')
        .setDescription(`Successfully joined <#${voice_channel.id}>`);

    await interaction.editReply({embeds: [success_join], ephemeral: is_ephemeral});
    await Log('append', interaction.guild.id, `├─Successfully joined ${voice_channel.name}`, 'INFO'); // Logs
}

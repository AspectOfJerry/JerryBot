const fs = require('fs');
const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const Sleep = require('../../../../modules/sleep'); // delayInMilliseconds;
const Log = require('../../../../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─;

module.exports = async function (client, interaction, is_ephemeral) {
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

    // Checks
    const _connection = getVoiceConnection(interaction.guild.id);
    if(!_connection) {
        const error_not_in_vc = new MessageEmbed()
            .setColor('RED')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle('Error')
            .setDescription("The bot is not in a voice channel.")

        await interaction.reply({embeds: [error_not_in_vc], ephemeral: is_ephemeral});
        return;
    }

    // Code
    const connection = getVoiceConnection(interaction.guild.id);

    await connection.selfMute()

    const self_mute = new MessageEmbed()
        .setColor('GREEN')
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        .setTitle("Voice selfMute")
        .setDescription("Successfully toggled self-mute.")

    await interaction.relpy({embeds: [self_mute], ephemeral: is_ephemeral});
}

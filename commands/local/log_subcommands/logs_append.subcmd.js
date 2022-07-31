const fs = require('fs');
const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const Sleep = require('../../../modules/sleep'); // delayInMilliseconds
const Log = require('../../../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = async function (client, interaction, is_ephemeral, string, object) {
    await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' executed '/log append'.`, 'INFO'); // Logs
    // Set minimum execution role
    let MINIMUM_EXECUTION_ROLE;
    switch(interaction.guild.id) {
        case process.env.DISCORD_JERRY_GUILD_ID:
            MINIMUM_EXECUTION_ROLE = "Friends";
            break;
        case process.env.DISCORD_GOLDFISH_GUILD_ID:
            MINIMUM_EXECUTION_ROLE = "staff";
            break;
        case process.env.DISCORD_CRA_GUILD_ID:
            MINIMUM_EXECUTION_ROLE = "PL3";
            break;
        default:
            await Log('append', interaction.guild.id, "Throwing because of bad permission configuration.", 'ERROR'); // Logs
            throw `Error: Bad permission configuration.`;
    }

    // Declaring variables

    // Checks
    if(!interaction.member.roles.cache.find(role => role.name == MINIMUM_EXECUTION_ROLE)) {
        const error_permissions = new MessageEmbed()
            .setColor('RED')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle('PermissionError')
            .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
            .setFooter({text: `You need at least the '${MINIMUM_EXECUTION_ROLE}' role to use this command.`})

        await interaction.reply({embeds: [error_permissions], ephemeral: is_ephemeral});
        await Log('append', interaction.guild.id, `  └─'${interaction.user.id}' did not have the required role to use '/log'.`, 'WARN');
        return;
    }

    // Code
    const writing_to_logs = new MessageEmbed()
        .setColor('YELLOW')
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
        .setTitle('Writing to logs...')
        .addField('String', `${string}`, false)
        .addField('Target Directory', `../logs/`, false)
    const _writing_to_logs = new MessageEmbed()
        .setColor('GREEN')
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
        .setTitle('Writing to logs')
        .addField('String', `${(await object).parsedString}`, false)
        .addField('Target Directory', `../logs/${(await object).fileName}`, false)

    await interaction.reply({embeds: [writing_to_logs], ephemeral: is_ephemeral});
    await Log('append', interaction.guild.id, string, 'LOG'); // Logs
    await interaction.editReply({embeds: [_writing_to_logs], ephemeral: is_ephemeral});
}

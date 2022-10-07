const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, ModalBuilder} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const Sleep = require('../../../../modules/sleep'); // delayInMilliseconds
const Log = require('../../../../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = async function (client, interaction, is_ephemeral) {
    await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' executed '/voice leave'.`, 'INFO'); // Logs
    await Log('append', interaction.guild.id, `  ├─ephemeral: ${is_ephemeral}`, 'INFO'); // Logs
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
            await Log('append', interaction.guild.id, "  └─Throwing because of bad permission configuration.", 'ERROR'); // Logs
            throw `Error: Bad permission configuration.`;
    }

    // Declaring variables

    // Checks
    // -----BEGIN ROLE CHECK-----
    if(MINIMUM_EXECUTION_ROLE !== null) {
        if(!interaction.member.roles.cache.find(role => role.name === MINIMUM_EXECUTION_ROLE)) {
            const error_permissions = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                .setFooter({text: `You need at least the '${MINIMUM_EXECUTION_ROLE}' role to use this command.`});

            await interaction.editReply({embeds: [error_permissions]});
            await Log('append', interaction.guild.id, `└─'${interaction.user.id}' did not have the required role to use '/voice leave'. [error_permissions]`, 'WARN'); // Logs
            return;
        }
    }
    // -----END ROLE CHECK-----
    const fetching_connection = new MessageEmbed()
        .setColor('YELLOW')
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        .setTitle('VoiceConnection')
        .setDescription("Fetching voice connections in this guild...");

    await interaction.editReply({embeds: [fetching_connection]});
    const connection = getVoiceConnection(interaction.guild.id);
    if(!connection) {
        const error_not_in_vc = new MessageEmbed()
            .setColor('RED')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle('Error')
            .setDescription("The bot is not in a voice channel.");

        await interaction.editReply({embeds: [error_not_in_vc]});
        return;
    }

    // Main
    connection.on(VoiceConnectionStatus.Destroyed, async () => {
        const connection_destroyed = new MessageEmbed()
            .setColor('FUCHSIA')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle('VoiceConnection')
            .setDescription("__Destroyed__. The connection to the voice channel has been destroyed.");

        await interaction.editReply({embeds: [connection_destroyed]});
        await Log('append', interaction.guild.id, `├─Destroyed. The connection to the voice channel has been destroyed.`, 'INFO'); // Logs

        await Sleep(500);

        const success_leave = new MessageEmbed()
            .setColor('FUCHSIA')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle('VoiceConnection')
            .setDescription(`Successfully left the voice channel.`);

        await interaction.editReply({embeds: [success_leave]});
        await Log('append', interaction.guild.id, `└─Successfully left the voice channel.`, 'INFO'); // Logs
    });
    connection.destroy();
};
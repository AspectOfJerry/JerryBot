const fs = require('fs');
const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const Sleep = require('../../modules/sleep'); // delayInMilliseconds
const Log = require('../../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disconnectall')
        .setDescription("Disconnects everyone in a user's channel.")
        .addChannelOption((options) =>
            options
                .setName('channel')
                .setDescription("[OPTIONAL] The channel to disconnect everyone from. Defaults to your voice channel.")
                .setRequired(false))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                .setRequired(false)),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/disconnectall'.`, 'INFO'); // Logs
        // Set minimum execution role
        let MINIMUM_EXECUTION_ROLE = undefined;
        switch(interaction.guild.id) {
            case process.env.DISCORD_JERRY_GUILD_ID:
                MINIMUM_EXECUTION_ROLE = "PL3";
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
        const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
        await Log('append', interaction.guild.id, `├─ephemeral: ${is_ephemeral}`, 'INFO'); // Logs
        const target = interaction.options.getUser('user') || interaction.user;
        const memberTarget = interaction.guild.members.cache.get(target.id);
        await Log('append', interaction.guild.id, `├─memberTarget: '${memberTarget.user.tag}'`, 'INFO');

        let voice_channel = interaction.options.get('channel');

        // Checks
        if(!interaction.member.roles.cache.find(role => role.name == MINIMUM_EXECUTION_ROLE)) {
            const error_permissions = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                .setFooter({text: `You need at least the '${MINIMUM_EXECUTION_ROLE}' role to use this command.`});

            await interaction.reply({embeds: [error_permissions], ephemeral: is_ephemeral});
            await Log('append', interaction.guild.id, `└─'${interaction.user.id}' did not have the required role to use '/disconnectall'.`, 'WARN');
            return;
        }

        if(!voice_channel) {
            if(!interaction.member.voice.channel) {
                const not_in_vc = new MessageEmbed()
                    .setColor('RED')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription("You must be in a voice channel if you are not providing a voice channel.");

                interaction.reply({embeds: [not_in_vc], ephemeral: is_ephemeral});
                return;
            }
            voice_channel = interaction.member.voice.channel;
        }

        // Code
        try {
            interaction.member.voice.channel.members.size;
        } catch {
            const empty_voice_channel = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription(`The ${voice_channel.name} voice channel is empty.`)

            interaction.reply({embeds: [empty_voice_channel], ephemeral: is_ephemeral});
            return;
        }
        const member_count = interaction.member.voice.channel.members.size;
        const disconnecting_members = new MessageEmbed()
            .setColor('YELLOW')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription(`Disconnecting all ${member_count} members from ${voice_channel.name}...`);

        await interaction.reply({embeds: [disconnecting_members], ephemeral: is_ephemeral});

        await memberTarget.voice.channel.members.forEach(member => {
            let voice_channel = member.voice.channel;
            member.voice.setChannel(null)
                .then(() => {
                    const disconnect_success = new MessageEmbed()
                        .setColor('GREEN')
                        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                        .setDescription(`Successfully disconnected <@${member.id}> from #${voice_channel.name}.`);

                    interaction.channel.send({embeds: [disconnect_success], ephemeral: is_ephemeral});
                })
        })
        const disconnected = new MessageEmbed()
            .setColor('GREEN')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription(`Successfully disconnected all ${member_count} members from #${voice_channel.name}.`);

        interaction.editReply({embeds: [disconnected], ephemeral: is_ephemeral});
    }
}

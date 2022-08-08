const fs = require('fs');
const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const Sleep = require('../../modules/sleep'); // delayInMilliseconds
const Log = require('../../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    data: new SlashCommandBuilder()
        .setName('move')
        .setDescription("Moves a user to a voice channel.")
        .addChannelOption((options) =>
            options
                .setName('channel')
                .setDescription("[REQUIRED] The targeted channel to move to.")
                .setRequired(true))
        .addUserOption((options) =>
            options
                .setName('user')
                .setDescription("[OPTIONAL] The user to move. Defaults to yourself.")
                .setRequired(false))
        .addBooleanOption((options) =>
            options
                .setName('all')
                .setDescription("[OPTIONAL] If you want to move everyone in the user's channel with them. Defaults to false.")
                .setRequired(false))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                .setRequired(false)),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/move'.`, 'INFO'); // Logs
        // Set minimum execution role
        switch(interaction.guild.id) {
            case process.env.DISCORD_JERRY_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = "Friends";
                break;
            case process.env.DISCORD_GOLDFISH_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = "staff";
                break;
            case process.env.DISCORD_CRA_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = "PL3";
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
        await Log('append', interaction.guild.id, `├─memberTarget: '${memberTarget.user.tag}'`, 'INFO'); // Logs

        const is_all = interaction.options.getBoolean('all') || false;
        await Log('append', interaction.guild.id, `├─is_all: ${is_all}`, 'INFO'); // Logs
        const new_voice_channel = interaction.options.getChannel('channel');

        // Checks
        // -----BEGIN ROLE CHECK-----
        if(!interaction.member.roles.cache.find(role => role.name == MINIMUM_EXECUTION_ROLE)) {
            const error_permissions = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                .setFooter({text: `You need at least the '${MINIMUM_EXECUTION_ROLE}' role to use this command.`});

            await interaction.reply({embeds: [error_permissions], ephemeral: is_ephemeral});
            await Log('append', interaction.guild.id, `└─'${interaction.user.id}' did not have the required role to use '/move'.`, 'WARN'); // Logs
            return;
        }
        // -----END ROLE CHECK-----
        if(!memberTarget.voice.channel) {
            const user_not_in_vc = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription(`Error: <@${memberTarget.id}> is not in a voice channel.`);

            interaction.reply({embeds: [user_not_in_vc], ephemeral: is_ephemeral});
            return;
        }

        // Main
        if(!is_all) {
            const current_voice_channel = memberTarget.voice.channel;
            memberTarget.voice.setChannel(new_voice_channel)
                .then(() => {
                    const success_move = new MessageEmbed()
                        .setColor('GREEN')
                        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                        .setDescription(`Successfully moved <@${memberTarget.id}> from ${current_voice_channel} to ${new_voice_channel}.`);

                    interaction.reply({embeds: [success_move], ephemeral: is_ephemeral});
                })
        } else {
            const current_voice_channel = memberTarget.voice.channel;
            const member_count = memberTarget.voice.channel.members.size;
            const moving_members = new MessageEmbed()
                .setColor('YELLOW')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription(`Moving all ${member_count} members from ${current_voice_channel} to ${new_voice_channel}...`);

            interaction.reply({embeds: [moving_members], ephemeral: is_ephemeral});

            memberTarget.voice.channel.members.forEach(async (member) => {
                let current_voice_channel = member.voice.channel;
                member.voice.setChannel(new_voice_channel)
                    .then(async () => {
                        const move_success = new MessageEmbed()
                            .setColor('GREEN')
                            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                            .setDescription(`Successfully moved <@${member.id}> from ${current_voice_channel} to ${new_voice_channel}.`);

                        await interaction.editReply({embeds: [move_success], ephemeral: is_ephemeral});
                        await Sleep(150);
                    });
            });
        }
    }
}

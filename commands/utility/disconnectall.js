const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

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
                .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself or not. Defaults to false.")
                .setRequired(false)),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/disconnectall'.`, 'INFO'); // Logs
        const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
        await Log('append', interaction.guild.id, `├─ephemeral: ${is_ephemeral}`, 'INFO'); // Logs
        await interaction.deferReply({ephemeral: is_ephemeral});

        // Set minimum execution role
        switch(interaction.guild.id) {
            case process.env.DISCORD_JERRY_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = "PL3";
                break;
            case process.env.DISCORD_GOLDFISH_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = "staff";
                break;
            case process.env.DISCORD_CRA_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = "PL3";
                break;
            case process.env.DISCORD_311_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = "PL1";
                break;
            default:
                await Log('append', interaction.guild.id, "└─Throwing because of bad permission configuration.", 'ERROR'); // Logs
                throw `Error: Bad permission configuration.`;
        }

        // Declaring variables
        let voice_channel = interaction.options.get('channel');

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
                await Log('append', interaction.guild.id, `└─'${interaction.user.id}' did not have the required role to use '/disconnectall'.`, 'WARN'); // Logs
                return;
            }
        }
        // -----END ROLE CHECK-----
        if(!voice_channel) {
            if(!interaction.member.voice.channel) {
                const not_in_vc = new MessageEmbed()
                    .setColor('RED')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription("You must be in a voice channel if you are not providing a voice channel.");

                interaction.editReply({embeds: [not_in_vc]});
                await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' was not in a voice channel and did not provide a channel`, 'WARN') // Logs
                return;
            }
            voice_channel = interaction.member.voice.channel;
            await Log('append', interaction.guild.id, `├─channel: '${voice_channel.name}'`, 'INFO'); // Logs
            await Log('append', interaction.guild.id, `├─No channel was provided. Using 'interaction.member.voice.channel' (${voice_channel.name})`, 'INFO'); // Logs
        }
        if(!voice_channel.isVoice) {
            const error_not_voice_channel = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription(`<#${voice_channel.channel.id}> is not a voice channel!`);

            interaction.editReply({embeds: [error_not_voice_channel]});
            await Log('append', interaction.guild.id, `└─The provided channel was not a voice channel (${voice_channel.channel.name}).`); // Logs
            return;
        }

        // Main
        try {
            voice_channel.members.size;
        } catch {
            const empty_voice_channel = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription(`The <#${voice_channel.channel.id}> voice channel is empty.`);

            interaction.editReply({embeds: [empty_voice_channel]});
            await Log('append', interaction.guild.id, `└─The provided channel was empty.`); // Logs
            return;
        }

        let member_count = interaction.member.voice.channel.members.size;
        const disconnecting_members = new MessageEmbed()
            .setColor('YELLOW')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription(`Disconnecting all ${member_count} members from <#${voice_channel.channel.id}>...`);

        await interaction.editReply({embeds: [disconnecting_members]});
        await Log('append', interaction.guild.id, `└─Attemping to disconnect all member in the '${voice_channel.name}' voice channel...`); // Logs

        let failed_member_count = 0;
        let failed_string = "";

        await voice_channel.members.forEach(async (member) => {
            let voice_channel = member.voice.channel;
            member.voice.setChannel(null)
                .then(async () => {
                    const disconnect_success = new MessageEmbed()
                        .setColor('GREEN')
                        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                        .setDescription(`Successfully disconnected <@${member.id}> from <#${voice_channel.channel.id}>.`);

                    await interaction.channel.send({embeds: [disconnect_success]});
                    await Log('append', interaction.guild.id, `  ├─Successfully disconnected '${member.tag}' from the '${voice_channel.name}' voice channel.`); // Logs
                }).catch(async () => {
                    const disconnect_error = new MessageEmbed()
                        .setColor('RED')
                        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                        .setDescription(`An error occurred while disconnecting <@${member.id}> from <#${voice_channel.channel.id}>.`);

                    await interaction.editReply({embeds: [disconnect_error]});
                    await Log('append', interaction.guild.id, `  ├─An error occurred while disconnecting '${member.tag}' from the '${voice_channel.name}' voice channel.`); // Logs
                    member_count--
                    failed_member_count++
                });
            await Sleep(150);
        });
        let embed_color = 'GREEN';
        if(failed_member_count !== 0) {
            embed_color = 'YELLOW';
            failed_string = `\nFailed to disconnect ${failed_member_count} members from <#${voice_channel.channel.id}>.`;
        }
        if(failed_member_count !== 0 && member_count === 0) {
            embed_color = 'RED';
        }
        const disconnected = new MessageEmbed()
            .setColor(embed_color)
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription(`Successfully disconnected ${member_count} members from <#${voice_channel.channel.id}>.${failed_string}`);

        interaction.editReply({embeds: [disconnected]});
        await Log('append', interaction.guild.id, `  └─Successfully disconnected ${member_count} members from '${voice_channel.name}' and failed to disconnect ${failed_member_count} members.`); // Logs
    }
};

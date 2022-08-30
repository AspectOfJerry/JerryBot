const fs = require('fs');
const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');
const ms = require('ms')

const Sleep = require('../../modules/sleep'); // delayInMilliseconds
const Log = require('../../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription("Times out a member for a specified amount of time.")
        .addUserOption((options) =>
            options
                .setName('user')
                .setDescription("[REQUIRED] The user to timeout.")
                .setRequired(true))
        .addStringOption((options) =>
            options
                .setName('duration')
                .setDescription("[REQUIRED] The duration of the timeout.")
                .setRequired(true))
        .addStringOption((options) =>
            options
                .setName('reason')
                .setDescription("[OPTIONAL] The reason for the timeout.")
                .setRequired(false))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                .setRequired(false)),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/timeout'.`, 'INFO'); // Logs
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
                await Log('append', interaction.guild.id, "Throwing because of bad permission configuration.", 'ERROR'); // Logs
                throw `Error: Bad permission configuration.`;
        }

        // Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
        await Log('append', interaction.guild.id, `├─ephemeral: ${is_ephemeral}`, 'INFO'); // Logs
        const target = interaction.options.getUser('user');
        const memberTarget = interaction.guild.members.cache.get(target.id);
        await Log('append', interaction.guild.id, `├─memberTarget: '${memberTarget.user.tag}'`, 'INFO'); // Logs

        const duration = interaction.options.getString('duration');
        let reason = interaction.options.getString('reason');
        await Log('append', interaction.guild.id, `├─reason: ${reason}`, 'INFO');

        const duration_in_ms = ms(duration);
        await Log('append', interaction.guild.id, `├─duration_in_ms: ${duration}`, 'INFO');

        // Checks
        // -----BEGIN ROLE CHECK-----
        if(!interaction.member.roles.cache.find(role => role.name == MINIMUM_EXECUTION_ROLE)) {
            const error_permissions = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                .setFooter({text: `You need at least the '${MINIMUM_EXECUTION_ROLE}' role to use this command.`});

            interaction.reply({embeds: [error_permissions]});
            await Log('append', interaction.guild.id, `└─'${interaction.user.id}' did not have the required role to user '/timeout'.`, 'WARN'); // Logs
            return;
        }
        // -----END ROLE CHECK-----
        if(memberTarget.id == interaction.user.id) {
            const error_cannot_use_on_self = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("Error")
                .setDescription('You cannot timeout yourself.');

            interaction.reply({embeds: [error_cannot_use_on_self], ephemeral: is_ephemeral});
            await Log('append', interaction.guild.id, `${interaction.user.id} tried to timeout themselves.`, 'WARN');
            return;
        }
        if(!duration_in_ms) {
            const error_duration = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('Error')
                .setDescription('Invalid duration. Please use a valid duration.')
                .addField("Examples", "1s *(min)*, 5m, 1h, 30d *(max)*");

            interaction.reply({embeds: [error_duration], ephemeral: is_ephemeral});
            return;
        }
        // -----BEGIN HIERARCHY CHECK-----
        if(memberTarget.roles.highest.position > interaction.member.roles.highest.position) {
            const error_role_too_low = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription(`Your highest role is lower than <@${memberTarget.id}>'s highest role.`);

            interaction.reply({embeds: [error_role_too_low], ephemeral: is_ephemeral});
            await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' tried to timeout ${memberTarget.user.tag} but their highest role was lower.`, 'WARN'); // Logs
            return;
        }
        if(memberTarget.roles.highest.position >= interaction.member.roles.highest.position) {
            const error_equal_roles = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription(`Your highest role is equal to <@${interaction.user.id}>'s highest role.`);

            interaction.reply({embeds: [error_equal_roles], ephemeral: is_ephemeral});
            await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' tried to timeout '${memberTarget.user.tag}' but their highest role was equal.`, 'WARN'); // Logs
            return;
        }
        // -----END HIERARCHY CHECK-----
        // Check if memberTarget has the ADMINISTRATOR permission flag
        if(memberTarget.permissions.has("ADMINISTRATOR")) {
            const target_is_admin = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('Error')
                .setDescription(`<@${memberTarget.id}> has the ` + `ADMINISTRATOR ` + `permission flag.`);

            interaction.reply({embeds: [target_is_admin], ephemeral: is_ephemeral});
            await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' tried to timeout '${memberTarget.user.tag}' but they had the 'ADMINISTRATOR' permission flag.`, 'WARN'); // Logs
            return;
        }

        // Main
        reason = reason ? ` \n**Reason:** ${reason}` : "";
        memberTarget.timeout(duration_in_ms, reason)
            .then(timeoutResult => {
                const success_timeout = new MessageEmbed()
                    .setColor('GREEN')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                    .setTitle("User timeout")
                    .setDescription(`<@${interaction.user.id}> timed out <@${memberTarget.id}> for ${duration}.${reason}`);

                interaction.reply({embeds: [success_timeout], components: [], ephemeral: is_ephemeral});
            });
        await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' timed out '${memberTarget.user.tag}' for ${duration}.${reason}`, 'WARN'); // Logs
    }
}

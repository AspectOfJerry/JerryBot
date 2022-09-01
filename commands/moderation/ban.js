const fs = require('fs');
const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const Sleep = require('../../modules/sleep'); // delayInMilliseconds
const Log = require('../../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription("Bans a user from the guild.")
        .addUserOption((options) =>
            options
                .setName('user')
                .setDescription("[REQUIRED] The user to ban.")
                .setRequired(true))
        .addStringOption((options) =>
            options
                .setName('reason')
                .setDescription("[OPTIONAL] The reason for the ban.")
                .setRequired(false))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                .setRequired(false)),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/ban'.`, 'INFO'); // Logs
        const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
        await Log('append', interaction.guild.id, `├─ephemeral: ${is_ephemeral}`, 'INFO'); // Logs
        await interaction.deferReply({ephemeral: is_ephemeral});

        // Set minimum execution role
        switch(interaction.guild.id) {
            case process.env.DISCORD_JERRY_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = "PL1";
                break;
            case process.env.DISCORD_GOLDFISH_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = "Mod";
                break;
            case process.env.DISCORD_CRA_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = "PL1";
                break;
            case process.env.DISCORD_311_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = "PL1";
                break;
            default:
                await Log('append', interaction.guild.id, "Throwing because of bad permission configuration.", 'ERROR'); // Logs
                throw `Error: Bad permission configuration.`;
        }

        // Declaring variables
        const target = interaction.options.getUser('user');
        const memberTarget = interaction.guild.members.cache.get(target.id);
        await Log('append', interaction.guild.id, `├─memberTarget: '${memberTarget.user.tag}'`, 'INFO'); // Logs

        let reason = interaction.options.getString('reason');
        await Log('append', interaction.guild.id, `├─reason: '${reason}'`, 'INFO'); // Logs

        // Check
        // -----BEGIN ROLE CHECK-----
        if(!interaction.member.roles.cache.find(role => role.name == MINIMUM_EXECUTION_ROLE)) {
            const error_permissions = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                .setFooter({text: `You need at least the '${MINIMUM_EXECUTION_ROLE}' role to use this command.`});

            await interaction.editReply({embeds: [error_permissions]});
            await Log('append', interaction.guild.id, `└─'${interaction.user.id}' did not have the required role t use '/ban'.`, 'WARN'); // Logs
            return;
        }
        // -----END ROLE CHECK-----
        if(memberTarget.id == interaction.user.id) {
            const error_cannot_use_on_self = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("Error")
                .setDescription('You cannot ban yourself.');

            interaction.editReply({embeds: [error_cannot_use_on_self]});
            await Log('append', interaction.guild.id, `└─'${interaction.user.id}' tried to ban themselves.`, 'WARN'); // Logs
            return;
        }
        // -----BEGIN HIERARCHY CHECK-----
        if(memberTarget.roles.highest.position > interaction.member.roles.highest.position) {
            const error_role_too_low = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription(`Your highest role is lower than <@${memberTarget.id}>'s highest role.`);

            interaction.editReply({embeds: [error_role_too_low]});
            await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' tried to timeout ${memberTarget.user.tag} but their highest role was lower.`, 'WARN'); // Logs
            return;
        }
        if(memberTarget.roles.highest.position >= interaction.member.roles.highest.position) {
            const error_equal_roles = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription(`Your highest role is equal to <@${memberTarget.id}>'s highest role.`);

            interaction.editReply({embeds: [error_equal_roles]});
            await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' tried to timeout '${memberTarget.user.tag}' but their highest role was equal.`, 'WARN'); // Logs
            return;
        }
        // -----END HIERARCHY CHECK-----

        // Main
        let row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('ban_confirm_button')
                    .setLabel(`Ban`)
                    .setStyle('DANGER')
                    .setDisabled(false),
                new MessageButton()
                    .setCustomId('ban_cancel_button')
                    .setLabel('Cancel')
                    .setStyle('PRIMARY')
                    .setDisabled(false),
            );

        const confirm_ban = new MessageEmbed()
            .setColor('YELLOW')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle(`Confirm Ban`)
            .setDescription(`Are you sure you want to ban <@${memberTarget.id}>?`);

        await interaction.editReply({embeds: [confirm_ban], components: [row]});
        await Log('append', interaction.guild.id, `├─Execution authorized. Waiting for confirmation.`, 'INFO'); // Logs

        const filter = async (buttonInteraction) => {
            if(buttonInteraction.member.roles.highest.position > interaction.member.roles.highest.position) {
                return true;
            }
            else if(buttonInteraction.user.id == interaction.user.id) {
                return true;
            } else {
                await buttonInteraction.editReply({content: "You cannot use this button.", ephemeral: true});
                await Log('append', interaction.guild.id, `├─'${buttonInteraction.user.tag}' did not have the permission to use this button.`, 'WARN'); // Logs
                return;
            }
        }

        const ban_collector = interaction.channel.createMessageComponentCollector({filter, time: 30000});

        ban_collector.on('collect', async buttonInteraction => {
            // Disabling buttons
            row.components[0]
                .setDisabled(true);
            row.components[1]
                .setDisabled(true);
            interaction.editReply({embeds: [confirm_ban], components: [row]});

            if(buttonInteraction.customId == 'ban_confirm_button') {
                buttonInteraction.deferUpdate();
                ban_collector.stop();
                const banning = new MessageEmbed()
                    .setColor('YELLOW')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription(`Banning <@${memberTarget.id}>...`);

                await interaction.editReply({embeds: [banning]});

                await Log('append', interaction.guild.id, `└─'${buttonInteraction.user.tag}' confirmed the ban.`, 'INFO'); // Logs
                reason = reason ? ` \n**Reason:** ${reason}` : "";
                memberTarget.ban({reason: reason})
                    .then(async banResult => {
                        const success_ban = new MessageEmbed()
                            .setColor('GREEN')
                            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                            .setTitle("GuildMember ban")
                            .setDescription(`<@${interaction.user.id}> banned <@${memberTarget.id}> from the guild.${reason}`);

                        await interaction.editReply({embeds: [success_ban], components: []});
                        await Log('append', interaction.guild.id, `  └─'${buttonInteraction.user.tag}' banned '${memberTarget.user.tag}' form the guild.`, 'WARN'); // Logs
                    });
            } else {
                buttonInteraction.deferUpdate();
                ban_collector.stop();
                const cancel_ban = new MessageEmbed()
                    .setColor('GREEN')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription(`<@${buttonInteraction.user.id}> cancelled the ban.`);

                interaction.editReply({embeds: [cancel_ban], components: []});
                await Log('append', interaction.guild.id, `└─'${buttonInteraction.user.tag}' cancelled the ban.`, 'INFO'); // Logs
            }
        });
    }
}

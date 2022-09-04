const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const Sleep = require('../../modules/sleep'); // delayInMilliseconds
const Log = require('../../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription("Enables slowmode in a guild text channel.")
        .addIntegerOption((options) =>
            options
                .setName('duration')
                .setDescription("[REQUIRED] The rate limit in seconds.")
                .setRequired(true))
        .addChannelOption((options) =>
            options
                .setName('channel')
                .setDescription("[OPTIONAL] The text channel to enable slowmode in.")
                .setRequired(false))
        .addStringOption((options) =>
            options
                .setName('reason')
                .setDescription("[OPTIONAL] The reason for enabling the rate limit.")
                .setRequired(false))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself or not. Defaults to false.")
                .setRequired(false)),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/COMMAND'.`, 'INFO'); // Logs
        const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
        await Log('append', interaction.guild.id, `├─ephemeral: ${is_ephemeral}`, 'INFO'); // Logs
        await interaction.deferReply({ephemeral: is_ephemeral});

        // Set minimum execution role
        switch(interaction.guild.id) {
            case process.env.DISCORD_JERRY_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = "PL3";
                break;
            case process.env.DISCORD_GOLDFISH_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = "Mod";
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
        const duration = interaction.options.getInteger('duration');
        const channel = interaction.options.getChannel('channel') || interaction.channel;
        const reason = interaction.options.getString('reason') || "No reason provided.";

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
                await Log('append', interaction.guild.id, `└─'${interaction.user.id}' did not have the required role to use '/slowmode'.`, 'WARN'); // Logs
                return;
            }
        }
        // -----END ROLE CHECK-----
        if(channel.type !== 'GUILD_TEXT') {
            const error_not_voice_channel = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription(`<#${channel.id}> is not a text channel!`);

            interaction.editReply({embeds: [error_not_voice_channel]});
            await Log('append', interaction.guild.id, `└─The provided channel was not a text channel (${channel.name}).`, 'WARN'); // Logs
            return;
        }

        // Main
        if(duration === 0) {
            channel.setRateLimitPerUser(0, reason)
                .then(async () => {
                    const disabled_slowmode = new MessageEmbed()
                        .setColor('GREEN')
                        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                        .setDescription(`Successfully disabled the rate limit per user in <#${channel.id}>.`)

                    interaction.editReply({embeds: [disabled_slowmode]});
                    await Log('append', interaction.guild.id, `└─Successfully disabled the rate limit per user in '${channel.name}'.`, 'INFO'); // Logs
                });
            return;
        }

        channel.setRateLimitPerUser(duration, reason)
            .then(async () => {
                const enabled_slowmode = new MessageEmbed()
                    .setColor('GREEN')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription(`Successfully enabled a **${duration}** second rate limit per user in <#${channel.id}>.`)
                    .setFooter({text: "Setting the rate limit to 0 will disable it."})

                interaction.editReply({embeds: [enabled_slowmode]});
                await Log('append', interaction.guild.id, `└─Successfully enabled a '${duration}' second rate limit per user in '${channel.name}'.`, 'INFO'); // Logs
            });
    }
};

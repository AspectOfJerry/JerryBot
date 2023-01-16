const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const {CheckPermission, Log, Sleep} = require('../../modules/JerryUtils');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription("Enables slowmode in a guild text channel.")
        .addIntegerOption((options) =>
            options
                .setName('interval')
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
                .setRequired(false)),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'@${interaction.user.tag}' executed '/${interaction.commandName}${interaction.options.getSubcommand(false) ? " " + interaction.options.getSubcommand(false) : ""}'.`, 'INFO');
        // await interaction.deferReply();

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
                await Log('append', interaction.guild.id, "└─Throwing because of bad permission configuration.", 'ERROR');
                throw `Error: Bad permission configuration.`;
        }

        // Declaring variables
        const interval = interaction.options.getInteger('interval');
        const channel = interaction.options.getChannel('channel') ?? interaction.channel;
        const reason = interaction.options.getString('reason') ?? "No reason provided.";

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

                await interaction.reply({embeds: [error_permissions]});
                await Log('append', interaction.guild.id, `└─'${interaction.user.id}' did not have the required role to perform '/slowmode'. [error_permissions]`, 'WARN');
                return 10;
            }
        }
        // -----END ROLE CHECK-----
        if(channel.type !== 'GUILD_TEXT') {
            const error_not_text_channel = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription(`<#${channel.id}> is not a text channel!`);

            await interaction.reply({embeds: [error_not_text_channel]});
            await Log('append', interaction.guild.id, `└─The provided channel was not a text channel (#${channel.name}).`, 'WARN');
            return 10;
        }

        // Main
        if(interval === 0) {
            channel.setRateLimitPerUser(0, reason)
                .then(async () => {
                    const disabled_slowmode = new MessageEmbed()
                        .setColor('GREEN')
                        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                        .setDescription(`Successfully disabled the rate limit per user in <#${channel.id}>.`)

                    await interaction.reply({embeds: [disabled_slowmode]});
                    await Log('append', interaction.guild.id, `└─Successfully disabled the rate limit per user in '#${channel.name}' in "${channel.guild.name}".`, 'INFO');
                });
            return 0;
        }

        channel.setRateLimitPerUser(interval, reason)
            .then(async () => {
                const enabled_slowmode = new MessageEmbed()
                    .setColor('GREEN')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription(`Successfully enabled a **${interval}** second rate limit per user in <#${channel.id}>.`)
                    .setFooter({text: "Set the rate limit to 0 to disable it."})

                await interaction.reply({embeds: [enabled_slowmode]});
                await Log('append', interaction.guild.id, `└─Successfully enabled a ${interval} second rate limit per user in '#${channel.name}' in "${channel.guild.name}".`, 'INFO');
            });
    }
};

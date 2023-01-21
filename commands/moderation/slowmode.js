const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");

const {PermissionCheck, Log, Sleep} = require("../../modules/JerryUtils");


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
        // await interaction.deferReply();

        if(await PermissionCheck(interaction) === false) {
            const error_permissions = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                .setFooter({text: `Use '/help' to access the documentation on command permissions.`});

            await interaction.reply({embeds: [error_permissions]});
            await Log('append', interaction.guild.id, `└─'@${interaction.user.tag}' did not have the required role to execute '/${interaction.commandName}${interaction.options.getSubcommand(false) ? " " + interaction.options.getSubcommand(false) : ""}'. [PermissionError]`, 'WARN');
            return;
        }

        // Declaring variables
        const interval = interaction.options.getInteger('interval');
        const channel = interaction.options.getChannel('channel') ?? interaction.channel;
        const reason = interaction.options.getString('reason') ?? "No reason provided.";

        // Checks
        if(channel.type !== 'GUILD_TEXT') {
            const error_not_text_channel = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription(`<#${channel.id}> is not a text channel!`);

            await interaction.reply({embeds: [error_not_text_channel]});
            await Log('append', interaction.guild.id, `└─The provided channel was not a text channel (#${channel.name}).`, 'WARN');
            return;
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
            return;
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

const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const {Log, Sleep} = require('../../modules/JerryUtils');

const ms = require('ms');

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
                .setDescription("[REQUIRED] The duration of the timeout (s, m, h, d). Examples: 1s, 1m, 1h, 1d")
                .setRequired(true))
        .addStringOption((options) =>
            options
                .setName('reason')
                .setDescription("[OPTIONAL] The reason for the timeout.")
                .setRequired(false)),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/timeout'.`, 'INFO'); // Logs
        // await interaction.deferReply();

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
        const target = interaction.options.getUser('user');
        const memberTarget = interaction.guild.members.cache.get(target.id);
        await Log('append', interaction.guild.id, `├─memberTarget: '${memberTarget.user.tag}'`, 'INFO'); // Logs

        const duration = interaction.options.getString('duration');
        let reason = interaction.options.getString('reason');
        await Log('append', interaction.guild.id, `├─reason: ${reason}`, 'INFO'); // Logs

        const duration_in_ms = ms(duration);
        await Log('append', interaction.guild.id, `├─duration_in_ms: ${duration}`, 'INFO'); // Logs

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
                await Log('append', interaction.guild.id, `└─'${interaction.user.id}' did not have the required role to perform '/timeout'. [error_permissions]`, 'WARN'); // Logs
                return 10;
            }
        }
        // -----END ROLE CHECK-----
        if(memberTarget.id == interaction.user.id) {
            const error_cannot_timeout_self = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("Error")
                .setDescription('You cannot timeout yourself.');

            interaction.reply({embeds: [error_cannot_timeout_self]});
            await Log('append', interaction.guild.id, `└─${interaction.user.id} tried to timeout themselves.`, 'WARN'); // Logs
            return 10;
        }
        if(!duration_in_ms) {
            const error_duration = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('Error')
                .setDescription('Invalid duration. Please use a valid duration.')
                .addFields(
                    {name: 'Valid examples', value: "1s *(minimum)*, 5m, 1h, 30d *(maximum)*", inline: true}
                );

            interaction.reply({embeds: [error_duration]});
            await Log('append', interaction.guild.id, `└─Invalid duration.`); // Logs
            return 10;
        }
        // -----BEGIN HIERARCHY CHECK-----
        if(memberTarget.roles.highest.position > interaction.member.roles.highest.position) {
            const error_role_too_low = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription(`Your highest role is lower than <@${memberTarget.id}>'s highest role.`);

            interaction.reply({embeds: [error_role_too_low]});
            await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' tried to timeout ${memberTarget.user.tag} but their highest role was lower.`, 'WARN'); // Logs
            return 10;
        }
        if(memberTarget.roles.highest.position >= interaction.member.roles.highest.position) {
            const error_equal_roles = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription(`Your highest role is equal to <@${interaction.user.id}>'s highest role.`);

            interaction.reply({embeds: [error_equal_roles]});
            await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' tried to timeout '${memberTarget.user.tag}' but their highest role was equal.`, 'WARN'); // Logs
            return 10;
        }
        // -----END HIERARCHY CHECK-----
        if(!memberTarget.moderatable) {
            const member_not_moderatable = new MessageEmbed()
                .setColor('FUCHSIA')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('Error')
                .setDescription(`<@${memberTarget.user.id}> is not moderatable by the client user.`)

            await interaction.reply({embeds: [member_not_moderatable]});
            await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' is not moderatable by the client user.`, 'ERROR'); // Logs
            return 10;
        }

        // Main
        if(!memberTarget.isCommunicationDisabled()) {
            reason = reason ? ` \n**Reason:** ${reason}` : "";

            memberTarget.timeout(duration_in_ms, reason)
                .then(async then => {
                    const success_timeout = new MessageEmbed()
                        .setColor('GREEN')
                        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                        .setTitle("User timeout")
                        .setDescription(`<@${interaction.user.id}> timed out <@${memberTarget.id}> for ${duration}.${reason}`)
                        .addFields(
                            {name: 'Timeout expiration', value: `> Expiration: <t:${Math.round(await memberTarget.communicationDisabledUntilTimestamp / 1000)}:R>*`, inline: false}
                        )
                        .setFooter({text: "*Relative timestamps can look out of sync depending on your timezone."});

                    await interaction.reply({embeds: [success_timeout]});
                    await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' timed out '${memberTarget.user.tag}' for ${duration}.${reason}`, 'WARN'); // Logs
                });
        } else {
            // Override option if the member is already timed out
            let row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('override_confirm_button')
                        .setLabel(`Override`)
                        .setStyle('DANGER')
                        .setDisabled(false),
                    new MessageButton()
                        .setCustomId('override_cancel_button')
                        .setLabel('Cancel')
                        .setStyle('SECONDARY')
                        .setDisabled(false)
                );

            let isOverriddenText = "";

            const now = Math.round(Date.now() / 1000);
            const auto_cancel_timestamp = now + 15;

            const confirm_override = new MessageEmbed()
                .setColor('YELLOW')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle(`Overrite timeout`)
                .setDescription(`<@${memberTarget.user.id}> is already timed out. Do you want to overrite the current timeout?`)
                .addFields(
                    {name: 'Auto cancel', value: `> :red_square: Canceling <t:${auto_cancel_timestamp}:R>*.`, inline: true}
                ).setFooter({text: "*Relative timestamps can look out of sync depending on your timezone."});

            await interaction.reply({embeds: [confirm_override], components: [row]});
            await Log('append', interaction.guild.id, `├─Execution authorized. Waiting for the confirmation.`, 'INFO'); // Logs

            // Creating a filter for the collector
            const filter = async (buttonInteraction) => {
                if(buttonInteraction.member.roles.highest.position > interaction.member.roles.highest.position) {
                    isOverriddenText = ` (overriden by <@${buttonInteraction.user.id}>)`;
                    await Log('append', interaction.guild.id, `├─'${buttonInteraction.user.tag}' overrode the decision.`, 'WARN'); // Logs
                    return true; // Reserved return, no return code
                } else if(buttonInteraction.user.id == interaction.user.id) {
                    return true; // Reserved return, no return code
                } else {
                    await buttonInteraction.reply({content: "You cannot use this button.", ephemeral: true});
                    await Log('append', interaction.guild.id, `├─'${buttonInteraction.user.tag}' did not have the permission to use this button.`, 'WARN'); // Logs
                    return; // Reserved return, no return code
                }
            };

            const button_collector = interaction.channel.createMessageComponentCollector({filter, time: 15000});

            button_collector.on('collect', async (buttonInteraction) => {
                await buttonInteraction.deferUpdate();
                await button_collector.stop();

                if(buttonInteraction.customId == 'override_confirm_button') {
                    // Disabling buttons
                    row.components[0]
                        .setStyle('SUCCESS')
                        .setDisabled(true);
                    row.components[1]
                        .setStyle('SECONDARY')
                        .setDisabled(true);

                    reason = reason ? ` \n**Reason:** ${reason}` : "";

                    memberTarget.timeout(duration_in_ms, reason)
                        .then(async then => {
                            const success_timeout = new MessageEmbed()
                                .setColor('GREEN')
                                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                                .setTitle("User timeout override")
                                .setDescription(`<@${interaction.user.id}> timed out (overriden) <@${memberTarget.id}> for ${duration}${isOverriddenText}.${reason}\n\n> Timeout expiration: <t:${Math.round(await memberTarget.communicationDisabledUntilTimestamp / 1000)}:R>.`)
                                .addFields(
                                    {value: 'Time out expiration', value: `> Expiration: <t:${Math.round(await memberTarget.communicationDisabledUntilTimestamp / 1000)}:R>*`}
                                )
                                .setFooter({text: "*Relative timestamps can look out of sync depending on your timezone."});

                            await interaction.editReply({embeds: [success_timeout], components: [row]});
                            await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' timed out (overriden) '${memberTarget.user.tag}' for ${duration}.${reason}`, 'WARN'); // Logs
                        });
                } else {
                    // Disabling buttons
                    row.components[0]
                        .setStyle('SECONDARY')
                        .setDisabled(true);
                    row.components[1]
                        .setStyle('SUCCESS')
                        .setDisabled(true);

                    const cancel_override = new MessageEmbed()
                        .setColor('GREEN')
                        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                        .setDescription(`<@${interaction.user.id}> cancelled the override${isOverriddenText}.`);

                    await interaction.editReply({embeds: [cancel_override], components: [row]});
                    await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' cancelled the timeout override${isOverriddenText}.`, 'INFO'); // Logs
                }
            });

            button_collector.on('end', async collected => {
                if(collected.size === 0) {
                    // Disabling buttons
                    row.components[0]
                        .setStyle('SECONDARY')
                        .setDisabled(true);
                    row.components[1]
                        .setStyle('SECONDARY')
                        .setDisabled(true);

                    const auto_abort = new MessageEmbed()
                        .setColor('GREEN')
                        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                        .setDescription(`Auto aborted.`);

                    await interaction.editReply({embeds: [auto_abort], components: [row]});
                    await Log('append', interaction.guild.id, `└─Auto aborted.`, 'INFO'); // Logs
                }
            });
        }
    }
};

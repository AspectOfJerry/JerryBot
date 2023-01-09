const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const {CheckPermission, Log, Sleep} = require('../../modules/JerryUtils');

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
                .setDescription("[REQUIRED] The duration of the timeout e.g. 1s, 1m, 1h, 1d")
                .setRequired(true))
        .addStringOption((options) =>
            options
                .setName('reason')
                .setDescription("[OPTIONAL] The reason for the timeout.")
                .setRequired(false)),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/timeout'.`, 'INFO');
        // await interaction.deferReply();

        if(await CheckPermission(interaction) === false) {
            const error_permissions = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")

            await interaction.reply({embeds: [error_permissions]});
            await Log('append', interaction.guild.id, `└─'@${interaction.user.tag}' did not have the required role to execute '/kick'. [PermissionError]`, 'WARN');
            return "PermissionError";
        }

        // Declaring variables
        const target = interaction.options.getUser('user');
        const memberTarget = interaction.guild.members.cache.get(target.id);
        await Log('append', interaction.guild.id, `├─memberTarget: '${memberTarget.user.tag}'`, 'INFO');

        const duration = interaction.options.getString('duration');
        let reason = interaction.options.getString('reason');
        await Log('append', interaction.guild.id, `├─reason: ${reason}`, 'INFO');

        const duration_in_ms = ms(duration);
        await Log('append', interaction.guild.id, `├─duration_in_ms: ${duration}`, 'INFO');

        // Checks
        if(memberTarget.id == interaction.user.id) {
            const error_cannot_timeout_self = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("Error")
                .setDescription('You cannot timeout yourself.');

            interaction.reply({embeds: [error_cannot_timeout_self]});
            await Log('append', interaction.guild.id, `└─${interaction.user.id} tried to timeout themselves.`, 'WARN');
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
            await Log('append', interaction.guild.id, `└─Invalid duration.`);
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
            await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' tried to timeout ${memberTarget.user.tag} but their highest role was lower.`, 'WARN');
            return 10;
        }
        if(memberTarget.roles.highest.position >= interaction.member.roles.highest.position) {
            const error_equal_roles = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription(`Your highest role is equal to <@${interaction.user.id}>'s highest role.`);

            interaction.reply({embeds: [error_equal_roles]});
            await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' tried to timeout '${memberTarget.user.tag}' but their highest role was equal.`, 'WARN');
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
            await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' is not moderatable by the client user.`, 'ERROR');
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
                        .setFooter({text: "*Relative timestamps look out of sync depending on your timezone."});

                    await interaction.reply({embeds: [success_timeout]});
                    await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' timed out '${memberTarget.user.tag}' for ${duration}.${reason}`, 'WARN');
                });
        } else {
            // Override option if the member is already timed out
            let buttonRow = new MessageActionRow()
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

            // const now = Math.round(Date.now() / 1000);
            // const auto_cancel_timestamp = now + 15;

            const confirm_override = new MessageEmbed()
                .setColor('YELLOW')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle(`Overrite timeout`)
                .setDescription(`<@${memberTarget.user.id}> is already timed out. Do you want to overrite the current timeout?`)
                // .addFields(
                //     {name: 'Auto cancel', value: `> :red_square: Canceling <t:${auto_cancel_timestamp}:R>*.`, inline: true}
                // ).setFooter({text: "*Relative timestamps look out of sync depending on your timezone."});
                .setFooter({text: "🟥 Canceling in 10s"});

            await interaction.reply({embeds: [confirm_override], components: [buttonRow]});
            await Log('append', interaction.guild.id, `├─Execution authorized. Waiting for the confirmation.`, 'INFO');

            // Creating a filter for the collector
            const filter = async (buttonInteraction) => {
                if(buttonInteraction.member.roles.highest.position > interaction.member.roles.highest.position) {
                    isOverriddenText = ` (overriden by <@${buttonInteraction.user.id}>)`;
                    await Log('append', interaction.guild.id, `├─'${buttonInteraction.user.tag}' overrode the decision.`, 'WARN');
                    return true; // Reserved return, no return code
                } else if(buttonInteraction.user.id == interaction.user.id) {
                    return true; // Reserved return, no return code
                } else {
                    await buttonInteraction.reply({content: "You cannot use this button.", ephemeral: true});
                    await Log('append', interaction.guild.id, `├─'${buttonInteraction.user.tag}' did not have the permission to use this button.`, 'WARN');
                    return; // Reserved return, no return code
                }
            };

            const button_collector = interaction.channel.createMessageComponentCollector({filter, time: 15000});

            button_collector.on('collect', async (buttonInteraction) => {
                await buttonInteraction.deferUpdate();
                await button_collector.stop();

                if(buttonInteraction.customId == 'override_confirm_button') {
                    // Disabling buttons
                    buttonRow.components[0]
                        .setStyle('SUCCESS')
                        .setDisabled(true);
                    buttonRow.components[1]
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
                                .setFooter({text: "*Relative timestamps look out of sync depending on your timezone."});

                            await interaction.editReply({embeds: [success_timeout], components: [buttonRow]});
                            await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' timed out (overriden) '${memberTarget.user.tag}' for ${duration}.${reason}`, 'WARN');
                        });
                } else {
                    // Disabling buttons
                    buttonRow.components[0]
                        .setStyle('SECONDARY')
                        .setDisabled(true);
                    buttonRow.components[1]
                        .setStyle('SUCCESS')
                        .setDisabled(true);

                    const cancel_override = new MessageEmbed()
                        .setColor('GREEN')
                        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                        .setDescription(`<@${interaction.user.id}> cancelled the override${isOverriddenText}.`);

                    await interaction.editReply({embeds: [cancel_override], components: [buttonRow]});
                    await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' cancelled the timeout override${isOverriddenText}.`, 'INFO');
                }
            });

            button_collector.on('end', async collected => {
                if(collected.size === 0) {
                    // Disabling buttons
                    buttonRow.components[0]
                        .setStyle('SECONDARY')
                        .setDisabled(true);
                    buttonRow.components[1]
                        .setStyle('SECONDARY')
                        .setDisabled(true);

                    const auto_abort = new MessageEmbed()
                        .setColor('DARK_GREY')
                        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                        .setDescription(`Auto aborted.`);

                    await interaction.editReply({embeds: [auto_abort], components: [buttonRow]});
                    await Log('append', interaction.guild.id, `└─Auto aborted.`, 'INFO');
                }
            });
        }
    }
};

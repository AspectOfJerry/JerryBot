import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";

import {logger, permissionCheck, sleep} from "../../utils/jerryUtils.js";

import ms from "ms";


export default {
    data: new SlashCommandBuilder()
        .setName("timeout")
        .setDescription("Times out a member for a specified amount of time.")
        .addUserOption((options) =>
            options
                .setName("user")
                .setDescription("[REQUIRED] The user to timeout.")
                .setRequired(true))
        .addStringOption((options) =>
            options
                .setName("duration")
                .setDescription("[REQUIRED] The duration of the timeout e.g. 1s, 1m, 1h, 1d")
                .setRequired(true))
        .addStringOption((options) =>
            options
                .setName("reason")
                .setDescription("[OPTIONAL] The reason for the timeout.")
                .setRequired(false)),
    async execute(client, interaction) {
        if(await permissionCheck(interaction, 3) === false) {
            return;
        }

        // Declaring variables
        const target = interaction.options.getUser("user");
        const memberTarget = interaction.guild.members.cache.get(target.id);
        logger.append("info", "IN", `'/timeout' > memberTarget: '@${memberTarget.user.tag}'`);

        const duration = interaction.options.getString("duration");
        let reason = interaction.options.getString("reason");
        logger.append("info", "IN", `'/timeout' > reason: ${reason}`);

        const duration_in_ms = ms(duration);
        logger.append("info", "IN", `'/timeout' > duration_in_ms: ${duration}`);

        // Checks
        if(memberTarget.id === interaction.user.id) {
            const self_timeout_exception = new MessageEmbed()
                .setColor("RED")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("SelfTimeoutException")
                .setDescription("You cannot timeout yourself.");

            interaction.reply({embeds: [self_timeout_exception]});
            logger.append("notice", "SelfTimeoutException", `'/timeout' > '@${interaction.user.id}' tried to timeout themselves.`);
            return;
        }
        if(!duration_in_ms) {
            const invalid_input_date_exception = new MessageEmbed()
                .setColor("RED")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("IllegalDateException")
                .setDescription("Invalid duration. Please use a valid duration.")
                .addFields(
                    {name: "Valid examples", value: "1s *(minimum)*, 5m, 1h, 30d *(maximum)*", inline: true}
                );

            interaction.reply({embeds: [invalid_input_date_exception]});
            logger.append("notice", "Validation", "'/timeout' > [IllegalArgumentException] Invalid duration");
            return;
        }
        // -----BEGIN HIERARCHY CHECK-----
        if(memberTarget.roles.highest.position > interaction.member.roles.highest.position) {
            const insufficient_permission_exception = new MessageEmbed()
                .setColor("RED")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("InsufficientPermissionException")
                .setDescription(`Your highest role is lower than <@${memberTarget.id}>'s highest role.`);

            interaction.reply({embeds: [insufficient_permission_exception]});
            logger.append("notice", "CMP", `'/timeout' > '@${interaction.user.tag}' tried to timeout "'${memberTarget.user.tag}' but their highest role was lower.`);
            return;
        }
        if(memberTarget.roles.highest.position >= interaction.member.roles.highest.position) {
            const insufficient_permission_exception = new MessageEmbed()
                .setColor("RED")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("InsufficientPermissionException")
                .setDescription(`Your highest role is equal to <@${interaction.user.id}>'s highest role.`);

            interaction.reply({embeds: [insufficient_permission_exception]});
            logger.append("notice", "CMP", `'/timeout' > '@${interaction.user.tag}' tried to timeout '@${memberTarget.user.tag}' but their highest role was equal.`);
            return;
        }
        // -----END HIERARCHY CHECK-----
        if(!memberTarget.moderatable) {
            const insufficient_permission_exception = new MessageEmbed()
                .setColor("FUCHSIA")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("InsufficientPermissionException")
                .setDescription(`<@${memberTarget.user.id}> is not moderatable by the client user.`);

            interaction.reply({embeds: [insufficient_permission_exception]});
            logger.append("ERROR", "STDERR", `'/timeout' > '@${interaction.user.tag}' is not moderatable by the client user.`);
            return;
        }

        // Main
        if(!memberTarget.isCommunicationDisabled()) {
            reason = reason ? ` \n**Reason:** ${reason}` : "";

            memberTarget.timeout(duration_in_ms, reason)
                .then(async () => {
                    const success_timeout = new MessageEmbed()
                        .setColor("GREEN")
                        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                        .setTitle("User timeout")
                        .setDescription(`<@${interaction.user.id}> timed out <@${memberTarget.id}> for ${duration}.${reason}`)
                        .addFields(
                            {name: "Timeout expiration", value: `> Expiration: <t:${Math.round(await memberTarget.communicationDisabledUntilTimestamp / 1000)}:R>*`, inline: false}
                        )
                        .setFooter({text: "*Relative timestamps look out of sync depending on your timezone."});

                    interaction.reply({embeds: [success_timeout]});
                    logger.append("notice", "STDOUT", `'@${interaction.user.tag}' timed out '@${memberTarget.user.tag}' for ${duration}.${reason}`);
                });
        } else {
            // Override option if the member is already timed out
            const buttonRow = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId("override_confirm_button")
                        .setLabel("Override")
                        .setStyle("DANGER")
                        .setDisabled(false),
                    new MessageButton()
                        .setCustomId("override_cancel_button")
                        .setLabel("Cancel")
                        .setStyle("SECONDARY")
                        .setDisabled(false)
                );

            let isOverridden = false;

            // const now = Math.round(dayjs() / 1000);
            // const auto_cancel_timestamp = now + 15;

            const confirm_override = new MessageEmbed()
                .setColor("YELLOW")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("Overrite timeout")
                .setDescription(`<@${memberTarget.user.id}> is already timed out. Do you want to overrite the current timeout?`)
                // .addFields(
                //     {name: 'Auto cancel', value: `> :red_square: Canceling <t:${auto_cancel_timestamp}:R>*.`, inline: true}
                // ).setFooter({text: "*Relative timestamps look out of sync depending on your timezone."});
                .setFooter({text: "🟥 Canceling in 10s"});

            const message = await interaction.reply({embeds: [confirm_override], components: [buttonRow], fetchReply: true});

            // Creating a filter for the collector
            const filter = async (buttonInteraction) => {
                if(buttonInteraction.member.roles.highest.position > interaction.member.roles.highest.position) {
                    logger.append("notice", "STDOUT", `'/timeout' > '@${buttonInteraction.user.tag}" overrode the decision.`);
                    return true;
                } else if(buttonInteraction.user.id === interaction.user.id) {
                    return true;
                } else {
                    buttonInteraction.reply({content: "You cannot use this button.", ephemeral: true});
                    logger.append("info", "CMP", `'/timeout' > '@${buttonInteraction.user.tag}' did not have the permission to use this button.`);
                    return;
                }
            };

            const button_collector = message.createMessageComponentCollector({filter, time: 15000});

            button_collector.on("collect", async (buttonInteraction) => {
                await buttonInteraction.deferUpdate();
                await button_collector.stop();

                if(buttonInteraction.customId === "override_confirm_button") {
                    // Disabling buttons
                    buttonRow.components[0]
                        .setStyle("SUCCESS")
                        .setDisabled(true);
                    buttonRow.components[1]
                        .setStyle("SECONDARY")
                        .setDisabled(true);

                    reason = reason ? ` \n**Reason:** ${reason}` : "";

                    memberTarget.timeout(duration_in_ms, reason)
                        .then(async () => {
                            const success_timeout = new MessageEmbed()
                                .setColor("GREEN")
                                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                                .setTitle("User timeout override")
                                .setDescription(`<@${interaction.user.id}> timed out (overriden) <@${memberTarget.id}> for ${duration}${isOverridden ? ` (overriden by <@${buttonInteraction.user.id}>)` : ""}.${reason} `)
                                .addFields(
                                    {name: "Time out expiration", value: `> Expiration: <t:${Math.round(await memberTarget.communicationDisabledUntilTimestamp / 1000)}:R>*`}
                                )
                                .setFooter({text: "*Relative timestamps look out of sync depending on your timezone."});

                            interaction.editReply({embeds: [success_timeout], components: [buttonRow]});
                            logger.append("notice", "STDOUT", `'/timeout' > '@${interaction.user.tag}' timed out (overriden) '@${memberTarget.user.tag}' for ${duration}.${reason}`);
                        });
                } else {
                    // Disabling buttons
                    buttonRow.components[0]
                        .setStyle("SECONDARY")
                        .setDisabled(true);
                    buttonRow.components[1]
                        .setStyle("SUCCESS")
                        .setDisabled(true);

                    const cancel_override = new MessageEmbed()
                        .setColor("GREEN")
                        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                        .setDescription(`<@${interaction.user.id}> cancelled the timeout${isOverridden ? ` (overriden by <@${buttonInteraction.user.id}>)` : ""}.`);

                    interaction.editReply({embeds: [cancel_override], components: [buttonRow]});
                    logger.append("info", "STDOUT", `'/timeout' > '@${interaction.user.tag}" cancelled the timeout${isOverridden ? ` (overriden by <@${buttonInteraction.user.id}>)` : ""}.`);
                }
            });

            button_collector.on("end", (collected) => {
                if(collected.size === 0) {
                    // Disabling buttons
                    buttonRow.components[0]
                        .setStyle("SECONDARY")
                        .setDisabled(true);
                    buttonRow.components[1]
                        .setStyle("SECONDARY")
                        .setDisabled(true);

                    const auto_abort = new MessageEmbed()
                        .setColor("DARK_GREY")
                        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                        .setDescription("Auto aborted.");

                    interaction.editReply({embeds: [auto_abort], components: [buttonRow]});
                    logger.append("info", "STDOUT", "'/timeout' > Auto aborted.");
                }
            });
        }
    }
};

import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";

import {log, permissionCheck, sleep} from "../../modules/jerryUtils.js";

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
        log("append", interaction.guild.id, `├─memberTarget: "@${memberTarget.user.tag}"`, "INFO");

        const duration = interaction.options.getString("duration");
        let reason = interaction.options.getString("reason");
        log("append", interaction.guild.id, `├─reason: ${reason}`, "INFO");

        const duration_in_ms = ms(duration);
        log("append", interaction.guild.id, `├─duration_in_ms: ${duration}`, "INFO");

        // Checks
        if(memberTarget.id === interaction.user.id) {
            const self_timeout_exception = new MessageEmbed()
                .setColor("RED")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("SelfTimeoutException")
                .setDescription("You cannot timeout yourself.");

            interaction.reply({embeds: [self_timeout_exception]});
            log("append", interaction.guild.id, `└─"@${interaction.user.id}" tried to timeout themselves.`, "WARN");
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
            log("append", interaction.guild.id, "└─Invalid duration.");
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
            log("append", interaction.guild.id, `└─"@${interaction.user.tag}" tried to timeout "@${memberTarget.user.tag}" but their highest role was lower.`, "WARN");
            return;
        }
        if(memberTarget.roles.highest.position >= interaction.member.roles.highest.position) {
            const insufficient_permission_exception = new MessageEmbed()
                .setColor("RED")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("InsufficientPermissionException")
                .setDescription(`Your highest role is equal to <@${interaction.user.id}>'s highest role.`);

            interaction.reply({embeds: [insufficient_permission_exception]});
            log("append", interaction.guild.id, `└─"@${interaction.user.tag}" tried to timeout "@${memberTarget.user.tag}" but their highest role was equal.`, "WARN");
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
            log("append", interaction.guild.id, `└─"@${interaction.user.tag}" is not moderatable by the client user.`, "ERROR");
            return;
        }

        // Main
        if(!memberTarget.isCommunicationDisabled()) {
            reason = reason ? ` \n**Reason:** ${reason}` : "";

            memberTarget.timeout(duration_in_ms, reason)
                .then(async (then) => {
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
                    log("append", interaction.guild.id, `└─"@${interaction.user.tag}" timed out "@${memberTarget.user.tag}" for ${duration}.${reason}`, "WARN");
                });
        } else {
            // Override option if the member is already timed out
            let buttonRow = new MessageActionRow()
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

            // const now = Math.round(Date.now() / 1000);
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
            log("append", interaction.guild.id, "├─Execution authorized. Waiting for the confirmation.", "INFO");

            // Creating a filter for the collector
            const filter = async (buttonInteraction) => {
                if(buttonInteraction.member.roles.highest.position > interaction.member.roles.highest.position) {
                    log("append", interaction.guild.id, `├─"@${buttonInteraction.user.tag}" overrode the decision.`, "WARN");
                    return true;
                } else if(buttonInteraction.user.id === interaction.user.id) {
                    return true;
                } else {
                    buttonInteraction.reply({content: "You cannot use this button.", ephemeral: true});
                    log("append", interaction.guild.id, `├─"@${buttonInteraction.user.tag}" did not have the permission to use this button.`, "WARN");
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
                        .then(async (then) => {
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
                            log("append", interaction.guild.id, `└─"@${interaction.user.tag}" timed out (overriden) "@${memberTarget.user.tag}"' for ${duration}.${reason}`, "WARN");
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
                    log("append", interaction.guild.id, `└─"@${interaction.user.tag}" cancelled the timeout timeout${isOverridden ? ` (overriden by <@${buttonInteraction.user.id}>)` : ""}.`, "INFO");
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
                    log("append", interaction.guild.id, "└─Auto aborted.", "INFO");
                }
            });
        }
    }
};

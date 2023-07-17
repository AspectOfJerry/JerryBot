import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";

import {logger, permissionCheck, sleep} from "../../modules/jerryUtils.js";


export default {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kicks a user from the guild.")
        .addUserOption((options) =>
            options
                .setName("user")
                .setDescription("[REQUIRED] The user to kick.")
                .setRequired(true))
        .addStringOption((options) =>
            options
                .setName("reason")
                .setDescription("[OPTIONAL] The reason for the kick.")
                .setRequired(false)),
    async execute(client, interaction) {
        if(await permissionCheck(interaction, 2) === false) {
            return;
        }

        // Declaring variables
        const target = interaction.options.getUser("user");
        const memberTarget = interaction.guild.members.cache.get(target.id);
        logger.append("info", "PARAM", `'/kick' > memberTarget: '@${memberTarget.user.tag}'`);
        let reason = interaction.options.getString("reason");
        logger.append("info", "PARAM", `'/kick' > reason: "${reason}"`);

        // Checks
        if(memberTarget.id == interaction.user.id) {
            const self_kick_exception = new MessageEmbed()
                .setColor("RED")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("SelfKickException")
                .setDescription("You cannot kick yourself.");

            interaction.reply({embeds: [self_kick_exception]});
            logger.append("notice", "CMP", `'/kick' > [SelfKickException] ${interaction.user.id}' tried to kick themselves.`);
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
            logger.append("notice", "CMP", `[InsufficientPermissionException] role '@${interaction.user.tag}' LESS role '@${memberTarget.user.tag}'`);
            return;
        }
        if(memberTarget.roles.highest.position >= interaction.member.roles.highest.position) {
            const insufficient_permission_exception = new MessageEmbed()
                .setColor("RED")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("InsufficientPermissionException")
                .setDescription(`Your highest role is equal to <@${memberTarget.id}>'s highest role.`);

            interaction.reply({embeds: [insufficient_permission_exception]});
            logger.append("notice", "CMP", `[InsufficientPermissionException] role '@${interaction.user.tag}' EQUAL role '@${memberTarget.user.tag}'`);
            return;
        }
        // -----END HIERARCHY CHECK-----
        if(!memberTarget.kickable) {
            const insufficient_permission_exception = new MessageEmbed()
                .setColor("FUCHSIA")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTilte("InsufficientPermissionException")
                .setDescription(`<@$${memberTarget.user.id}> is not kickable by the client user.`);

            interaction.reply({embeds: [insufficient_permission_exception]});
            logger.append("error", "STDERR", `'/kick' > [InsufficientPermissionException] '@${interaction.user.tag}' is not kickable by the client user.`);
            return;
        }

        // Main
        const buttonRow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("kick_confirm_button")
                    .setLabel("Kick")
                    .setStyle("DANGER")
                    .setDisabled(false),
                new MessageButton()
                    .setCustomId("kick_cancel_button")
                    .setLabel("Cancel")
                    .setStyle("SECONDARY")
                    .setDisabled(false)
            );

        let isOverridden = false;

        // const now = Math.round(dayjs() / 1000);
        // const auto_cancel_timestamp = now + 10;

        const confirm_kick = new MessageEmbed()
            .setColor("YELLOW")
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle("Confirm Kick")
            .setDescription(`Are you sure you want to kick <@${memberTarget.id}>?`)
            // .addFields(
            //     {name: "Auto cancel", value: `> :red_square: Canceling <t:${auto_cancel_timestamp}:R>*.`, inline: false}
            // ).setFooter({text: "*Relative timestamps look out of sync depending on your timezone."});
            .setFooter({text: "🟥 Canceling in 10s"});

        const message = await interaction.reply({embeds: [confirm_kick], components: [buttonRow], fetchReply: true});

        // Creating a filter for the collector
        const filter = async (buttonInteraction) => {
            if(buttonInteraction.member.roles.highest.position > interaction.member.roles.highest.position) {
                logger.append("info", "STDOUT", `'/kick' > '${buttonInteraction.user.tag}' overrode the decision.`);
                return true;
            } else if(buttonInteraction.user.id == interaction.user.id) {
                return true;
            } else {
                await buttonInteraction.reply({content: "You cannot use this button.", ephemeral: true});
                logger.append("info", "STDOUT", `'/kick' > '${buttonInteraction.user.tag}' did not have the permission to use this button.`);
                return;
            }
        };

        const button_collector = message.createMessageComponentCollector({filter, componentType: "BUTTON", time: 10000});

        button_collector.on("collect", async (buttonInteraction) => {
            await buttonInteraction.deferUpdate();
            await button_collector.stop();

            if(buttonInteraction.customId == "kick_confirm_button") {
                // Disabling buttons
                buttonRow.components[0]
                    .setStyle("SUCCESS")
                    .setDisabled(true);
                buttonRow.components[1]
                    .setStyle("SECONDARY")
                    .setDisabled(true);

                const kicking = new MessageEmbed()
                    .setColor("YELLOW")
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription(`Kicking <@${memberTarget.id}>...`);

                await interaction.editReply({embeds: [kicking]});
                logger.append("debug", "STDOUT", `'/ban' > Banning '@${memberTarget.user.tag}'`);

                reason = reason ? ` \n**Reason:** ${reason}` : "";

                memberTarget.kick(reason)
                    .then((res) => {
                        const success_kick = new MessageEmbed()
                            .setColor("GREEN")
                            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                            .setTitle("GuildMember kick")
                            .setDescription(`<@${interaction.user.id}> kicked <@${memberTarget.id}> from the guild${isOverridden ? ` (overriden by <@${buttonInteraction.user.id}>)` : ""}.${reason}`);

                        interaction.editReply({embeds: [success_kick], components: [buttonRow]});
                        logger.append("warn", "STDOUT", `'/kick' > '@${interaction.user.tag}' kicked '@${memberTarget.user.tag}' from the guild${isOverridden ? ` (overriden by <@${buttonInteraction.user.id}>)` : ""}.`);
                    });
            } else {
                // Disabling buttons
                buttonRow.components[0]
                    .setStyle("SECONDARY")
                    .setDisabled(true);
                buttonRow.components[1]
                    .setStyle("SUCCESS")
                    .setDisabled(true);

                const cancel_kick = new MessageEmbed()
                    .setColor("GREEN")
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription(`<@${interaction.user.id}> cancelled the kick${isOverridden ? ` (overriden by <@${buttonInteraction.user.id}>)` : ""}.`);

                interaction.editReply({embeds: [cancel_kick], components: [buttonRow]});
                logger.append("warn", "STDOUT", `'/kick' > '${interaction.user.tag}' cancelled the kick${isOverridden ? ` (overriden by <@${buttonInteraction.user.id}>)` : ""}.`);
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
                logger.append("info", "STDOUT", "'/kick' > Auto aborted.");
            }
        });
    }
};

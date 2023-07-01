const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");

const {log, permissionCheck, sleep} = require("../../modules/jerryUtils.js");


module.exports = {
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
        log("append", interaction.guild.id, `├─memberTarget: '@${memberTarget.user.tag}'`, "INFO");

        let reason = interaction.options.getString("reason");

        // Checks
        if(memberTarget.id == interaction.user.id) {
            const self_kick_exception = new MessageEmbed()
                .setColor("RED")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("SelfKickException")
                .setDescription("You cannot kick yourself.");

            interaction.reply({embeds: [self_kick_exception]});
            log("append", interaction.guild.id, `└─'${interaction.user.id}' tried to kick themselves.`, "WARN");
            return;
        }
        // -----BEGIN HIERARCHY CHECK-----
        if(memberTarget.roles.highest.position > interaction.member.roles.highest.position) {
            const error_role_too_low = new MessageEmbed()
                .setColor("RED")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("PermissionLevelException")
                .setDescription(`Your highest role is lower than <@${memberTarget.id}>'s highest role.`);

            interaction.reply({embeds: [error_role_too_low]});
            log("append", interaction.guild.id, `└─'@${interaction.user.tag}' tried to kick '@${memberTarget.user.tag}' but their highest role was lower.`, "WARN");
            return;
        }
        if(memberTarget.roles.highest.position >= interaction.member.roles.highest.position) {
            const error_equal_roles = new MessageEmbed()
                .setColor("RED")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("PermissionLevelException")
                .setDescription(`Your highest role is equal to <@${memberTarget.id}>'s highest role.`);

            interaction.reply({embeds: [error_equal_roles]});
            log("append", interaction.guild.id, `└─'@${interaction.user.tag}' tried to kick '@${memberTarget.user.tag}' but their highest roles were equal.`, "WARN");
            return;
        }
        // -----END HIERARCHY CHECK-----
        if(!memberTarget.kickable) {
            const kick_permission_exception = new MessageEmbed()
                .setColor("FUCHSIA")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTilte("KickPermissionException")
                .setDescription(`<@$${memberTarget.user.id}> is not kickable by the client user.`);

            interaction.reply({embeds: [kick_permission_exception]});
            log("append", interaction.guild.id, `└─'@${interaction.user.tag}' is not kickable by the client user.`, "ERROR");
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

        // const now = Math.round(Date.now() / 1000);
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
        log("append", interaction.guild.id, "├─Execution authorized. Waiting for the confirmation.", "INFO");

        // Creating a filter for the collector
        const filter = async (buttonInteraction) => {
            if(buttonInteraction.member.roles.highest.position > interaction.member.roles.highest.position) {
                await log("append", interaction.guild.id, `├─'@${buttonInteraction.user.tag}' overrode the decision.`, "WARN");
                return true;
            } else if(buttonInteraction.user.id == interaction.user.id) {
                return true;
            } else {
                await buttonInteraction.reply({content: "You cannot use this button.", ephemeral: true});
                await log("append", interaction.guild.id, `├─'@${buttonInteraction.user.tag}' did not have the permission to use this button.`, "WARN");
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

                reason = reason ? ` \n**Reason:** ${reason}` : "";

                memberTarget.kick(reason)
                    .then((res) => {
                        const success_kick = new MessageEmbed()
                            .setColor("GREEN")
                            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                            .setTitle("GuildMember kick")
                            .setDescription(`<@${interaction.user.id}> kicked <@${memberTarget.id}> from the guild${isOverridden ? ` (overriden by <@${buttonInteraction.user.id}>)` : ""}.${reason}`);

                        interaction.editReply({embeds: [success_kick], components: [buttonRow]});
                        log("append", interaction.guild.id, `└─'${interaction.user.tag}' kicked '${memberTarget.user.tag}' from the guild${isOverridden ? ` (overriden by <@${buttonInteraction.user.id}>)` : ""}.`, "WARN");
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
                log("append", interaction.guild.id, `└─'${interaction.user.tag}' cancelled the kick${isOverridden ? ` (overriden by <@${buttonInteraction.user.id}>)` : ""}.`, "INFO");
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
};

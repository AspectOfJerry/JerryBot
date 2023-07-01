const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");

const {log, permissionCheck, sleep} = require("../../modules/jerryUtils.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Bans a user from the guild.")
        .addUserOption((options) =>
            options
                .setName("user")
                .setDescription("[REQUIRED] The user to ban.")
                .setRequired(true))
        .addStringOption((options) =>
            options
                .setName("reason")
                .setDescription("[OPTIONAL] The reason for the ban.")
                .setRequired(false)),
    async execute(client, interaction) {
        if(await permissionCheck(interaction, 1) === false) {
            return;
        }

        // Declaring variables
        const target = interaction.options.getUser("user");
        const memberTarget = interaction.guild.members.cache.get(target.id);
        log("append", interaction.guild.id, `├─memberTarget: '@${memberTarget.user.tag}'`, "INFO");

        let reason = interaction.options.getString("reason");
        log("append", interaction.guild.id, `├─reason: '${reason}'`, "INFO");

        // Checks
        if(memberTarget.id == interaction.user.id) {
            const self_ban_exception = new MessageEmbed()
                .setColor("RED")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("SelfBanException")
                .setDescription("You cannot ban yourself.");

            interaction.reply({embeds: [self_ban_exception]});
            log("append", interaction.guild.id, `└─'${interaction.user.id}' tried to ban themselves.`, "WARN");
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
            log("append", interaction.guild.id, `└─'${interaction.user.tag}' tried to ban ${memberTarget.user.tag} but their highest role was lower.`, "WARN");
            return;
        }
        if(memberTarget.roles.highest.position >= interaction.member.roles.highest.position) {
            const error_equal_roles = new MessageEmbed()
                .setColor("RED")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("PermissionLevelException")
                .setDescription(`Your highest role is equal to <@${memberTarget.id}>'s highest role.`);

            interaction.reply({embeds: [error_equal_roles]});
            log("append", interaction.guild.id, `└─'${interaction.user.tag}' tried to ban '${memberTarget.user.tag}' but their highest role was equal.`, "WARN");
            return;
        }
        // -----END HIERARCHY CHECK-----
        if(!memberTarget.bannable) {
            const ban_permission_exception = new MessageEmbed()
                .setColor("FUCHSIA")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTilte("BanPermissionException")
                .setDescription(`<@$${memberTarget.user.id}> is not bannable by the client user.`);

            interaction.reply({embeds: [ban_permission_exception]});
            log("append", interaction.guild.id, `└─'${interaction.user.tag}' is not bannable by the client user.`, "ERROR");
            return;
        }

        // Main
        const buttonRow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("ban_confirm_button")
                    .setLabel("Ban")
                    .setStyle("DANGER")
                    .setDisabled(false),
                new MessageButton()
                    .setCustomId("ban_cancel_button")
                    .setLabel("Cancel")
                    .setStyle("SECONDARY")
                    .setDisabled(false)
            );

        let isOverridden = false;

        // const now = Math.round(Date.now() / 1000);
        // const auto_cancel_timestamp = now + 10;

        const confirm_ban = new MessageEmbed()
            .setColor("YELLOW")
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle("Confirm Ban")
            .setDescription(`Are you sure you want to ban <@${memberTarget.id}>?`)
            // .addFields(
            //     {name: "Auto cancel", value: `> :red_square: Canceling <t:${auto_cancel_timestamp}:R>*.`, inline: false}
            // ).setFooter({text: "*Relative timestamps look out of sync depending on your timezone."});
            .setFooter({text: "🟥 Canceling in 10s"});

        const message = await interaction.reply({embeds: [confirm_ban], components: [buttonRow], fetchReply: true});
        log("append", interaction.guild.id, "├─Execution authorized. Waiting for the confirmation.", "INFO");

        // Creating a filter for the collector
        const filter = async (buttonInteraction) => {
            if(buttonInteraction.member.roles.highest.position > interaction.member.roles.highest.position) {
                await log("append", interaction.guild.id, `├─'${buttonInteraction.user.tag}' overrode the decision.`, "WARN");
                return true;
            } else if(buttonInteraction.user.id == interaction.user.id) {
                return true;
            } else {
                await buttonInteraction.reply({content: "You cannot use this button.", ephemeral: true});
                await log("append", interaction.guild.id, `├─'${buttonInteraction.user.tag}' did not have the permission to use this button.`, "WARN");
                return;
            }
        };

        const button_collector = message.createMessageComponentCollector({filter, componentType: "BUTTON", time: 10000});

        button_collector.on("collect", async (buttonInteraction) => {
            await buttonInteraction.deferUpdate();
            await button_collector.stop();
            // Disabling buttons
            buttonRow.components[0]
                .setDisabled(true);
            buttonRow.components[1]
                .setDisabled(true);
            await interaction.editReply({embeds: [confirm_ban], components: [buttonRow]});

            if(buttonInteraction.customId == "ban_confirm_button") {
                await log("append", interaction.guild.id, `└─'${buttonInteraction.user.tag}' confirmed the ban.`, "INFO");
                const banning = new MessageEmbed()
                    .setColor("YELLOW")
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription(`Banning <@${memberTarget.id}>...`);

                await interaction.editReply({embeds: [banning]});

                reason = reason ? ` \n**Reason:** ${reason}` : "";

                memberTarget.ban({reason: reason})
                    .then((banResult) => {
                        const success_ban = new MessageEmbed()
                            .setColor("GREEN")
                            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                            .setTitle("GuildMember ban")
                            .setDescription(`<@${interaction.user.id}> banned <@${memberTarget.id}> from the guild${isOverridden ? ` (overriden by <@${buttonInteraction.user.id}>)` : ""}.${reason}`);

                        interaction.editReply({embeds: [success_ban], components: [buttonRow]});
                        log("append", interaction.guild.id, `└─'${interaction.user.tag}' banned '${memberTarget.user.tag}' form the guild${isOverridden ? ` (overriden by <@${buttonInteraction.user.id}>)` : ""}.`, "WARN");
                    });
            } else {
                const cancel_ban = new MessageEmbed()
                    .setColor("GREEN")
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription(`<@${interaction.user.id}> cancelled the ban${isOverridden ? ` (overriden by <@${buttonInteraction.user.id}>)` : ""}.`);

                interaction.editReply({embeds: [cancel_ban], components: [buttonRow]});
                log("append", interaction.guild.id, `└─'${interaction.user.tag}' cancelled the ban${isOverridden ? ` (overriden by <@${buttonInteraction.user.id}>)` : ""}.`, "INFO");
            }
        });

        button_collector.on("end", (collected) => {
            // Disabling buttons
            buttonRow.components[0]
                .setDisabled(true);
            buttonRow.components[1]
                .setDisabled(true);

            if(collected.size === 0) {
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

const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");

const {logger, permissionCheck, sleep} = require("../../modules/jerryUtils.js");


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
        logger.append("info", "PARAM", `'/ban' > memberTarget: '@${memberTarget.user.tag}'`);

        let reason = interaction.options.getString("reason");
        logger.append("info", "PARAM", `'/ban' > reason: '${reason}'`);

        // Checks
        if(memberTarget.id == interaction.user.id) {
            const self_ban_exception = new MessageEmbed()
                .setColor("RED")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("SelfBanException")
                .setDescription("You cannot ban yourself.");

            interaction.reply({embeds: [self_ban_exception]});
            logger.append("notice", "CMP", `'/ban' > [SelfBanException] '@${interaction.user.tag}' tried to ban themselves.`);
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
            logger.append("notice", "CMP", `'/ban' > [InsufficientPermissionException] role '@${interaction.user.tag}' EQUAL role '@${memberTarget.user.tag}'`);
            return;
        }
        if(memberTarget.roles.highest.position >= interaction.member.roles.highest.position) {
            const insufficient_permission_exception = new MessageEmbed()
                .setColor("RED")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("InsufficientPermissionException")
                .setDescription(`Your highest role is equal to <@${memberTarget.id}>'s highest role.`);

            interaction.reply({embeds: [insufficient_permission_exception]});
            logger.append("append", "CMP", `'/ban' > [InsufficientPermissionException] role '@${interaction.user.tag}' EQUAL role '@${memberTarget.user.tag}'`);
            return;
        }
        // -----END HIERARCHY CHECK-----
        if(!memberTarget.bannable) {
            const insufficient_permission_exception = new MessageEmbed()
                .setColor("FUCHSIA")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTilte("InsufficientPermissionException")
                .setDescription(`<@$${memberTarget.user.id}> is not bannable by the client user.`);

            interaction.reply({embeds: [insufficient_permission_exception]});
            logger.append("error", "STDERR", `'/ban' > '${interaction.user.tag}' is not bannable by the client user.`);
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

        // Creating a filter for the collector
        const filter = async (buttonInteraction) => {
            if(buttonInteraction.member.roles.highest.position > interaction.member.roles.highest.position) {
                logger.append("info", "STDOUT", `'/ban' > '${buttonInteraction.user.tag}' overrode the decision.`);
                return true;
            } else if(buttonInteraction.user.id == interaction.user.id) {
                return true;
            } else {
                await buttonInteraction.reply({content: "You cannot use this button.", ephemeral: true});
                logger.append("info", "STDOUT", `'/ban' > '${buttonInteraction.user.tag}' did not have the permission to use this button.`);
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
                const banning = new MessageEmbed()
                    .setColor("YELLOW")
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription(`Banning <@${memberTarget.id}>...`);

                await interaction.editReply({embeds: [banning]});
                logger.append("debug", "STDOUT", `'/ban' > Banning '@${memberTarget.user.tag}'`);

                reason = reason ? ` \n**Reason:** ${reason}` : "";

                memberTarget.ban({reason: reason})
                    .then((banResult) => {
                        const success_ban = new MessageEmbed()
                            .setColor("GREEN")
                            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                            .setTitle("GuildMember ban")
                            .setDescription(`<@${interaction.user.id}> banned <@${memberTarget.id}> from the guild${isOverridden ? ` (overriden by <@${buttonInteraction.user.id}>)` : ""}.${reason}`);

                        interaction.editReply({embeds: [success_ban], components: [buttonRow]});
                        logger.append("warn", "STDOUT", `'/ban' > '${interaction.user.tag}' banned '${memberTarget.user.tag}' from the guild${isOverridden ? ` (overriden by <@${buttonInteraction.user.id}>)` : ""}.`);
                    });
            } else {
                const cancel_ban = new MessageEmbed()
                    .setColor("GREEN")
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription(`<@${interaction.user.id}> cancelled the ban${isOverridden ? ` (overriden by <@${buttonInteraction.user.id}>)` : ""}.`);

                interaction.editReply({embeds: [cancel_ban], components: [buttonRow]});
                logger.append("info", "STDOUT", `'/ban' > '${interaction.user.tag}' cancelled the ban${isOverridden ? ` (overriden by <@${buttonInteraction.user.id}>)` : ""}.`);
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
                logger.append("info", "STDOUT", "'/ban' > Auto aborted.");
            }
        });
    }
};

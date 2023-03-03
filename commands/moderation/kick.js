const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");

const {PermissionCheck, Log, Sleep} = require("../../modules/JerryUtils.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription("Kicks a user from the guild.")
        .addUserOption((options) =>
            options
                .setName('user')
                .setDescription("[REQUIRED] The user to kick.")
                .setRequired(true))
        .addStringOption((options) =>
            options
                .setName('reason')
                .setDescription("[OPTIONAL] The reason for the kick.")
                .setRequired(false)),
    async execute(client, interaction) {
        if(await PermissionCheck(interaction) === false) {
            return;
        }

        // Declaring variables
        const target = interaction.options.getUser('user');
        const memberTarget = interaction.guild.members.cache.get(target.id);
        await Log("append", interaction.guild.id, `├─memberTarget: '${memberTarget.user.tag}'`, "INFO");

        let reason = interaction.options.getString('reason');

        // Checks
        if(memberTarget.id == interaction.user.id) {
            const error_target_self = new MessageEmbed()
                .setColor("RED")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("Error")
                .setDescription('You cannot kick yourself.');

            await interaction.reply({embeds: [error_target_self]});
            await Log("append", interaction.guild.id, `└─'${interaction.user.id}' tried to kick themselves.`, "WARN");
            return;
        }
        // -----BEGIN HIERARCHY CHECK-----
        if(memberTarget.roles.highest.position > interaction.member.roles.highest.position) {
            const error_role_too_low = new MessageEmbed()
                .setColor("RED")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription(`Your highest role is lower than <@${memberTarget.id}>'s highest role.`);

            await interaction.reply({embeds: [error_role_too_low]});
            await Log("append", interaction.guild.id, `└─'${interaction.user.tag}' tried to kick ${memberTarget.user.tag} but their highest role was lower.`, "WARN");
            return;
        }
        if(memberTarget.roles.highest.position >= interaction.member.roles.highest.position) {
            const error_equal_roles = new MessageEmbed()
                .setColor("RED")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription(`Your highest role is equal to <@${memberTarget.id}>'s highest role.`);

            await interaction.reply({embeds: [error_equal_roles]});
            await Log("append", interaction.guild.id, `└─'${interaction.user.tag}' tried to kick '${memberTarget.user.tag}' but their highest roles were equal.`, "WARN");
            return;
        }
        // -----END HIERARCHY CHECK-----
        if(!memberTarget.kickable) {
            const member_not_kickcable = new MessageEmbed()
                .setColor("FUCHSIA")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTilte('Error')
                .setDescription(`<@$${memberTarget.user.id}> is not kickable by the client user.`);

            await interaction.reply({embeds: [member_not_kickcable]});
            await Log("append", interaction.guild.id, `└─'${interaction.user.tag}' is not kickable by the client user.`, "ERROR");
            return;
        }

        // Main
        let buttonRow = new MessageActionRow()
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

        // const now = Math.round(Date.now() / 1000);
        // const auto_cancel_timestamp = now + 10;

        const confirm_kick = new MessageEmbed()
            .setColor("YELLOW")
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle(`Confirm Kick`)
            .setDescription(`Are you sure you want to kick <@${memberTarget.id}>?`)
            // .addFields(
            //     {name: 'Auto cancel', value: `> :red_square: Canceling <t:${auto_cancel_timestamp}:R>*.`, inline: false}
            // ).setFooter({text: "*Relative timestamps look out of sync depending on your timezone."});
            .setFooter({text: "🟥 Canceling in 10s"});

        await interaction.reply({embeds: [confirm_kick], components: [buttonRow]});
        await Log("append", interaction.guild.id, `├─Execution authorized. Waiting for the confirmation.`, "INFO");

        // Creating a filter for the collector
        let isOverriddenText = "";
        const filter = async (buttonInteraction) => {
            if(buttonInteraction.member.roles.highest.position > interaction.member.roles.highest.position) {
                isOverriddenText = ` (overriden by <@${buttonInteraction.user.id}>)`;
                await Log("append", interaction.guild.id, `├─'${buttonInteraction.user.tag}' overrode the decision.`, "WARN");
                return true;
            } else if(buttonInteraction.user.id == interaction.user.id) {
                return true;
            } else {
                await buttonInteraction.reply({content: "You cannot use this button.", ephemeral: true});
                await Log("append", interaction.guild.id, `├─'${buttonInteraction.user.tag}' did not have the permission to use this button.`, "WARN");
                return;
            }
        };

        const button_collector = interaction.channel.createMessageComponentCollector({filter, componentType: "BUTTON", time: 10000});

        button_collector.on("collect", async (buttonInteraction) => {
            await buttonInteraction.deferUpdate();
            await button_collector.stop();

            if(buttonInteraction.customId == 'kick_confirm_button') {
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
                    .then(async kickResult => {
                        const success_kick = new MessageEmbed()
                            .setColor("GREEN")
                            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                            .setTitle("GuildMember kick")
                            .setDescription(`<@${interaction.user.id}> kicked <@${memberTarget.id}> from the guild${isOverriddenText}.${reason}`);

                        await interaction.editReply({embeds: [success_kick], components: [buttonRow]});
                        await Log("append", interaction.guild.id, `└─'${interaction.user.tag}' kicked '${memberTarget.user.tag}' from the guild${isOverriddenText}.`, "WARN");
                        return;
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
                    .setDescription(`<@${interaction.user.id}> cancelled the kick${isOverriddenText}.`);

                await interaction.editReply({embeds: [cancel_kick], components: [buttonRow]});
                await Log("append", interaction.guild.id, `└─'${interaction.user.tag}' cancelled the kick${isOverriddenText}.`, "INFO");
            }
        });

        button_collector.on("end", async collected => {
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
                    .setDescription(`Auto aborted.`);

                await interaction.editReply({embeds: [auto_abort], components: [buttonRow]});
                await Log("append", interaction.guild.id, `└─Auto aborted.`, "INFO");
            }
        });
    }
};

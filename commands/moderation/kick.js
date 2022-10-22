const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, ModalBuilder} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const Sleep = require('../../modules/sleep'); // delayInMilliseconds
const Log = require('../../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

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
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/kick'.`, 'INFO'); // Logs

        // Set minimum execution role
        switch(interaction.guild.id) {
            case process.env.DISCORD_JERRY_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = "PL2";
                break;
            case process.env.DISCORD_GOLDFISH_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = "Mod";
                break;
            case process.env.DISCORD_CRA_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = "PL2";
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

        let reason = interaction.options.getString('reason');

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
                await Log('append', interaction.guild.id, `└─'${interaction.user.id}' did not have the required role to use '/kick'. [error_permissions]`, 'WARN'); // Logs
                return;
            }
        }
        // -----END ROLE CHECK-----
        if(memberTarget.id == interaction.user.id) {
            const error_cannot_use_on_self = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("Error")
                .setDescription('You cannot kick yourself.');

            await interaction.reply({embeds: [error_cannot_use_on_self]});
            await Log('append', interaction.guild.id, `└─'${interaction.user.id}' tried to kick themselves.`, 'WARN');
            return;
        }
        // -----BEGIN HIERARCHY CHECK-----
        if(memberTarget.roles.highest.position > interaction.member.roles.highest.position) {
            const error_role_too_low = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription(`Your highest role is lower than <@${memberTarget.id}>'s highest role.`);

            await interaction.reply({embeds: [error_role_too_low]});
            await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' tried to kick ${memberTarget.user.tag} but their highest role was lower.`, 'WARN'); // Logs
            return;
        }
        if(memberTarget.roles.highest.position >= interaction.member.roles.highest.position) {
            const error_equal_roles = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription(`Your highest role is equal to <@${memberTarget.id}>'s highest role.`);

            await interaction.reply({embeds: [error_equal_roles]});
            await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' tried to kick '${memberTarget.user.tag}' but their highest roles were equal.`, 'WARN'); // Logs
            return;
        }
        // -----END HIERARCHY CHECK-----
        if(!memberTarget.kickable) {
            const member_not_kickcable = new MessageEmbed()
                .setColor('FUCHSIA')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTilte('Error')
                .setDescription(`<@$${memberTarget.user.id}> is not kickable by the client user.`);

            await interaction.reply({embeds: [member_not_kickcable]});
            await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' is not kickable by the client user.`, 'FATAL'); // Logs
            return;
        }

        // Main
        let row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('kick_confirm_button')
                    .setLabel(`Kick`)
                    .setStyle('DANGER')
                    .setDisabled(false),
                new MessageButton()
                    .setCustomId('kick_cancel_button')
                    .setLabel('Cancel')
                    .setStyle('PRIMARY')
                    .setDisabled(false)
            );

        let isOverriddenText = "";

        const confirm_kick = new MessageEmbed()
            .setColor('YELLOW')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle(`Confirm Kick`)
            .setDescription(`Are you sure you want to kick <@${memberTarget.id}>?`)
            .setFooter({text: "*Relative timestamps can look out of sync depending on your timezone."});

        await interaction.reply({embeds: [confirm_kick], components: [row]});
        await Log('append', interaction.guild.id, `├─Execution authorized. Waiting for the confirmation.`, 'INFO'); // Logs

        const now = Math.round(Date.now() / 1000);
        const auto_delete_timestamp = now + 10;

        let autoCancelTimerMessage = await interaction.channel.send({content: `> Canceling <t:${auto_delete_timestamp}:R>*.`});

        // Creating a filter for the collector
        const filter = async (buttonInteraction) => {
            if(buttonInteraction.member.roles.highest.position > interaction.member.roles.highest.position) {
                isOverriddenText = ` (overriden by <@${buttonInteraction.user.id}>)`;
                await Log('append', interaction.guild.id, `├─'${buttonInteraction.user.tag}' overrode the decision.`, 'WARN'); // Logs
                return true;
            } else if(buttonInteraction.user.id == interaction.user.id) {
                return true;
            } else {
                await buttonInteraction.reply({content: "You cannot use this button.", ephemeral: true});
                await Log('append', interaction.guild.id, `├─'${buttonInteraction.user.tag}' did not have the permission to use this button.`, 'WARN'); // Logs
                return;
            }
        }

        const button_collector = interaction.channel.createMessageComponentCollector({filter, time: 10000});

        button_collector.on('collect', async (buttonInteraction) => {
            await buttonInteraction.deferUpdate();
            await button_collector.stop();

            if(buttonInteraction.customId == 'kick_confirm_button') {
                // Disabling buttons
                row.components[0]
                    .setStyle('SUCCESS')
                    .setDisabled(true);
                row.components[1]
                    .setStyle('SECONDARY')
                    .setDisabled(true);

                const kicking = new MessageEmbed()
                    .setColor('YELLOW')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription(`Kicking <@${memberTarget.id}>...`);

                await interaction.editReply({embeds: [kicking]});

                reason = reason ? ` \n**Reason:** ${reason}` : "";

                memberTarget.kick(reason)
                    .then(async kickResult => {
                        const success_kick = new MessageEmbed()
                            .setColor('GREEN')
                            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                            .setTitle("GuildMember kick")
                            .setDescription(`<@${interaction.user.id}> kicked <@${memberTarget.id}> from the guild${isOverriddenText}.${reason}`);

                        await interaction.editReply({embeds: [success_kick], components: [row]});
                        await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' kicked '${memberTarget.user.tag}' from the guild${isOverriddenText}.`, 'WARN'); // Logs
                    });
            } else {
                // Disabling buttons
                row.components[0]
                    .setStyle('SECONDARY')
                    .setDisabled(true);
                row.components[1]
                    .setStyle('SUCCESS')
                    .setDisabled(true);

                const cancel_kick = new MessageEmbed()
                    .setColor('GREEN')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription(`<@${interaction.user.id}> cancelled the kick${isOverriddenText}.`);

                await interaction.editReply({embeds: [cancel_kick], components: [row]});
                await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' cancelled the kick${isOverriddenText}.`, 'INFO'); // Logs
            }
        });

        button_collector.on('end', async collected => {
            await autoCancelTimerMessage.delete();

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
};

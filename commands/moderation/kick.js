const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const Sleep = require('../../modules/sleep');
const Log = require('../../modules/logger');

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
                .setRequired(false))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                .setRequired(false)),
    async execute(client, interaction) {
        await Log(interaction.guild.id, `'${interaction.user.tag}' executed '/kick'.`, 'INFO');
        //Command information
        const REQUIRED_ROLE = "PL2";

        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
        await Log(interaction.guild.id, `├─ephemeral: ${is_ephemeral}`, 'INFO'); //Logs
        const target = interaction.options.getUser('user');
        const memberTarget = interaction.guild.members.cache.get(target.id);
        await Log(interaction.guild.id, `├─memberTarget: '${memberTarget.user.tag}'`, 'INFO'); //Logs

        let reason = interaction.options.getString('reason');

        let isRole = "";
        let isRoleTitle = "";
        let kickAnyway = "";

        //Checks
        if(!interaction.member.roles.cache.find(role => role.name == REQUIRED_ROLE)) {
            const error_permissions = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                .setFooter({text: `You need at least the '${REQUIRED_ROLE}' role to use this command.`});

            await await interaction.reply({embeds: [error_permissions], ephemeral: is_ephemeral});
            await Log(interaction.guild.id, `└─'${interaction.user.id}' did not have the required role to use '/kick'.`, 'WARN');  //Logs
            return;
        }
        if(memberTarget.id == interaction.user.id) {
            const error_cannot_use_on_self = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("Error")
                .setDescription('You cannot kick yourself.');

            await interaction.reply({embeds: [error_cannot_use_on_self], ephemeral: is_ephemeral});
            await Log(interaction.guild.id, `└─'${interaction.user.id}' tried to kick themselves.`, 'WARN')
            return;
        }
        //Role position check---
        if(memberTarget.roles.highest.position > interaction.member.roles.highest.position) {
            const error_role_too_low = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription(`Your highest role is lower than <@${memberTarget.id}>'s highest role.`);

            await interaction.reply({embeds: [error_role_too_low], ephemeral: is_ephemeral});
            await Log(interaction.guild.id, `└─'${interaction.user.tag}' tried to kick ${memberTarget.user.tag} but their highest role was lower.`, 'WARN');   //Logs
            return;
        }
        if(memberTarget.roles.highest.position >= interaction.member.roles.highest.position) {
            const error_equal_roles = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription(`Your highest role is equal to <@${memberTarget.id}>'s highest role.`);

            await interaction.reply({embeds: [error_equal_roles], ephemeral: is_ephemeral});
            await Log(interaction.guild.id, `└─'${interaction.user.tag}' tried to kick '${memberTarget.user.tag}' but their highest role was equal.`, 'WARN'); //Logs
            return;
        }
        //---Role position check
        if(memberTarget.roles.cache.find(role => role.name == "Owner")) {
            kickAnyway = " anyway";
            isRoleTitle = " Owner";
            isRole = " They have the 'Owner' role.";
        } else if(memberTarget.roles.cache.find(role => role.name == "Administrator")) {
            kickAnyway = " anyway";
            isRoleTitle = " Administrator";
            isRole = " They have the 'Administrator' role.";
        } else if(memberTarget.roles.cache.find(role => role.name == "Moderator")) {
            kickAnyway = " anyway";
            isRoleTitle = " Moderator";
            isRole = " They have the 'Moderator' role.";
        } else if(memberTarget.roles.cache.find(role => role.name == "Staff")) {
            kickAnyway = " anyway";
            isRoleTitle = " Staff";
            isRole = " They have the 'Staff' role.";
        } else if(memberTarget.roles.cache.find(role => role.name == "Friends")) {
            kickAnyway = " anyway";
            isRoleTitle = " Friend";
            isRole = " They are your friend.";
        }

        //Code
        let row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('kick_confirm_button')
                    .setLabel(`Kick${kickAnyway}`)
                    .setStyle('DANGER')
                    .setDisabled(false),
                new MessageButton()
                    .setCustomId('kick_cancel_button')
                    .setLabel('Cancel')
                    .setStyle('PRIMARY')
                    .setDisabled(false)
            )

        const confirm_kick = new MessageEmbed()
            .setColor('YELLOW')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle(`Confirm Kick${isRoleTitle}`)
            .setDescription(`Are you sure you want to kick <@${memberTarget.id}>?${isRole}`)

        await interaction.reply({embeds: [confirm_kick], components: [row], ephemeral: is_ephemeral});
        await Log(interaction.guild.id, `├─Execution authorized. Waiting for the kick confirmation.`, 'INFO');   //Logs

        const filter = (buttonInteraction) => {
            if(buttonInteraction.member.roles.highest.position > interaction.member.roles.highest.position) {
                return true;
            }
            else if(buttonInteraction.user.id == interaction.user.id) {
                return true;
            } else {
                return buttonInteraction.reply({content: "You cannot use this button.", ephemeral: true});
            }
        }
        const kick_collector = interaction.channel.createMessageComponentCollector({filter, time: 30000});

        kick_collector.on('collect', async buttonInteraction => {
            //Disabling buttons
            row.components[0]
                .setDisabled(true);
            row.components[1]
                .setDisabled(true);
            interaction.editReply({embeds: [confirm_kick], components: [row], ephemeral: is_ephemeral});

            if(buttonInteraction.customId == 'kick_confirm_button') {
                const kicking = new MessageEmbed()
                    .setColor('YELLOW')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription(`Kicking <@${memberTarget.id}>...`)
                    .setTimestamp()

                await buttonInteraction.reply({embeds: [kicking], ephemeral: is_ephemeral});
                reason = reason ? ` \n**Reason:** ${reason}` : "";
                memberTarget.kick(reason)
                    .then(kickResult => {
                        const success_kick = new MessageEmbed()
                            .setColor('GREEN')
                            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                            .setTitle("GuildMember kick")
                            .setDescription(`<@${interaction.user.id}> kicked <@${memberTarget.id}> from the guild.${reason}`);

                        buttonInteraction.editReply({embeds: [success_kick], ephemeral: is_ephemeral});
                    })
                kick_collector.stop();
                await Log(interaction.guild.id, `└─'${buttonInteraction.user.tag}' kicked '${memberTarget.user.tag}' from the guild.`, 'WARN');    //Logs
            } else {
                const cancel_kick = new MessageEmbed()
                    .setColor('GREEN')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription(`<@${interaction.user.id}> cancelled the kick.`)

                await buttonInteraction.reply({embeds: [cancel_kick], ephemeral: is_ephemeral});
                await Log(interaction.guild.id, `└─'${buttonInteraction.user.tag}' cancelled the kick.`, 'INFO');   //Logs
            }
            kick_collector.stop();
        })
    }
}

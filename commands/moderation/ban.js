const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const Sleep = require('../../modules/sleep'); //delayInMilliseconds;
const Log = require('../../modules/logger'); //DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription("Bans a user from the guild.")
        .addUserOption((options) =>
            options
                .setName('user')
                .setDescription("[REQUIRED] The user to ban.")
                .setRequired(true))
        .addIntegerOption((options) =>
            options
                .setName('duration')
                .setDescription("[OPTIONAL] The duration of the ban in days (0 to 7). Defaults to 0 (no duration).")
                .addChoice("No duration", 0)
                .addChoice("1 day", 1)
                .addChoice("2 days", 2)
                .addChoice("3 days", 3)
                .addChoice("4 days", 4)
                .addChoice("5 days", 5)
                .addChoice("6 days", 6)
                .addChoice("7 days", 7)
                .setRequired(false))
        .addStringOption((options) =>
            options
                .setName('reason')
                .setDescription("[OPTIONAL] The reason for the ban.")
                .setRequired(false))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                .setRequired(false)),
    async execute(client, interaction) {
        await Log(interaction.guild.id, `'${interaction.user.tag}' executed '/ban'.`, 'INFO');
        //Command information
        const REQUIRED_ROLE = "PL1";

        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
        await Log(interaction.guild.id, `├─ephemeral: ${is_ephemeral}`, 'INFO'); //Logs
        const target = interaction.options.getUser('user');
        const memberTarget = interaction.guild.members.cache.get(target.id);
        await Log(interaction.guild.id, `├─memberTarget: '${memberTarget.user.tag}'`, 'INFO');   //Logs

        let banDuration = interaction.options.getInteger('duration');
        await Log(interaction.guild.id, `├─banDuration: ${banDuration}`, 'INFO');  //Logs
        let reason = interaction.options.getString('reason');
        await Log(interaction.guild.id, `├─reason: '${reason}'`, 'INFO');    //Logs

        let isRole = "";
        let isRoleTitle = "";
        let banAnyway = "";

        //Check
        if(!interaction.member.roles.cache.find(role => role.name == REQUIRED_ROLE)) {
            const error_permissions = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                .setFooter({text: `You need at least the '${REQUIRED_ROLE}' role to use this command.`});

            await interaction.reply({embeds: [error_permissions], ephemeral: is_ephemeral});
            await Log(interaction.guild.id, `└─'${interaction.user.id}' did not have the required role t use '/ban'.`, 'WARN');   //Logs
            return;
        }
        if(memberTarget.id == interaction.user.id) {
            const error_cannot_use_on_self = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("Error")
                .setDescription('You cannot ban yourself.');

            interaction.reply({embeds: [error_cannot_use_on_self], ephemeral: is_ephemeral});
            await Log(interaction.guild.id, `└─'${interaction.user.id}' tried to ban themselves.`, 'WARN');   //Logs
            return;
        }
        if(memberTarget.user.tag == "Salmon#5933") {
            interaction.reply({content: "L BAD YOU CANT BAN ME", ephemeral: is_ephemeral});
            return;
        }
        //---Role position check
        if(memberTarget.roles.highest.position > interaction.member.roles.highest.position) {
            const error_role_too_low = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription(`Your highest role is lower than <@${memberTarget.id}>'s highest role.`);

            interaction.reply({embeds: [error_role_too_low], ephemeral: is_ephemeral});
            await Log(interaction.guild.id, `└─'${interaction.user.tag}' tried to timeout ${memberTarget.user.tag} but their highest role was lower.`, 'WARN');    //Logs
            return;
        }
        if(memberTarget.roles.highest.position >= interaction.member.roles.highest.position) {
            const error_equal_roles = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription(`Your highest role is equal to <@${memberTarget.id}>'s highest role.`);

            interaction.reply({embeds: [error_equal_roles], ephemeral: is_ephemeral});
            await Log(interaction.guild.id, `└─'${interaction.user.tag}' tried to timeout '${memberTarget.user.tag}' but their highest role was equal.`, 'WARN');  //Logs
            return;
        }
        //Role position check---
        if(memberTarget.roles.cache.find(role => role.name == "Owner")) {
            banAnyway = " anyway";
            isRoleTitle = " Owner";
            isRole = " They have the 'Owner' role.";
        } else if(memberTarget.roles.cache.find(role => role.name == "Administrator")) {
            banAnyway = " anyway";
            isRoleTitle = " Administrator";
            isRole = " They have the 'Administrator' role.";
        } else if(memberTarget.roles.cache.find(role => role.name == "Moderator")) {
            banAnyway = " anyway";
            isRoleTitle = " Moderator";
            isRole = " They have the 'Moderator' role.";
        } else if(memberTarget.roles.cache.find(role => role.name == "Staff")) {
            banAnyway = " anyway";
            isRoleTitle = " Staff";
            isRole = " They have the 'Staff' role.";
        } else if(memberTarget.roles.cache.find(role => role.name == "Friends")) {
            banAnyway = " anyway";
            isRoleTitle = " Friend";
            isRole = " They are your friend.";
        }

        //Code
        let row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('ban_confirm_button')
                    .setLabel(`Ban${banAnyway}`)
                    .setStyle('DANGER')
                    .setDisabled(false),
                new MessageButton()
                    .setCustomId('ban_cancel_button')
                    .setLabel('Cancel')
                    .setStyle('PRIMARY')
                    .setDisabled(false))

        const confirm_ban = new MessageEmbed()
            .setColor('YELLOW')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle(`Confirm Ban${isRoleTitle}`)
            .setDescription(`Are you sure you want to ban <@${memberTarget.id}>?${isRole}`)

        await interaction.reply({embeds: [confirm_ban], components: [row], ephemeral: is_ephemeral})
        await Log(interaction.guild.id, `├─Execution authorized. Waiting for confirmation.`, 'INFO');    //Logs

        const filter = (buttonInteraction) => {
            if(buttonInteraction.user.id == interaction.user.id) {
                return true;
            } else {
                return buttonInteraction.reply({content: "You cannot use this button.", ephemeral: true});
            }
        }
        const ban_collector = interaction.channel.createMessageComponentCollector({filter, time: 30000});

        ban_collector.on('collect', async buttonInteraction => {
            //Disabling buttons
            row.components[0]
                .setDisabled(true);
            row.components[1]
                .setDisabled(true);
            interaction.editReply({embeds: [confirm_ban], components: [row], ephemeral: is_ephemeral});

            if(buttonInteraction.customId == 'ban_confirm_button') {
                await Log(interaction.guild.id, `└─'${buttonInteraction.user.tag}' confirmed the ban.`, 'INFO')
                reason = reason ? ` \n**Reason:** ${reason}` : "";
                banDuration = banDuration ? banDuration : 0;
                memberTarget.ban(banDuration, reason)
                    .then(async banResult => {
                        if(banDuration == 0) {
                            banDuration = "";
                        } else {
                            banDuration = ` for ${banDuration} days`;
                        }
                        const success_ban = new MessageEmbed()
                            .setColor('GREEN')
                            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                            .setTitle("GuildMember ban")
                            .setDescription(`<@${interaction.user.id}> banned <@${memberTarget.id}> from the guild${banDuration}.${reason}`);

                        await interaction.reply({embeds: [success_ban], ephemeral: is_ephemeral});
                        await Log(interaction.guild.id, `  └─'${interaction.user.tag}' banned '${memberTarget.user.tag}' form the guild.`, 'WARN')
                    })
                ban_collector.stop();
            } else {
                const cancel_ban = new MessageEmbed()
                    .setColor('GREEN')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription(`<@${interaction.user.id}> cancelled the ban.`);

                buttonInteraction.reply({embeds: [cancel_ban], ephemeral: is_ephemeral});
                await Log(interaction.guild.id, `└─'${buttonInteraction.user.tag}' cancelled the ban.`, 'INFO')
            }
            ban_collector.stop();
        })
    }
}

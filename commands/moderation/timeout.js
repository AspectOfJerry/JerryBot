const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const ms = require('ms')

const Sleep = require('../../modules/sleep');
const Log = require('../../modules/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription("Times out a member for a specified amount of time.")
        .addUserOption((options) =>
            options
                .setName('user')
                .setDescription("[REQUIRED] The user to timeout.")
                .setRequired(true))
        .addStringOption((options) =>
            options
                .setName('duration')
                .setDescription("[REQUIRED] The duration of the timeout.")
                .setRequired(true))
        .addStringOption((options) =>
            options
                .setName('reason')
                .setDescription("[OPTIONAL] The reason for the timeout.")
                .setRequired(false))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                .setRequired(false)),
    async execute(client, interaction) {
        await Log(interaction.guild.id, `'${interaction.user.tag}' executed '/timeout'.`, 'INFO');
        //Command information
        const REQUIRED_ROLE = "PL3";

        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
        await Log(interaction.guild.id, `├─ephemeral: ${is_ephemeral}`, 'DEBUG'); //Logs
        const target = interaction.options.getUser('user');
        const memberTarget = interaction.guild.members.cache.get(target.id);
        await Log(interaction.guild.id, `├─memberTarget: '${memberTarget.user.tag}'`, 'DEBUG'); //Logs

        const duration = interaction.options.getString('duration');
        let reason = interaction.options.getString('reason');
        await Log(interaction.guild.id, `├─reason: ${reason}`, 'DEBUG');

        const duration_in_ms = ms(duration)
        await Log(interaction.guild.id, `├─duration_in_ms: ${duration}`, 'DEBUG');

        //Checks
        if(!interaction.member.roles.cache.find(role => role.name == REQUIRED_ROLE)) {
            const error_permissions = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                .setFooter({text: `You need at least the '${REQUIRED_ROLE}' role to use this command.`});

            interaction.reply({embeds: [error_permissions]})
            await Log(interaction.guild.id, `└─'${interaction.user.id}' did not have the required role to user '/timeout'.`, 'WARN');   //Logs
            return;
        }
        if(memberTarget.id == interaction.user.id) {
            const error_cannot_use_on_self = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("Error")
                .setDescription('You cannot timeout yourself.');

            interaction.reply({embeds: [error_cannot_use_on_self], ephemeral: is_ephemeral});
            await Log(interaction.guild.id, `${interaction.user.id} tried to timeout themselves.`, 'WARN');
            return;
        }
        if(!duration_in_ms) {
            const error_duration = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('Error')
                .setDescription('Invalid duration. Please use a valid duration.')
                .addField("Examples", "1s *(min)*, 5m, 1h, 30d *(max)*");

            interaction.reply({embeds: [error_duration], ephemeral: is_ephemeral});
            return;
        }
        //Role position check---
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
                .setDescription(`Your highest role is equal to <@${interaction.user.id}>'s highest role.`);

            interaction.reply({embeds: [error_equal_roles], ephemeral: is_ephemeral});
            await Log(interaction.guild.id, `└─'${interaction.user.tag}' tried to timeout '${memberTarget.user.tag}' but their highest role was equal.`, 'WARN');  //Logs
            return;
        }
        //---Role position check

        //Code
        reason = reason ? ` \n**Reason:** ${reason}` : "";
        memberTarget.timeout(duration_in_ms, reason)
            .then(timeoutResult => {
                const success_timeout = new MessageEmbed()
                    .setColor('GREEN')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                    .setTitle("User timeout")
                    .setDescription(`<@${interaction.user.id}> timed out <@${memberTarget.id}> for ${duration}.${reason}`);

                interaction.reply({embeds: [success_timeout], ephemeral: is_ephemeral});
            })
        await Log(interaction.guild.id, `└─'${interaction.user.tag}' timed out '${memberTarget.user.tag}' for ${duration}.${reason}`, 'WARN');  //Logs
    }
}

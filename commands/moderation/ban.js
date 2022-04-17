const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription("Bans a user from the guild.")
        .addUserOption((options) =>
            options
                .setName('user')
                .setDescription("The user to ban.")
                .setRequired(true))
        .addIntegerOption((options) =>
            options
                .setName('duration')
                .setDescription("The duration of the ban in days (0 to 7). Defaults to 0 (no duration).")
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
                .setDescription("The reason for the ban.")
                .setRequired(false))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("Whether you want the bot's messages to only be visible to yourself.")
                .setRequired(false)),
    async execute(client, interaction) {
        //Command information
        const REQUIRED_ROLE = "PL1";

        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral');
        const target = interaction.options.getUser('user');
        const memberTarget = interaction.guild.members.cache.get(target.id);

        let banDuration = interaction.options.getInteger('duration');
        let reason = interaction.options.getString('reason');

        //Check
        if(!interaction.member.roles.cache.find(role => role.name == REQUIRED_ROLE)) {
            const error_permissions = new MessageEmbed()
                .setColor('#ff2020')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                .setFooter({text: `You need at least the '${REQUIRED_ROLE}' role to use this command.`});

            interaction.reply({embeds: [error_permissions], ephemeral: is_ephemeral});
            return;
        }
        if(memberTarget.id == interaction.user.id) {
            const error_cannot_use_on_self = new MessageEmbed()
                .setColor('ff2020')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("Error")
                .setDescription('You cannot ban yourself.');

            interaction.reply({embeds: [error_cannot_use_on_self], ephemeral: is_ephemeral});
            return;
        }
        //Role position check---
        if(memberTarget.roles.highest.position > interaction.member.roles.highest.position) {
            const error_role_too_low = new MessageEmbed()
                .setColor('ff2020')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription(`Your highest role is lower than <@${memberTarget.id}>'s highest role.`);

            interaction.reply({embeds: [error_role_too_low], ephemeral: is_ephemeral});
            return;
        }
        if(memberTarget.roles.highest.position >= interaction.member.roles.highest.position) {
            const error_equal_roles = new MessageEmbed()
                .setColor('ff2020')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription(`Your highest role is equal to <@${memberTarget.id}>'s highest role.`);

            interaction.reply({embeds: [error_equal_roles], ephemeral: is_ephemeral});
            return;
        }
        //---Role position check

        //Code
        reason = reason ? ` \n**Reason:** ${reason}` : "";
        banDuration = banDuration ? banDuration : 0;
        memberTarget.ban(banDuration, reason)
            .then(banResult => {
                if(banDuration == 0) {
                    banDuration = "";
                } else {
                    banDuration = ` for ${banDuration} days`;
                }
                const success_ban = new MessageEmbed()
                    .setColor('20ff20')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                    .setTitle("GuildMember ban")
                    .setDescription(`<@${interaction.user.id}> banned <@${memberTarget.id}> from the guild${banDuration}.${reason}`);

                interaction.reply({embeds: [success_ban], ephemeral: is_ephemeral});
            })
    }
}

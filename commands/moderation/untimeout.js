const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('untimeout')
        .setDescription("Untimes out a member for a specified amount of time.")
        .addUserOption((options) =>
            options
                .setName('user')
                .setDescription("The user to untimeout.")
                .setRequired(true))
        .addStringOption((options) =>
            options
                .setName('reason')
                .setDescription("The reason for the untimeout.")
                .setRequired(false))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("Whether you want the bot's messages to only be visible to yourself.")
                .setRequired(false)),
    async execute(client, interaction) {
        //Command information
        const REQUIRED_ROLE = "PL3";

        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral');
        const target = interaction.options.getUser('user');
        const memberTarget = interaction.guild.members.cache.get(target.id);

        let reason = interaction.options.getString('reason');
        //Checks
        if(!interaction.member.roles.cache.find(role => role.name == REQUIRED_ROLE)) {
            const error_permissions = new MessageEmbed()
                .setColor('#ff2020')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("PermissionError")
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                .setFooter({text: `You need at least the '${REQUIRED_ROLE}' role to use this command.`});

            interaction.reply({embeds: [error_permissions], ephemeral: is_ephemeral})
            return;
        }
        if(memberTarget.id == interaction.user.id) {
            const error_cannot_use_on_self = new MessageEmbed()
                .setColor('ff2020')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("Error")
                .setDescription('You cannot timeout yourself.')

            interaction.reply({embeds: [error_cannot_use_on_self], ephemeral: false});
            return;
        }
        //Role position check---
        if(memberTarget.roles.highest.position > interaction.member.roles.highest.position) {
            const error_role_too_low = new MessageEmbed()
                .setColor('ff2020')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("PermissionError")
                .setDescription(`Your highest role is lower than <@${memberTarget.id}>'s highest role.`);

            interaction.reply({embeds: [error_role_too_low], ephemeral: is_ephemeral})
            return;
        }
        if(memberTarget.roles.highest.position >= interaction.member.roles.highest.position) {
            const error_equal_roles = new MessageEmbed()
                .setColor('ff2020')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("PermissionError")
                .setDescription(`Your highest role is equal to <@${interaction.user.id}>'s highest role.`);

            interaction.reply({embeds: [error_equal_roles], ephemeral: is_ephemeral})
            return;
        }
        //---Role position check

        //Code
        reason = reason ? ` \n**Reason:** ${reason}` : "";
        memberTarget.timeout(null, reason)
            .then(timeoutResult => {
                const success_untimeout = new MessageEmbed()
                    .setColor('20ff20')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                    .setTitle("User untimeout")
                    .setDescription(`<@${interaction.user.id}> untimed out <@${memberTarget.id}>.${reason}`);

                interaction.reply({embeds: [success_untimeout], ephemeral: is_ephemeral});
            })
    }
}

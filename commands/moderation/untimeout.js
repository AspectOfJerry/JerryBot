const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");

const {PermissionCheck, Log, Sleep} = require("../../modules/JerryUtils");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('untimeout')
        .setDescription("Untimes out a member for a specified amount of time.")
        .addUserOption((options) =>
            options
                .setName('user')
                .setDescription("[REQUIRED] The user to untimeout.")
                .setRequired(true))
        .addStringOption((options) =>
            options
                .setName('reason')
                .setDescription("[OPTIONAL] The reason for the untimeout.")
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
                .setDescription('You cannot timeout yourself.');

            await interaction.reply({embeds: [error_target_self]});
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
            return;
        }
        if(memberTarget.roles.highest.position >= interaction.member.roles.highest.position) {
            const error_equal_roles = new MessageEmbed()
                .setColor("RED")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription(`Your highest role is equal to <@${interaction.user.id}>'s highest role.`);

            await interaction.reply({embeds: [error_equal_roles]});
            return;
        }
        // -----END HIERARCHY CHECK-----
        // Main
        reason = reason ? ` \n**Reason:** ${reason}` : "";

        if(!memberTarget.isCommunicationDisabled()) {
            const member_not_timed_out = new MessageEmbed()
                .setColor("RED")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription(`<@${memberTarget.user.id}> is not timed out.`)
                .setFooter({text: "Attempting to clear timeout anyway..."})

            await interaction.reply({embeds: [member_not_timed_out]});
            await Log("append", interaction.guild.id, `└─'${interaction.user.tag}' is not timed out. Attempting to clear timeout anyway.`, "WARN");

            await memberTarget.timeout(null, reason);
            return;
        }

        memberTarget.timeout(null, reason)
            .then(async timeoutResult => {
                const success_untimeout = new MessageEmbed()
                    .setColor("GREEN")
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                    .setTitle("User untimeout")
                    .setDescription(`<@${interaction.user.id}> untimed out <@${memberTarget.id}>.${reason}`);

                await interaction.reply({embeds: [success_untimeout]});
            });
    }
};

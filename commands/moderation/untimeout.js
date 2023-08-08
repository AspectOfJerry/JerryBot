import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";

import {logger, permissionCheck, sleep} from "../../utils/jerryUtils.js";


export default {
    data: new SlashCommandBuilder()
        .setName("untimeout")
        .setDescription("Untimes out a member for a specified amount of time.")
        .addUserOption((options) =>
            options
                .setName("user")
                .setDescription("[REQUIRED] The user to untimeout.")
                .setRequired(true))
        .addStringOption((options) =>
            options
                .setName("reason")
                .setDescription("[OPTIONAL] The reason for the untimeout.")
                .setRequired(false)),
    async execute(client, interaction) {
        if(await permissionCheck(interaction, 3) === false) {
            return;
        }

        // Declaring variables
        const target = interaction.options.getUser("user");
        const memberTarget = interaction.guild.members.cache.get(target.id);
        logger.append("info", "IN", `'/untimeout' > memberTarget: '@${memberTarget.user.tag}'`);

        let reason = interaction.options.getString("reason");

        // Checks
        if(memberTarget.id == interaction.user.id) {
            const self_timeout_exception = new MessageEmbed()
                .setColor("RED")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("SelfTimeoutException")
                .setDescription("You cannot timeout yourself.");

            interaction.reply({embeds: [self_timeout_exception]});
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
            return;
        }
        if(memberTarget.roles.highest.position >= interaction.member.roles.highest.position) {
            const insufficient_permission_exception = new MessageEmbed()
                .setColor("RED")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("InsufficientPermissionException")
                .setDescription(`Your highest role is equal to <@${interaction.user.id}>'s highest role.`);

            interaction.reply({embeds: [insufficient_permission_exception]});
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
                .setFooter({text: "Attempting to clear timeout anyway..."});

            await interaction.reply({embeds: [member_not_timed_out]});
            logger.append("notice", "STDOUT", `'/untimeout' > '@${interaction.user.tag}' is not timed out. Attempting to clear timeout anyway.`);

            await memberTarget.timeout(null, reason);
            return;
        }

        memberTarget.timeout(null, reason)
            .then((timeoutResult) => {
                const success_untimeout = new MessageEmbed()
                    .setColor("GREEN")
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                    .setTitle("User untimeout")
                    .setDescription(`<@${interaction.user.id}> untimed out <@${memberTarget.id}>.${reason}`);

                interaction.reply({embeds: [success_untimeout]});
            });
    }
};

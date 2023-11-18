import {MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";

import {logger, permissionCheck, sleep} from "../../utils/jerryUtils.js";


export default {
    data: new SlashCommandBuilder()
    .setName("disconnect")
    .setDescription("Disconnect a user from their voice channel.")
    .addUserOption((options) =>
        options
        .setName("user")
        .setDescription("[OPTIONAL] The user to disconnect. Defaults to yourself.")
        .setRequired(false))
    .addBooleanOption((options) =>
        options
        .setName("all")
        .setDescription("[OPTIONAL] If you want to disconnect everyone in the targted user's voice channel. Defaults to false")
        .setRequired(false)),
    async execute(client, interaction) {
        if (await permissionCheck(interaction, 3) === false) {
            return;
        }

        // Declaring variables
        const target = interaction.options.getUser("user") || interaction.user;
        const memberTarget = interaction.guild.members.cache.get(target.id);
        logger.append("info", "IN", `├─memberTarget: '@${memberTarget.user.tag}'`);

        const is_all = interaction.options.getBoolean("all") || false;
        logger.append("info", "IN", `├─is_all: ${is_all}`);

        // Checks
        if (!memberTarget.voice.channel) {
            const user_not_in_vc = new MessageEmbed()
            .setColor("RED")
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription(`Error: <@${memberTarget.id}> is not in a voice channel.`);

            interaction.reply({embeds: [user_not_in_vc]});
            logger.append("notice", interaction.guild.id, `'/disconnect' > '@${memberTarget.tag}' is not in a voice channel.`);
            return;
        }

        // Main
        if (!is_all) {
            const current_voice_channel = memberTarget.voice.channel;
            const disconnecting = new MessageEmbed()
            .setColor("YELLOW")
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription(`Disconnecting <@${memberTarget.id}> from ${current_voice_channel}...`);

            await interaction.reply({embeds: [disconnecting]});
            await memberTarget.voice.setChannel(null)
            .then(() => {
                const disconnect_success = new MessageEmbed()
                .setColor("GREEN")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription(`Successfully disconnected <@${memberTarget.id}> from ${current_voice_channel}.`);

                interaction.editReply({embeds: [disconnect_success]});
            });
        } else {
            const current_voice_channel = memberTarget.voice.channel;
            let memberCount = memberTarget.voice.channel.members.size;
            const disconnecting = new MessageEmbed()
            .setColor("YELLOW")
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription(`Disconnecting all ${memberCount} members from ${current_voice_channel}...`);

            await interaction.reply({embeds: [disconnecting]});
            logger.append("debug", "STDOUT", `Attemping to disconnect every member in 'v#${current_voice_channel.name}'...`);

            let failedMemberCount = 0;
            let failedString = "";

            await memberTarget.voice.channel.members.forEach(async (member) => {
                const voice_channel = member.voice.channel; // using variable here because we won't be able to access it after the member is disconnected
                await member.voice.setChannel(null)
                .then(() => {
                    // const disconnect_success = new MessageEmbed()
                    //     .setColor("GREEN")
                    //     .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    //     .setDescription(`Successfully disconnected <@${member.id}> from <#${voice_channel.id}>.`);

                    // interaction.editReply({embeds: [disconnect_success], ephemeral: true});
                    logger.append("info", "STDOUT", `'/disconnect' > Successfully disconnected '${member.tag}' from the '${voice_channel.name}' voice channel.`);
                }).catch(() => {
                    // const disconnect_error = new MessageEmbed()
                    //     .setColor("RED")
                    //     .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    //     .setDescription(`An error occurred while disconnecting <@${member.id}>.`);

                    // interaction.editReply({embeds: [disconnect_error]});
                    logger.append("error", "STDERR", `'/disconnect' > An error occurred while disconnecting '${member.tag}' from '${voice_channel.name}'.`);
                    memberCount--;
                    failedMemberCount++;
                });
            });

            // using a functio because too lazy to figure out why the final embed was being sent before the disconnects :/
            let embedColor = "GREEN";
            if (failedMemberCount !== 0) {
                embedColor = "YELLOW";
                failedString = `\nFailed to disconnect ${failedMemberCount} members.`;
            }
            if (failedMemberCount !== 0 && memberCount === 0) {
                embedColor = "RED";
            }

            const disconnected = new MessageEmbed()
            .setColor(embedColor)
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription(`Successfully disconnected ${memberCount} members from <#${current_voice_channel.id}>.${failedString}`);

            interaction.editReply({embeds: [disconnected]});
            logger.apppend("info", "STDOUT", `'/disconnect' > Successfully disconnected ${memberCount} members from '${current_voice_channel.name}' and failed to disconnect ${failedMemberCount} members.`);
        }
    }
};

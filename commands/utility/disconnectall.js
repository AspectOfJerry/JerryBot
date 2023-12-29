import {MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";

import {logger, permissionCheck, sleep} from "../../utils/jerryUtils.js";


export default {
    data: new SlashCommandBuilder()
    .setName("disconnectall")
    .setDescription("Disconnects everyone in a user's channel.")
    .addChannelOption((options) =>
        options
        .setName("channel")
        .setDescription("[OPTIONAL] The channel to disconnect everyone from. Defaults to your voice channel.")
        .setRequired(false)),
    async execute(client, interaction) {
        if (await permissionCheck(interaction, 3) === false) {
            return;
        }

        // Declaring variables
        const voice_channel = interaction.options.getChannel("channel") || interaction.member.voice.channel;
        logger.append("info", "IN", `'/disconnectall' > voice_channel: '${voice_channel.name}'`);

        // Checks

        if (!interaction.member.voice.channel) {
            const not_in_vc = new MessageEmbed()
            .setColor("RED")
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setTitle("IllegalVoiceStateException")
            .setDescription("You must be in a voice channel if you are not providing a voice channel.");

            interaction.reply({embeds: [not_in_vc]});
            logger.append("notice", "STDOUT", `'/disconnectall' > '${interaction.user.tag}' was not in a voice channel && did not provide a channel`);
            return;
        }

        if (!voice_channel.isVoice) {
            const invalid_input_channel_type_exception = new MessageEmbed()
            .setColor("RED")
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setTitle("IllegalChannelTypeException")
            .setDescription(`<#${voice_channel.id}> is not a voice channel!`);

            interaction.reply({embeds: [invalid_input_channel_type_exception]});
            logger.append("notice", "STDOUT", `The provided channel NOT voice channel (${voice_channel.name}).`);
            return;
        }

        // Main
        try {
            voice_channel.members.size;
        } catch {
            const empty_voice_channel = new MessageEmbed()
            .setColor("RED")
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription(`The <#${voice_channel.id}> voice channel is empty.`);

            interaction.reply({embeds: [empty_voice_channel]});
            logger.append("notice", "STDOUT", "'/disconnectall' > The provided channel was empty.");
            return;
        }

        let memberCount = voice_channel.members.size;
        const disconnecting_members = new MessageEmbed()
        .setColor("YELLOW")
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
        .setDescription(`Disconnecting all ${memberCount} members from <#${voice_channel.id}>...`);

        await interaction.reply({embeds: [disconnecting_members]});
        logger.append("debug", "STDOUT", `'/disconnectall' > Attemping to disconnect all member in the '#${voice_channel.name}' voice channel...`);

        let failedMemberCount = 0;
        let failedString = "";

        await voice_channel.members.forEach(async (member) => {
            const voice_channel = member.voice.channel; // using variable here because we won't be able to access it after the member is disconnected
            await member.voice.setChannel(null)
            .then(() => {
                // const disconnect_success = new MessageEmbed()
                //     .setColor("GREEN")
                //     .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                //     .setDescription(`Successfully disconnected <@${member.id}> from <#${voice_channel.id}>.`);

                // interaction.editReply({embeds: [disconnect_success], ephemeral: true});
                logger.append("info", "StDOUT", `'/disconnectall' > Successfully disconnected '@${member.tag}' from the '@${voice_channel.name}' voice channel.`);
            }).catch(() => {
                // const disconnect_error = new MessageEmbed()
                //     .setColor("RED")
                //     .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                //     .setDescription(`An error occurred while disconnecting <@${member.id}>.`);

                // interaction.editReply({embeds: [disconnect_error]});
                logger.append("error", "STDERR", `'/disconnectall' > An error occurred while disconnecting '@${member.tag}' from '@${voice_channel.name}'.`);
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
        .setDescription(`Successfully disconnected ${memberCount} members from <#${voice_channel.id}>.${failedString}`);

        interaction.editReply({embeds: [disconnected]});
        logger.append("info", "STDOUT", `'/disconnectall' > Successfully disconnected ${memberCount} members from '${voice_channel.name}' and failed to disconnect ${failedMemberCount} members.`);
    }
};

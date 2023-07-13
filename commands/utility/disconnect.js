const {MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";

import {log, permissionCheck, sleep} from "../../modules/jerryUtils.js";


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
        if(await permissionCheck(interaction, 3) === false) {
            return;
        }

        // Declaring variables
        const target = interaction.options.getUser("user") || interaction.user;
        const memberTarget = interaction.guild.members.cache.get(target.id);
        log("append", interaction.guild.id, `├─memberTarget: '@${memberTarget.user.tag}'`, "INFO");

        const is_all = interaction.options.getBoolean("all") || false;
        log("append", interaction.guild.id, `├─is_all: ${is_all}`, "INFO");

        // Checks
        if(!memberTarget.voice.channel) {
            const user_not_in_vc = new MessageEmbed()
                .setColor("RED")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription(`Error: <@${memberTarget.id}> is not in a voice channel.`);

            interaction.reply({embeds: [user_not_in_vc]});
            log("append", interaction.guild.id, `  └─'${memberTarget.tag}' is not in a voice channel.`, "WARN");
            return;
        }

        // Main
        if(!is_all) {
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
            log("append", interaction.guild.id, `└─Attemping to disconnect every member in 'v#${current_voice_channel.name}'...`, "WARN");

            let failedMemberCount = 0;
            let failedString = "";

            await memberTarget.voice.channel.members.forEach(async (member) => {
                const voice_channel = member.voice.channel; // using variable here because we wont be able to access it after the member is disconnected
                await member.voice.setChannel(null)
                    .then(() => {
                        // const disconnect_success = new MessageEmbed()
                        //     .setColor("GREEN")
                        //     .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                        //     .setDescription(`Successfully disconnected <@${member.id}> from <#${voice_channel.id}>.`);

                        // interaction.editReply({embeds: [disconnect_success], ephemeral: true});
                        log("append", interaction.guild.id, `├─Successfully disconnected '${member.tag}' from the '${voice_channel.name}' voice channel.`, "INFO");
                    }).catch(() => {
                        // const disconnect_error = new MessageEmbed()
                        //     .setColor("RED")
                        //     .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                        //     .setDescription(`An error occurred while disconnecting <@${member.id}>.`);

                        // interaction.editReply({embeds: [disconnect_error]});
                        log("append", interaction.guild.id, `├─An error occurred while disconnecting '${member.tag}' from '${voice_channel.name}'.`);
                        memberCount--;
                        failedMemberCount++;
                    });
            });

            // using a functio because too lazy to figure out why the final embed was being sent before the disconnects :/
            let embedColor = "GREEN";
            if(failedMemberCount !== 0) {
                embedColor = "YELLOW";
                failedString = `\nFailed to disconnect ${failedMemberCount} members.`;
            }
            if(failedMemberCount !== 0 && memberCount === 0) {
                embedColor = "RED";
            }

            const disconnected = new MessageEmbed()
                .setColor(embedColor)
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription(`Successfully disconnected ${memberCount} members from <#${current_voice_channel.id}>.${failedString}`);

            interaction.editReply({embeds: [disconnected]});
            log("append", interaction.guild.id, `└─Successfully disconnected ${memberCount} members from '${current_voice_channel.name}' and failed to disconnect ${failedMemberCount} members.`, "INFO");
        }
    }
};

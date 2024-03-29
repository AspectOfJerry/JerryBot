import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";

import {logger, permissionCheck, sleep} from "../../utils/jerryUtils.js";


export default {
    data: new SlashCommandBuilder()
    .setName("move")
    .setDescription("Moves a user to a voice channel.")
    .addChannelOption((options) =>
        options
        .setName("channel")
        .setDescription("[REQUIRED] The targeted channel to move to.")
        .setRequired(true))
    .addUserOption((options) =>
        options
        .setName("user")
        .setDescription("[OPTIONAL] The user to move. Defaults to yourself.")
        .setRequired(false))
    .addBooleanOption((options) =>
        options
        .setName("all")
        .setDescription("[OPTIONAL] If you want to move everyone in the user's channel with them. Defaults to false.")
        .setRequired(false)),
    async execute(client, interaction) {
        if (await permissionCheck(interaction, 3) === false) {
            return;
        }

        // Declaring variables
        const target = interaction.options.getUser("user") || interaction.user;
        const memberTarget = interaction.guild.members.cache.get(target.id);
        logger.append("info", "IN", `'/move' > memberTarget: '@${memberTarget.user.tag}'`);

        const is_all = interaction.options.getBoolean("all") || false;
        logger.append("info", "IN", `'/move' > is_all: ${is_all}`);
        const new_voice_channel = interaction.options.getChannel("channel");

        // Checks
        if (!memberTarget.voice.channel) {
            const user_not_in_vc = new MessageEmbed()
            .setColor("RED")
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription(`Error: <@${memberTarget.id}> is not in a voice channel.`);

            interaction.reply({embeds: [user_not_in_vc]});
            return;
        }

        // Main
        if (!is_all) {
            const current_voice_channel = memberTarget.voice.channel;
            memberTarget.voice.setChannel(new_voice_channel)
            .then(() => {
                const success_move = new MessageEmbed()
                .setColor("GREEN")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription(`Successfully moved <@${memberTarget.id}> from ${current_voice_channel} to ${new_voice_channel}.`);

                interaction.reply({embeds: [success_move]});
                logger.append("info", "STDOUT", `'/move' > Successfully moved '@${memberTarget.tag}' from '#${current_voice_channel.name}' to '#${new_voice_channel.name}'.`);
            });
        } else {
            const current_voice_channel = memberTarget.voice.channel;
            let member_count = memberTarget.voice.channel.members.size;
            const moving_members = new MessageEmbed()
            .setColor("YELLOW")
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription(`Moving all ${member_count} members from <#${current_voice_channel.id}> to <#${new_voice_channel.id}>...`);

            await interaction.reply({embeds: [moving_members]});
            logger.append("debug", "STDOUT", `'/move' > Attemping to move every member in '#${current_voice_channel.name}' to '#${new_voice_channel.name}'...`);

            let failed_member_count = 0;
            let failed_string = "";

            await memberTarget.voice.channel.members.forEach(async (member) => {
                const current_voice_channel = member.voice.channel;
                await member.voice.setChannel(new_voice_channel)
                .then(() => {
                    const move_success = new MessageEmbed()
                    .setColor("GREEN")
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription(`Successfully moved <@${member.id}> from <#${current_voice_channel.id}> to <#${new_voice_channel.id}>.`);

                    interaction.editReply({embeds: [move_success]});
                    logger.append("info", "STDOUT", `'/move' > Successfully moved '${member.tag}' from <#${current_voice_channel.name}> to #<${new_voice_channel.name}>.`);
                }).catch(() => {
                    const move_error = new MessageEmbed()
                    .setColor("RED")
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription(`An error occurred while moving <@${member.id}>.`);

                    interaction.editReply({embeds: [move_error]});
                    logger.append("error", "STDERR", `'/move' > An error occurred while moving '${member.tag}' from <#${current_voice_channel.name}> to #<${new_voice_channel.name}>.`);

                    member_count--;
                    failed_member_count++;
                });
                await sleep(100);
            });
            let embed_color = "GREEN";
            if (failed_member_count !== 0) {
                embed_color = "YELLOW";
                failed_string = `\nFailed to move ${failed_member_count} members.`;
            }
            if (failed_member_count !== 0 && member_count === 0) {
                embed_color = "RED";
            }

            const succes_move = new MessageEmbed()
            .setColor(embed_color)
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription(`Successfully moved ${member_count} members from <#${current_voice_channel.id}> to <#${new_voice_channel.id}>.${failed_string}`);

            interaction.editReply({embeds: [succes_move]});
            logger.append("info", "STDOUT", `'/move' > Successfully moved ${member_count} members from '#${current_voice_channel.name}' to '#${new_voice_channel.name}' and failed to move ${failed_member_count} members.`);
        }
    }
};

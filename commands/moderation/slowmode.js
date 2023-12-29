import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";

import {logger, permissionCheck, sleep} from "../../utils/jerryUtils.js";


export default {
    data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Enables slowmode in a guild text channel.")
    .addIntegerOption((options) =>
        options
        .setName("interva")
        .setDescription("[REQUIRED] The rate limit in seconds.")
        .setRequired(true))
    .addChannelOption((options) =>
        options
        .setName("channel")
        .setDescription("[OPTIONAL] The text channel to enable slowmode in.")
        .setRequired(false))
    .addStringOption((options) =>
        options
        .setName("reason")
        .setDescription("[OPTIONAL] The reason for enabling the rate limit.")
        .setRequired(false)),
    async execute(client, interaction) {
        if (await permissionCheck(interaction, 3) === false) {
            return;
        }

        const interval = interaction.options.getInteger("interval");
        const channel = interaction.options.getChannel("channel") ?? interaction.channel;
        const reason = interaction.options.getString("reason") ?? "No reason provided.";

        if (channel.type !== "GUILD_TEXT") {
            const error_not_text_channel = new MessageEmbed()
            .setColor("RED")
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription(`<#${channel.id}> is not a text channel!`);

            await interaction.reply({embeds: [error_not_text_channel]});
            logger.append("notice", "STDOUT", `'/slowmode' > The provided channel was not a text channel (#${channel.name}).`);
            return;
        }

        if (interval === 0) {
            await channel.setRateLimitPerUser(0, reason)
            .then(() => {
                const disabled_slowmode = new MessageEmbed()
                .setColor("GREEN")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription(`Successfully disabled the rate limit per user in <#${channel.id}>.`);

                interaction.reply({embeds: [disabled_slowmode]});
                logger.append("info", "STDOUT", `'/slowmode' > Successfully disabled the rate limit per user in '#${channel.name}' in "${channel.guild.name}".`);
            });
            return;
        }

        channel.setRateLimitPerUser(interval, reason)
        .then(() => {
            const enabled_slowmode = new MessageEmbed()
            .setColor("GREEN")
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription(`Successfully enabled a **${interval}** second rate limit per user in <#${channel.id}>.`)
            .setFooter({text: "Set the rate limit to 0 to disable it."});

            interaction.reply({embeds: [enabled_slowmode]});
            logger.append("append", "STDOUT", `'/slowmode' > Successfully enabled a ${interval} second rate limit per user in '#${channel.name}' in "${channel.guild.name}".`);
        });
    }
};

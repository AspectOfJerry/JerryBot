import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";

import {log, permissionCheck, sleep} from "../../modules/jerryUtils.js";


export default {
    data: new SlashCommandBuilder()
        .setName("react")
        .setDescription("Reacts to a message")
        .addStringOption((options) =>
            options
                .setName("message")
                .setDescription("[REQUIRED] The message Snowflake ID.")
                .setRequired(true))
        .addStringOption((options) =>
            options
                .setName("emoji")
                .setDescription("[REQUIRED] The Unicode emoji")
                .setRequired(true)),
    async execute(client, interaction) {
        // interaction.deferReply()
        if(await permissionCheck(interaction, 2) === false) {
            return;
        }

        interaction.reply("This command is currently disabled. Reactions are weird and the command doesn't really work.");
        return;
        // Declaring variables
        const snowflake = await interaction.options.getString("message");
        console.log(snowflake);
        const message = await interaction.channel.messages.resolve(snowflake);
        console.log(message);
        const emoji = interaction.options.getString("emoji");

        // Checks
        if(!message) {
            const message_resolve_exception = new MessageEmbed()
                .setColor("RED")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setTitle("MessageResolveException")
                .setDescription(`Unable to reference the ${message} Snowflake to a message in <#${interaction.channel.id}>.`);

            interaction.reply({embeds: [message_resolve_exception], ephemeral: true});
            return;
        }

        // Main
        interaction.channel.messages.react(message, emoji)
            .then((msg) => {
                const reacted = new MessageEmbed()
                    .setColor("GREEN")
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription(`Successfully reacted to [this message](${msg.url}).`);

                interaction.reply({embeds: [reacted]});
            }).catch(() => {
                const reaction_failure_exception = new MessageEmbed()
                    .setColor("RED")
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setTitle("ReactionFailureException")
                    .setDescription("Could not react `" + emoji + "` to the message.");

                interaction.reply({embeds: [reaction_failure_exception], ephemeral: true});
            });
    }
};

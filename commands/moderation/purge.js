import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";

import {log, permissionCheck, sleep} from "../../modules/jerryUtils.js";


export default {
    data: new SlashCommandBuilder()
        .setName("purge")
        .setDescription("Purges a certain amount of messages in this channel.")
        .addIntegerOption((options) =>
            options
                .setName("amount")
                .setDescription("[REQUIRED] The amount of messages to delete (<= 100).")
                .setMinValue(0)
                .setMaxValue(100)
                .setRequired(true))
        .addChannelOption((options) =>
            options
                .setName("channel")
                .setDescription("[OPTIONAL] The channel to delete the messages from. Defaults to this channel.")
                .setRequired(false)),
    async execute(client, interaction) {
        if(await permissionCheck(interaction, 3) === false) {
            return;
        }

        // Declaring variables
        const amount = interaction.options.getInteger("amount");
        const channel = interaction.options.getChannel("channel") ?? interaction.channel;

        // Checks

        // Main
        const button_row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("purge_confirm_button")
                    .setLabel("Purge")
                    .setStyle("DANGER")
                    .setDisabled(false),
                new MessageButton()
                    .setCustomId("purge_cancel_button")
                    .setLabel("Cancel")
                    .setStyle("PRIMARY")
                    .setDisabled(false)
            );

        let isOverridden = false;

        // const now = Math.round(Date.now() / 1000);
        // const auto_cancel_timestamp = now + 10;

        const confirm_purging = new MessageEmbed()
            .setColor("YELLOW")
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle("Confirm purging")
            .setDescription(`Are you sure you want to delete __${amount}__ messages?\n*Messages older than two weeks are not bulk-deletable.*`)
            // .addFields(
            //     {name: "Auto cancel", value: `> :red_square: Canceling <t:${auto_cancel_timestamp}:R>*.`, inline: true}
            // ).setFooter({text: "*Relative timestamps look out of sync depending on your timezone."});
            .setFooter({text: "🟥 Canceling in 10s"});

        const message = await interaction.reply({embeds: [confirm_purging], components: [button_row], ephemeral: true, fetchReply: true});
        log("append", interaction.guild.id, "├─Execution authorized. Waiting for the confirmation.", "INFO");

        // Creating a filter for the collector
        const filter = async (buttonInteraction) => {
            if(buttonInteraction.member.roles.highest.position > interaction.member.roles.highest.position) {
                await log("append", interaction.guild.id, `├─'${buttonInteraction.user.tag}' overrode the decision.`, "WARN");
                return true;
            } else if(buttonInteraction.user.id === interaction.user.id) {
                return true;
            } else {
                await buttonInteraction.reply({content: "You cannot use this button.", ephemeral: true});
                await log("append", interaction.guild.id, `├─'${buttonInteraction.user.tag}' did not have the permission to use this button.`, "WARN");
                return;
            }
        };

        const button_collector = message.createMessageComponentCollector({filter, componentType: "BUTTON", time: 10000});

        button_collector.on("collect", async (buttonInteraction) => {
            await buttonInteraction.deferUpdate();
            await button_collector.stop();

            if(buttonInteraction.customId == "purge_confirm_button") {
                // Disabling buttons
                button_row.components[0]
                    .setStyle("SUCCESS")
                    .setDisabled(true);
                button_row.components[1]
                    .setStyle("SECONDARY")
                    .setDisabled(true);

                await sleep(250);

                channel.bulkDelete(amount, true)
                    .then((msgs) => {
                        const success_purge = new MessageEmbed()
                            .setColor("GREEN")
                            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                            .setTitle("Message purging")
                            .setDescription(`Successfully purged __${msgs.size}__  messages in <#${channel.id}>${isOverridden ? ` (overriden by <@${buttonInteraction.user.id}>)` : ""}.`);
                        // .setDescription(`<@${interaction.user.id}> purged __${msgs.size}__  messages in <#${channel.id}>$${isOverridden ? ` (overriden by <@${buttonInteraction.user.id}>)` : ""}.`);

                        interaction.followUp({embeds: [success_purge], components: [button_row], ephemeral: true});
                        log("append", interaction.guild.id, `└─'${interaction.user.tag}' purged '${msgs.size}' message(s) in '${channel.name}'${isOverridden ? ` (overriden by <@${buttonInteraction.user.id}>)` : ""}.`, "WARN");
                    });
            } else {
                // Disabling buttons
                button_row.components[0]
                    .setStyle("SECONDARY")
                    .setDisabled(true);
                button_row.components[1]
                    .setStyle("SUCCESS")
                    .setDisabled(true);

                const cancel_purge = new MessageEmbed()
                    .setColor("GREEN")
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription(`Successfully cancelled${isOverridden ? ` (overriden by <@${buttonInteraction.user.id}>)` : ""}.`);

                interaction.followUp({embeds: [cancel_purge], components: [button_row], ephemeral: true});
                log("append", interaction.guild.id, `└─'${interaction.user.tag}' cancelled the purge${isOverridden ? ` (overriden by <@${buttonInteraction.user.id}>)` : ""}.`, "INFO");
            }
        });

        button_collector.on("end", (collected) => {
            if(collected.size === 0) {
                // Disabling buttons
                button_row.components[0]
                    .setStyle("SECONDARY")
                    .setDisabled(true);
                button_row.components[1]
                    .setStyle("SECONDARY")
                    .setDisabled(true);

                const auto_abort = new MessageEmbed()
                    .setColor("DARK_GREY")
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription("Auto aborted.");

                interaction.followUp({embeds: [auto_abort], components: [button_row], ephemeral: true});
                log("append", interaction.guild.id, "└─Auto aborted.", "INFO");
            }
        });
    }
};

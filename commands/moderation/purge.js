const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const Sleep = require('../../modules/sleep.js'); // delayInMilliseconds
const Log = require('../../modules/logger.js'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription("Purges a certain amount of messages in this channel.")
        .addIntegerOption((options) =>
            options
                .setName('amount')
                .setDescription("[REQUIRED] The amount of messages to delete.")
                .setRequired(true))
        .addChannelOption((options) =>
            options
                .setName('channel')
                .setDescription("[OPTIONAL] The channel to delete the messages from. Defaults to this channel.")
                .setRequired(false)),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/purge'.`, 'INFO'); // Logs
        // await interaction.deferReply();

        // Set minimum execution role
        switch(interaction.guild.id) {
            case process.env.DISCORD_JERRY_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = "PL3";
                break;
            case process.env.DISCORD_GOLDFISH_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = "staff";
                break;
            case process.env.DISCORD_CRA_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = "PL3";
                break;
            case process.env.DISCORD_311_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = "PL1";
                break;
            default:
                await Log('append', interaction.guild.id, "└─Throwing because of bad permission configuration.", 'ERROR'); // Logs
                throw `Error: Bad permission configuration.`;
        }

        // Declaring variables
        const amount = interaction.options.getInteger('amount');
        const channel = interaction.options.getChannel('channel') || interaction.channel;

        // Checks
        // -----BEGIN ROLE CHECK-----
        if(MINIMUM_EXECUTION_ROLE !== null) {
            if(!interaction.member.roles.cache.find(role => role.name === MINIMUM_EXECUTION_ROLE)) {
                const error_permissions = new MessageEmbed()
                    .setColor('RED')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                    .setTitle('PermissionError')
                    .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                    .setFooter({text: `You need at least the '${MINIMUM_EXECUTION_ROLE}' role to use this command.`});

                await interaction.reply({embeds: [error_permissions]});
                await Log('append', interaction.guild.id, `└─'${interaction.user.id}' did not have the required role to use '/purge'. [error_permissions]`, 'WARN'); // Logs
                return;
            }
        } // -----END ROLE CHECK-----

        // Main
        let row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('purge_confirm_button')
                    .setLabel('Purge')
                    .setStyle('DANGER')
                    .setDisabled(false),
                new MessageButton()
                    .setCustomId('purge_cancel_button')
                    .setLabel('Cancel')
                    .setStyle('PRIMARY')
            );

        let isOverriddenText = "";

        const confirm_purging = new MessageEmbed()
            .setColor('YELLOW')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle('Confirm purging')
            .setDescription(`Are you sure you want to delete __${amount}__ messages?\n*Messages older than two weeks are not bulk-deletable.*`)
            .setFooter({text: "*Relative timestamps can look out of sync depending on your timezone."});

        await interaction.reply({embeds: [confirm_purging], components: [row]});
        await Log('append', interaction.guild.id, `├─Execution authorized. Waiting for the confirmation.`, 'INFO'); // Logs

        const now = Math.round(Date.now() / 1000);
        const auto_cancel_timestamp = now + 10;

        let autoCancelTimerMessage = await interaction.channel.send({content: `> Canceling <t:${auto_cancel_timestamp}:R>*.`});

        // Creating a filter for the collector
        const filter = async (buttonInteraction) => {
            if(buttonInteraction.member.roles.highest.position > interaction.member.roles.highest.position) {
                isOverriddenText = ` (overriden by <@${buttonInteraction.user.id}>)`;
                await Log('append', interaction.guild.id, `├─'${buttonInteraction.user.tag}' overrode the decision.`, 'WARN'); // Logs
                return true;
            } else if(buttonInteraction.user.id == interaction.user.id) {
                return true;
            } else {
                await buttonInteraction.reply({content: "You cannot use this button.", ephemeral: true});
                await Log('append', interaction.guild.id, `├─'${buttonInteraction.user.tag}' did not have the permission to use this button.`, 'WARN'); // Logs
                return;
            }
        }

        const button_collector = interaction.channel.createMessageComponentCollector({filter, time: 10000});

        button_collector.on('collect', async (buttonInteraction) => {
            await buttonInteraction.deferUpdate();
            await button_collector.stop();

            if(buttonInteraction.customId == 'purge_confirm_button') {
                // Disabling buttons
                row.components[0]
                    .setStyle('SUCCESS')
                    .setDisabled(true);
                row.components[1]
                    .setStyle('SECONDARY')
                    .setDisabled(true);

                await Sleep(250);

                channel.bulkDelete(amount + 1, true)
                    .then(async msgs => {
                        const success_purge = new MessageEmbed()
                            .setColor('GREEN')
                            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                            .setTitle("Message purging")
                            .setDescription(`<@${interaction.user.id}> purged __${msgs.size - 1}__ *(+2 bot-sent message)* messages in <#${channel.id}>${isOverriddenText}.`);

                        await interaction.followUp({embeds: [success_purge], ephemeral: true, components: [row]});
                        await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' purged '${msgs.size}' message(s) in '${channel.name}'${isOverriddenText}.`, 'WARN'); // Logs
                    });
            } else {
                // Disabling buttons
                row.components[0]
                    .setStyle('SECONDARY')
                    .setDisabled(true);
                row.components[1]
                    .setStyle('SUCCESS')
                    .setDisabled(true);

                const cancel_purge = new MessageEmbed()
                    .setColor('GREEN')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription(`<@${interaction.user.id}> cancelled the purge${isOverriddenText}.`)
                    .setFooter({text: "*Relative timestamps can look out of sync depending on your timezone."});

                const message = await interaction.editReply({embeds: [cancel_purge], components: [row]});
                await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' cancelled the purge${isOverriddenText}.`, 'INFO'); // Logs

                const now = Math.round(Date.now() / 1000);
                const auto_delete_timestamp = now + 5;

                let autoDeleteTimerMessage = await interaction.channel.send({content: `> Auto deleting bot-sent messages: <t:${auto_delete_timestamp}:R>*.`});
                await Sleep(5000);
                await autoDeleteTimerMessage.delete();
                await message.delete();
            }
        });

        button_collector.on('end', async collected => {
            await autoCancelTimerMessage.delete();

            if(collected.size === 0) {
                // Disabling buttons
                row.components[0]
                    .setStyle('SECONDARY')
                    .setDisabled(true);
                row.components[1]
                    .setStyle('SECONDARY')
                    .setDisabled(true);

                const auto_abort = new MessageEmbed()
                    .setColor('GREEN')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription(`Auto aborted.`)
                    .setFooter({text: "*Relative timestamps can look out of sync depending on your timezone."});

                const message = await interaction.editReply({embeds: [auto_abort], ephemeral: true, components: [row]});
                await Log('append', interaction.guild.id, `└─Auto aborted.`, 'INFO'); // Logs

                const now = Math.round(Date.now() / 1000);
                const auto_delete_timestamp = now + 5;

                let autoDeleteTimerMessage = await interaction.channel.send({content: `> Auto deleting bot-sent messages: <t:${auto_delete_timestamp}:R>*.`});
                await Sleep(5000);
                await autoDeleteTimerMessage.delete();
                await message.delete();
            }
        });
    }
};

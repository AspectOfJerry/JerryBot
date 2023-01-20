const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");

const {PermissionCheck, Log, Sleep} = require("../../modules/JerryUtils");


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
        await Log('append', interaction.guild.id, `'@${interaction.user.tag}' executed '/${interaction.commandName}${interaction.options.getSubcommand(false) ? " " + interaction.options.getSubcommand(false) : ""}'.`, 'INFO');
        // await interaction.deferReply();

        if(await PermissionCheck(interaction) === false) {
            const error_permissions = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                .setFooter({text: `Use '/help' to access the documentation on command permissions.`});

            await interaction.reply({embeds: [error_permissions]});
            await Log('append', interaction.guild.id, `└─'@${interaction.user.tag}' did not have the required role to execute '/${interaction.commandName}${interaction.options.getSubcommand(false) ? " " + interaction.options.getSubcommand(false) : ""}'. [PermissionError]`, 'WARN');
            return "PermissionError";
        }

        // Declaring variables
        const amount = interaction.options.getInteger('amount');
        const channel = interaction.options.getChannel('channel') ?? interaction.channel;

        // Checks

        // Main
        let buttonRow = new MessageActionRow()
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

        // const now = Math.round(Date.now() / 1000);
        // const auto_cancel_timestamp = now + 10;

        const confirm_purging = new MessageEmbed()
            .setColor('YELLOW')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle('Confirm purging')
            .setDescription(`Are you sure you want to delete __${amount}__ messages?\n*Messages older than two weeks are not bulk-deletable.*`)
            // .addFields(
            //     {name: 'Auto cancel', value: `> :red_square: Canceling <t:${auto_cancel_timestamp}:R>*.`, inline: true}
            // ).setFooter({text: "*Relative timestamps look out of sync depending on your timezone."});
            .setFooter({text: "🟥 Canceling in 10s"});

        await interaction.reply({embeds: [confirm_purging], components: [buttonRow], ephemeral: true});
        await Log('append', interaction.guild.id, `├─Execution authorized. Waiting for the confirmation.`, 'INFO');

        // Creating a filter for the collector
        const filter = async (buttonInteraction) => {
            if(buttonInteraction.member.roles.highest.position > interaction.member.roles.highest.position) {
                isOverriddenText = ` (overriden by <@${buttonInteraction.user.id}>)`;
                await Log('append', interaction.guild.id, `├─'${buttonInteraction.user.tag}' overrode the decision.`, 'WARN');
                return true;
            } else if(buttonInteraction.user.id == interaction.user.id) {
                return true;
            } else {
                await buttonInteraction.reply({content: "You cannot use this button.", ephemeral: true});
                await Log('append', interaction.guild.id, `├─'${buttonInteraction.user.tag}' did not have the permission to use this button.`, 'WARN');
                return;
            }
        }

        const button_collector = interaction.channel.createMessageComponentCollector({filter, time: 10000});

        button_collector.on('collect', async (buttonInteraction) => {
            await buttonInteraction.deferUpdate();
            await button_collector.stop();

            if(buttonInteraction.customId == 'purge_confirm_button') {
                // Disabling buttons
                buttonRow.components[0]
                    .setStyle('SUCCESS')
                    .setDisabled(true);
                buttonRow.components[1]
                    .setStyle('SECONDARY')
                    .setDisabled(true);

                await Sleep(250);

                channel.bulkDelete(amount, true)
                    .then(async msgs => {
                        const success_purge = new MessageEmbed()
                            .setColor('GREEN')
                            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                            .setTitle("Message purging")
                            .setDescription(`Successfully purged __${msgs.size}__  messages in <#${channel.id}>${isOverriddenText}.`);
                        // .setDescription(`<@${interaction.user.id}> purged __${msgs.size}__  messages in <#${channel.id}>${isOverriddenText}.`);

                        await interaction.followUp({embeds: [success_purge], components: [buttonRow], ephemeral: true});
                        await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' purged '${msgs.size}' message(s) in '${channel.name}'${isOverriddenText}.`, 'WARN');
                    });
            } else {
                // Disabling buttons
                buttonRow.components[0]
                    .setStyle('SECONDARY')
                    .setDisabled(true);
                buttonRow.components[1]
                    .setStyle('SUCCESS')
                    .setDisabled(true);

                const cancel_purge = new MessageEmbed()
                    .setColor('GREEN')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription(`Successfully cancelled${isOverriddenText}.`)

                await interaction.followUp({embeds: [cancel_purge], components: [buttonRow], ephemeral: true});
                await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' cancelled the purge${isOverriddenText}.`, 'INFO');
            }
        });

        button_collector.on('end', async collected => {
            if(collected.size === 0) {
                // Disabling buttons
                buttonRow.components[0]
                    .setStyle('SECONDARY')
                    .setDisabled(true);
                buttonRow.components[1]
                    .setStyle('SECONDARY')
                    .setDisabled(true);

                const auto_abort = new MessageEmbed()
                    .setColor('DARK_GREY')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription(`Auto aborted.`)

                await interaction.followUp({embeds: [auto_abort], components: [buttonRow], ephemeral: true});
                await Log('append', interaction.guild.id, `└─Auto aborted.`, 'INFO');
            }
        });
    }
};

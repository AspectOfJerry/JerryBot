const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const Sleep = require('../../modules/sleep'); // delayInMilliseconds
const Log = require('../../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription("Stops the bot.")
        .addStringOption((options) =>
            options
                .setName('reason')
                .setDescription("[OPTIONAL] The reason for the stop request.")
                .setRequired(false))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible by you or not. Defaults to false.")
                .setRequired(false)),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/stop'.`, 'INFO'); // Logs
        const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
        await Log('append', interaction.guild.id, `├─ephemeral: ${is_ephemeral}`, 'INFO'); // Logs
        await interaction.deferReply({ephemeral: is_ephemeral});

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
        const reason = interaction.options.getString('reason') || "No reason provided.";
        await Log('append', interaction.guild.id, `├─reason: ${reason}`, 'INFO'); // Logs

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

                await interaction.editReply({embeds: [error_permissions]});
                await Log('append', interaction.guild.id, `└─'${interaction.user.id}' did not have the required role to use '/stop'.`, 'WARN'); // Logs
                return;
            }
        }
        // -----END ROLE CHECK-----

        // Main
        let row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('stop_confirm_button')
                    .setLabel(`Stop`)
                    .setStyle('DANGER')
                    .setDisabled(false),
                new MessageButton()
                    .setCustomId('stop_cancel_button')
                    .setLabel('Cancel')
                    .setStyle('PRIMARY')
                    .setDisabled(false)
            );

        let isOverriddenText = "";

        const confirm_stop = new MessageEmbed()
            .setColor('YELLOW')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle('Confirm Stop')
            .setDescription("Are you sure you want to stop the bot? Only the bot owner is able to restart the bot. Please use this command as last resort.");

        interaction.editReply({embeds: [confirm_stop], components: [row]});
        await Log('append', interaction.guild.id, `├─Execution authotized. Waiting for the stop confirmation...`, 'INFO'); // Logs

        const filter = async (buttonInteraction) => {
            if(buttonInteraction.member.roles.highest.position > interaction.member.roles.highest.position) {
                isOverriddenText = ` (overriden by <@${buttonInteraction.user.id}>)`;
                await Log('append', interaction.guild.id, `├─'${buttonInteraction.user.tag}' overrode the decision.`, 'WARN'); // Logs
                return true;
            } else if(buttonInteraction.user.id = interaction.user.id) {
                return true;
            } else {
                await buttonInteraction.reply({content: "You cannot use this button.", ephemeral: true});
                await Log('append', interaction.guild.id, `├─'${buttonInteraction.user.tag}' did not have the permission to use this button.`, 'WARN'); // Logs
                return;
            }
        };

        const stop_button_collector = interaction.channel.createMessageComponentCollector({filter, time: 30000});
        stop_button_collector.on('collect', async buttonInteraction => {
            // Disabling buttons
            row.components[0]
                .setDisabled(true);
            row.components[1]
                .setDisabled(true);
            interaction.editReply({embeds: [confirm_stop], components: [row]});

            if(buttonInteraction.customId == 'stop_confirm_button') {
                buttonInteraction.deferUpdate();
                await stop_button_collector.stop()
                const _destroying_voice_connections = new MessageEmbed()
                    .setColor('YELLOW')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription("Destroying all active voice connections...");

                await interaction.editReply({embeds: [_destroying_voice_connections]});
                const stopping_bot = new MessageEmbed()
                    .setColor('FUCHSIA')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                    .setTitle('Stopping the bot')
                    .setDescription(`<@${interaction.user.id}> requested the bot to stop${isOverriddenText}.`)
                    .addField('Reason', `${reason}`, false)
                    .addField('Requested at', `${interaction.createdAt}`, false)
                    .setFooter({text: "The process will exit after this message."});

                await interaction.editReply({embeds: [stopping_bot]});
                await Log('append', interaction.guild.id, `├─'${interaction.user.tag}' authorized the stop request${isOverriddenText}.`, 'INFO'); // Logs
                await Log('append', interaction.guild.id, `└─Stopping the bot...`, 'FATAL'); // Logs
                await Sleep(100);
                await client.destroy(); // Destroying the Discord client
                await Sleep(250);
                process.exit(0); // Exiting here
            } else {
                buttonInteraction.deferUpdate();
                stop_button_collector.stop();

                const cancel_stop = new MessageEmbed()
                    .setColor('GREEN')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription(`<@${interaction.user.id}> aborted the stop request${isOverriddenText}.`);

                await interaction.editReply({embeds: [cancel_stop]});
                await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' aborted the stop request${isOverriddenText}.`, 'INFO'); // Logs
            }
        });
    }
};

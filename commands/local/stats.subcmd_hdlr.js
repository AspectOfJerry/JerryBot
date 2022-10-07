const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, ModalBuilder} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const Sleep = require('../../modules/sleep'); // delayInMilliseconds
const Log = require('../../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription("Shows statistics about the bot.")
        .addSubcommand(subcommand =>
            subcommand
                .setName('bot')
                .setDescription("Shows statistics about the bot.")
                .addBooleanOption((options) =>
                    options
                        .setName('ephemeral')
                        .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible by you or not. Defaults to false.")
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('system')
                .setDescription("Shows statistics about the system running the bot.")
                .addBooleanOption((options) =>
                    options
                        .setName('ephemeral')
                        .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible by you or not. Defaults to false.")
                        .setRequired(false))),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/stats [...]'.`, 'INFO'); // Logs

        // Declaring variables

        const subcommand = interaction.options.getSubcommand();

        // Main
        switch(subcommand) {
            case 'bot': {
                await Log('append', "subcmd_hdlr", `└─'${interaction.user.tag}' executed '/stats bot'.`, 'INFO'); // Logs

                // Declaring variables
                const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
                await Log('append', interaction.guild.id, `  ├─ephemeral: ${is_ephemeral}`, 'INFO'); // Logs

                // Calling the subcommand file
                await Log('append', "subcmd_hdlr", `└─Handing controls to subcommand file...`, 'WARN'); // Logs
                require('./stats_bot.subcmd')(client, interaction, is_ephemeral);
            }
                break;
            case 'system': {
                await Log('append', "subcmd_hdlr", `└─'${interaction.user.tag}' executed '/voice system'.`, 'INFO'); // Logs

                // Declaring variables
                const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
                await Log('append', interaction.guild.id, `  ├─ephemeral: ${is_ephemeral}`, 'INFO'); // Logs

                // Calling the subcommand file
                await Log('append', "subcmd_hdlr", `└─Handing controls to subcommand file...`, 'WARN'); // Logs
                require('./stats_system.subcmd')(client, interaction, is_ephemeral);
            }
                break;
            default:
                throw "Invalid subcommand.";
        }
    }
};
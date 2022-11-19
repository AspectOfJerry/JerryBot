const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const Sleep = require('../../../modules/sleep.js'); // delayInMilliseconds
const Log = require('../../../modules/logger.js'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    data: new SlashCommandBuilder()
        .setName('logs')
        .setDescription("Perform an action with the bot's log files.")
        .addSubcommand(subcommand =>
            subcommand
                .setName('append')
                .setDescription("Appends a string to the active log file.")
                .addStringOption((options) =>
                    options
                        .setName('string')
                        .setDescription("[REQUIRED] The string to append to the log file.")
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('read')
                .setDescription("Read a line from a log file starting with the latest line.")
                .addIntegerOption((options) =>
                    options
                        .setName('offset')
                        .setDescription("[OPTIONAL] Number of the line to read starting with the latest line. Defaults to 0 (latest line).")
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('get')
                .setDescription("Sends the latest log file to the current channel or in DMs.")
                .addIntegerOption((options) =>
                    options
                        .setName('offset')
                        .setDescription("[OPTIONAL] Number of days to skip starting with the current day going back. Defaults to 0 (today).")
                        .setRequired(false))
                .addBooleanOption((options) =>
                    options
                        .setName('todms')
                        .setDescription("[OPTIONAL] Whether you want the bot to send the log files in DMs or not. Defaults to false.")
                        .setRequired(false))),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/logs [...]'.`, 'INFO'); // Logs

        // Declaring variables
        const subcommand = interaction.options.getSubcommand();

        // Main
        switch(subcommand) {
            case 'append': {
                await Log('append', "subcmd_hdlr", `├─'${interaction.user.tag}' executed '/logs append'.`, 'INFO'); // Logs

                // Declaring variables
                const string = interaction.options.getString('string');
                await Log('append', interaction.guild.id, `  └─string: ${string}`, 'INFO'); // Logs

                const object = Log('append', interaction.guild.id, string, 'LOG', true);

                // Calling the subcommand file
                await Log('append', "subcmd_hdlr", `├─Handing controls to subcommand file...`, 'DEBUG'); // Logs
                require('./logs_append.subcmd')(client, interaction, string, object);
            }
                break;
            case 'read': {
                await Log('append', "subcmd_handler", `└─'${interaction.user.tag}' executed '/logs read'.`, 'INFO'); // Logs

                // Declaring variables
                const line_offset = interaction.options.getInteger('offset') || 0;
                await Log('append', interaction.guild.id, `  └─offset: ${line_offset}`, 'INFO'); // Logs

                // Calling the subcommand file
                await Log('append', "subcmd_hdlr", `├─Handing controls to subcommand file...`, 'DEBUG'); // Logs
                require('./logs_read.subcmd')(client, interaction, line_offset);
            }
                break;
            case 'get': {
                await Log('append', "subcmd_handler", `└─'${interaction.user.tag}' executed '/logs get'.`, 'INFO'); // Logs

                // Declaring variables
                const day_offset = interaction.options.getInteger('offset') || 0;
                await Log('append', interaction.guild.id, `  └─offset: ${day_offset}`, 'INFO'); // Logs

                // Calling the subcommand file
                await Log('append', "subcmd_hdlr", `├─Handing controls to subcommand file...`, 'DEBUG'); // Logs
                require('./logs_get.subcmd')(client, interaction, day_offset);
            }
                break;
            default:
                throw "Invalid subcommand.";
        }
    }
};

const fs = require('fs');
const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, ModalBuilder} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const Sleep = require('../../../modules/sleep'); // delayInMilliseconds
const Log = require('../../../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    data: new SlashCommandBuilder()
        .setName('311')
        .setDescription("Commands for 311.")
        .addSubcommand(subcommand =>
            subcommand
                .setName('schedule')
                .setDescription("Get's today's schedule or select another day."))
        .addSubcommand(subcommand =>
            subcommand
                .setName('weather')
                .setDescription("Get today's weather.")),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/311 [...]'.`, 'INFO'); // Logs

        // Declaring variables
        const subcommand = interaction.options.getSubcommand();

        // Main
        switch(subcommand) {
            case 'schedule': {
                await Log('append', "subcmd_hdlr", `└─'${interaction.user.tag}' executed '/311 schedule'.`, 'INFO'); // Logs

                // Declaring variables

                // Calling the subcommand file
                await Log('append', "subcmd_hdlr", `└─Handing controls to subcommand file...`, 'WARN'); // Logs
                require('./311_schedule.subcmd')(client, interaction);
            }
                break;
            case 'weather': {
                await Log('append', "subcmd_hdlr", `└─'${interaction.user.tag}' executed '/311 weather'.`, 'INFO'); // Logs

                // Declaring variables

                // Calling the subcommand file
                await Log('append', "subcmd_hdlr", `└─Handing controls to subcommand file...`, 'WARN'); // Logs
                require('./311_weather.subcmd')(client, interaction);
            }
                break;
            default:
                throw "Invalid subcommand.";
        }
    }
};

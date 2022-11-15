const fs = require('fs');
const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const Sleep = require('../../../modules/sleep.js'); // delayInMilliseconds
const Log = require('../../../modules/logger.js'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dev')
        .setDescription("Developer commands")
        .addSubcommand(subcommand =>
            subcommand
                .setName('stop')
                .setDescription("Pauses the Heartbeat monitor and stops the bot."))
    // .addSubcommand(subcommand =>
    //     subcommand
    //         .setName('SUBCMD_NAME')
    //         .setDescription("SUBCMD_DESCRIPTION"))
    ,
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/dev [...]'.`, 'INFO'); // Logs

        // Declaring variables
        const subcommand = interaction.options.getSubcommand();

        // Main
        switch(subcommand) {
            case 'stop': {
                await Log('append', "subcmd_hdlr", `└─'${interaction.user.tag}' executed '/dev stop'.`, 'INFO'); // Logs

                // Declaring variables

                // Calling the subcommand file
                await Log('append', "subcmd_hdlr", `└─Handing controls to subcommand file...`, 'DEBUG'); // Logs
                require('./dev_stop.subcmd')(client, interaction);
            }
                break;
            case 'SUBCMD_NAME': {
                await Log('append', "subcmd_hdlr", `└─'${interaction.user.tag}' executed '/dev SUBCMD_NAME'.`, 'INFO'); // Logs

                // Declaring variables

                // Calling the subcommand file
                await Log('append', "subcmd_hdlr", `└─Handing controls to subcommand file...`, 'DEBUG'); // Logs
                require('./DIRECTORY_subcommands')(client, interaction);
            }
                break;
            default:
                throw "Invalid subcommand.";
        }
    }
};

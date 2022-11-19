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
                .setDescription("Pauses the Heartbeat monitor and stops the bot.")),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/dev [...]'.`, 'INFO'); // Logs

        // Declaring variables
        const subcommand = interaction.options.getSubcommand();

        // Checks
        // Whitelist
        const whitelist_ids = ['611633988515266562'];

        if(!whitelist_ids.includes(interaction.user.id)) {
            const error_whitelist = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                .setFooter({text: "You must be whitelisted to use this command."});

            await interaction.reply({embeds: [error_whitelist]});
            await Log('append', interaction.guild.id, `└─'${interaction.user.id}' was not whitelisted to perform '/dev [...]' subcommands. [error_permissions]`, 'WARN'); // Logs
            return;
        }

        // Main
        switch(subcommand) {
            case 'stop': {
                await Log('append', "subcmd_hdlr", `├─'${interaction.user.tag}' executed '/dev stop'.`, 'INFO'); // Logs

                // Prep

                // Calling the subcommand file
                await Log('append', "subcmd_hdlr", `├─Handing controls to subcommand file...`, 'DEBUG'); // Logs
                require('./dev_stop.subcmd')(client, interaction);
            }
                break;
            case 'SUBCMD_NAME': {
                await Log('append', "subcmd_hdlr", `├─'${interaction.user.tag}' executed '/dev SUBCMD_NAME'.`, 'INFO'); // Logs

                // Prep

                // Calling the subcommand file
                await Log('append', "subcmd_hdlr", `├─Handing controls to subcommand file...`, 'DEBUG'); // Logs
                require('./DIRECTORY_subcommands')(client, interaction);
            }
                break;
            default:
                throw "Invalid subcommand.";
        }
    }
};

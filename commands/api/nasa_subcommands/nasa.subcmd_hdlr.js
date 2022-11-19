const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const Sleep = require('../../../modules/sleep.js'); // delayInMilliseconds
const Log = require('../../../modules/logger.js'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nasa')
        .setDescription("Executes a command related with the NASA Open APIs.")
        .addSubcommand(subcommand =>
            subcommand
                .setName('api')
                .setDescription("Makes an API call to NASA's APOD API."))
        .addSubcommand(subcommand =>
            subcommand
                .setName('apod')
                .setDescription("Returns the Astronomy Picture of the Day (APOD) from NASA.")),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/nasa [...]'.`, 'INFO'); // Logs

        // Declaring variables
        const subcommand = interaction.options.getSubcommand();

        // Checks

        // Main
        switch(subcommand) {
            case 'api': {
                await Log('append', "subcmd_hdlr", `├─'${interaction.user.tag}' executed '/nasa apod'.`, 'INFO'); // Logs

                // Prep

                // Calling the subcommand file
                await Log('append', "subcmd_hdlr", `├─Handing controls to subcommand file...`, 'DEBUG'); // Logs
                interaction.reply("This command is currently unavailable.")
                return;
                require('./nasa_api.subcmd.js')(client, interaction);

            }
                break;
            case 'apod': {
                await Log('append', "subcmd_hdlr", `├─'${interaction.user.tag}' executed '/nasa apod'.`, 'INFO'); // Logs

                // Prep

                // Calling the subcommand file
                await Log('append', "subcmd_hdlr", `├─Handing controls to subcommand file...`, 'DEBUG'); // Logs
                require('./nasa_apod.subcmd.js')(client, interaction);
            }
                break;
            default:
                await Log('append', interaction.guild.id, "Throwing because of an invalid subcommand.", 'ERROR'); // Logs
                throw "Invalid subcommand.";
        }
    }
}
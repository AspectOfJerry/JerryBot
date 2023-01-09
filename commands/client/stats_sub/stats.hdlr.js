const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const {Log, Sleep} = require('../../../modules/JerryUtils');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription("Shows statistics about the bot.")
        .addSubcommand(subcommand =>
            subcommand
                .setName('bot')
                .setDescription("Shows statistics about the bot."))
        .addSubcommand(subcommand =>
            subcommand
                .setName('system')
                .setDescription("Shows statistics about the system running the bot.")),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/stats [...]'.`, 'INFO');

        // Declaring variables
        const subcommand = interaction.options.getSubcommand();

        // Main
        switch(subcommand) {
            case 'bot': {
                await Log('append', "hdlr", `├─'${interaction.user.tag}' executed '/stats bot'.`, 'INFO');

                // Declaring variables

                // Calling the subcommand file
                await Log('append', "hdlr", `├─Handing controls to subcommand file...`, 'DEBUG');
                require('./stats_bot.subcmd')(client, interaction);
            }
                break;
            case 'system': {
                await Log('append', "hdlr", `├─'${interaction.user.tag}' executed '/stats system'.`, 'INFO');

                // Declaring variables

                // Calling the subcommand file
                await Log('append', "hdlr", `├─Handing controls to subcommand file...`, 'DEBUG');
                require('./stats_system.subcmd')(client, interaction);
            }
                break;
            default:
                throw "Invalid subcommand.";
        }
    }
};

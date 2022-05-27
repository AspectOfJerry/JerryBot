const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const Sleep = require('../../../modules/sleep'); //delayInMilliseconds;
const Log = require('../../../modules/logger'); //DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─;

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
                        .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('system')
                .setDescription("Shows statistics about the system running the bot.")
                .addBooleanOption((options) =>
                    options
                        .setName('ephemeral')
                        .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                        .setRequired(false))),
    async execute(client, interaction) {
        //Declaring variables
        const is_ephemeral = await interaction.options.getBoolean('ephemeral') || false;

        //Code
        if(interaction.options.getSubcommand() == 'bot') {
            require('./stats_bot.subcommand')(client, interaction, is_ephemeral);
        } else if(interaction.options.getSubcommand() == 'system') {
            require('./stats_system.subcommand')(client, interaction, is_ephemeral);
        } else {
            throw "Invalid subcommand. `stats.js` 36:11";
        }
    }
}

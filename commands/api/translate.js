const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const translate = require('google-translate-api');

const Sleep = require('../../modules/sleep'); //delayInMilliseconds;
const Log = require('../../modules/logger'); //DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription("Translator.")
        .addStringOption((options) =>
            options
                .setName('string')
                .setDescription("[REQUIRED] The string to translate.")
                .setRequired(true))
        .addStringOption((options) =>
            options
                .setName('to')
                .setDescription("[REQUIRED] The language to translate the string to.")
                .addChoice("English (English)", 'en')
                .addChoice("Français (French)", 'fr')
                .setRequired(true))
        .addStringOption((options) =>
            options
                .setName('from')
                .setDescription("[OPTIONAL]")
                .setRequired(false))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                .setRequired(false)),
    async execute(client, interaction) {
        //Command information
        const REQUIRED_ROLE = "ROLE";

        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
        await Log(interaction.guild.id, `├─ephemeral: ${is_ephemeral}`, 'INFO');

        //Checks

        //Code

    }
}

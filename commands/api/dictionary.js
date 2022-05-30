//https://api.dictionaryapi.dev/api/v2/entries/en/<word>
const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const fetch = require('node-fetch');

const Sleep = require('../../modules/sleep'); //delayInMilliseconds;
const Log = require('../../modules/logger'); //DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dictionary')
        .setDescription("Get the definition of a word.")
        .addStringOption((options) =>
            options
                .setName('string')
                .setDescription("[REQUIRED] the word to define.")
                .setRequired(true))
        .addStringOption((options) =>
            options
                .setName('language')
                .setDescription("[OPTIONAL] the language to define the word in. Defaults to English.")
                .addChoice("English (English)", 'en')
                .addChoice("Français (French)", 'fr')
                .addChoice("Español (Spanish)", 'es')
                .setRequired(false))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                .setRequired(false)),
    async execute(client, interaction) {
        //Command information
        const REQUIRED_ROLE = "everyone";

        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
        await Log(interaction.guild.id, `├─ephemeral: ${is_ephemeral}`, 'INFO');

        const word = interaction.options.getString('string');
        const language = interaction.options.getString('language') || 'en';
        //Checks

        //Code
        await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/hello`)
            .then(res => {
                res => res.json()
            }).then(res => {
                console.log(res)
            })

        await interaction.reply({content: "This command is currently unavailable."});
    }
}

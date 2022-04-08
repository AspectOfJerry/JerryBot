const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const Docs = require('discord.js-docs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('documentation')
        .setDescription("Discord.js documentation search tool.")
        .addStringOption((options) =>
            options
                .setName('search')
                .setDescription("The search term to search for.")
                .setRequired(true))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("Whether you want the bot's messages to only be visible to yourself.")
                .setRequired(false)),
    async execute(client, interaction) {
        //Command information
        const REQUIRED_ROLE = "eveyrone";

        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral');

        //Checks

        //Code
        interaction.reply({content: "This command is currently unavailable.", ephemeral: is_ephemeral});
    }
}

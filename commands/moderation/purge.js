const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription("Purges a certain amount of messages in this channel.")
        .addIntegerOption((options) =>
            options
                .setName('amount')
                .setDescription("The amount of messages to delete.")
                .setRequired(true))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("Whether you want the bot's messages to only be visible to yourself.")
                .setRequired(false)),
    async execute(client, interaction) {
        //Command information
        const REQUIRED_ROLE = "PL3";

        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral');

        const amount = interaction.options.getInteger('amount');
        const channel = interaction.channel;

        //Checks

        //Code

    }
}

const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('restart')
        .setDescription("Restarts the bot.")
        .addStringOption((options) =>
            options
                .setName('reason')
                .setDescription("The reason for the restart request.")
                .setRequired(false))
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

        //Checks

        //Code
        interaction.reply({content: "This command is currently unavailable.", ephemeral: is_ephemeral});
    }
}

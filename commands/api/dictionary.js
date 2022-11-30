// https:// api.dictionaryapi.dev/api/v2/entries/en/<word>
const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dictionary')
        .setDescription("[DISCONTINUED] Get the definition of a word."),
    async execute(client, interaction) {
        // Set minimum execution role

        // Declaring variables

        // Checks

        // Main
        await interaction.reply({content: "This command is discontinued and will be removed in the future."});
        return 0;
    }
};

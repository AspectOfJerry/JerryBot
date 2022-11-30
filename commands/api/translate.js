const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription("[DISCONTINUED] Word translator"),
    async execute(client, interaction) {
        // Declaring variables

        // Checks

        // Main
        await interaction.reply({content: "This command is discontinued and will be removed in the future."});
        return 0;
    }
};

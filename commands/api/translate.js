const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, ModalBuilder} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const Sleep = require('../../modules/sleep'); // delayInMilliseconds
const Log = require('../../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription("[DISCONTINUED] Word translator"),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/translate'.`, 'INFO'); // Logs

        // Declaring variables

        // Checks

        // Main
        await interaction.reply({content: "This command is discontinued and will be removed in the future."});
        await Log('append', interaction.guild.id, "└─This command is discontinued and will be removed in the future.", 'WARN'); // Logs
        return;
    }
};

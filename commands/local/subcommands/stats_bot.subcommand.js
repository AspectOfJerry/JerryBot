const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const Sleep = require('../../../modules/sleep'); //delayInMilliseconds;
const Log = require('../../../modules/logger'); //DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─;

module.exports = async function (client, interaction) {
    //Command information
    const REQUIRED_ROLE = "everyone";

    //Declaring variables
    const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
    await Log(interaction.guild.id, `├─ephemeral: ${is_ephemeral}`, 'INFO');

    //Checks

    //Code
    console.log("bot")
}

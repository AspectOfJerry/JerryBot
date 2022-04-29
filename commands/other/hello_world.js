const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const Sleep = require('../../modules/sleep');
const Log = require('../../modules/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hello_world')
        .setDescription("Replies with 'Hello World!'")
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                .setRequired(false)),
    async execute(client, interaction) {
        await Log(`'${interaction.user.tag}' executed /hello_world`, 'INFO');
        //Command information
        const REQUIRED_ROLE = "everyone";

        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
        await Log(`├─ephemeral: ${is_ephemeral}`, 'DEBUG'); //Logs

        //Checks

        //Code
        interaction.channel.sendTyping();
        await Sleep(1000)
        interaction.reply({content: "Hello World!", ephemeral: is_ephemeral});
    }
}

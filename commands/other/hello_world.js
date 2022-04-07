const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("hello_world")
        .setDescription("Replies with 'Hello World!'")
    ,
    async execute(client, interaction) {
        //Command information
        const REQUIRED_ROLE = "everyone";

        //Declaring variables

        //Checks

        //Code
        interaction.reply({content: "Hello World!"})
    }
}

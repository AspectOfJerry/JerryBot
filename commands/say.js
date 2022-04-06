const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("say")
        .setDescription("Sends a message to the current channel.")
        .addStringOption((options) =>
            options
                .setName("string")
                .setDescription("The message to send.")
                .setRequired(true)
        ),
    async execute(client, interaction) {
        //Command information
        const REQUIRED_ROLE = "everyone";
        
        //Declaring variables
        let message = interaction.options.getString("string")

        //Checks

        //Code
        interaction.reply({content: `Input message: ${message}`, ephemeral: true})
        interaction.channel.send({content: `${message}`, ephemeral: false})
    }
}

const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription("Test command")
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("Whether you want the bot's messages to only be visible to yourself.")
                .setRequired(false))
    ,
    async execute(client, interaction) {
        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral');

        let target = interaction.options.getUser('user') || interaction.member;
        let memberTarget = interaction.guild.members.cache.get(target.id);

        //Checks
        console.log(interaction.options.getUser('user'))

        //Code

    }
}

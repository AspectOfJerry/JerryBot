const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
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

        //let target = interaction.options.getUser('user') || interaction.member;
        //let memberTarget = interaction.guild.members.cache.get(target.id);

        //Checks

        //Code
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('button1')
                .setLabel('button')
                .setStyle('PRIMARY')
                .setDisabled(false)
        )

        interaction.reply({content: "Hello!", components: [row], ephemeral: is_ephemeral});
    }
}

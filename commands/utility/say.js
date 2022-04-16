const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription("[DEPRECATED] Please use '/send' instead. Sends a message to the current channel.")
        .addStringOption((options) =>
            options
                .setName('message')
                .setDescription("The message to send.")
                .setRequired(true))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("Whether you want the bot's messages to only be visible to yourself.")
                .setRequired(false)),
    async execute(client, interaction) {
        //Command information
        const REQUIRED_ROLE = "everyone";

        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral');

        let message = interaction.options.getString("string");

        //Checks

        //Code
        const deprecation_warning = new MessageEmbed()
            .setColor('#ff2020')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle('DeprecationWarning')
            .setDescription("This command is deprecated. Please use the `/send` command instead.")

        interaction.reply({emebds: [deprecation_warning], ephemeral: is_ephemeral});
    }
}

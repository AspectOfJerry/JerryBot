const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('send')
        .setDescription("Sends a message in a channel")
        .addStringOption((options) =>
            options
                .setName('message')
                .setDescription("The message to send.")
                .setRequired(true))
        .addChannelOption((options) =>
            options
                .setName('channel')
                .setDescription("The channel to send the message to. Defaults to the current channel.")
                .setRequired(false))
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

        const channel = interaction.options.getChannel('channel') || interaction.channel;
        const message = interaction.options.getString('message');

        //Checks
        if(!channel.isText()) {
            const error_require_text_based_channel = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("Error")
                .setURL("https://discord.js.org/#/docs/discord.js/stable/typedef/TextBasedChannels")
                .setDescription("You need to mention a text-based channel.")

            interaction.reply({embeds: [error_require_text_based_channel]})
            return;
        }

        //Code
        interaction.reply({content: "This command is currently unavailable.", ephemeral: is_ephemeral});
    }
}

const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const Sleep = require('../../modules/sleep');
const Log = require('../../modules/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('send')
        .setDescription("Sends a message in a channel")
        .addStringOption((options) =>
            options
                .setName('message')
                .setDescription("[REQUIRED] The message to send.")
                .setRequired(true))
        .addChannelOption((options) =>
            options
                .setName('channel')
                .setDescription("[OPTIONAL] The channel to send the message to. Defaults to the current channel.")
                .setRequired(false))
        .addBooleanOption((options) =>
            options
                .setName('type')
                .setDescription("[OPTIONAL] Whether you want the bot to type for 1 seconds before the message is sent.")
                .setRequired(false))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to true.")
                .setRequired(false)),
    async execute(client, interaction) {
        //Command information
        const REQUIRED_ROLE = "everyone";

        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral');

        const channel = interaction.options.getChannel('channel') || interaction.channel;
        const message = interaction.options.getString('message') || true;
        const isTyping = interaction.options.getBoolean('doTyping') || false;

        //Checks
        if(!channel.isText()) {
            const error_require_text_based_channel = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("Error")
                .setURL("https://discord.js.org/#/docs/discord.js/stable/typedef/TextBasedChannels")
                .setDescription("You need to mention a text-based channel.")

            interaction.reply({embeds: [error_require_text_based_channel], ephemeral: is_ephemeral});
            return;
        }

        //Code
        switch(isTyping) {
            case true:
                await interaction.reply({content: `Sending "${message}" to #${channel} with typing...`, ephemeral: is_ephemeral})

                await channel.sendTyping()
                await Sleep(1000)

                await channel.send({content: `${message}`});
                break;  //
            case false:
                await interaction.reply({content: `Sending "${message}" to #${channel} without typing...`, ephemeral: is_ephemeral})

                await channel.send({content: `${message}`});
                break;  //
        }
    }
}

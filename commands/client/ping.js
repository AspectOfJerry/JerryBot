const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Displays the client latency and the WebSocket server latency.")
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                .setRequired(false)),
    async execute(client, interaction) {
        //Command information
        const REQUIRED_ROLE = "everyone";

        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;

        //Code
        const ping = new MessageEmbed()
            .setColor('#ffff00')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription('ping...')

        interaction.channel.send({embeds: [ping]}).then(pingMessage => {
            const pong = new MessageEmbed()
                .setColor('GREEN')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("Pong!")
                .addField(`Bot latency`, `~${pingMessage.createdTimestamp - interaction.createdTimestamp}ms`, true)
                .addField(`DiscordJS API latency`, `~${client.ws.ping}ms`, true)

            pingMessage.delete().catch(console.error)
            interaction.reply({embeds: [pong], ephemeral: is_ephemeral})
        })
    }
}

const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const Sleep = require('../../modules/sleep');
const Log = require('../../modules/logger');

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
        await Log(`'${interaction.user.tag}' executed /ping`, 'DEBUG')
        //Command information
        await Log(`'${interaction.user.tag}' executed /ping`, 'INFO');
        const REQUIRED_ROLE = "everyone";

        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
        await Log(`├─ephemeral: ${is_ephemeral}`, 'DEBUG'); //Logs

        let clientLatency = null;
        let WebSocketLatency = null;

        //Code
        const ping = new MessageEmbed()
            .setColor('#ffff00')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription('ping...')

        interaction.channel.send({embeds: [ping]}).then(pingMessage => {
            clientLatency = pingMessage.createdTimestamp - interaction.createdTimestamp;
            WebSocketLatency = client.ws.ping;

            const pong = new MessageEmbed()
                .setColor('GREEN')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("Pong!")
                .addField(`Bot latency`, `~${clientLatency}ms`, true)
                .addField(`DiscordJS API latency`, `~${WebSocketLatency}ms`, true)

            pingMessage.delete().catch(console.error)
            interaction.reply({embeds: [pong], ephemeral: is_ephemeral})
        })
        await Log(`└─Client latency: ${clientLatency}; WebSocket latency: ${WebSocketLatency};`)
    }
}

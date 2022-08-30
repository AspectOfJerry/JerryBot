const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const Sleep = require('../../modules/sleep'); // delayInMilliseconds
const Log = require('../../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

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
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/ping'.`, 'INFO'); // Logs
        // Set minimum execution role
        switch(interaction.guild.id) {
            case process.env.DISCORD_JERRY_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = null;
                break;
            case process.env.DISCORD_GOLDFISH_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = null;
                break;
            case process.env.DISCORD_CRA_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = null;
                break;
            case process.env.DISCORD_311_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = null;
                break;
            default:
                await Log('append', interaction.guild.id, "Throwing because of bad permission configuration.", 'ERROR'); // Logs
                throw `Error: Bad permission configuration.`;
        }

        // Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
        await Log('append', interaction.guild.id, `├─ephemeral: ${is_ephemeral}`, 'INFO'); // Logs

        let clientLatency = null;
        let WebSocketLatency = null;
        // Checks

        // Main
        const ping = new MessageEmbed()
            .setColor('YELLOW')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription('ping...');

        interaction.channel.send({embeds: [ping]}).then(async pingMessage => {
            clientLatency = pingMessage.createdTimestamp - interaction.createdTimestamp;
            WebSocketLatency = client.ws.ping;

            const pong = new MessageEmbed()
                .setColor('GREEN')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("Pong!")
                .addField(`Bot latency`, `~${clientLatency}ms`, true)
                .addField(`DiscordJS API latency`, `~${WebSocketLatency}ms`, true);

            pingMessage.delete().catch(console.error);
            interaction.reply({embeds: [pong], ephemeral: is_ephemeral});
            await Log('append', interaction.guild.id, `└─Client latency: ${clientLatency}ms; WebSocket latency: ${WebSocketLatency}ms;`, 'INFO'); // Logs
        });
    }
}

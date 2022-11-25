const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const Sleep = require('../../modules/sleep.js'); // delayInMilliseconds
const Log = require('../../modules/logger.js'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Displays the client latency and the WebSocket server latency."),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/ping'.`, 'INFO'); // Logs
        // await interaction.deferReply();

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
                await Log('append', interaction.guild.id, "└─Throwing because of bad permission configuration.", 'ERROR'); // Logs
                throw `Error: Bad permission configuration.`;
        }

        // Declaring variables
        let clientLatency = null;
        let webSocketLatency = null;

        // Checks
        // -----BEGIN ROLE CHECK-----
        if(MINIMUM_EXECUTION_ROLE !== null) {
            if(!interaction.member.roles.cache.find(role => role.name === MINIMUM_EXECUTION_ROLE)) {
                const error_permissions = new MessageEmbed()
                    .setColor('RED')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                    .setTitle('PermissionError')
                    .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                    .setFooter({text: `You need at least the '${MINIMUM_EXECUTION_ROLE}' role to use this command.`});

                await interaction.reply({embeds: [error_permissions]});
                await Log('append', interaction.guild.id, `└─'${interaction.user.id}' did not have the required role to perform '/ping'. [error_permissions]`, 'WARN'); // Logs
                return 10;
            }
        } // -----END ROLE CHECK-----

        // Main
        const ping = new MessageEmbed()
            .setDescription('ping...');

        interaction.channel.send({embeds: [ping]}).then(pingMessage => {
            clientLatency = pingMessage.createdTimestamp - interaction.createdTimestamp;
            webSocketLatency = client.ws.ping;

            const pong = new MessageEmbed()
                .setColor('GREEN')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("Pong!")
                .addFields(
                    {name: 'Bot latency', value: `~${clientLatency}`, inline: true},
                    {name: 'DiscordJS latency', value: `~${webSocketLatency}`, inline: true}
                );

            interaction.reply({embeds: [pong]});
            pingMessage.delete().catch(console.error);
            Log('append', interaction.guild.id, `└─Client latency: ${clientLatency}ms; WebSocket latency: ${WebSocketLatency}ms;`, 'INFO'); // Logs
        });
    }
};

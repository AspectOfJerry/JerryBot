const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");

const {PermissionCheck, Log, Sleep} = require("../../modules/JerryUtils");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Displays the client latency and the WebSocket server latency."),
    async execute(client, interaction) {
        if(await PermissionCheck(interaction) === false) {
            return;
        }

        // Declaring variables
        let clientLatency = null;
        let webSocketLatency = null;

        // Checks

        // Main
        const ping = new MessageEmbed()
            .setDescription('ping...');

        interaction.channel.send({embeds: [ping]}).then(pingMessage => {
            webSocketLatency = client.ws.ping;
            clientLatency = pingMessage.createdTimestamp - interaction.createdTimestamp;

            const pong = new MessageEmbed()
                .setColor("GREEN")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("Pong!")
                .addFields(
                    {name: 'Bot latency', value: `~${clientLatency}`, inline: true},
                    {name: 'DiscordJS latency', value: `~${webSocketLatency}`, inline: true},
                    {name: "WebSocket status", value: `code ${client.ws.status}`, inline: false}
                );

            interaction.reply({embeds: [pong]});
            pingMessage.delete().catch(console.error);
            Log('append', interaction.guild.id, `└─Client latency: ${clientLatency}ms; WebSocket latency: ${webSocketLatency}ms;`, "INFO");
        });
    }
};

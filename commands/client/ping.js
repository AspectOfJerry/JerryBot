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
        interaction.channel.send({content: "ping..."}).then(pingMessage => {
            pingMessage.delete().catch(console.error);

            webSocketLatency = client.ws.ping;
            clientLatency = pingMessage.createdTimestamp - interaction.createdTimestamp;

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setLabel("Learn how the bot connects to Discord")
                        .setEmoji("📘")
                        .setStyle("LINK")
                        .setURL("https://discord.com/developers/docs/topics/gateway#connections")
                );

            const pong = new MessageEmbed()
                .setColor("GREEN")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("Pong!")
                .addFields(
                    {name: "Bot latency", value: `~${clientLatency}ms`, inline: true},
                    {name: "Discord API latency", value: `~${webSocketLatency}ms`, inline: true},
                    {name: "WebSocket status", value: `code ${client.ws.status}`, inline: false}
                );

            interaction.reply({embeds: [pong], components: [row]});
            Log("append", interaction.guild.id, `└─Client latency: ${clientLatency}ms; WebSocket latency: ${webSocketLatency}ms;`, "INFO");
        });
    }
};

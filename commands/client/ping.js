import {MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";

import {logger, permissionCheck} from "../../utils/jerryUtils.js";


export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Displays the client latency and the WebSocket server latency."),
    async execute(client, interaction) {
        if(await permissionCheck(interaction, 0) === false) {
            return;
        }

        // Declaring variables
        let clientLatency = null;
        let webSocketLatency = null;

        // Checks

        // Main
        interaction.channel.send({content: "ping..."})
            .then((pingMessage) => {
                pingMessage.delete().catch(console.error);

                webSocketLatency = client.ws.ping;
                clientLatency = pingMessage.createdTimestamp - interaction.createdTimestamp;

                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setLabel("Learn how bots connect to Discord")
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
                logger.append("notice", "STDOUT", `'/ping' > Client latency: ${clientLatency}ms, webSocket latency: ${webSocketLatency}ms`);
            });
    }
};

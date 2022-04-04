const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Displays the client latency and the WebSocket server latency."),

    async execute(client, interaction) {
        //Command information

        //Code
        let pong;
        const ping = new MessageEmbed()
            .setColor('#ffff00')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription('sending ping...')

        //Code
        interaction.channel.send({embeds: [ping]}).then(pingMessage => {
            pong = new MessageEmbed()
                .setColor('#80e0e0')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("Pong!")
                .addField(`Bot latency`, `~${pingMessage.createdTimestamp - interaction.createdTimestamp}ms`, true)
                .addField(`DiscordJS API latency`, `~${client.ws.ping}ms`, true)

            pingMessage.delete().catch(console.error)
            interaction.reply({embeds: [pong], ephemeral: false})
        })
    }
}
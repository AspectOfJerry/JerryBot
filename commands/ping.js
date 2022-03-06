module.exports = {
    callback: (message, Discord, client, ...args) => {
        //Help command
        if(args[0] == '?') {
            const help_command = new Discord.MessageEmbed()
                .setColor('0000ff')
                .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('%ping command help')
                .setDescription("This command displays the bot's latency and the websocket server's latency in milliseconds.")
                .addField(`Usage`, "`%ping`", true)
                .addField(`Aliases`, "`latency`", true)
                .addField("Stats for nerds", "Lines: `36`; File size: `~1.65` KB", false)

            message.channel.send({embeds: [help_command]})
            return;
        }
        //Declaring variables
        let pong
        const ping = new Discord.MessageEmbed()
            .setColor('#ffff00')
            .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription('sending ping...');
        //Code
        message.channel.send({embeds: [ping]}).then(resultMessage => {
            pong = new Discord.MessageEmbed()
                .setColor('#7dc8cd')
                .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
                .addField(`Bot latency`, `~${resultMessage.createdTimestamp - message.createdTimestamp}ms`, true)
                .addField(`DiscordJS API latency`, `~${client.ws.ping}ms`, true);

            message.channel.bulkDelete(1).catch(console.error)
            message.channel.send({embeds: [pong]})
        })
    }
}

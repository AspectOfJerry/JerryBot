module.exports = {
    callback: (message, Discord, client, ...args) => {
        //Command information
        const COMMAND_NAME = "ping";
        const ROLE_REQUIRED = "everyone";
        const EXCPECTED_ARGUMENTS = 0;
        const OPTIONAL_ARGUMENTS = 0;

        //Help command
        if(args[0] == '?') {
            const help_command = new Discord.MessageEmbed()
                .setColor('#0000ff')
                .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle(`%${COMMAND_NAME} command help (${ROLE_REQUIRED})`)
                .setDescription("This command displays the client's latency as well as the websocket server's latency in milliseconds.")
                .addField(`Usage`, "`" + `%${COMMAND_NAME}` + "`", false)
                .addField(`Excpected arguments`, `${EXCPECTED_ARGUMENTS}`, true)
                .addField(`Optional arguments`, `${OPTIONAL_ARGUMENTS}`, true)
                .addField('Related commands', "`info`", false)
                .setFooter({text: "./commands/ping.js; Lines: 46; File size: ~2.07 KB"})

            message.channel.send({embeds: [help_command]})
            return;
        }

        //Declaring variables
        let pong;
        const ping = new Discord.MessageEmbed()
            .setColor('#ffff00')
            .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription('sending ping...');

        //Code
        message.channel.send({embeds: [ping]}).then(pingMessage => {
            pong = new Discord.MessageEmbed()
                .setColor('#80e0e0')
                .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 32})}`)
                .addField(`Bot latency`, `~${pingMessage.createdTimestamp - message.createdTimestamp}ms`, true)
                .addField(`DiscordJS API latency`, `~${client.ws.ping}ms`, true);

            message.channel.bulkDelete(1).catch(console.error)
            message.channel.send({embeds: [pong]})
        })
    }
}
//Tomassy#1435 best!
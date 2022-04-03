module.exports = {
    callback: (message, Discord, client, ...args) => {
        //Command information
        const COMMAND_NAME = "ping";
        const REQUIRED_ROLE = "everyone";
        const EXCPECTED_ARGUMENTS = 0;
        const OPTIONAL_ARGUMENTS = 0;

        //Help command
        if(args[0] == '?') {
            const help_command = new Discord.MessageEmbed()
                .setColor('#2020ff')
                .setAuthor({name: "dir: ./commands/ping.js; Lines: 51; File size: ~2.4 KB"})
                .setTitle(`%${COMMAND_NAME} command help (${REQUIRED_ROLE})`)
                .setDescription("This command displays the client's latency as well as the websocket server's latency in milliseconds.")
                .addField(`Usage`, "`" + `%${COMMAND_NAME}` + "`", false)
                .addField(`Excpected arguments`, `${EXCPECTED_ARGUMENTS}`, true)
                .addField(`Optional arguments`, `${OPTIONAL_ARGUMENTS}`, true)
                .addField('Related commands', "`info`", false)
                .setFooter({text: `${message.author.tag} • ${COMMAND_NAME}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                .setTimestamp();

            message.channel.send({embeds: [help_command]})
            return;
        }

        //Declaring variables
        let pong;
        const ping = new Discord.MessageEmbed()
            .setColor('#ffff00')
            .setAuthor({name: "Waiting"})
            .setDescription('sending ping...')
            .setFooter({text: `${message.author.tag} • ${COMMAND_NAME}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
            .setTimestamp();

        //Code
        message.channel.send({embeds: [ping]}).then(pingMessage => {
            pong = new Discord.MessageEmbed()
                .setColor('#80e0e0')
                .setTitle("Pong!")
                .addField(`Bot latency`, `~${pingMessage.createdTimestamp - message.createdTimestamp}ms`, true)
                .addField(`DiscordJS API latency`, `~${client.ws.ping}ms`, true)
                .setFooter({text: `${message.author.tag} • ${COMMAND_NAME}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                .setTimestamp();

            message.channel.bulkDelete(1).catch(console.error)
            message.channel.send({embeds: [pong]})
        })
    }
}
//Tomassy#1435 best!
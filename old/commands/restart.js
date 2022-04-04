module.exports = {
    callback: (message, Discord, client, ...args) => {
        //Command information
        const COMMAND_NAME = "restart";
        const REQUIRED_ROLE = "PL3";
        const EXCPECTED_ARGUMENTS = 0;
        const OPTIONAL_ARGUMENTS = 0;

        //Help command
        if(args[0] == '?') {
            const help_command = new Discord.MessageEmbed()
                .setColor('#4040ff')
                .setAuthor({name: "dir: ./commands/restart.js; Lines: [INT]; File size: ~[INT] KB"})
                .setTitle(`%${COMMAND_NAME} command help (${REQUIRED_ROLE})`)
                .setDescription('This command destroys the client and reconnects it.')
                .addField(`Usage`, "`" + `%${COMMAND_NAME}` + "`", false)
                .addField(`Aliases`, "`rs`", false)
                .addField(`Excpected arguments`, `${EXCPECTED_ARGUMENTS}`, true)
                .addField(`Optional arguments`, `${OPTIONAL_ARGUMENTS}`, true)
                .addField(`Notes`, "This command does not restart the NodeJS process. Just the bot.", false)
                .addField('Related commands', "`stop`", false)
                .setFooter({text: `${message.author.tag} • ${COMMAND_NAME}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                .setTimestamp();

            message.channel.send({embeds: [help_command]})
            return;
        }

        //Declaring variables

        //Declaring functions

        //Checks
        if(!message.member.roles.cache.find(role => role.name == REQUIRED_ROLE)) {
            const error_permissions = new Discord.MessageEmbed()
                .setColor('#ff2020')
                .setAuthor({name: "PermissionError"})
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                .setFooter({text: `${message.author.tag} • Use '%${COMMAND_NAME} ?' for help`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                .setTimestamp();

            message.channel.send({embeds: [error_permissions]})
            return;
        }

        //Code

    }
}

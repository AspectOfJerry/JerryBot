module.exports = {
    callback: (message, Discord, client, ...args) => {
        //Command information
        const COMMAND_NAME = "[COMMAND_NAME]";
        const REQUIRED_ROLE = "[REQUIRED_ROLE]";
        const EXCPECTED_ARGUMENTS = "[EXCPECTED_ARGUMENTS]";
        const OPTIONAL_ARGUMENTS = "[OPTIONAL_ARGUMENTS]";

        //Help command
        const help_command = new Discord.MessageEmbed()
            .setColor('#4040ff')
            .setAuthor({name: "./commands/[STRING].js; Lines: [INT]; File size: ~[INT] KB", iconURL: "https://winaero.com/blog/wp-content/uploads/2018/12/file-explorer-folder-libraries-icon-18298.png"})
            .setTitle(`%${COMMAND_NAME} command help (${REQUIRED_ROLE})`)
            .setDescription('This command [STRING].')
            .addField(`Usage`, "`" + `%${COMMAND_NAME}` + " <[ARGUMENTS?]>" + "`", false)
            .addField(`Aliases`, "`[STRING]`", false)
            .addField(`Excpected arguments`, `${EXCPECTED_ARGUMENTS} case-in/sensitive`, true)
            .addField(`Optional arguments`, `${OPTIONAL_ARGUMENTS} case-in/sensitive`, true)
            .addField(`Notes`, "[STRING]", false)
            .addField('Related commands', "`[STRING]`", false)
            .setFooter({text: `${message.author.tag} • ${COMMAND_NAME}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
            .setTimestamp();

        message.channel.send({embeds: [help_command]})

        //Error messages
        const error_permissions = new Discord.MessageEmbed()
            .setColor('#ff2020')
            .setAuthor({name: "PermissionError"})
            .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
            .setFooter({text: `${message.author.tag} • Use '%${COMMAND_NAME} ?' for help`, iconURL: message.author.displayAvatarURL({dynamic: true})})
            .setTimestamp();

        message.channel.send({embeds: [error_permissions]})
        const error_missing_arguments = new Discord.MessageEmbed()
            .setColor('#ff2020')
            .setAuthor({name: "Error"})
            .setDescription(`Excpected **${EXCPECTED_ARGUMENTS}** arguments but only provided **[INT]**.\n` +
                "Please provide [STRING].")
            .setFooter({text: `${message.author.tag} • Use '%${COMMAND_NAME} ?' for help`, iconURL: message.author.displayAvatarURL({dynamic: true})})
            .setTimestamp();

        message.channel.send({embeds: [error_missing_arguments]})
    }
}

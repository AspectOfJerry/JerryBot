module.exports = {
    callback: (message, Discord, client, ...args) => {
        //Command information
        const COMMAND_NAME = "say";
        const REQUIRED_ROLE = "everyone";
        const EXCPECTED_ARGUMENTS = 1;
        const OPTIONAL_ARGUMENTS = 0;

        //Help command
        if(args[0] == '?') {
            const help_command = new Discord.MessageEmbed()
                .setColor('#4040ff')
                .setAuthor({name: "./commands/say.js; Lines: 55; File size: ~2.4 KB", iconURL: "https://winaero.com/blog/wp-content/uploads/2018/12/file-explorer-folder-libraries-icon-18298.png"})
                .setTitle(`%${COMMAND_NAME} command help (${REQUIRED_ROLE})`)
                .setDescription('This command sends a message in the current channel.')
                .addField(`Usage`, "`" + `%${COMMAND_NAME}` + " <string>" + "`", false)
                .addField(`Aliases`, "`write`", false)
                .addField(`Excpected arguments`, `${EXCPECTED_ARGUMENTS} case-sensitive`, true)
                .addField(`Optional arguments`, `${OPTIONAL_ARGUMENTS}`, true)
                .addField('Related commands', "`send`", false)
                .setFooter({text: `${message.author.tag} • ${COMMAND_NAME}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                .setTimestamp();

            message.channel.send({embeds: [help_command]})
            return;
        }

        //Declaring variables
        let userMessage;

        //Declaring functions

        //Checks
        if(!args[0]) {
            const error_missing_arguments = new Discord.MessageEmbed()
                .setColor('#ff2020')
                .setAuthor({name: "Error"})
                .setDescription(`Excpected **${EXCPECTED_ARGUMENTS}** arguments but only provided **0**.\n` +
                    "Please provide a message for the bot to send.")
                .setFooter({text: `${message.author.tag} • Use '%${COMMAND_NAME} ?' for help`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                .setTimestamp();

            message.channel.send({embeds: [error_missing_arguments]})
            return;
        }
        userMessage = args.join(" ")

        //Code
        message.channel.bulkDelete(1).catch(console.error)
            .then(() => {
                message.channel.send(`${userMessage}`)
            })
    }
}

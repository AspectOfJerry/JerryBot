require('dotenv').config();
const fetch = require('window-fetch');

module.exports = {
    callback: (message, Discord, client, ...args) => {
        //Command information
        const COMMAND_NAME = "nasa_api";
        const REQUIRED_ROLE = "everyone";
        const EXCPECTED_ARGUMENTS = 0;
        const OPTIONAL_ARGUMENTS = 0;

        //Help command
        if(args[0] == '?') {
            const help_command = new Discord.MessageEmbed()
                .setColor('#4040ff')
                .setAuthor({name: "dir: ./commands/api/nasa/nasa_api.js; Lines: [INT]; File size: ~[INT] KB"})
                .setTitle(`%${COMMAND_NAME} command help (${REQUIRED_ROLE})`)
                .setDescription('This command makes an API call to `https://api.nasa.gov/planetary/apod`.')
                .addField(`Usage`, "`" + `%${COMMAND_NAME}` + "`", false)
                .addField(`Aliases`, "`nasaapi`", false)
                .addField(`Excpected arguments`, `${EXCPECTED_ARGUMENTS}`, true)
                .addField(`Optional arguments`, `${OPTIONAL_ARGUMENTS}`, true)
                .addField('Related commands', "`nasa_api`", false)
                .setFooter({text: `${message.author.tag} • ${COMMAND_NAME}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                .setTimestamp();

            message.channel.send({embeds: [help_command]})
            return;
        }

        //Declaring variables

        //Declaring functions

        //Checks

        //Code

    }
}

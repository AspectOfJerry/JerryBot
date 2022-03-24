module.exports = {
    callback: (message, Discord, client, ...args) => {
        //Command information
        const COMMAND_NAME = "avatar";
        const ROLE_REQUIRED = "everyone";
        const EXCPECTED_ARGUMENTS = 0;
        const OPTIONAL_ARGUMENTS = 1;

        //Help command
        if(args[0] == '?') {
            const help_command = new Discord.MessageEmbed()
                .setColor('#4040ff')
                .setAuthor({name: "./commands/avatar.js; Lines: [INT]; File size: ~[INT] KB", iconURL: "https://winaero.com/blog/wp-content/uploads/2018/12/file-explorer-folder-libraries-icon-18298.png"})
                .setTitle(`%${COMMAND_NAME} command help (${ROLE_REQUIRED})`)
                .setDescription("**[DEPRECATED]** This command shows your user avatar or the targeted user's avatar if included.")
                .addField(`Usage`, "`" + `%${COMMAND_NAME}` + " <user>" + "`", false)
                .addField(`New command`, "`profile`", false)
                .addField(`Excpected arguments`, `${EXCPECTED_ARGUMENTS} case-in/sensitive`, true)
                .addField(`Optional arguments`, `${OPTIONAL_ARGUMENTS} case-in/sensitive`, true)
                .setFooter({text: `Executed by: ${message.author.tag}`, iconURL: message.author.displayAvatarURL({dynamic: true})})

            message.channel.send({embeds: [help_command]})
            return;
        }

        //Declaring variables

        //Declaring functions

        //Checks


        //Code
        if(!args[0]) {
            const own_avatar = new Discord.MessageEmbed()
        }
        else if(args[0]) {
            const target = message.mentions.users.first();
            if(!target) {
                const reference_error_target = new Discord.MessageEmbed()
                    .setColor('ff2020')
                    .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription('**ReferenceError:** Invalid user (not found).' + " Use " + "`" + `%${COMMAND_NAME} ?` + "`" + " for help.")
                    .setFooter({text: "Please provide a valid member to show their avatar."})

                message.channel.send({embeds: [reference_error_target]})
                return;
            }

            const memberTarget = message.guild.members.cache.get(target.id);
        }

    }
}

module.exports = {
    callback: (message, Discord, client, ...args) => {
        //Command information
        const COMMAND_NAME = "report";
        const REQUIRED_ROLE = "everyone";
        const EXCPECTED_ARGUMENTS = 2;
        const OPTIONAL_ARGUMENTS = 0;

        //Help command
        if(args[0] == '?') {
            const help_command = new Discord.MessageEmbed()
                .setColor('#2020ff')
                .setAuthor({name: "dir: ./commands/report.js; Lines: 88; File size: ~4.1 KB"})
                .setTitle(`%${COMMAND_NAME} command help (${REQUIRED_ROLE})`)
                .setDescription('This command reports a user to the staff.')
                .addField(`Usage`, "`" + `%${COMMAND_NAME}` + " <user> (<reason>)" + "`", false)
                .addField(`Excpected arguments`, `${EXCPECTED_ARGUMENTS}`, true)
                .addField(`Optional arguments`, `${OPTIONAL_ARGUMENTS}`, true)
                .addField('Related commands', "`[STRING]`", false)
                .setFooter({text: `${message.author.tag} • ${COMMAND_NAME}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                .setTimestamp();

            message.channel.send({embeds: [help_command]})
            return;
        }

        //Declaring variables
        let reportReason;

        //Declaring functions

        //Checks
        if(!args[0]) {
            const error_missing_arguments = new Discord.MessageEmbed()
                .setColor('#ff2020')
                .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription(`**Error:** Excpected **${EXCPECTED_ARGUMENTS}** arguments but only provided **0**.` + " Use " + "`" + `%${COMMAND_NAME} ?` + "`" + " for help.")
                .setFooter({text: "Please provide a member to report."})

            message.channel.send({embeds: [error_missing_arguments]})
            return;
        }
        const target = message.mentions.users.first();
        if(!target) {
            const reference_error_target = new Discord.MessageEmbed()
                .setColor('ff2020')
                .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription('**ReferenceError:** Invalid user (not found).' + " Use " + "`" + `%${COMMAND_NAME} ?` + "`" + " for help.")
                .setFooter({text: "Please provide a valid member to kick."})

            message.channel.send({embeds: [reference_error_target]})
            return;
        }
        const memberTarget = message.guild.members.cache.get(target.id);
        if(memberTarget == message.memebr) {
            const error_cannot_use_on_self = new Discord.MessageEmbed()
                .setColor('ff2020')
                .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription('**Error:** You cannot use this command on yourself.')
                .setFooter({text: "Report someone else!"})

            message.channel.send({embeds: [error_cannot_use_on_self]})
            return;
        }
        if(args[1]) {
            const error_missing_arguments = new Discord.MessageEmbed()
                .setColor('#ff2020')
                .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription(`**Error:** Excpected **${EXCPECTED_ARGUMENTS}** arguments but only provided **1**.` + " Use " + "`" + `%${COMMAND_NAME} ?` + "`" + " for help.")
                .setFooter({text: "Please provide a reason for the report."})

            message.channel.send({embeds: [error_missing_arguments]})
            return;
        }
        reportReason = args.shift();


        //Code
        const success_report = new Discord.MessageEmbed()
            .setColor('#20ff20')
            .setTitle("User report")
            .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 32})}`)
            .setDescription(`<@${message.member.user.id}> reported <@${memberTarget.user.id}`)

        message.channel.send({embeds: [success_report]})
    }
}

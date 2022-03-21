//%stop (<reason>)
//Aliases: ["terminate", "kill", "end", "shutdown"]
module.exports = {
    callback: (message, Discord, client, ...args) => {
        //Command information
        const COMMAND_NAME = "stop";
        const ROLE_REQUIRED = "PL3";
        const EXCPECTED_ARGUMENTS = 0;
        const OPTIONAL_ARGUMENTS = 1;

        //Help command
        if(args[0] == '?') {
            const help_command = new Discord.MessageEmbed()
                .setColor('#4040ff')
                .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle(`%${COMMAND_NAME} command help (${ROLE_REQUIRED})`)
                .setDescription('This command stops the bot.')
                .addField(`Usage`, "`" + `%${COMMAND_NAME}` + " (<reason>)" + "`", false)
                .addField(`Aliases`, "`[STRING]`", false)
                .addField(`Excpected arguments`, `${EXCPECTED_ARGUMENTS}`, true)
                .addField(`Optional arguments`, `${OPTIONAL_ARGUMENTS}`, true)
                .addField(`Notes`, "If no reason is provided, the bot will stop after 10 seconds. The user will be able to cancel the request within these 10 seconds.", false)
                .setFooter({text: "./commands/stop.js; Lines: [INT]; File size: [NUMBER] KB"})

            message.channel.send({embeds: [help_command]})
            return;
        }

        //Declaring variables
        let verdict;
        let messageMemberHighestRole;
        let memberTargetHighestRole;

        //Declaring functions

        //Checks
        if(!message.member.roles.cache.find(role => role.name == ROLE_REQUIRED)) {
            const error_premissions = new Discord.MessageEmbed()
                .setColor('ff2020')
                .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")

            message.channel.send({embeds: [error_premissions]})
            return;
        }

        //Code
        if(args[0]) {
            let filter = m => m.author.id === message.author.id
            const confirm_bot_stop = new Discord.MessageEmbed()
                .setColor('ffff20')
                .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription("Are you sure you want to stop the bot? You have 10 seconds to reply `yes` or `no`.")
                .setFooter({text: "[10s], awaiting yes/no answer"})

            message.channel.send({embeds: [confirm_bot_stop]})
                .then(() => {
                    message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 10000,
                        errors: ['time']
                    })
                        .then(message => {
                            message = message.first()
                            if(message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y' || message.content.toUpperCase() == '1') {
                                const request_authorized = new Discord.MessageEmbed()

                            } else if(message.content.toUpperCase() == 'NO' || message.content.toUpperCase() == 'N' || message.content.toUpperCase() == '0') {
                                const request_canceled = new Discord.MessageEmbed()

                            } else {
                                const request_canceled_no_responce = new Discord.MessageEmbed()

                            }
                        })
                        .catch(collected => {
                            const request_timeout = new Discord.MessageEmbed()

                        })
                })
        }
        if(!args[0]) {
            const warning_no_arguments = new Discord.MessageEmbed()
                .setColor('ffff20')
                .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription("**Warning:** No argument was provided. The bot will stop in **10** seconds. You can cancel the request within these 10 seconds by sending `cancel`.")

            message.channel.send({embeds: [warning_no_arguments]})
            return;
        }
    }
}

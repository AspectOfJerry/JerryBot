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
                .setColor('#2020ff')
                .setAuthor({name: "./commands/stop.js; Lines: 144; File size: ~10.2 KB", iconURL: "https://winaero.com/blog/wp-content/uploads/2018/12/file-explorer-folder-libraries-icon-18298.png"})
                .setTitle(`%${COMMAND_NAME} command help (${ROLE_REQUIRED})`)
                .setDescription('This command stops the bot.')
                .addField(`Usage`, "`" + `%${COMMAND_NAME}` + " (<reason>)" + "`", false)
                .addField(`Aliases`, "`end`, `kill`, `shutdown`, `terminate`", false)
                .addField(`Excpected arguments`, `${EXCPECTED_ARGUMENTS}`, true)
                .addField(`Optional arguments`, `${OPTIONAL_ARGUMENTS} (case-insensitive)`, true)
                .addField(`Notes`, "If no reason is provided, the bot will stop after 10 seconds. The user will be able to cancel the request within these 10 seconds.", false)
                .setFooter({text: `Executed by: ${message.author.tag}`, iconURL: message.author.displayAvatarURL({dynamic: true})})

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
        if(!args[0]) {
            const warning_no_arguments = new Discord.MessageEmbed()
                .setColor('ffff20')
                .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription("**Warning:** No argument was provided. The bot will stop in **10** seconds. You can cancel the request within these 10 seconds by sending `cancel`.")

            message.channel.send({embeds: [warning_no_arguments]})
                .then(() => {
                    message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 10000,
                        errors: ['time']
                    })
                        .then(message => {
                            message = message.first()
                            if(message.content.toUpperCase() == 'CANCEL' || message.content.toUpperCase() == 'C' || message.content.toUpperCase() == 'REJECT') {
                                const request_canceled = new Discord.MessageEmbed()
                                    .setColor('#20ff20')
                                    .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
                                    .setDescription("The request was canceled.")

                                message.channel.send({embeds: [request_canceled]})
                                return;
                            }
                        })
                        .catch(() => {  //collected?
                            const request_resolve_stop = new Discord.MessageEmbed()
                                .setColor('#ff20ff')
                                .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
                                .setTitle("Bot shutdown")
                                .setFooter({text: "Exiting the process after this message"})

                            message.channel.send({embeds: [request_resolve_stop]})
                            //EXIT HERE
                            message.channel.send('If you see this message, the bot was not stopped. Message a bot developer immediately.')
                            return;
                        })
                })
        } else if(args[0]) {
            let filter = m => m.author.id === message.author.id
            const confirm_bot_stop = new Discord.MessageEmbed()
                .setColor('ffff20')
                .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('Confirmation required')
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
                            if(message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y' || message.content.toUpperCase() == '1' || message.content.toUpperCase() == 'RESOLVE') {
                                const request_resolve_stop = new Discord.MessageEmbed()
                                    .setColor('#ff20ff')
                                    .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
                                    .setTitle("Bot shutdown")
                                    .setFooter({text: "Exiting the process after this message"})

                                message.channel.send({embeds: [request_resolve_stop]})
                                //EXIT HERE
                                message.channel.send('If you see this message, the bot was not stopped. Message a bot developer immediately.')
                                return;
                            } else if(message.content.toUpperCase() == 'NO' || message.content.toUpperCase() == 'N' || message.content.toUpperCase() == '0' || message.content.toUpperCase() == 'REJECT') {
                                const request_canceled = new Discord.MessageEmbed()
                                    .setColor('#20ff20')
                                    .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
                                    .setDescription("The request was canceled.")

                                message.channel.send({embeds: [request_canceled]})
                                return;
                            } else {
                                const request_canceled_invalid_response = new Discord.MessageEmbed()
                                    .setColor('#ff2020')
                                    .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
                                    .setDescription("For safety, the request was canceled because an invalid response was provided.")

                                message.channel.send({embeds: [request_canceled_invalid_response]})
                                return;
                            }
                        })
                        .catch(() => {  //collected?
                            const request_timeout = new Discord.MessageEmbed()
                                .setColor('#ff2020')
                                .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
                                .setDescription("Error: Timeout. No response was provided during the 10 second wait.")

                            message.channel.send({embeds: [request_timeout]})
                            return;
                        })
                })
        }
    }
}

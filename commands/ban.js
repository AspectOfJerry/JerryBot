module.exports = {
    callback: (message, Discord, client, ...args) => {
        //Command information
        const COMMAND_NAME = "ban";
        const REQUIRED_ROLE = "PL1";
        const EXCPECTED_ARGUMENTS = 1;
        const OPTIONAL_ARGUMENTS = 1;

        //Help command
        if(args[0] == '?') {
            const help_command = new Discord.MessageEmbed()
                .setColor('#2020ff')
                .setAuthor({name: "./commands/ban.js; Lines: 173; File size: ~8.4 KB", iconURL: "https://winaero.com/blog/wp-content/uploads/2018/12/file-explorer-folder-libraries-icon-18298.png"})
                .setTitle(`%${COMMAND_NAME} command help (${REQUIRED_ROLE})`)
                .setDescription('This command bans a user from the guild.')
                .addField(`Usage`, "`" + `%${COMMAND_NAME}` + " <user> (<reason>)" + "`", false)
                .addField(`Excpected arguments`, `${EXCPECTED_ARGUMENTS} case-sensitive`, true)
                .addField(`Optional arguments`, `${OPTIONAL_ARGUMENTS} case-insensitive`, true)
                .addField('Related commands', "`kick`", false)
                .setFooter({text: `${message.author.tag} • ${COMMAND_NAME}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                .setTimestamp();

            message.channel.send({embeds: [help_command]})
            return;
        }

        //Declaring variables
        let verdict;
        let messageMemberHighestRole;
        let memberTargetHighestRole;

        //Declaring functions
        function GetMessageMemberHighestRole(message) {
            if(message.member.roles.cache.find(role => role.name == "PL0")) {
                return 0;
            } else if(message.member.roles.cache.find(role => role.name == "PL1")) {
                return 1;
            } else if(message.member.roles.cache.find(role => role.name == "PL2")) {
                return 2;
            } else if(message.member.roles.cache.find(role => role.name == "PL3")) {
                return 3;
            } else {
                return null;
            }
        }
        function GetMemberTargetHighestRole(memberTarget) {
            if(memberTarget.roles.cache.find(role => role.name == "PL0")) {
                return 0;
            } else if(memberTarget.roles.cache.find(role => role.name == "PL1")) {
                return 1;
            } else if(memberTarget.roles.cache.find(role => role.name == "PL2")) {
                return 2;
            } else if(memberTarget.roles.cache.find(role => role.name == "PL3")) {
                return 3;
            } else {
                return null;
            }
        }
        function CanMessageMemberExecute(messageMemberHighestRole, memberTargetHighestRole) {
            if(messageMemberHighestRole == memberTargetHighestRole) {
                return "equal";
            } else if(messageMemberHighestRole < memberTargetHighestRole || memberTargetHighestRole == null) {
                return "yes";
            } else {
                return "no";
            }
        }
        function FriendProtection(message, memberTarget, verdict) {
            if(memberTarget.roles.cache.find(role => role.name == "Friends")) {
                let filter = m => m.author.id === message.author.id;
                const confirm_ban_friend = new Discord.MessageEmbed()
                    .setColor('ffff20')
                    .setAuthor({name: "Warning"})
                    .setTitle("FriendProtection")
                    .setDescription(`Are you sure you want to ban <@${memberTarget.user.id}>. They are your friend.\n` +
                        "You have 10 seconds to send `yes` to confirm or `no` to cancel. (default: `no`)")
                    .setFooter({text: `${message.author.tag} • ${COMMAND_NAME}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                    .setTimestamp();

                message.channel.send({embeds: [confirm_ban_friend]})
                const collector = message.channel.createMessageCollector({
                    filter,
                    max: 1,
                    time: 10000,
                })
                collector.on('collect', message => {
                    if(message.content.toUpperCase() == "YES") {
                        Verdict(message, memberTarget, verdict);
                    } else if(message.content.toUpperCase() == "NO") {
                        const request_canceled = new Discord.MessageEmbed()
                            .setColor('#20ff20')
                            .setAuthor({name: "Rejected"})
                            .setDescription("The request was canceled.")
                            .setFooter({text: `${message.author.tag} • ${COMMAND_NAME}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                            .setTimestamp();

                        message.channel.send({embeds: [request_canceled]})
                        return;
                    }
                })
                collector.on('end', collected => {
                    if(collected.size === 0) {
                        const request_timeout = new Discord.MessageEmbed()
                            .setColor('#bb20ff')
                            .setAuthor({name: "Timeout"})
                            .setDescription("The request was canceled.")
                            .setFooter({text: `${message.author.tag} • ${COMMAND_NAME}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                            .setTimestamp();

                        message.channel.send({embeds: [request_timeout]})
                        return;
                    }
                })
            } else {
                Verdict(message, memberTarget, verdict)
            }
        }
        function Verdict(message, memberTarget, verdict) {
            if(verdict == "equal") {
                const error_equal_roles = new Discord.MessageEmbed()
                    .setColor('ff2020')
                    .setAuthor({name: "PermissionError"})
                    .setDescription(`Your highest role is equal to <@${message.member.user.id}>'s highest role.`)
                    .setFooter({text: `${message.author.tag} • Use '%${COMMAND_NAME} ?' for help`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                    .setTimestamp();

                message.channel.send({embeds: [error_equal_roles]})
                return;
            } else if(verdict == "yes") {
                memberTarget.ban()
                    .then((banResult) => {
                        const success_ban = new Discord.MessageEmbed()
                            .setColor('20ff20')
                            .setAuthor({name: "Success"})
                            .setTitle("User ban")
                            .setDescription(`<@${message.member.user.id}> banned <@${memberTarget.user.id}>.`)
                            .setFooter({text: `${message.author.tag} • ${COMMAND_NAME}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                            .setTimestamp();

                        message.channel.send({embeds: [success_ban]})
                        return;
                    })
                    .catch((error) => {
                        console.log(error)
                        const error_catch = new Discord.MessageEmbed()
                            .setColor('#ff20ff')
                            .setAuthor({name: "PromiseRejected"})
                            .setTitle("Critical error catch")
                            .setDescription("An error was caught at line `143`.")
                            .addField("code", `${error.code}`, true)
                            .addField("httpsStatus", `${error.httpStatus}`, true)
                            .addField("path", `${error.path}`, false)
                            .setFooter({text: `${message.author.tag} • Use '%${COMMAND_NAME} ?' for help`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                            .setTimestamp();

                        message.channel.send({embeds: [error_catch]})
                    })
            } else {
                const error_role_too_low = new Discord.MessageEmbed()
                    .setColor('ff2020')
                    .setAuthor({name: "PermissionError"})
                    .setDescription(`Your role is lower than <@${memberTarget.user.id}>'s role.`)
                    .setFooter({text: `${message.author.tag} • Use '%${COMMAND_NAME} ?' for help`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                    .setTimestamp();

                message.channel.send({embeds: [error_role_too_low]})
                return;
            }
        }

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
        if(!args[0]) {
            const error_missing_arguments = new Discord.MessageEmbed()
                .setColor('#ff2020')
                .setAuthor({name: "Error"})
                .setDescription(`Excpected **${EXCPECTED_ARGUMENTS}** arguments but only provided **0**.\n` +
                    "Please provide a member to ban.")
                .setFooter({text: `${message.author.tag} • Use '%${COMMAND_NAME} ?' for help`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                .setTimestamp();

            message.channel.send({embeds: [error_missing_arguments]})
            return;
        }
        const target = message.mentions.users.first();
        if(!target) {
            const reference_error_target = new Discord.MessageEmbed()
                .setColor('ff2020')
                .setAuthor({name: "ReferenceError"})
                .setDescription('Invalid user (not found).\n' +
                    "Please provide a valid member to ban.")
                .setFooter({text: `${message.author.tag} • Use '%${COMMAND_NAME} ?' for help`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                .setTimestamp();

            message.channel.send({embeds: [reference_error_target]})
            return;
        }
        const memberTarget = message.guild.members.cache.get(target.id);
        if(memberTarget == message.member) {
            const error_cannot_use_on_self = new Discord.MessageEmbed()
                .setColor('ff2020')
                .setAuthor({name: "Error"})
                .setDescription('You cannot use this command on yourself.')
                .setFooter({text: `${message.author.tag} • Use '%${COMMAND_NAME} ?' for help`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                .setTimestamp();

            message.channel.send({embeds: [error_cannot_use_on_self]})
            return;
        }

        //Code
        messageMemberHighestRole = GetMessageMemberHighestRole(message)
        memberTargetHighestRole = GetMemberTargetHighestRole(memberTarget)

        verdict = CanMessageMemberExecute(messageMemberHighestRole, memberTargetHighestRole)

        FriendProtection(message, memberTarget, verdict)
    }
}

module.exports = {
    callback: (message, Discord, client, ...args) => {
        //Command information
        const COMMAND_NAME = "timeout";
        const REQUIRED_ROLE = "PL3";
        const EXCPECTED_ARGUMENTS = 2;
        const OPTIONAL_ARGUMENTS = 1;

        //Help command
        if(args[0] == '?') {
            const help_command = new Discord.MessageEmbed()
                .setColor('#2020ff')
                .setAuthor({name: "dir: ./commands/timeout.js; Lines: 219; File size: ~11.0 KB"})
                .setTitle(`%${COMMAND_NAME} command help (${REQUIRED_ROLE})`)
                .setDescription('This command times a guild member out.')
                .addField(`Usage`, "`" + `%${COMMAND_NAME}` + " <user> <time> (<reason>)" + "`", false)
                .addField(`Aliases`, "`freeze`", false)
                .addField(`Excpected arguments`, `${EXCPECTED_ARGUMENTS}`, true)
                .addField(`Optional arguments`, `${OPTIONAL_ARGUMENTS}`, true)
                .addField(`Notes`, "The timeout duration must be within the range **1** - **3600** seconds.")
                .addField('Related commands', "`mute`", false)
                .setFooter({text: `${message.author.tag} • ${COMMAND_NAME}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                .setTimestamp();

            message.channel.send({embeds: [help_command]})
            return;
        }

        //Declaring variables
        let memberTargetHighestRole;
        let messageMemberHighestRole;
        let timeoutDuration;
        let verdict;

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
        function Verdict(message, verdict, timeoutDuration) {
            if(verdict == "equal") {
                const error_equal_roles = new Discord.MessageEmbed()
                    .setColor('ff2020')
                    .setAuthor({name: "PermissionError"})
                    .setDescription(`Your highest role is equal to <@${memberTarget.user.id}>'s highest role.`)
                    .setFooter({text: `${message.author.tag} • Use '%${COMMAND_NAME} ?' for help`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                    .setTimestamp();

                message.channel.send({embeds: [error_equal_roles]})
                return;
            } else if(verdict == "yes") {
                memberTarget.timeout(timeoutDuration * 1000)
                    .then(() => {
                        const success_timeout = new Discord.MessageEmbed()
                            .setColor('20ff20')
                            .setAuthor({name: "Success"})
                            .setTitle("User timeout")
                            .setDescription(`<@${message.member.user.id}> timed out <@${memberTarget.user.id}> for ${timeoutDuration} seconds.`)
                            .setFooter({text: `${message.author.tag} • ${COMMAND_NAME}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                            .setTimestamp();

                        message.channel.send({embeds: [success_timeout]})
                        return;
                    })
                    .catch((error) => {
                        console.log(error)
                        const error_catch = new Discord.MessageEmbed()
                            .setColor('#ff20ff')
                            .setAuthor({name: "PromiseRejected"})
                            .setTitle("Critical error catch")
                            .setDescription("An error was caught at line `96`.")
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
            const error_premissions = new Discord.MessageEmbed()
                .setColor('ff2020')
                .setAuthor({name: "PermissionError"})
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                .setFooter({text: `${message.author.tag} • Use '%${COMMAND_NAME} ?' for help`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                .setTimestamp();

            message.channel.send({embeds: [error_premissions]})
            return;
        }
        if(!args[0]) {
            const error_missing_arguments = new Discord.MessageEmbed()
                .setColor('ff2020')
                .setAuthor({name: "Error"})
                .setDescription(`Excpected **${EXCPECTED_ARGUMENTS}** arguments but only provided **0**.\n` +
                    "Please provide a member to timeout.")
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
                .setDescription('Invalid member.\n' +
                    "Please provide a valid memebr to timeout.")
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
        if(!args[1]) {
            const error_missing_arguments = new Discord.MessageEmbed()
                .setColor('ff2020')
                .setAuthor({name: "Error"})
                .setDescription(`Excpected **${EXCPECTED_ARGUMENTS}** arguments but only provided **1**.\n` +
                    "Please provide a timeout duration in seconds.")
                .setFooter({text: `${message.author.tag} • Use '%${COMMAND_NAME} ?' for help`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                .setTimestamp();

            message.channel.send({embeds: [error_missing_arguments]})
            return;
        }
        if(isNaN(args[1]) == true) {
            const type_error_argument_isNaN = new Discord.MessageEmbed()
                .setColor('ff2020')
                .setAuthor({name: "TypeError"})
                .setDescription("Unexpected argument type. `" + `${args[1]}` + '` is NaN.\n' +
                    "Please provide a timeout duration in seconds using an integer.")
                .setFooter({text: `${message.author.tag} • Use '%${COMMAND_NAME} ?' for help`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                .setTimestamp();

            message.channel.send({embeds: [type_error_argument_isNaN]})
            return;
        }
        if(args[1] < 1 || args[1] > 3600) {
            const range_error = new Discord.MessageEmbed()
                .setColor('#ff2020')
                .setAuthor({name: "RangeError"})
                .setDescription("Timeout duration must be within the range **1** - **3600** seconds.")
                .setFooter({text: `${message.author.tag} • Use '%${COMMAND_NAME} ?' for help`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                .setTimestamp();

            message.channel.send({embeds: [range_error]})
            return;
        }
        timeoutDuration = args[1];

        //Code 
        messageMemberHighestRole = GetMessageMemberHighestRole(message);
        memberTargetHighestRole = GetMemberTargetHighestRole(memberTarget);

        verdict = CanMessageMemberExecute(messageMemberHighestRole, memberTargetHighestRole);

        Verdict(message, verdict, timeoutDuration);
    }
}

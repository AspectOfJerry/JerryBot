module.exports = {
    callback: (message, Discord, client, ...args) => {
        //Command information
        const COMMAND_NAME = "timeout";
        const ROLE_REQUIRED = "PL3";
        const EXCPECTED_ARGUMENTS = 1;
        const OPTIONAL_ARGUMENTS = 1;

        //Help command
        if(args[0] == '?') {
            const help_command = new Discord.MessageEmbed()
                .setColor('#0000ff')
                .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle(`%${COMMAND_NAME} command help (${ROLE_REQUIRED})`)
                .setDescription('This command times a guild member out.')
                .addField(`Usage`, "`" + `%${COMMAND_NAME}` + " <user> (<reason>)" + "`", false)
                .addField(`Excpected arguments`, `**${EXCPECTED_ARGUMENTS}**`, true)
                .addField(`Optional arguments`, `**${OPTIONAL_ARGUMENTS}**`, true)
                .addField('Related commands', "`mute`", false)
                .setFooter({text: "./commands/testing/timeout.js; Lines: [INT]; File size: [NUMBER] KB"})

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
                return 0
            } else if(message.member.roles.cache.find(role => role.name == "PL1")) {
                return 1
            } else if(message.member.roles.cache.find(role => role.name == "PL2")) {
                return 2
            } else if(message.member.roles.cache.find(role => role.name == "PL3")) {
                return 3
            } else {
                return null;
            }
        }
        function GetMemberTargetHighestRole(message, memberTarget) {
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
        function Verdict(verdict, messageMemberHighestRole, memberTargetHigestRole, message) {
            if(verdict == "equal") {
                const error_equal_roles = new Discord.MessageEmbed()
                    .setColor('ff0000')
                    .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription(`Error: <@${memberTarget.user.id}>'s highest role is equal to <@${message.member.user.id}>'s highest role.`)
                    .setFooter({text: "Your role must be higher than the targeted member's role."})

                message.channel.send({embeds: error_equal_roles})
                return;
            } else if(verdict == "yes") {
                memberTarget.ban()
                    .then(banInfo => {
                        const success_ban = new Discord.MessageEmbed()
                            .setColor('00ff00')
                            .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
                            .setTitle("User ban")
                            .setDescription(`<@${message.member.user.id}> banned <@${memberTarget.user.id}> from the guild.`)

                        message.channel.send({embeds: success_ban})
                        return;
                    })
                    .cactch()

            } else {
                const error_role_too_low = new Discord.MessageEmbed()
                    .setColor('ff0000')
                    .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription(`Error: <@${message.member.user.id}>'s role is lower then <@${memberTarget.uesr.id}>'s role.`)
                    .setFooter({text: "Your role must be higher than the targeted member's role."})

                message.channel.send({embeds: error_role_too_low})
                return;
            }
        }

        //Checks
        if(message.member.roles.cache.find(role => role.name == "PL3")) {
            const error_premissions = new Discord.MessageEmbed()
                .setColor('ff0000')
                .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")

            message.channel.send({embeds: error_premissions})
            return;
        }
        if(!args[0]) {
            const error_require_more_arguments = new Discord.MessageEmbed()
                .setColor('ff0000')
                .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription(`Error: Excpected ${EXCPECTED_ARGUMENTS} arguments but only provided 0.` + " Use " + "`" + `%${COMMAND_NAME} ?` + "`" + " for help.")
                .setFooter({text: "Please provide a member to ban."})

            message.channel.send({embeds: [error_require_more_arguments]})
            return;
        }
        const target = message.mentions.users.first();
        if(!target) {
            const reference_error_target = new Discord.MessageEmbed()
                .setColor('ff0000')
                .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription('ReferenceError: Invalid user (not found).' + " Use " + "`" + `%${COMMAND_NAME} ?` + "`" + " for help.")
                .setFooter({text: "You must provide a Snowflake."})

            message.channel.send({embeds: [reference_error_target]})
            return;
        }
        const memberTarget = message.guild.members.cache.get(target.id);
        if(memberTarget == message.member) {
            const error_cannot_use_on_self = new Disocrd.MessageEmbed()
                .setColor('ff0000')
                .setDescription('Error: You cannot use this command on yourself')
                .setFooter({text: "Select a different memberTarget."})

            message.channel.send({embeds: error_cannot_use_on_self})
            return;
        }
        //Code 
        GetMessageMemberHighestRole(message)
        GetMemberTargetHighestRole(message, memberTarget)
        
        CanMessageMemberExecute(messageMemberHighestRole, memberTargetHighestRole)

        Verdict(verdict, messageMemberHighestRole, memberTargetHighestRole, message)
    }
}

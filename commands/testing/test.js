module.exports = {
    callback: (message, Discord, client, ...args) => {
        //Declaring variables
        const target = message.mentions.users.first();
        const memberTarget = message.guild.members.cache.get(target.id);
        const role_requirement = "BotPL2"
        let verdict;
        let messageMemberHighestRole
        let memberTargetHighestRole
        //Code
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
        messageMemberHighestRole = GetMessageMemberHighestRole(message)
        message.channel.send(`mM: ${messageMemberHighestRole}`)
        console.log(`Message member: ${messageMemberHighestRole}`)

        memberTargetHighestRole = GetMemberTargetHighestRole(message, memberTarget)
        message.channel.send(`mT: ${memberTargetHighestRole}`)
        console.log(`MemberTarget: ${memberTargetHighestRole}`)

        verdict = CanMessageMemberExecute(messageMemberHighestRole, memberTargetHighestRole)
        message.channel.send(`v: ${verdict}`)
    }
}

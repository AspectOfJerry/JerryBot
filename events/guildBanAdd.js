const {Log, Sleep} = require('../modules/JerryUtils');


module.exports = {
    name: "guildBanAdd",
    once: false, // Whether or not this event should only be triggered once
    async execute(ban) {
        const reason = " Reason: " + ban.reason + "." || "";
        await Log('append', 'guildBanAdd', `'@${ban.user.tag}' was banned from "${ban.guild.name}".${reason}`, 'WARN'); // Logs
    }
};

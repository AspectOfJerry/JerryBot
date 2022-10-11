const Sleep = require('../modules/sleep'); // delayInMilliseconds
const Log = require('../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    name: "guildBanAdd",
    once: false, // Whether or not this even should only be triggered once
    async execute(ban) {
        const reason = " Reason: " + ban.reason + "." || "";
        await Log('append', 'guildBanAdd', `'${ban.user.tag}' was banned in "${ban.guild.name}".${reason}`, 'WARN'); // Logs
    }
};

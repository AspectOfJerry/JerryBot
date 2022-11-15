const Sleep = require('../modules/sleep.js'); // delayInMilliseconds
const Log = require('../modules/logger.js'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    name: "guildBanRemove",
    once: false, // Whether or not this event should only be triggered once
    async execute(ban) {
        await Log('append', 'guildBanRemove', `'${ban.user.tag}' was unbanned in "${ban.guild.name}".`, 'WARN'); // Logs
    }
};

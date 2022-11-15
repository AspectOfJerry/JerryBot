const Sleep = require('../modules/sleep.js'); // delayInMilliseconds
const Log = require('../modules/logger.js'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    name: "typingStart",
    once: false,
    async execute(typing) {
        await Log('append', 'typingStart', `'${typing.user.tag}' started typing in '${typing.channel.name}' in '${typing.guild.name}'!`, 'DEBUG'); // Logs
    }
};

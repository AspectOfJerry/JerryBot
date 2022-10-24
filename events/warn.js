const Sleep = require('../modules/sleep'); // delayInMilliseconds
const Log = require('../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    name: "warn",
    once: false, // Whether or not this event should only be triggered once
    async execute(info) {
        await Log('append', 'warn', info, 'WARN'); // Logs
    }
};

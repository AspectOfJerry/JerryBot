const Sleep = require('../modules/sleep.js'); // delayInMilliseconds
const Log = require('../modules/logger.js'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    name: "debug",
    once: false,
    async execute(info) {
        await Log('append', 'debug', info, 'DEBUG'); // Logs
    }
};

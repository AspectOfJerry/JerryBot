const Sleep = require('../modules/sleep.js'); // delayInMilliseconds
const Log = require('../modules/logger.js'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    name: "EVENT_NAME",
    once: false, // Whether or not this event should only be triggered once
    async execute(event) {
        await Log('append', 'EVENT_NAME', ``, 'DEBUG'); // Logs
    }
};

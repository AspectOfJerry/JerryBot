const Sleep = require('../modules/sleep'); // delayInMilliseconds
const Log = require('../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    name: "messageUpdate",
    once: false, // Whether or not this even should only be triggered once
    async execute(err) {
        await Log('append', 'EVENT_NAME', "", ''); // Logs
    }
};

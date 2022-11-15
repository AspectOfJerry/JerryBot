const Sleep = require('../modules/sleep.js'); // delayInMilliseconds
const Log = require('../modules/logger.js'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    name: "error",
    once: false,
    async execute(error) {
        console.log(error);
        await Log('append', 'error', error, 'ERROR'); // Logs
    }
};

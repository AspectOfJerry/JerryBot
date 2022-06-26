const Sleep = require('../modules/sleep'); // delayInMilliseconds
const Log = require('../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    name: "error",
    once: false,
    async execute(err) {
        console.log(err);
        Log("read", 'error', err, 'ERROR');
    }
}

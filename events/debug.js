const Sleep = require('../modules/sleep');
const Log = require('../modules/logger');

module.exports = {
    name: "debug",
    once: false,
    async execute(info) {
        Log('debug_event', info, 'DEBUG');
    }
}
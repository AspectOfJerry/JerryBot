const {Log, Sleep} = require('../modules/JerryUtils');


module.exports = {
    name: "debug",
    once: false,
    async execute(info) {
        await Log('append', 'debug', info, 'DEBUG'); // Logs
    }
};

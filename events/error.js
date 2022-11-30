const {Log, Sleep} = require('../modules/JerryUtils');

module.exports = {
    name: "error",
    once: false,
    async execute(error) {
        console.log(error);
        await Log('append', 'error', error, 'ERROR'); // Logs
    }
};

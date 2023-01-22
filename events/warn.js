const {Log, Sleep} = require("../modules/JerryUtils");


module.exports = {
    name: "warn",
    once: false, // Whether or not this event should only be triggered once
    async execute(info) {
        await Log("append", 'warn', info, "WARN");
    }
};

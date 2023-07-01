const {logger, sleep} = require("../modules/jerryUtils.js");


module.exports = {
    name: "warn",
    once: false, // Whether or not this event should only be triggered once
    async execute(info) {
        logger.append("warn", "0x57524E", `[WRN] ${info}`);
    }
};

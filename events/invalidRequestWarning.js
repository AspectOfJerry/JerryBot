const {log, sleep} = require("../modules/jerryUtils.js");


module.exports = {
    name: "invalidRequestWarning",
    once: false, // Whether or not this event should only be triggered once
    async execute(invalidRequestWarningData) {
        await log("append", "", `[0x495257] ${invalidRequestWarningData}`, "WARN");
    }
};

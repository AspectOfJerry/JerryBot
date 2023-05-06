const {log, sleep} = require("../modules/JerryUtils.js");


module.exports = {
    name: "invalidRequestWarning",
    once: false, // Whether or not this event should only be triggered once
    async execute(invalidRequestWarningData) {
        await log("append", "invalidRequestWarning", invalidRequestWarningData, "WARN");
    }
};

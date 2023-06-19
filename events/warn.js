const {log, sleep} = require("../modules/JerryUtils.js");


module.exports = {
    name: "warn",
    once: false, // Whether or not this event should only be triggered once
    async execute(info) {
        await log("append", "", `[0x57524E] ${info}`, "WARN");
    }
};

const {log, sleep} = require("../modules/JerryUtils.js");


module.exports = {
    name: "debug",
    once: false,
    async execute(info) {
        await log("append", "Debug", info, "DEBUG");
    }
};

const {Log, Sleep} = require("../modules/JerryUtils.js");


module.exports = {
    name: "debug",
    once: false,
    async execute(info) {
        await Log("append", "Debug", info, "DEBUG");
    }
};

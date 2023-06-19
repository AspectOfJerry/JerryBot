const {log, sleep} = require("../modules/JerryUtils.js");


module.exports = {
    name: "error",
    once: false,
    async execute(error) {
        console.log(error);
        await log("append", "", `[0x455252] ${error}`, "ERROR");
    }
};

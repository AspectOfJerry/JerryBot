const {logger, sleep} = require("../modules/jerryUtils.js");


module.exports = {
    name: "debug",
    once: false,
    async execute(info) {
        logger.append("debug", "0x444247", `${info}`);
    }
};

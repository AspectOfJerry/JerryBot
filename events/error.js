const {logger, sleep} = require("../modules/jerryUtils.js");


module.exports = {
    name: "error",
    once: false,
    async execute(error) {
        console.log(error);
        logger.append("error", "0x455252", `${error}`);
    }
};

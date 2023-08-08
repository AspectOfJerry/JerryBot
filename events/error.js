import {logger, sleep} from "../utils/jerryUtils.js";

export default {
    name: "error",
    once: false,
    async execute(error) {
        console.log(error);
        logger.append("error", "0x455252", `${error}`);
    }
};

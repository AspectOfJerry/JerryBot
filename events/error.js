import {logger, sleep} from "../utils/jerryUtils.js";

export default {
    name: "error",
    once: false,
    async execute(error) {
        console.log(error);
        logger.append("error", "ERR", error);
    }
};

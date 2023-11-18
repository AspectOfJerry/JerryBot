import {logger, sleep} from "../utils/jerryUtils.js";


export default {
    name: "STRING",
    once: false, // Whether this event should only be triggered once
    async execute(EVENT) {
        logger.append("debug", "STDOUT", `[]`);
    }
};

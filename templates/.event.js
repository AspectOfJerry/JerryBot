import {logger, sleep} from "../modules/jerryUtils.js";


export default {
    name: "STRING",
    once: false, // Whether or not this event should only be triggered once
    async execute(EVENT) {
        logger.append("debug", "STDOUT", `[]`);
    }
};

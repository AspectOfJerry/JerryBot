import {logger, sleep} from "../utils/jerryUtils.js";


export default {
    name: "warn",
    once: false, // Whether this event should only be triggered once
    async execute(info) {
        logger.append("warn", "WRN", ` ${info}`);
    }
};

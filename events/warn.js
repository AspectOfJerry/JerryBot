import {logger, sleep} from "../utils/jerryUtils.js";


export default {
    name: "warn",
    once: false, // Whether or not this event should only be triggered once
    async execute(info) {
        logger.append("warn", "0x57524E", `[WRN] ${info}`);
    }
};

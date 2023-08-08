import {logger, sleep} from "../utils/jerryUtils.js";


export default {
    name: "invalidRequestWarning",
    once: false, // Whether or not this event should only be triggered once
    async execute(invalidRequestWarningData) {
        logger.append("warn", "0x495257", `[IRW] ${invalidRequestWarningData}`);
    }
};

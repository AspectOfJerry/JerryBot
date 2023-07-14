import {logger, sleep} from "../modules/jerryUtils.js";


export default {
    name: "invalidRequestWarning",
    once: false, // Whether or not this event should only be triggered once
    async execute(invalidRequestWarningData) {
        logger.append("warn", "0x495257", `[IRW] ${invalidRequestWarningData}`);
    }
};

import {logger, sleep} from "../utils/jerryUtils.js";


export default {
    name: "invalidRequestWarning",
    once: false, // Whether this event should only be triggered once
    async execute(invalidRequestWarningData) {
        logger.append("warn", "IRW", `${invalidRequestWarningData}`);
    }
};

import {logger, sleep} from "../utils/jerryUtils.js";

export default {
    name: "guildBanAdd",
    once: false, // Whether this event should only be triggered once
    async execute(ban) {
        logger.append("notice", "GBA", `'@${ban.user.tag}' was banned from "${ban.guild.name}".${ban.reason ? " Reason: " + ban.reason : ""}`);
    }
};

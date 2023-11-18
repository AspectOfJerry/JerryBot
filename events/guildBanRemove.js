import {logger, sleep} from "../utils/jerryUtils.js";


export default {
    name: "guildBanRemove",
    once: false, // Whether this event should only be triggered once
    async execute(ban) {
        logger.append("info", "GBR", `'@${ban.user.tag}' was unbanned from "${ban.guild.name}".`);
    }
};

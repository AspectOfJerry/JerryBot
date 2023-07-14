import {logger, sleep} from "../modules/jerryUtils.js";


export default {
    name: "guildBanRemove",
    once: false, // Whether or not this event should only be triggered once
    async execute(ban) {
        logger.append("info", "0x474252", `[GBR] '@${ban.user.tag}' was unbanned from "${ban.guild.name}".`);
    }
};

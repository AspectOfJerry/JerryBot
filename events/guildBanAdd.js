import {logger, sleep} from "../modules/jerryUtils.js";

export default {
    name: "guildBanAdd",
    once: false, // Whether or not this event should only be triggered once
    async execute(ban) {
        logger.append("notice", "0x474241", `[GBA] '@${ban.user.tag}' was banned from "${ban.guild.name}".${ban.reason ? " Reason: " + ban.reason : ""}`);
    }
};

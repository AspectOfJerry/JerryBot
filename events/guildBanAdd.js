const {logger, sleep} = require("../modules/jerryUtils.js");


module.exports = {
    name: "guildBanAdd",
    once: false, // Whether or not this event should only be triggered once
    async execute(ban) {
        logger.append("note", "0x474241", `[GBA] '@${ban.user.tag}' was banned from "${ban.guild.name}".${ban.reason ? " Reason: " + ban.reason : ""}`);
    }
};

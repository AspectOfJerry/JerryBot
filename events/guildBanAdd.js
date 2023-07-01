const {log, sleep} = require("../modules/jerryUtils.js");


module.exports = {
    name: "guildBanAdd",
    once: false, // Whether or not this event should only be triggered once
    async execute(ban) {
        const reason = " Reason: " + ban.reason + "." || "";
        await log("append", "", `[0x474241] '@${ban.user.tag}' was banned from "${ban.guild.name}".${reason}`, "WARN");
    }
};

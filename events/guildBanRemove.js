const {log, sleep} = require("../modules/JerryUtils.js");


module.exports = {
    name: "guildBanRemove",
    once: false, // Whether or not this event should only be triggered once
    async execute(ban) {
        await log("append", "guildBanRemove", `'@${ban.user.tag}' was unbanned from "${ban.guild.name}".`, "WARN");
    }
};

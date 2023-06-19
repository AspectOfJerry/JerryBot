const {log, sleep} = require("../modules/JerryUtils.js");
const {deleteGuild} = require("../database/mongodb.js");


module.exports = {
    name: "guildDelete",
    once: false, // Whether or not this event should only be triggered once
    async execute(guild) {
        await log("append", "", `[0x475544] The bot joined the "${guild.name}" guild guild:
            createdAt: ${guild.createdAt} [${guild.createdTimestamp}],
            id: ${guild.id},
            large: ${guild.large},
            memberCount: ${guild.memberCount},
            ownerId: ${guild.ownerId},
            preferredLocale: '${guild.preferredLocale}'.`, "INFO");

        deleteGuild(guild.id);
    }
};

const {Log, RefreshDataset, Sleep} = require("../modules/JerryUtils.js");

module.exports = {
    name: "guildCreate",
    once: false, // Whether or not this event should only be triggered once
    async execute(guild) {
        await Log("append", 'guildCreate', `The bot joined the "${guild.name}" guild:
            createdAt: ${guild.createdAt} [${guild.createdTimestamp}],
            id: ${guild.id},
            large: ${guild.large},
            memberCount: ${guild.memberCount},
            ownerId: ${guild.ownerId},
            preferredLocale: '${guild.preferredLocale}'.`, "INFO");

        await RefreshDataset(guild.client);
    }
};

const {Log, Sleep} = require('../modules/JerryUtils');

module.exports = {
    name: "guildDelete",
    once: false, // Whether or not this event should only be triggered once
    async execute(guild) {
        await Log('append', 'guildDelete', `The bot joined the "${guild.name}" guild guild:
            createdAt: ${guild.createdAt} [${guild.createdTimestamp}],
            id: ${guild.id},
            large: ${guild.large},
            memberCount: ${guild.memberCount},
            ownerId: ${guild.ownerId},
            preferredLocale: '${guild.preferredLocale}'.`, 'INFO');
    }
};

import {logger, sleep} from "../utils/jerryUtils.js";
import {updateGuild} from "../database/mongodb.js";

export default {
    name: "guildCreate",
    once: false, // Whether this event should only be triggered once
    async execute(guild) {
        logger.append("notice", "GUC", `The bot joined the "${guild.name}" guild:
            createdAt: ${guild.createdAt} [${guild.createdTimestamp}],
            id: ${guild.id},
            large: ${guild.large},
            memberCount: ${guild.memberCount},
            ownerId: ${guild.ownerId},
            preferredLocale: '${guild.preferredLocale}'.`);

        updateGuild(guild.id, guild.name, "", "", "");
    }
};

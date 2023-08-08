import {logger, sleep} from "../utils/jerryUtils.js";
import {deleteGuild} from "../database/mongodb.js";

export default {
    name: "guildDelete",
    once: false, // Whether or not this event should only be triggered once
    async execute(guild) {
        logger.append("notice", "0x475544", `[GUD] The bot left the "${guild.name}" guild:
            createdAt: ${guild.createdAt} [${guild.createdTimestamp}],
            id: ${guild.id},
            large: ${guild.large},
            memberCount: ${guild.memberCount},
            ownerId: ${guild.ownerId},
            preferredLocale: '${guild.preferredLocale}'.`);

        deleteGuild(guild.id);
    }
};

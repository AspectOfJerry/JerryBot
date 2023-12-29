import {MessageEmbed} from "discord.js";

import {logger, sleep} from "../utils/jerryUtils.js";


export default {
    name: "messageDelete",
    once: false, // Whether this event should only be triggered once
    async execute(message) {
        // Check if .cleanContent is the same as .content
        if (message.content === message.cleanContent) {
            logger.append("notice", "MSD", `A message sent by <@${message?.author.tag}> has been deleted:
            message.content: "${message.content}".`);
        } else {
            logger.append("notice", "MSD", `A message sent by <@${message?.author.tag}> has been deleted:
                message.content: "${message.content}",
                message.cleanContent: "${message.cleanContent}".`);
        }
    }
};

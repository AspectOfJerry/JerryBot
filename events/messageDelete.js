const {MessageEmbed} = require("discord.js");

const {logger, sleep} = require("../modules/jerryUtils.js");


module.exports = {
    name: "messageDelete",
    once: false, // Whether or not this event should only be triggered once
    async execute(message) {
        // Check if .cleanContent is the same as .content
        if(message.content === message.cleanContent) {
            logger.append("note", "0x4D5344", `[MSD] A message sent by <@${message?.author.tag}> has been deleted:
            message.content: "${message.content}".`);
        } else {
            logger.append("note", "0x4D5344", `[MSD] A message sent by <@${message?.author.tag}> has been deleted:
                message.content: "${message.content}",
                message.cleanContent: "${message.cleanContent}".`);
        }
    }
};

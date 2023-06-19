const {MessageEmbed} = require("discord.js");

const {log} = require("../modules/JerryUtils.js");


module.exports = {
    name: "messageDelete",
    once: false, // Whether or not this event should only be triggered once
    async execute(message) {
        // Check if .cleanContent is the same as .content
        if(message.content === message.cleanContent) {
            log("append", "", `[0x4D5344] A message sent by <@${message?.author.tag}> has been deleted:
            message.content: "${message.content}".`, "WARN");
        } else {
            log("append", "", `[0x4D5344] A message sent by <@${message?.author.tag}> has been deleted:
                message.content: "${message.content}",
                message.cleanContent: "${message.cleanContent}".`, "WARN");
        }
    }
};

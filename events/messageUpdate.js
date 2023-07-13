const {MessageActionRow, MessageButton, MessageEmbed} from "discord.js";

const {logger, sleep} = require("../modules/jerryUtils.js");


module.exports = {
    name: "messageUpdate",
    once: false, // Whether or not this event should only be triggered once
    async execute(oldMessage, newMessage) {
        let oldContent;
        let newContent;

        if(newMessage.author.bot) {
            return;
        }

        // Check if .cleanContent is the same as .content in the old message
        if(oldMessage.content === oldMessage.cleanContent) {
            oldContent = `oldMessage.content: "${oldMessage.content}",`;
        } else {
            oldContent = `oldMessage.content: "${oldMessage.content}",
            oldMessage.cleanContent: "${oldMessage.cleanContent}".`;
        }
        // Check if .cleanContent is the same as .content in the new message
        if(newMessage.content === newMessage.cleanContent) {
            newContent = `newMessage.content: "${newMessage.content}".`;
        } else {
            newContent = `newMessage.content: "${newMessage.content}",
            newMessage.cleanContent: "${newMessage.cleanContent}".`;
        }

        logger.append("info", "0x4D5355", `[MSU] <@${newMessage.author.tag}> edited a message in <#${newMessage.channel.name}> in <${newMessage.guild.name}>:
            ${oldContent}
            ${newContent}`);
    }
};

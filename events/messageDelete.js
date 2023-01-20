const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");

const {Log, Sleep} = require("../modules/JerryUtils");


module.exports = {
    name: "messageDelete",
    once: false, // Whether or not this event should only be triggered once
    async execute(message) {
        // Check if .cleanContent is the same as .content
        if(message.content === message.cleanContent) {
            await Log('append', 'messageDelete', `A message sent by <@${message?.author.tag}> has been deleted:
            message.content: "${message.content}").`, 'WARN');
        } else {
            await Log('append', 'messageDelete', `A message sent by <@${message?.author.tag}> has been deleted:
                message.content: "${message.content}",
                message.cleanContent: "${message.cleanContent}".`, 'WARN');
        }
    }
};

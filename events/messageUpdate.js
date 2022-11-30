const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent} = require('discord.js');

const Sleep = require('../modules/sleep.js'); // delayInMilliseconds
const Log = require('../modules/logger.js'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

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
            oldContent = oldMessage.content;
        } else {
            oldContent = `${oldMessage.content} (cleanContent: ${oldMessage.cleanContent})`;
        }
        // Check if .cleanContent is the same as .content in the new message
        if(newMessage.content === newMessage.cleanContent) {
            newContent = newMessage.content;
        } else {
            newContent = `${newMessage.content} (cleanContent: ${newMessage.cleanContent})`;
        }

        await Log('append', 'messageUpdate', `<@${newMessage.author.tag}> edited a message: "${oldContent}" -> "${newContent}" in <#${newMessage.channel.name}> in <${newMessage.guild.name}>`, 'WARN'); // Logs
    }
};

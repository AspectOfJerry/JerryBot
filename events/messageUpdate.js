const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, ModalBuilder} = require('discord.js');

const Sleep = require('../modules/sleep'); // delayInMilliseconds
const Log = require('../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    name: "messageUpdate",
    once: false, // Whether or not this event should only be triggered once
    async execute(oldMessage, newMessage) {
        let oldContent;
        let newContent;

        if(oldMessage.channel.name == "📊system-monitor" || newMessage.channel.name == "📊system-monitor") {
            return;
        }

        // If cleanContent is the same as the true content
        if(oldMessage.content === oldMessage.cleanContent) {
            oldContent = oldMessage.content;
        } else {
            oldContent = `${oldMessage.content} (cleanContent: ${oldMessage.cleanContent})`;
        }
        // If cleanContent is the same as the true content
        if(newMessage.content === newMessage.cleanContent) {
            newContent = newMessage.content;
        } else {
            newContent = `${newMessage.content} (cleanContent: ${newMessage.cleanContent})`;
        }

        await Log('append', 'messageUpdate', `'${newMessage.author.tag}' edited a message: "${oldContent}" -> "${newContent}" in "${newMessage.channel.name}" in "${newMessage.guild.name}"`, 'WARN'); // Logs
    }
};

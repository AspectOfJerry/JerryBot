const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, ModalBuilder} = require('discord.js');

const Sleep = require('../modules/sleep'); // delayInMilliseconds
const Log = require('../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    name: "messageUpdate",
    once: false, // Whether or not this even should only be triggered once
    async execute(oldMessage, newMessage) {
        let oldContent;
        let newContent;
        if(oldMessage.content === oldMessage.cleanContent) {
            oldContent = oldMessage.content;
        } else {
            oldContent = `${oldMessage.content} (cleanContent: ${oldMessage.cleanContent})`;
        }
        if(newMessage.content === newMessage.cleanContent) {
            newContent = newMessage.content;
        } else {
            newContent = newMessage.cleanContent;
        }

        await Log('append', 'messageUpdate', `'${newMessage.author.tag}' edited a message: "${oldContent}" -> "${newContent}" in "${newMessage.channel.name}" in "${newMessage.guild.name}"`, 'WARN'); // Logs
    }
};

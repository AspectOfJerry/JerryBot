const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, ModalBuilder} = require('discord.js');

const Sleep = require('../modules/sleep'); // delayInMilliseconds
const Log = require('../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    name: "messageDelete",
    once: false, // Whether or not this event should only be triggered once
    async execute(message) {
        if(message.content === message.cleanContent) {
            await Log('append', 'messageDelete', `A message sent by '${message?.author.tag}' has been deleted (content: "${message.content}").`, 'WARN'); // Logs
        } else {
            await Log('append', 'messageDelete', `A message sent by '${message?.author.tag}' has been deleted (content: "${message.content}", cleanContent: ${message.cleanContent}).`, 'WARN'); // Logs
        }
    }
};

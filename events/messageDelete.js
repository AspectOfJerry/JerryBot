const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent} = require('discord.js');

const Sleep = require('../modules/sleep.js'); // delayInMilliseconds
const Log = require('../modules/logger.js'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    name: "messageDelete",
    once: false, // Whether or not this event should only be triggered once
    async execute(message) {
        if(message.author.bot) {
            return;
        }

        // Check if .cleanContent is the same as .content
        if(message.content === message.cleanContent) {
            await Log('append', 'messageDelete', `A message sent by <@${message?.author.tag}> has been deleted (content: "${message.content}").`, 'WARN'); // Logs
        } else {
            await Log('append', 'messageDelete', `A message sent by <@${message?.author.tag}> has been deleted (content: "${message.content}", cleanContent: ${message.cleanContent}).`, 'WARN'); // Logs
        }
    }
};

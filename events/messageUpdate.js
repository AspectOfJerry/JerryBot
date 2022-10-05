const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, ModalBuilder} = require('discord.js');

const Sleep = require('../modules/sleep'); // delayInMilliseconds
const Log = require('../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    name: "messageUpdate",
    once: false, // Whether or not this even should only be triggered once
    async execute(oldMessage, newMessage) {
        await Log('append', 'messageUpdate', "", ''); // Logs
    }
};

const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, ModalBuilder} = require('discord.js');

const CronJob = require('cron').CronJob;
const fetch = require('node-fetch');

const Sleep = require('../modules/sleep'); // dedlayInMilliseconds;
const Log = require('../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

// Main
const schedule_311 = new CronJob('45 6 * * *', async () => { // Interval of 1 day, at 06h45
    console.log("SCHEDULE THING")
});

schedule_311.start();

Log('append', 'Schedule_311', `[Schedule_311] The 311 daily schedule announcer job has been initiated! The CRON job was set to 06h45 everyday.`, 'DEBUG'); // Logs
console.log(`[Schedule_311] The 311 daily schedule announcer job has been initiated! The CRON job was set to 06h45 everyday.`);
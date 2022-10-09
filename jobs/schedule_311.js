const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, ModalBuilder} = require('discord.js');

const CronJob = require('cron').CronJob;
const fetch = require('node-fetch');

const Sleep = require('../modules/sleep'); // dedlayInMilliseconds;
const Log = require('../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

// Main
const schedule_311 = new CronJob('45 06 * * *', async () => { // Interval of 1 day, at 06h45
    await Log('append', 'schedule_311', `[Schedule_311] Posting today's schedule...`, 'DEBUG'); // Logs
});

schedule_311.start();

Log('append', 'schedule_311', `[Schedule_311] The 311 daily schedule announcer job has been started! The CRON job was set to 06h45 everyday.`, 'DEBUG'); // Logs
console.log(`[Schedule_311] The 311 daily schedule announcer job has been started! The CRON job was set to 06h45 everyday.`);

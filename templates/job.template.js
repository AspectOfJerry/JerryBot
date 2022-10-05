const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, ModalBuilder} = require('discord.js');

const CronJob = require('cron').CronJob;
const fetch = require('node-fetch');

const Sleep = require('../modules/sleep'); // dedlayInMilliseconds;
const Log = require('../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

// Main

const JOB_NAME = new CronJob('* * * * *', async () => { // Interval of INTERVAL

});

JOB_NAME.start();

Log('append', 'JOB_NAME', `[JOB_NAME] `, 'DEBUG'); // Logs
console.log(`JOB_NAME initiated!`);

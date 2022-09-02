const CronJob = require('cron').CronJob;
const fetch = require('node-fetch');

const Sleep = require('../modules/sleep'); // dedlayInMilliseconds;
const Log = require('../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

// Main
const heartbeat_interval = '1 minute';
const grace_period = '15 seconds';

const heartbeat = new CronJob('* * * * *', async () => { // Interval of 1 minute
    try {
        await fetch(`https://betteruptime.com/api/v1/heartbeat/ixeh3Ufdvq9EKWznsZMPFrpq`)
            .then(async () => {
                await Log('append', 'Heartbeat', `[Heartbeat] Heartbeat sent to the status page.`, 'DEBUG'); // Logs
            });
    } catch(err) {
        if(err) {
            console.error(err);
        }

        Log('append', 'Heartbeat', `[Heartbeat] An error occurred while sending the Heartbeat. Retrying in 5 seconds.`, 'FATAL'); // Logs
        await Sleep(5000);
        await fetch(`https://betteruptime.com/api/v1/heartbeat/ixeh3Ufdvq9EKWznsZMPFrpq`)
            .then(async () => {
                await Log('append', 'Heartbeat', `[Heartbeat] Heartbeat sent to status page.`, 'DEBUG'); // Logs
            });
    }
});

heartbeat.start();

Log('append', 'Heartbeat', `[Heartbeat] Heartbeat initiated! The Heartbeat interval is set to ${heartbeat_interval} with a grace period of ${grace_period}.`, 'DEBUG'); // Logs
console.log(`Heartbeat initiated! The Heartbeat interval is set to ${heartbeat_interval} with a grace period of ${grace_period}.`);

fetch(`https://betteruptime.com/api/v1/heartbeat/ixeh3Ufdvq9EKWznsZMPFrpq`)
    .then(async () => {
        await Log('append', 'Heartbeat', `[Heartbeat] The first Heartbeat was sent to the status page.`, 'DEBUG'); // Logs
    });

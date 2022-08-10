const CronJob = require('cron').CronJob;
const fetch = require('node-fetch');

const Sleep = require('../modules/sleep'); // dedlayInMilliseconds;
const Log = require('../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

// Main
const heartbeat_interval = '1 minute';
const grace_period = '10 seconds';

const heartbeat = new CronJob('* * * * *', async () => { // Interval of 1 minute
    await fetch(`https://betteruptime.com/api/v1/heartbeat/ixeh3Ufdvq9EKWznsZMPFrpq`)
        .then(async () => {
            await Log('append', 'Heartbeat', `[Heartbeat] Heartbeat sent to status page.`, 'DEBUG');
        });
});
heartbeat.start();

Log('append', 'Heartbeat', `[Heartbeat] Heartbeat initiated! The Heartbeat interval is set to ${heartbeat_interval} with a grace period of ${grace_period}.`, 'DEBUG'); // Logs
console.log(`Heartbeat initiated! The Heartbeat interval is set to ${heartbeat_interval} with a grace period of ${grace_period}.`);

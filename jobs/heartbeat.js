const CronJob = require('cron').CronJob;
const fetch = require('node-fetch');

const Sleep = require('../modules/sleep'); // dedlayInMilliseconds;
const Log = require('../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

// Main
const heartbeat_interval = '1 minute';
const grace_period = '10 seconds';

const heartbeat = new CronJob('* * * * *', async () => {
    await fetch(`https://betteruptime.com/api/v1/heartbeat/ixeh3Ufdvq9EKWznsZMPFrpq`)
        .then(async () => {
            await Log('append', 'HEARTBEAT', `[Hearbeat] Heartbeat sent to status page. The Hearbeat interval is set to ${heartbeat_interval} with a grace period of ${grace_period}.`, 'DEBUG');
        });
});
heartbeat.start();

console.log("Heartbeat started!");

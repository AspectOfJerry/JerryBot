const Sleep = require('../modules/sleep'); // delayInMilliseconds
const Log = require('../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

async function StartJobs() {
    // Heartbeat
    await Log('append', 'Heartbeat', `[Heartbeat] Starting the Heartbeat...`, 'DEBUG'); // Logs
    console.log("Starting the Heartbeat...");
    require('../jobs/heartbeat');

    // 311 Schedule
    await Log('append', 'schedule_311', `[Schedule311] Starting the 311 daily schedule announcer...`, 'DEBUG'); // Logs
    console.log("Starting the 311 daily schedule announcer...");
    require('../jobs/schedule_311');
}

module.exports = StartJobs;
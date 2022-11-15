const Sleep = require('../modules/sleep.js'); // delayInMilliseconds
const Log = require('../modules/logger.js'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─
const {ChecklistJobsStarted} = require('../modules/system_monitor');

async function StartJobs(client) {
    // Heartbeat
    await Log('append', 'Heartbeat', `[Heartbeat] Starting the Heartbeat...`, 'DEBUG'); // Logs
    console.log("Starting the Heartbeat...");
    require('../jobs/heartbeat')(client);

    // 311 Schedule
    await Log('append', 'schedule_311', `[Schedule311] Starting the 311 daily schedule announcer...`, 'DEBUG'); // Logs
    console.log("Starting the 311 daily schedule announcer...");
    require('../jobs/schedule_311')(client);

    await ChecklistJobsStarted();
}

module.exports = StartJobs;

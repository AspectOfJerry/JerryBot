const Sleep = require('../modules/sleep'); // delayInMilliseconds
const Log = require('../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    name: "presenceUpdate",
    once: false,
    async execute(oldPresence, newPresence) {
        // Declaring variables
        let oldStatus = "unknown";
        let oldClientStatus = "unknown";
        let oldClientActivityType = "unknown";
        let oldClientActivityName = "unknown";
        let oldClientActivityDetails = "unknown";
        let oldClientActivityState = "unknown";

        if(oldPresence) {
            oldStatus = oldPresence.status || "unknown";
            oldClientStatus = oldPresence.clientStatus || "unknown";
            oldClientStatus = JSON.stringify(oldClientStatus);
            oldClientStatus = oldClientStatus.replace("{", "");
            oldClientStatus = oldClientStatus.replace("}", "");
            oldClientActivityType = oldPresence.activities[0].type + " " || "";
            oldClientActivityName = oldPresence.activities[0].name + " " || "";
            oldClientActivityDetails = oldPresence.activities[0].details + " " || "";
            oldClientActivityState = oldPresence.activities[0].state + " " || "";
        }

        let newStatus = newPresence.status || "unknown";
        let newClientStatus = newPresence.clientStatus || "unknown";
        let newClientActivityType = newPresence.activities[0].type + " " || "";
        let newClientActivityName = newPresence.activities[0].name + " " || "";
        let newClientActivityDetails = newPresence.activities[0].details + " " || "";
        let newClientActivityState = newPresence.activities[0].state + " " || "";
        newClientStatus = JSON.stringify(newClientStatus);
        newClientStatus.toString();
        newClientStatus = newClientStatus.replace("{", "");
        newClientStatus = newClientStatus.replace("}", "");

        const old_activity = oldStatus + "; " + oldClientActivityType + oldClientActivityName + oldClientActivityDetails + oldClientActivityState;
        const new_activity = newStatus + "; " + newClientActivityType + newClientActivityName + newClientActivityDetails + newClientActivityState;

        await Log('append', 'presenceUpdate', `"${newPresence.user.tag}" went from '${old_activity}' (${oldClientStatus}) to '${new_activity}' (${newClientStatus}) in "${newPresence.guild.name}"`, 'INFO'); // Logs
    }
};

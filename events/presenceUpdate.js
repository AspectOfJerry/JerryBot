const Sleep = require('../modules/sleep'); // delayInMilliseconds
const Log = require('../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    name: "presenceUpdate",
    once: false,
    async execute(oldPresence, newPresence) {
        // Declaring variables

        let oldStatus = oldPresence?.status || "unknown";
        let oldClientStatus = oldPresence?.clientStatus || "unknown";
        let oldClientActivityType = oldPresence?.activities[0]?.type || "";
        let oldClientActivityName = " | " + oldPresence?.activities[0]?.name || "";
        let oldClientActivityDetails = " | " + oldPresence?.activities[0]?.details || "";
        let oldClientActivityState = " | " + oldPresence?.activities[0]?.state || "";
        oldClientStatus = JSON.stringify(oldClientStatus);
        oldClientStatus.toString();
        oldClientStatus = oldClientStatus.replace("{", "");
        oldClientStatus = oldClientStatus.replace("}", "");

        let newStatus = newPresence?.status || "unknown";
        let newClientStatus = newPresence?.clientStatus || "unknown";
        let newClientActivityType = newPresence?.activities[0]?.type || "";
        let newClientActivityName = " | " + newPresence?.activities[0]?.name || "";
        let newClientActivityDetails = " | " + newPresence?.activities[0]?.details || "";
        let newClientActivityState = " | " + newPresence?.activities[0]?.state || "";
        newClientStatus = JSON.stringify(newClientStatus);
        newClientStatus.toString();
        newClientStatus = newClientStatus.replace("{", "");
        newClientStatus = newClientStatus.replace("}", "");

        const old_activity = oldClientActivityType + oldClientActivityName + oldClientActivityDetails + oldClientActivityState;
        const new_activity = newClientActivityType + newClientActivityName + newClientActivityDetails + newClientActivityState;

        await Log('append', 'presenceUpdate', `"${newPresence.user.tag}" went from: '${oldStatus} (${oldClientStatus})' | '${old_activity}' to: '${newStatus} (${newClientStatus})' | '${new_activity}' in: "${newPresence.guild.name}"`, 'INFO'); // Logs
    }
};

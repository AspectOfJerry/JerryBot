const {MessageEmbed} = require("discord.js");
const {log} = require("../modules/jerryUtils.js");

var lastGuildId;
var latestGuildId;


module.exports = {
    name: "presenceUpdate",
    once: false,
    async execute(oldPresence, newPresence) {
        /* ---FULL PRESENCE UPDATE---
            // Declaring variables
            let oldStatus = oldPresence?.status;
            let oldClientStatus = oldPresence?.clientStatus;
            let oldClientActivityType = oldPresence?.activities[0]?.type || "";
            let oldClientActivityName = " | " + oldPresence?.activities[0]?.name || "";
            let oldClientActivityDetails = " | " + oldPresence?.activities[0]?.details || "";
            let oldClientActivityState = " | " + oldPresence?.activities[0]?.state || "";
            oldClientStatus = JSON.stringify(oldClientStatus);
            oldClientStatus.toString();
            oldClientStatus = oldClientStatus.replace("{", "");
            oldClientStatus = oldClientStatus.replace("}", "");
    
            let newStatus = newPresence?.status;
            let newClientStatus = newPresence?.clientStatus;
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
    
            await log("append", 'presenceUpdate', `"${newPresence.user.tag}" went from: '${oldStatus} (${oldClientStatus})' | '${old_activity}' to: '${newStatus} (${newClientStatus})' | '${new_activity}' in: "${newPresence.guild.name}"`, "INFO");
        */

        // ---STATUS UPDATE ONLY---
        // Declaring variables
        let oldClientStatus = oldPresence?.clientStatus || "unknown";
        let oldClientActivityType = oldPresence?.activities[0]?.type ? oldPresence.activities[0].type + ", " : "";

        let newClientStatus = newPresence?.clientStatus || "unknown";
        let newClientActivityType = newPresence?.activities[0]?.type ? newPresence.activities[0].type + ", " : "";

        latestGuildId = newPresence.guild.id;

        // If there are mostly no changes, do not log to prevent log spamming
        if(oldClientStatus == newClientStatus && oldClientActivityType == newClientActivityType || lastGuildId != latestGuildId) {
            return;
        }

        newClientStatus = JSON.stringify(newClientStatus);
        newClientStatus.toString();
        newClientStatus = newClientStatus.replaceAll("{", "");
        newClientStatus = newClientStatus.replaceAll("}", "");
        newClientStatus = newClientStatus.replaceAll("\"", "");
        newClientStatus = newClientStatus.replaceAll(":", ": ");
        newClientStatus = newClientStatus.replaceAll(",", ", ");

        oldClientStatus = JSON.stringify(oldClientStatus);
        oldClientStatus.toString();
        oldClientStatus = oldClientStatus.replaceAll("{", "");
        oldClientStatus = oldClientStatus.replaceAll("}", "");
        oldClientStatus = oldClientStatus.replaceAll("\"", "");
        oldClientStatus = oldClientStatus.replaceAll(":", ": ");
        oldClientStatus = oldClientStatus.replaceAll(",", ", ");

        log("append", "", `[0x505355] "@${newPresence.user.tag}" went from: "${oldClientActivityType}${oldClientStatus}" to: "${newClientActivityType}${newClientStatus}"`, "INFO");
        lastGuildId = newPresence.guild.id;
    }

    // Message all superUsers with a "@silent" message when another superUser goes online

};

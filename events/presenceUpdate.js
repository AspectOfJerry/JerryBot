const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {GetConfig, Log, Sleep} = require("../modules/JerryUtils");

var lastGuildId;
var latestGuildId;
var firstTime = true;


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
    
            await Log("append", 'presenceUpdate', `"${newPresence.user.tag}" went from: '${oldStatus} (${oldClientStatus})' | '${old_activity}' to: '${newStatus} (${newClientStatus})' | '${new_activity}' in: "${newPresence.guild.name}"`, "INFO");
        */

        // ---STATUS UPDATE ONLY---
        // Declaring variables
        let oldStatus = oldPresence?.status || "unknown";
        let oldClientStatus = oldPresence?.clientStatus || "unknown";
        let oldClientActivityType = oldPresence?.activities[0]?.type ? oldPresence.activities[0].type + ", " : "null, ";

        let newStatus = newPresence?.status || "unknown";
        let newClientStatus = newPresence?.clientStatus || "unknown";
        let newClientActivityType = newPresence?.activities[0]?.type ? newPresence.activities[0].type + ", " : "null, ";

        latestGuildId = newPresence.guild.id;

        if(oldStatus == newStatus && oldClientActivityType == newClientActivityType || lastGuildId != latestGuildId && firstTime != true) {
            return; // No changes
        }

        newClientStatus = JSON.stringify(newClientStatus);
        newClientStatus.toString();
        newClientStatus = newClientStatus.replaceAll("{", "");
        newClientStatus = newClientStatus.replaceAll("}", "");
        newClientStatus = newClientStatus.replaceAll('"', "");
        newClientStatus = newClientStatus.replaceAll(":", ": ");
        newClientStatus = newClientStatus.replaceAll(",", ", ");

        oldClientStatus = JSON.stringify(oldClientStatus);
        oldClientStatus.toString();
        oldClientStatus = oldClientStatus.replaceAll("{", "");
        oldClientStatus = oldClientStatus.replaceAll("}", "");
        oldClientStatus = oldClientStatus.replaceAll('"', "");
        oldClientStatus = oldClientStatus.replaceAll(":", ": ");
        oldClientStatus = oldClientStatus.replaceAll(",", ", ");

        await Log("append", 'presenceUpdate', `<@${newPresence.user.tag}> went from: '${oldClientActivityType}${oldStatus} (${oldClientStatus})' to: '${newClientActivityType}${newStatus} (${newClientStatus})'`, "INFO");
        lastGuildId = newPresence.guild.id;
        firstTime = false;
    }

    // Message all superUsers when another superUser goes online

};

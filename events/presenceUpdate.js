const Sleep = require('../modules/sleep'); //delayInMilliseconds;
const Log = require('../modules/logger'); //DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─;

module.exports = {
    name: "presenceUpdate",
    once: false,
    async execute(oldPresence, newPresence) {
        //Declaring variables
        let old_status = "unknown";
        let old_client_status = "unknown";
        if(oldPresence) {
            old_status = oldPresence.status || "unknown";
            old_client_status = oldPresence.clientStatus || "unknown";
            old_client_status = JSON.stringify(old_client_status);
            old_client_status = old_client_status.replace("{", "");
            old_client_status = old_client_status.replace("}", "");
        }

        let new_status = newPresence.status || "unknown";
        let new_client_status = newPresence.clientStatus || "unknown";
        new_client_status = JSON.stringify(new_client_status);
        new_client_status.toString();
        new_client_status = new_client_status.replace("{", "");
        new_client_status = new_client_status.replace("}", "");

        Log("read", 'presenceUpdate', `"${newPresence.user.tag}" went from '${old_status}' (${old_client_status}) to '${new_status}' (${new_client_status}) in "${newPresence.guild.name}"`, 'INFO');
    }
}
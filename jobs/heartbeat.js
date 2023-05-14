const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");

const CronJob = require("cron").CronJob;
const fetch = require("node-fetch");

const {log, sleep} = require("../modules/JerryUtils.js");
const {checklistHeartbeat, updateHeartbeat} = require("../modules/telemetry");


let disabled = false;
let once = false;

async function execute(client) {
    /**
     * Triggers every 2 minutes.
     * Sends a heartbeat to the status page
     */
    const heartbeat = new CronJob("*/2 * * * *", async () => {
        try {
            await sleep(jitter());
            await fetch("https://betteruptime.com/api/v1/heartbeat/ixeh3Ufdvq9EKWznsZMPFrpq", {method: "POST"})
                .then(() => {
                    log("append", "heartbeat", "[Heartbeat] Heartbeat sent to the status page.", "DEBUG");
                    const now = Math.round(Date.now() / 1000);
                    updateHeartbeat(client, now);
                    if(!once) {
                        checklistHeartbeat();
                        once = true;
                    }
                });
        } catch(err) {
            if(err) {
                console.error(err);
            }

            log("append", "heartbeat", "[Heartbeat] An error occurred while sending the Heartbeat. Retrying in 6 seconds.", "ERROR");
            await sleep(5000 + jitter());
            await fetch("https://betteruptime.com/api/v1/heartbeat/ixeh3Ufdvq9EKWznsZMPFrpq", {method: "POST"})
                .then(() => {
                    log("append", "heartbeat", "[Heartbeat] Heartbeat sent to status page.", "DEBUG");
                    const now = Math.round(Date.now() / 1000);
                    updateHeartbeat(client, now);
                    if(!once) {
                        checklistHeartbeat();
                        once = true;
                    }
                });
        }
    });

    heartbeat.start();

    log("append", "heartbeat", "[Heartbeat] Heartbeat started!", "DEBUG");
    console.log("[Heartbeat] Heartbeat started!");

    await fetch("https://betteruptime.com/api/v1/heartbeat/ixeh3Ufdvq9EKWznsZMPFrpq")
        .then(() => {
            log("append", "heartbeat", "[Heartbeat] The first Heartbeat was sent to the status page.", "DEBUG");
            const now = Math.round(Date.now() / 1000);
            updateHeartbeat(client, now);
        });
}


function jitter() {
    return Math.floor(Math.random() * 1450) + 50;
}


module.exports = {
    execute
};

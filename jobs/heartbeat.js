const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");

const CronJob = require("cron").CronJob;
const fetch = require("node-fetch");

const {Log, Sleep} = require("../modules/JerryUtils.js");
const {ChecklistHeartbeat, UpdateHeartbeat} = require("../modules/telemetry");


let disabled = false;
let once = false;

async function execute(client) {
    /**
     * Triggers every 2 minutes.
     * Sends a heartbeat to the status page
     */
    const heartbeat = new CronJob("*/2 * * * *", async () => {
        try {
            await Sleep(await Jitter());
            await fetch("https://betteruptime.com/api/v1/heartbeat/ixeh3Ufdvq9EKWznsZMPFrpq", {method: "POST"})
                .then(() => {
                    Log("append", "heartbeat", "[Heartbeat] Heartbeat sent to the status page.", "DEBUG");
                    const now = Math.round(Date.now() / 1000);
                    UpdateHeartbeat(client, now);
                    if(!once) {
                        ChecklistHeartbeat();
                        once = true;
                    }
                });
        } catch(err) {
            if(err) {
                console.error(err);
            }

            Log("append", "heartbeat", "[Heartbeat] An error occurred while sending the Heartbeat. Retrying in 6 seconds.", "ERROR");
            await Sleep(6000 + await Jitter());
            await fetch("https://betteruptime.com/api/v1/heartbeat/ixeh3Ufdvq9EKWznsZMPFrpq", {method: "POST"})
                .then(() => {
                    Log("append", "heartbeat", "[Heartbeat] Heartbeat sent to status page.", "DEBUG");
                    const now = Math.round(Date.now() / 1000);
                    UpdateHeartbeat(client, now);
                    if(!once) {
                        ChecklistHeartbeat();
                        once = true;
                    }
                });
        }
    });

    heartbeat.start();

    Log("append", "heartbeat", "[Heartbeat] Heartbeat started!", "DEBUG");
    console.log("[Heartbeat] Heartbeat started!");

    await fetch("https://betteruptime.com/api/v1/heartbeat/ixeh3Ufdvq9EKWznsZMPFrpq")
        .then(() => {
            Log("append", "heartbeat", "[Heartbeat] The first Heartbeat was sent to the status page.", "DEBUG");
            const now = Math.round(Date.now() / 1000);
            UpdateHeartbeat(client, now);
        });
}


async function Jitter() {
    return Math.floor(Math.random() * 1450) + 50;
}


module.exports = {
    execute
};

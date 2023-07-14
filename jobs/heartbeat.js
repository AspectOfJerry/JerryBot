import CronJob from "cron";
import fetch from "node-fetch";

import {logger, sleep} from "../modules/jerryUtils.js";
import {checklistHeartbeat, updateHeartbeat} from "../modules/telemetry";


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
                    logger.append("debug", "CRON", "[Heartbeat] Heartbeat sent to the status page.");
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

            logger.append("error", "STDERR", "[Heartbeat] An error occurred while sending the Heartbeat. Retrying in 6 seconds.");
            await sleep(5000 + jitter());
            await fetch("https://betteruptime.com/api/v1/heartbeat/ixeh3Ufdvq9EKWznsZMPFrpq", {method: "POST"})
                .then(() => {
                    logger.append("debug", "CRON", "[Heartbeat] Catch Heartbeat sent to status page.");
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
    logger.append("debug", "INIT", "[Heartbeat] Heartbeat cron job started!");

    logger.append("info", "INIT", "[Heartbeat] Heartbeat daemon started!");
    console.log("[Heartbeat] Heartbeat daemon started!");

    await fetch("https://betteruptime.com/api/v1/heartbeat/ixeh3Ufdvq9EKWznsZMPFrpq")
        .then(() => {
            logger.append("debug", "INIT", "[Heartbeat] The first Heartbeat was sent to the status page.");
            const now = Math.round(Date.now() / 1000);
            updateHeartbeat(client, now);
        });
}


function jitter() {
    return Math.floor(Math.random() * 1450) + 50;
}


export {
    execute
};

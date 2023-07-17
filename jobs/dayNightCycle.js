import CronJob from "cron";

import {logger, sleep} from "../modules/jerryUtils.js";

let disabled = false;

async function execute(client) {
    /**
     * Triggers at 06h00 every day
     */
    const online = new CronJob("00 6 * * *", async () => {
        client.user.setStatus("online");

        logger.append("info", "CRON", "[DayNightCycle] Successfully the bot's status to online.");
    });

    /**
     * Triggers at 22h30 every day
     */
    const idle = new CronJob("30 22 * * *", async () => {
        client.user.setStatus("idle");

        logger.append("info", "CRON", "[DayNightCycle] Successfully the bot's status to idle.");
    });

    online.start();
    logger.append("debug", "INIT", "[DayNightCycle] online cron job started!");
    idle.start();
    logger.append("debug", "INIT", "[DayNightCycle] idle cron job started!");

    console.log("Day/night cycle daemon started!");
    logger.append("info", "INIT", "[DayNightCycle] Day/night cycle daemon started!");
}


export {
    execute
};

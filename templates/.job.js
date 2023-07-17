import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";

import CronJob from "cron";
import fetch from "node-fetch";

import {logger, sleep} from "../modules/jerryUtils.js";

let disabled = false;


async function execute(client) {
    const STRING = new CronJob("* * * * *", async () => { // Interval of INTERVAL

    });

    STRING.start();
    logger.append("debug", "INIT", "[]  cron job started!");

    console.log("JOBNAME started!");
    logger.append("info", "INIT", "[]  daemon started!");
}


export {
    execute
};

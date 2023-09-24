import {CronJob} from "cron";
import fs from "fs";
import dayjs from "dayjs";

import {logger, sleep} from "../utils/jerryUtils.js";

let disabled = false;


const counter = {
    "DEBUG": 0,
    "ERROR": 0,
    "FATAL": 0,
    "INFO": 0,
    "WARN": 0
};

async function execute(client) {
    /**
     * Triggers every day
     */
    const digest = new CronJob("0 0 * * *", async () => {
        // await sleep(100);

        const yesterday = dayjs().subtract(1, "day");

        const file_name = dayjs.format(yesterday, "YYYY-MMMM");
        const prefix = dayjs.format(yesterday, "YYYY-MM-DD");

        const total_events = Object.values(counter).reduce((a, b) => {return a + b;}, 0);

        const body = `[${prefix}] Total events: ${total_events},
    DEBUG: ${counter.DEBUG},
    ERROR: ${counter.ERROR},
    FATAL: ${counter.FATAL},
    INFO: ${counter.INFO},
    WARN: ${counter.WARN}`;

        // Append to file
        fs.appendFile(`./logs/digest/${file_name}_JerryBot.log`, body + "\n", (err) => {
            if(err) {
                throw err;
            }
        });

        logger.append("debug", "Digest", `Successfully saved ${yesterday}'s digest`);

        // Reset counter
        Object.keys(counter).forEach((key) => {counter[key] = 0;});
    });

    digest.start();
    logger.append("debug", "INIT", "[Digest] digest CRON job started!");

    console.log("[Digest] Log digest started!");
    logger.append("info", "INIT", "[Digest] Log digest daemon started!");
}


function registerEvent(type, amount) {
    amount = amount ?? 1;

    const types = ["DEBUG", "ERROR", "FATAL", "INFO", "WARN"];

    if(!types.includes(type)) {
        throw `Invalid type tag of ${type}`;
    }

    counter[type] += amount;
}


export {
    execute,
    registerEvent
};

const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");

const CronJob = require("cron").CronJob;
const fs = require("fs");
const date = require("date-and-time");

// const {log, sleep} = require("../modules/JerryUtils.js");

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

        const now = new Date();
        const yesterday = date.addDays(now, -1);

        const file_name = date.format(yesterday, "YYYY-MMMM");
        const prefix = date.format(yesterday, "YYYY-MM-DD");

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

        // log("append", "Digest", `Successfully saved ${yesterday}'s digest`, "INFO");

        // Reset counter
        Object.keys(counter).forEach((key) => {counter[key] = 0;});
    });

    digest.start();

    // log("append", "log_digest", "[Digest] Log digest started!", "DEBUG");
    console.log("[Digest] Log digest started!");
}


function registerEvent(type, amount) {
    amount = amount ?? 1;

    const types = ["DEBUG", "ERROR", "FATAL", "INFO", "WARN"];

    if(!types.includes(type)) {
        throw `Invalid type tag of ${type}`;
    }

    counter[type] + amount;
}


module.exports = {
    execute,
    registerEvent
};

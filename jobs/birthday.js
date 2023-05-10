const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");

const CronJob = require("cron").CronJob;
const fetch = require("node-fetch");

const {log, sleep} = require("../modules/JerryUtils.js");

let disabled = false;


async function execute(client) {
    const birthday = new CronJob("30 6 * * *", async () => { // Interval of every day at

        log("append", "birthday", "[Birthday] Checking birthdays...", "DEBUG");
        console.log("Checking birthdays...");
    });

    birthday.start();

    console.log("birthday announcer started!");
    log("append", "birthday", "[Birthday] birthday announcer started", "DEBUG");
}


module.exports = {
    execute
};

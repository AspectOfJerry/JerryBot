const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");

const CronJob = require("cron").CronJob;
const fetch = require("node-fetch");

const {log, sleep} = require("../modules/JerryUtils.js");

let disabled = false;


async function execute(client) {
    const birthday = new CronJob("30 6 * * *", async () => { // Interval of every day at

    });

    birthday.start();

    log("append", "birthday", "[Birthday] birthday announcer started", "DEBUG");
    console.log("birthday announcer started!");
}


module.exports = {
    execute
};

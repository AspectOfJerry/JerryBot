const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");

const CronJob = require("cron").CronJob;
const fetch = require("node-fetch");

const {Log, Sleep} = require("../modules/JerryUtils.js");


module.exports = async function (client) {
    const online = new CronJob("00 6 * * *", async () => { // Interval of 06h00 everyday
        client.user.setStatus("online");

        Log("append", 'day_night_cycle', "[CycleDay] Successfully the bot's status to online.", "DEBUG");
    });

    const idle = new CronJob("45 21 * * *", async () => { // Interval of 29h45 everyday
        client.user.setStatus("idle");

        Log("append", "day_night_cycle", "[CycleNight] Successfully the bot's status to idle.", "DEBUG");
    });

    online.start();
    idle.start();

    console.log("Day/night cycle started!");
};

const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");

const CronJob = require("cron").CronJob;
const fs = require("fs");
const date = require('date-and-time');
const fetch = require("node-fetch");

const {Log, Sleep} = require("../modules/JerryUtils.js");


let logged = {

};

async function Execute(client) {
    const digest = new CronJob("0 0 * * *", async () => { // Interval of INTERVAL
        await Sleep(100);

        const now = newDate();
        const yesterday = date.addDays(now, -1);

        const file_name = yesterday.format(yesterday, "YYYY-MMMMM ");

        const body = `[${file_name}] The quick brown fox jumps over the lazy dog.`;

        // Append to file
        fs.appendFile(`./logs/digest/${file_name}_JerryBot.log`, body + "\n", (err) => {
            if(err) {
                throw err;
            }
        });

        Log("append", "Digest", `Successfully saved ${yesterday}'s digest`, "INFO");

        logged = {};
    });

    digest.start();

    Log("append", "log_digest", "[Digest] started!", "DEBUG");
    console.log("Digest started!");
};


async function RegisterEvent(type, amount) {
    amount = amount ?? 1;

    const types = ["DEBUG", "ERROR", "FATAL", "INFO", "WARN"];

    if(!types.includes(type)) {
        throw `Invalid type tag of ${type}`;
    }

    logged[type]++

}


module.exports = {
    Execute
};

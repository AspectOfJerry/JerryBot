import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";

import CronJob from "cron";
import date from "date-and-time";
import {getBirthdayByDate} from "../database/mongodb.js";

import {log, sleep} from "../modules/jerryUtils.js";

let disabled = false;


async function execute(client) {
    const birthday = new CronJob("30 6 * * *", async () => { // Interval of every day at
        const now = new Date();
        const _date = date.format(now, "D-M").split("-");

        log("append", "birthday", "[Birthday] Checking birthdays...", "DEBUG");

        const birthdays = await getBirthdayByDate(_date[0], _date[1]);

        if(!birthdays) {
            log("append", "birthday", "[Birthday] No birthdays to report today.", "INFO");
            return;
        }

        for(const birthday of birthdays) {
            const channels = [];
            if(birthday.notes.includes("cra")) {
                channels.push(client.channels.resolve("1014293537363341332"));
            }

            const bday = new MessageEmbed()
                .setColor("GOLD")
                .setTitle(":tada: Happy birthday!")
                .setDescription(`:birthday: Happy Birthday to ${birthday.name} (<@${birthday.id}>)! :partying_face: Let's all wish them a fantastic day!`)
                .setFooter({text: `${date.format(new Date(), "dddd, MMMM D, YYYY")}`});

            for(const channel of channels) {
                channel.send({content: `Happy birthday, <@${birthday.id}>!`, embeds: [bday]});
                log("append", "birthday", `[Birthday] Wished ${birthday.name} a happy birthday in "#${channel.name}/${channel.guild.name}"!`, "INFO");
            }
        }
    });

    birthday.start();

    console.log("birthday announcer started!");
    log("append", "birthday", "[Birthday] birthday announcer started", "DEBUG");
}


export {
    execute
};

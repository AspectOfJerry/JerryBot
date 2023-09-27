import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";

import {CronJob} from "cron";
import dayjs from "dayjs";
import {getBirthdayByDate} from "../database/mongodb.js";

import {logger, sleep} from "../utils/jerryUtils.js";

let disabled = false;


async function execute(client) {
    return; // temporarily disabled
    const birthday = new CronJob("30 6 * * *", async () => { // Interval of every day at
        const now = dayjs();
        const _date = dayjs.format(now, "D-M").split("-");

        logger.append("debug", "CRON", "[Birthday] Checking birthdays...");

        const birthdays = await getBirthdayByDate(_date[0], _date[1]);

        if(!birthdays) {
            logger.append("info", "CRON", "[Birthday] No birthdays to report today.");
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
                .setFooter({text: `${dayjs().format("MMMM Do, YYYY")}`});

            for(const channel of channels) {
                channel.send({content: `Happy birthday, <@${birthday.id}>!`, embeds: [bday]});
                logger.append("info", "CRON", `[Birthday] Wished ${birthday.name} a happy birthday in "#${channel.name}/${channel.guild.name}"!`);
            }
        }
    });

    birthday.start();
    logger.append("debug", "INIT", "[birthday] birthday cron job started!");

    console.log("Birthday announcer started!");
    logger.append("info", "INIT", "[Birthday]  Birthday announcer daemon started!");
}


export {
    execute
};

import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";

import CronJob from "cron";

import {logger, sleep} from "../utils/jerryUtils.js";
import {getExceptions, getCdayByDate, getFullDateString, getScheduleByCday} from "../database/controllers/cra.js";
import dayjs from "dayjs";


let _disabled = false;

async function execute(client) {
    /**
     * Triggers every day, at 06h30
     */
    const daily_cra = new CronJob("30 06 * * *", async () => {
        if(_disabled) {
            return;
        }

        logger.append("debug", "CRON", "[Schedule] Fetching today's schedule...");

        const guild = await client.guilds.fetch("1014278986135781438");
        const channel = await guild.channels.fetch("1015060767403421696");

        channel.sendTyping();

        const cohort = "testCohort";

        let jour = await getCdayByDate(cohort, dayjs("2023-04-03", "YYYY-MM-DD").toDate());

        if(jour === "DISABLE") {
            daily_cra.stop();
            console.log("Disabled schedule announcer.");
            logger.append("debug", "CRON", "[Schedule] End of school year; disabling daily schedule announcer");
            return;
        }

        const day = await getFullDateString();

        if(jour === "EOY") {
            // const schedule_message = "<@&1016500157480706191>, End of school year reached!";
            const schedule_message = "End of school year reached!";

            const schedule_embed = new MessageEmbed()
                .setColor("GREEN")
                .setTitle(`:newspaper: ${day}`)
                .setDescription("Detected the end of the school year. Daily schedule posting has been automatically disabled.");

            await channel.send({content: "<@&1016500157480706191>, Good morning, here's **today's** schedule for **401**!", embeds: [schedule_embed]});
            await channel.send({content: schedule_message})
                .then((msg) => {
                    msg.react("🎉");
                });
            logger.append("info", "CRON", "[Schedule] Successfully posted today's schedule (End of year reached).");

            _disabled = true;
            return;
        }

        if(isNaN(jour)) {
            const schedule_message = `${jour}: No school`;

            const schedule_embed = new MessageEmbed()
                .setColor("YELLOW")
                .setTitle(`:newspaper: [${jour}] ${day}`)
                // .setDescription(`:hourglass: There are ${days_to_frc} days remaining before the first FRC match!\n\n:calendar_spiral: No school today!`);
                .setDescription(":calendar_spiral: No school today!");

            // if(days_to_frc === 1 || days_to_frc === 0) {
            //     schedule_embed
            //         .setDescription(`:hourglass: There is ${days_to_frc} day remaining before the first FRC match!\n\n:calendar_spiral: No school today!`);
            // }

            await channel.send({content: "Good morning, here's **today's** schedule for **311**!", embeds: [schedule_embed]});
            await channel.send({content: schedule_message})
                .then((msg) => {
                    msg.react("✅");
                });
            logger.append("info", "CRON", `[Schedule] Successfully posted today's schedule (${schedule_message}).`);
            return;
        }

        const schedule = await getScheduleByCday(cohort, jour);

        jour = jour.toString();

        if(jour.length == 1) {
            jour = "0".toString() + jour;
        }

        const schedule_message = `Jour ${jour}:` +
            ` ${schedule.period1.className},` +
            ` ${schedule.period2.className},` +
            ` ${schedule.period3.className},` +
            ` ${schedule.period4.className},` +
            ` ${schedule.period6.className}`;

        const schedule_embed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle(`:newspaper: [Jour ${jour}] ${day}`)
            // .setDescription(`:hourglass: There are ${days_to_frc} days remaining before the first FRC match!\n\n:calendar_spiral: This is the schedule for Jour ${jour} (**today**).`)
            .setDescription(`:calendar_spiral: This is the schedule for Jour ${jour} (**today**).`)
            .addFields(
                {name: `P1 ${schedule.period1.className}`, value: `• ${schedule.period1.classroom}${schedule.period1.notes}`, inline: false},
                {name: `P2 ${schedule.period2.className}`, value: `• ${schedule.period2.classroom}${schedule.period2.notes}`, inline: false},
                {name: `P3 ${schedule.period3.className}`, value: `• ${schedule.period3.classroom}${schedule.period3.notes}`, inline: false},
                {name: `P4 ${schedule.period4.className}`, value: `• ${schedule.period4.classroom}${schedule.period4.notes}`, inline: false},
                {name: `P5 ${schedule.period5.className}`, value: `• ${schedule.period5.classroom}${schedule.period5.notes}`, inline: false},
                {name: `P6 ${schedule.period6.className}`, value: `• ${schedule.period6.classroom}${schedule.period6.notes}`, inline: false}
            ).setFooter({
                text: `Jour ${jour}:` +
                    ` ${schedule.period1.classCode},` +
                    ` ${schedule.period2.classCode},` +
                    ` ${schedule.period3.classCode},` +
                    ` ${schedule.period4.classCode}` +
                    " |" +
                    ` ${schedule.period6.classCode}`
            });

        // if(days_to_frc === 1 || days_to_frc === 0) {
        //     schedule_embed
        //         .setDescription(`:hourglass: There is ${days_to_frc} day remaining before the first FRC match!\n\n:calendar_spiral: This is the schedule for Jour ${jour} (**today**).`)
        // }

        await channel.send({content: "<@&1016500157480706191> Good morning, here's **today's** schedule for **311**!", embeds: [schedule_embed]});
        await channel.send({content: schedule_message})
            .then((msg) => {
                msg.react("✅");
            });
        logger.append("info", "CRON", `[Schedule] Successfully posted today's schedule (${schedule_message}).`);
    });

    // daily_cra.start();
    // logger.append("debug", "CRON","[Daily] daily_cra CRON job started!");

    console.log("[Schedule] Daily announcer daemon! @06h30 everyday.");
    logger.append("info", "CRON", "[Daily] Daily announcer daemon! @06h30 everyday.");
}


export {
    execute
};

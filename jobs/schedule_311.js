const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");

const CronJob = require('cron').CronJob;
const fetch = require("node-fetch");
const date = require("date-and-time");

const {Log, Sleep} = require("../modules/JerryUtils.js");
const {GetFullSchedule, GetExceptions, GetDate, GetFullDateString, GetFRCDays, GetJourByDate, GetScheduleByJour} = require('../database/commands/exclusive/schedule/dbms');

let disabled = false;


async function Execute(client) {
    const schedule_311 = new CronJob("30 06 * * *", async () => { // Interval of 1 day, at 06h30
        if(disabled) {
            return;
        }

        await Log("append", 'schedule311', `[311] Posting today's schedule...`, "DEBUG");

        const guild = await client.guilds.fetch("1014278986135781438");
        const channel = await guild.channels.fetch("1015060767403421696");

        const waiting_schedule = await channel.send({content: "Fetching the schedule..."});
        channel.sendTyping();


        let jour = await GetJourByDate();
        const day = await GetFullDateString();

        const days_to_frc = await GetFRCDays(await GetDate());

        if(isNaN(jour)) {
            const schedule_message = `${jour}: No school`;

            const schedule_embed = new MessageEmbed()
                .setColor("YELLOW")
                .setTitle(`:newspaper: [${jour}] ${day}`)
                .setDescription(`:hourglass: There are ${days_to_frc} days remaining before the first FRC match!\n\n:calendar_spiral: No school today!`);

            if(days_to_frc === 1 || days_to_frc === 0) {
                schedule_embed
                    .setDescription(`:hourglass: There is ${days_to_frc} day remaining before the first FRC match!\n\n:calendar_spiral: No school today!`);
            }

            waiting_schedule.delete();
            await channel.send({content: `Good morning, here's **today's** schedule for **311**!`});
            await channel.send({embeds: [schedule_embed]});
            await channel.send({content: schedule_message})
                .then((msg) => {
                    msg.react("✅");
                });
            await Log("append", "schedule311", `[311] Successfully posted today's schedule (${schedule_message}).`, "INFO");
            return;
        }

        const schedule = await GetScheduleByJour(jour);

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
            .setDescription(`:hourglass: There are ${days_to_frc} days remaining before the first FRC match!\n\n:calendar_spiral: This is the schedule for Jour ${jour} (**today**).`)
            .addFields(
                {name: `P1 ${schedule.period1.className}`, value: `• Classroom: ${schedule.period1.classroom}${schedule.period1.notes}`, inline: false},
                {name: `P2 ${schedule.period2.className}`, value: `• Classroom: ${schedule.period2.classroom}${schedule.period2.notes}`, inline: false},
                {name: `P3 ${schedule.period3.className}`, value: `• Classroom: ${schedule.period3.classroom}${schedule.period3.notes}`, inline: false},
                {name: `P4 ${schedule.period4.className}`, value: `• Classroom: ${schedule.period4.classroom}${schedule.period4.notes}`, inline: false},
                {name: `P5 ${schedule.period5.className}`, value: `• Classroom: ${schedule.period5.classroom}${schedule.period5.notes}`, inline: false},
                {name: `P6 ${schedule.period6.className}`, value: `• Classroom: ${schedule.period6.classroom}${schedule.period6.notes}`, inline: false}
            ).setFooter({
                text: `Jour ${jour}:` +
                    ` ${schedule.period1.className},` +
                    ` ${schedule.period2.className},` +
                    ` ${schedule.period3.className},` +
                    ` ${schedule.period4.className},` +
                    ` ${schedule.period5.className},` +
                    ` ${schedule.period6.className}`
            });

        if(days_to_frc === 1 || days_to_frc === 0) {
            schedule_embed
                .setDescription(`:hourglass: There is ${days_to_frc} day remaining before the first FRC match!\n\n:calendar_spiral: This is the schedule for Jour ${jour} (**today**).`)
        }

        waiting_schedule.delete();
        await channel.send({content: `<@&1016500157480706191> Good morning, here's **today's** schedule for **311**!`});
        await channel.send({embeds: [schedule_embed]});
        await channel.send({content: schedule_message})
            .then((msg) => {
                msg.react('✅');
            });
        await Log("append", "schedule311", `[311] Successfully posted today's schedule (${schedule_message}).`, "INFO");
    });

    schedule_311.start();

    Log("append", "schedule311", `[311] The 311 daily schedule announcer job has been started! The CRON job was set to 06h30 everyday.`, "DEBUG");
    console.log(`[311] The 311 daily schedule announcer job has been started! The CRON job was set to 06h45 everyday.`);
}


module.exports = {
    Execute
};

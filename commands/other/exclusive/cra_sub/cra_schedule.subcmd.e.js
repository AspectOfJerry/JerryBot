import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";

import {logger, permissionCheck, sleep} from "../../../../utils/jerryUtils.js";
import {getCdayByDate, getExceptions, getFullDateString, getScheduleByCday} from "../../../../database/controllers/cra.js";
import dayjs from "dayjs";


export default async function (client, interaction) {
    await interaction.deferReply();
    if(await permissionCheck(interaction, 0) === false) {
        return;
    }

    // Declaring variables
    const cohort = "testCohort";
    const testDate = "2022-08-30";

    // Checks

    // Main
    // let cDay = interaction.options.getString("day") ?? await getJourByDate(cohort);
    let cDay = interaction.options.getString("day") ?? interaction.options.getString("date")
        ? await getCdayByDate(cohort, dayjs(interaction.options.getString("date")))
        : null ?? await getCdayByDate(cohort, dayjs(testDate));

    console.log(cDay);

    return;

    const day = await getFullDateString(testDate);

    if(cDay === "EOY" || cDay === "DISABLE") {
        // const schedule_message = "<@&1016500157480706191>, End of school year reached!";
        const schedule_message = "End of school year reached!";

        const schedule_embed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle(`:newspaper: ${day}`)
            .setDescription("Detected the end of the school year. Have an amazing break!");

        interaction.editReply({content: schedule_message, embeds: [schedule_embed]})
            .then((msg) => {
                msg.react("🎉");
            });
        return;
    }


    if(isNaN(cDay)) {
        const schedule_embed = new MessageEmbed()
            .setColor("YELLOW")
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle(`:newspaper: [${cDay}] ${day}`)
            // .setDescription(`:hourglass: There are ${days_to_frc} days remaining before the first FRC match!\n\n:calendar_spiral: No school today!`);
            .setDescription(":calendar_spiral: No school today!");

        // if(days_to_frc === 1 || days_to_frc === 0) {
        //     schedule_embed
        //         .setDescription(`:hourglass: There is ${days_to_frc} day remaining before the first FRC match!\n\n:calendar_spiral: No school today!`);
        // }

        interaction.editReply({content: "Here's **today's** schedule!", embeds: [schedule_embed]});
        return;
    }

    const _schedule = await getScheduleByCday(cohort, cDay);
    const schedule = _schedule.cDay;

    cDay = cDay.toString();

    if(cDay.length == 1) {
        cDay = "0".toString() + cDay;
    }

    // const schedule_message = `Jour ${cDay}:` +
    //     ` ${schedule.period1.className},` +
    //     ` ${schedule.period2.className},` +
    //     ` ${schedule.period3.className},` +
    //     ` ${schedule.period4.className},` +
    //     ` ${schedule.period6.className}`;

    const schedule_embed = new MessageEmbed()
        .setColor("GREEN")
        .setTitle(`:newspaper: [Jour ${cDay}] ${day}`)
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        // .setDescription(`:hourglass: There are ${days_to_frc} days remaining before the first FRC match!\n\n:calendar_spiral: This is the schedule for Jour ${cDay}.`)
        .setDescription(`:calendar_spiral: This is the Daily for ${_schedule.cohort}.`)
        .addFields(
            {
                name: "Schedule",
                value: `1. ${schedule.p1.classCode} @ ${schedule.p1.classroom}${schedule.p1.notes ? ` (${schedule.p1.notes})` : ""}`
                    + `\n2. ${schedule.p2.classCode} @ ${schedule.p2.classroom}${schedule.p2.notes ? ` (${schedule.p2.notes})` : ""}`
                    + `\n3. ${schedule.p3.classCode} @ ${schedule.p3.classroom}${schedule.p3.notes ? ` (${schedule.p3.notes})` : ""}`
                    + `\n4. ${schedule.p4.classCode} @ ${schedule.p4.classroom}${schedule.p4.notes ? ` (${schedule.p4.notes})` : ""}`
                    + `\n5. ${schedule.p5.classCode} @ ${schedule.p5.classroom}${schedule.p5.notes ? ` (${schedule.p5.notes})` : ""}`
                    + `\n6. ${schedule.p6.classCode} @ ${schedule.p6.classroom}${schedule.p6.notes ? ` (${schedule.p6.notes})` : ""}`,
                inline: false
            },
        );

    // if(days_to_frc === 1 || days_to_frc === 0) {
    //     schedule_embed
    //         .setDescription(`:hourglass: There is ${days_to_frc} day remaining before the first FRC match!\n\n:calendar_spiral: This is the schedule for Jour ${cDay} (**today**).`);
    // }

    interaction.editReply({content: "Here's **today's** schedule!", embeds: [schedule_embed]});
    // interaction.channel.send({content: schedule_message});
}

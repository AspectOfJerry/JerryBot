const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");

const {log, permissionCheck, sleep} = require("../../../../modules/JerryUtils.js");
const {GetFullSchedule, GetExceptions, GetDate, GetFullDateString, GetFRCDays, GetJourByDate, GetScheduleByJour} = require("../../../../database/commands/exclusive/schedule/dbms");

const date = require("date-and-time");


module.exports = async function (client, interaction) {
    await interaction.deferReply();
    if(await permissionCheck(interaction, 0) === false) {
        return;
    }

    // Declaring variables

    // Checks

    // Main
    let jour = interaction.options.getString("day") ?? await GetJourByDate();
    const day = await GetFullDateString();

    if(jour === "EOY" || jour === "DISABLE") {
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


    const days_to_frc = await GetFRCDays(await GetDate());

    if(isNaN(jour)) {
        const schedule_embed = new MessageEmbed()
            .setColor("YELLOW")
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle(`:newspaper: [${jour}] ${day}`)
            // .setDescription(`:hourglass: There are ${days_to_frc} days remaining before the first FRC match!\n\n:calendar_spiral: No school today!`);
            .setDescription(":calendar_spiral: No school today!");

        // if(days_to_frc === 1 || days_to_frc === 0) {
        //     schedule_embed
        //         .setDescription(`:hourglass: There is ${days_to_frc} day remaining before the first FRC match!\n\n:calendar_spiral: No school today!`);
        // }

        interaction.editReply({content: "Here's **today's** schedule!", embeds: [schedule_embed]});
        return;
    }

    const schedule = await GetScheduleByJour(jour);

    jour = jour.toString();

    if(jour.length == 1) {
        jour = "0".toString() + jour;
    }

    // const schedule_message = `Jour ${jour}:` +
    //     ` ${schedule.period1.className},` +
    //     ` ${schedule.period2.className},` +
    //     ` ${schedule.period3.className},` +
    //     ` ${schedule.period4.className},` +
    //     ` ${schedule.period6.className}`;

    const schedule_embed = new MessageEmbed()
        .setColor("GREEN")
        .setTitle(`:newspaper: [Jour ${jour}] ${day}`)
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        // .setDescription(`:hourglass: There are ${days_to_frc} days remaining before the first FRC match!\n\n:calendar_spiral: This is the schedule for Jour ${jour}.`)
        .setDescription(`:calendar_spiral: This is the schedule for Jour ${jour}.`)
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
    //         .setDescription(`:hourglass: There is ${days_to_frc} day remaining before the first FRC match!\n\n:calendar_spiral: This is the schedule for Jour ${jour} (**today**).`);
    // }

    interaction.editReply({content: "Here's **today's** schedule!", embeds: [schedule_embed]});
    // interaction.channel.send({content: schedule_message});
};

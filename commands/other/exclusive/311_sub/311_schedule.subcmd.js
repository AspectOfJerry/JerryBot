const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");

const {PermissionCheck, Log, Sleep} = require("../../../../modules/JerryUtils");
const {GetFullSchedule, GetExceptions, GetDate, GetFullDateString, GetFRCDays, GetJourByDate, GetScheduleByJour} = require('../../../../database/commands/exclusive/schedule/dbms');

const date = require('date-and-time');


module.exports = async function (client, interaction) {
    await interaction.deferReply();

    if(await PermissionCheck(interaction) === false) {
        return;
    }

    // Declaring variables

    // Checks

    // Main
    let jour = await GetJourByDate();
    const day = await GetFullDateString();

    const days_to_frc = await GetFRCDays(await GetDate());

    if(isNaN(jour)) {
        const schedule_message = `${jour} No school`;

        const schedule_embed = new MessageEmbed()
            .setColor("YELLOW")
            .setTitle(`:newspaper: [${jour}] ${day}`)
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setDescription(`:hourglass: There are ${days_to_frc} days remaining before the first FRC match!\n\n:calendar_spiral: No school today!`);

        await interaction.editReply({content: `Here's **today's** schedule!`});
        await interaction.channel.send({embeds: [schedule_embed]});
        await interaction.channel.send({content: schedule_message});
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
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        .setDescription(`:hourglass: There are ${days_to_frc} days remaining before the first FRC match!\n\n:calendar_spiral: This is the schedule for Jour ${jour}.`)
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

    await interaction.editReply({content: `Here's **today's** schedule!`});
    await interaction.channel.send({embeds: [schedule_embed]});
    await interaction.channel.send({content: schedule_message});
};

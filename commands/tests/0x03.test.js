const fs = require('fs');
const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const {Log, Sleep} = require('../../modules/JerryUtils');
const {GetFullSchedule, GetExceptions, GetDate, GetDateString, GetJourByDate, GetScheduleByJour} = require('../other/311/database/dbms');

const test_label = "0x03";

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`test-${test_label}`)
        .setDescription(`[TEST/${test_label}]`)
        .addUserOption((options) =>
            options
                .setName('user')
                .setDescription("[OPTIONAL] User to test")
                .setRequired(false))
    // .addStringOption((options) =>
    //     options
    //         .setName('OPTION_NAME')
    //         .setDescription("[OPTIONAL] OPTION_DESCRIPTION")
    //         .setRequired(false))
    ,
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed a test command (${test_label}).`, 'INFO'); // Logs
        interaction.deferReply();

        // Permission check
        const whitelist_ids = ['611633988515266562'];

        if(!whitelist_ids.includes(interaction.user.id)) {
            const error_permissions = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                .setFooter({text: "You must be whitelisted to use this command."});

            await interaction.reply({embeds: [error_permissions]});
            await Log('append', interaction.guild.id, `└─'${interaction.user.id}' did not have the required role to use this test command (${test_label}). [error_permissions]`, 'WARN'); // Logs
            return;
        }

        // Declaring variables
        let testFailureCount = 0;

        let target = interaction.options.getUser('user') ?? interaction.member;
        let memberTarget = interaction.guild.members.cache.get(target.id);

        // Checks

        // Main
        const guild = await client.guilds.fetch("1014278986135781438");
        const channel = await guild.channels.fetch("1015060767403421696");

        const waiting_schedule = await channel.send("Fetching the schedule...");
        channel.sendTyping();


        let jour = await GetJourByDate();
        const day = await GetDateString();

        if(isNaN(jour)) {
            const schedule_message = `${jour} No school`;

            const schedule_embed = new MessageEmbed()
                .setColor('YELLOW')
                .setTitle(`[${jour}] ${day}`)
                .setDescription("No school today!");

            waiting_schedule.detele();
            await channel.send({content: `Good morning, here's **today's** schedule for **311**!`});
            await channel.send({embeds: [schedule_embed]});
            await channel.send({content: schedule_message})
                .then((msg) => {
                    msg.react('✅');
                });
            await Log('append', 'schedule_311', `[Schedule_311] Successfully posted today's schedule (${schedule_message}).`, 'INFO'); // Logs
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
            .setColor('GREEN')
            .setTitle(`[Jour ${jour}] ${day}`)
            .setDescription(`This is the schedule for Jour ${jour} (**today**).`)
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

        waiting_schedule.detele();
        await channel.send({content: `Good morning, here's **today's** schedule for **311**!`});
        await channel.send({embeds: [schedule_embed]});
        await channel.send({content: schedule_message})
            .then((msg) => {
                msg.react('✅');
            });
    }
};


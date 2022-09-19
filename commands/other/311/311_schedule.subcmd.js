const fs = require('fs');
const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const Sleep = require('../../../modules/sleep'); // delayInMilliseconds
const Log = require('../../../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

const date = require('date-and-time');
const {GetFullSchedule, GetExceptions, GetDate, GetJourByDate, GetScheduleByJour} = require('./database/dbms');

module.exports = async function (client, interaction, is_ephemeral) {
    await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' executed '/311 schedule'.`, 'INFO'); // Logs
    await Log('append', interaction.guild.id, `  ├─ephemeral: ${is_ephemeral}`, 'INFO'); // Logs
    await interaction.deferReply({ephemeral: is_ephemeral});

    // Set minimum execution role
    switch(interaction.guild.id) {
        case process.env.DISCORD_JERRY_GUILD_ID:
            var MINIMUM_EXECUTION_ROLE = null;
            break;
        case process.env.DISCORD_GOLDFISH_GUILD_ID:
            var MINIMUM_EXECUTION_ROLE = null;
            break;
        case process.env.DISCORD_CRA_GUILD_ID:
            var MINIMUM_EXECUTION_ROLE = null;
            break;
        case process.env.DISCORD_311_GUILD_ID:
            var MINIMUM_EXECUTION_ROLE = null;
            break;
        default:
            await Log('append', interaction.guild.id, "└─Throwing because of bad permission configuration.", 'ERROR'); // Logs
            throw `Error: Bad permission configuration.`;
    }

    // Declaring variables

    // Checks
    // -----BEGIN ROLE CHECK-----
    if(MINIMUM_EXECUTION_ROLE !== null) {
        if(!interaction.member.roles.cache.find(role => role.name === MINIMUM_EXECUTION_ROLE)) {
            const error_permissions = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                .setFooter({text: `You need at least the '${MINIMUM_EXECUTION_ROLE}' role to use this command.`});

            await interaction.editReply({embeds: [error_permissions]});
            await Log('append', interaction.guild.id, `  └─'${interaction.user.id}' did not have the required role to use '/311 schedule'.`, 'WARN'); // Logs
            return;
        }
    }
    // -----END ROLE CHECK-----
    if(interaction.guild.id != "1014278986135781438") {
        const cmd_not_avail_in_guild = new MessageEmbed()
            .setColor('RED')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription("This command is not available in this guild!");

        await interaction.editReply({embeds: [cmd_not_avail_in_guild]});
        return;
    }

    // Main
    let jour = await GetJourByDate();
    let _day = await GetDate();
    const day = date.format(_day, 'dddd, MMMM DD, YYYY');

    if(isNaN(jour)) {
        const schedule_message = `${jour} No school`;

        const schedule_embed = new MessageEmbed()
            .setColor('YELLOW')
            .setTitle(`[${jour}] ${day}`)
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setDescription("No school today!");

        await interaction.editReply({content: `Here's today's schedule!`});
        await interaction.channel.send({content: schedule_message, embeds: [schedule_embed]});
        return;
    }
    const schedule = await GetScheduleByJour(jour);
    jour = jour.toString();

    if(jour.length == 1) {
        jour = "0".toString() + jour;
    }

    const schedule_message = `<@${interaction.user.id}>; J${jour}:` +
        ` ${schedule.period1.classcode} (${schedule.period1.classroom}),` +
        ` ${schedule.period2.classcode} (${schedule.period2.classroom}),` +
        ` ${schedule.period3.classcode} (${schedule.period3.classroom}),` +
        ` ${schedule.period4.classcode} (${schedule.period4.classroom}),` +
        ` ${schedule.period6.classcode} (${schedule.period6.classroom})`;

    const schedule_embed = new MessageEmbed()
        .setColor('GREEN')
        .setTitle(`[Jour ${jour}] ${day}`)
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        .setDescription(`This is the schedule for Jour ${jour}.`)
        .addField(`Period 1: `, `• Classcode: ${schedule.period1.classcode}\n• Classroom: ${schedule.period1.classroom}${schedule.period1.notes}`, false)
        .addField(`Period 2: `, `• Classcode: ${schedule.period2.classcode}\n• Classroom: ${schedule.period2.classroom}${schedule.period2.notes}`, false)
        .addField(`Period 3: `, `• Classcode: ${schedule.period3.classcode}\n• Classroom: ${schedule.period3.classroom}${schedule.period3.notes}`, false)
        .addField(`Period 4: `, `• Classcode: ${schedule.period4.classcode}\n• Classroom: ${schedule.period4.classroom}${schedule.period4.notes}`, false)
        .addField(`Period 5: `, `• Classcode: ${schedule.period5.classcode}\n• Classroom: ${schedule.period5.classroom}${schedule.period5.notes}`, false)
        .addField(`Period 6: `, `• Classcode: ${schedule.period6.classcode}\n• Classroom: ${schedule.period6.classroom}${schedule.period6.notes}`, false)
        .setFooter({
            text: `Jour ${jour}:` +
                ` ${schedule.period1.classcode},` +
                ` ${schedule.period2.classcode},` +
                ` ${schedule.period3.classcode},` +
                ` ${schedule.period4.classcode},` +
                ` ${schedule.period5.classcode},` +
                ` ${schedule.period6.classcode}`
        });

    await interaction.editReply({content: `Here's today's schedule!`});
    await interaction.channel.send({content: schedule_message, embeds: [schedule_embed]});
};

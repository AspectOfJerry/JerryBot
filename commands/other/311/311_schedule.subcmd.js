const fs = require('fs');
const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const Sleep = require('../../../modules/sleep'); // delayInMilliseconds
const Log = require('../../../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

const date = require('date-and-time');
const {GetFullSchedule, GetJourByDate, GetExceptions} = require('./database/dbms');

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
    }
    // Main
    const schedule_message = `<@&1016500157480706191>; J00: XYZ(A123), XYZ(B123), XYZ(C123), XYZ(D123), XYZ(E123)`;

    const schedule_embed = new MessageEmbed()
        .setTitle('[JOUR 00] Monday, January 00, 0000')
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        .setDescription("this will be the embed for the schedule!");

    await interaction.editReply({content: `Good morning, here's today's schedule!`});
    await interaction.channel.send({content: schedule_message, embeds: [schedule_embed]})

    async function GetDate() {
        const _now = new Date();
        const now = date.format(_now, 'YYYY-MM-DD');
        return now;
    }
    await interaction.channel.send(`GetDate(): ${await GetDate()}`); //

    //async function GetJourByDate() {
    const now = await GetDate();
    const full_schedule = await GetFullSchedule();
    let jour = 1;

    let firstDay = full_schedule.metadata.firstJourDate;
    let _day = date.parse(firstDay, 'YYYY-MM-DD')
    console.log(_day)
    let day = date.format(_day, 'YYYY-MM-DD');
    console.log(day)
    await Sleep(500)

    while(day != now) {
        console.log(`${jour} | ${day}`);
        jour++;

        // Check for exceptions here

        _day = date.parse(day, 'YYYY-MM-DD');
        _day = date.addDays(_day, 1);
        day = date.format(_day, 'YYYY-MM-DD');

        if(jour > 18) {
            jour = 1;
        }
        await Sleep(25);
    }
    console.log(`>>> ${jour} | ${day}`);
    // return jour;
    //}

    await interaction.channel.send(`GetJourByDate(): ${await GetJourByDate()}`);
};

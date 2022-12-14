const fs = require('fs');
const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const {Log, Sleep} = require('../../modules/JerryUtils');
const {GetFullSchedule, GetExceptions, GetDate, GetDateString, GetFRCRemainingDays, GetJourByDate, GetScheduleByJour} = require('../other/311/database/dbms');

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
        await interaction.reply(`Executing Test ${test_label}...`);
        // interaction.deferReply()

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
        await interaction.followUp("Hello, World!");
    }
};
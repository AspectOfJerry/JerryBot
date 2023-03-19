const fs = require("fs");
const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const {PermissionCheck, Log, Sleep} = require("../../modules/JerryUtils.js");
const {GetFullSchedule, GetExceptions, GetDate, GetFullDateString, GetFRCDays, GetJourByDate, GetScheduleByJour} = require('../../database/commands/exclusive/schedule/dbms');

const test_label = "0x03";


module.exports = {
    data: new SlashCommandBuilder()
        .setName(`test-${test_label}`)
        .setDescription(`[TEST/${test_label}]`)
        .addUserOption((options) =>
            options
                .setName("user")
                .setDescription("[OPTIONAL] User to test")
                .setRequired(false))
    // .addStringOption((options) =>
    //     options
    //         .setName('OPTION_NAME')
    //         .setDescription("[OPTIONAL] OPTION_DESCRIPTION")
    //         .setRequired(false))
    ,
    async execute(client, interaction) {
        await interaction.reply(`Executing Test ${test_label}...`);
        // interaction.deferReply()

        // Permission check
        const whitelist_ids = ['611633988515266562'];

        if(!whitelist_ids.includes(interaction.user.id)) {
            const error_permissions = new MessageEmbed()
                .setColor("RED")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("PermissionError")
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the bot administrators if you believe that this is an error.")
                .setFooter({text: "You must be whitelisted to use this command."});

            await interaction.reply({embeds: [error_permissions]});
            await Log("append", interaction.guild.id, `└─'@${interaction.user.tag}' did not have the required role to execute '/${interaction.commandName}${interaction.options.getSubcommand(false) ? " " + interaction.options.getSubcommand(false) : ""}'. [PermissionError]`, "WARN");
            return;
        }

        // Declaring variables
        let testFailureCount = 0;

        let target = interaction.options.getUser("user") ?? interaction.member;
        let memberTarget = interaction.guild.members.cache.get(target.id);

        // Checks

        // Main
        await interaction.followUp('Nothing here...');
    }
};

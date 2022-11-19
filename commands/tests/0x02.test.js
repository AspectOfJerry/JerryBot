const fs = require('fs');
const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const Sleep = require('../../modules/sleep.js'); // delayInMilliseconds
const Log = require('../../modules/logger.js'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

const test_label = "0x02";

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`test-${test_label}`)
        .setDescription(`[TEST/${test_label}] Create test channels`)
    // .addStringOption((options) =>
    //     options
    //         .setName('OPTION_NAME')
    //         .setDescription("[OPTIONAL] OPTION_DESCRIPTION")
    //         .setRequired(false))
    ,
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed a test command (${test_label}).`, 'INFO'); // Logs
        // interaction.deferUpdate()

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
            await Log('append', interaction.guild.id, `└─'${interaction.user.id}' did not have the required role to use this test command. [error_permissions]`, 'WARN'); // Logs
            return;
        }

        // Declaring variables
        let target = interaction.options.getUser('user') || interaction.member;
        let memberTarget = interaction.guild.members.cache.get(target.id);

        // Checks

        // Main
        await interaction.reply(`Executing Test ${test_label}...`);

        const category_id = '1042989616921313341';
        const channel_count = 3;

        let channelName;

        for(let i = 1; i <= channel_count; i++) {
            if(i.toString(16).length <= 1) {
                channelName = "0x0" + i.toString(16).toUpperCase();
            } else {
                channelName = "0x" + i.toString(16).toUpperCase();
            }

            interaction.guild.channels.create("t-" + channelName, {parent: category_id});
            await Sleep(50);
        }
    }
};

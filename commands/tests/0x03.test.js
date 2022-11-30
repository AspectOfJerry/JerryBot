const fs = require('fs');
const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const {Log, Sleep} = require('../../modules/JerryUtils');

const test_label = "0x03";

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`test-${test_label}`)
        .setDescription(`[TEST/${test_label}] embed emoji color test`)
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
        // const whitelist_ids = ['611633988515266562'];

        // if(!whitelist_ids.includes(interaction.user.id)) {
        //     const error_permissions = new MessageEmbed()
        //         .setColor('RED')
        //         .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        //         .setTitle('PermissionError')
        //         .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
        //         .setFooter({text: "You must be whitelisted to use this command."});

        //     await interaction.reply({embeds: [error_permissions]});
        //     await Log('append', interaction.guild.id, `└─'${interaction.user.id}' did not have the required role to use this test command (${test_label}). [error_permissions]`, 'WARN'); // Logs
        //     return;
        // }

        // Declaring variables
        let testFailureCount = 0;

        let target = interaction.options.getUser('user') ?? interaction.member;
        let memberTarget = interaction.guild.members.cache.get(target.id);

        // Checks

        // Main
        await interaction.reply(`Executing Test ${test_label}...`);

        const now = Math.round(Date.now() / 1000);
        const auto_cancel_timestamp = now + 10;

        const embed1 = new MessageEmbed()
            .setColor('YELLOW')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle(`Confirm Kick`)
            .setDescription(`Are you sure you want to kick <@${memberTarget.id}>?`)
            .addFields(
                {name: 'Auto cancel', value: `> :red_square: Canceling <t:${auto_cancel_timestamp}:R>*.`, inline: true}
            ).setFooter({text: "*Relative timestamps can look out of sync depending on your timezone."});

        const embed2 = new MessageEmbed()
            .setColor('YELLOW')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle(`Confirm Kick`)
            .setDescription(`Are you sure you want to kick <@${memberTarget.id}>?`)
            .addFields(
                {name: 'Auto cancel', value: `> :yellow_square: Canceling <t:${auto_cancel_timestamp}:R>*.`, inline: true}
            ).setFooter({text: "*Relative timestamps can look out of sync depending on your timezone."});

        interaction.channel.send({embeds: [embed1, embed2]});
    }
};

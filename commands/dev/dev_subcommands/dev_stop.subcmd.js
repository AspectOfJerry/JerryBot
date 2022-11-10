const fs = require('fs');
const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent} = require('discord.js');
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const Sleep = require('../../../modules/sleep'); // delayInMilliseconds
const Log = require('../../../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = async function (client, interaction) {
    await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' executed '/dev stop'.`, 'INFO'); // Logs

    // Whitelist
    const whitelist = ["611633988515266562"]

    let isWhitelisted = false;

    for(let userId in whitelist) {
        if(interaction.user.id == userId) {
            isWhitelisted = true;
            break;
        }
        continue;
    }

    // -----BEGIN PERMISSION CHECK-----
    if(!isWhitelisted) {
        const error_whitelist = new MessageEmbed()
            .setColor('RED')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle('PermissionError')
            .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
            .setFooter({text: `You are not whitelisted to use this command.`});

        await interaction.reply({embeds: [error_whitelist]});
        await Log('append', interaction.guild.id, `└─'${interaction.user.id}' was not whitelisted to use '/dev stop'. [error_permissions]`, 'WARN'); // Logs
        return;
    } // -----END PERMISSION CHECK-----

    // Declaring variables
    const payload_body = null;

    // Checks

    // Main
    await interaction("This command is currently under development.");
};

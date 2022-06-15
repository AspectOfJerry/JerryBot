const fs = require('fs');
const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const os = require('node:os');

const Sleep = require('../../../modules/sleep'); //delayInMilliseconds;
const Log = require('../../../modules/logger'); //DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─;

module.exports = async function (client, interaction, is_ephemeral) {
    await Log("read", interaction.guild.id, `'${interaction.user.tag}' executed '/stats system'.`, 'INFO'); //Logs
    await Log("read", interaction.guild.id, `├─ephemeral: ${is_ephemeral}`, 'INFO'); //Logs
    //Checks
    let MINIMUM_EXECUTION_ROLE = undefined;
    switch(interaction.guild.id) {
        case process.env.DISCORD_JERRY_GUILD_ID:
            MINIMUM_EXECUTION_ROLE = null;
            break;
        case process.env.DISCORD_GOLDFISH_GUILD_ID:
            MINIMUM_EXECUTION_ROLE = null;
            break;
        case process.env.DISCORD_CRA_GUILD_ID:
            MINIMUM_EXECUTION_ROLE = null;
            break;
        default:
            await Log("read", interaction.guild.id, "Throwing because of bad permission configuration.", "ERROR"); // Logs
            throw `Error: Bad permission configuration.`;
    }

    //Declaring variables
    const ram_total = os.totalmem();
    const ram_free = os.freemem();
    const ram_used = ram_total - ram_free;
    //Checks

    //Code
    const embed = new MessageEmbed()
        .setColor('BLUE')
        .setTitle('System Statistics')
        .setDescription('Here are some statistics about the server running the bot.')
        .addField('Operating System', `${os.version()} (${os.type()}) ${os.release()}`, false)
        .addField(`CPU model (${os.arch()} on ${os.platform()})`, `${os.cpus()[0].model}`, false)
        .addField('CPU logical core count', `${os.cpus().length}`, true)
        .addField('CPU base speed', `${os.cpus()[0].speed} MHz`, true)
        .addField('CPU average load', `*${os.loadavg()} unavailable on Windows*`, true)
        .addField(`Total allocatable RAM`, `${os.totalmem().toLocaleString()} bytes (~${(os.totalmem / 1000000000).toLocaleString()} gigabytes)`, false)
        .addField(`Allocated RAM (~${((os.totalmem() - os.freemem()) / os.totalmem() * 100).toLocaleString()}%)`, `${(os.totalmem() - os.freemem()).toLocaleString()} bytes (~${((os.totalmem() - os.freemem()) / 1000000000).toLocaleString()} gigabytes)`, true)
        .addField(`Available RAM (~${(os.freemem() / os.totalmem() * 100).toLocaleString()}%)`, `${os.freemem().toLocaleString()} bytes (~${(os.freemem() / 1000000000).toLocaleString()} gigabytes)`, true)
        .setFooter({text: "node:os"})

    await interaction.reply({embeds: [embed], ephemeral: is_ephemeral});
}

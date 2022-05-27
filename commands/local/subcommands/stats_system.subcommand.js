const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const os = require('node:os');

const Sleep = require('../../../modules/sleep'); //delayInMilliseconds;
const Log = require('../../../modules/logger'); //DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─;

module.exports = async function (client, interaction, is_ephemeral) {
    //Command information
    const REQUIRED_ROLE = "everyone";

    //Declaring variables
    await Log(interaction.guild.id, `├─ephemeral: ${is_ephemeral}`, 'INFO');

    const ram_total = os.totalmem();
    const ram_free = os.freemem();
    const ram_used = ram_total - ram_free;
    //Checks

    //Code
    const embed = new MessageEmbed()
        .setColor('BLUE')
        .setTitle('System Statistics')
        .setDescription('Here are some statistics about the server running the bot.')
        .addField('CPU model', `${os.cpus()[0].model}`, false)
        .addField('OS CPU architecture', `${os.arch()}`, true)
        .addField('CPU logical core count', `${os.cpus().length}`, true)
        .addField('CPU base speed', `${os.cpus()[0].speed} MHz`, true)
        .addField('CPU average load', `*${os.loadavg()} unavailable on Windows*`, true)
        .addField(`Total allocatable RAM`, `${os.totalmem().toLocaleString()} bytes (~${(os.totalmem / 1000000000).toLocaleString()} gigabytes)`, false)
        .addField(`Allocated RAM (~${((os.totalmem() - os.freemem()) / os.totalmem() * 100).toLocaleString()}%)`, `${(os.totalmem() - os.freemem()).toLocaleString()} bytes (~${((os.totalmem() - os.freemem()) / 1000000000).toLocaleString()} gigabytes)`, true)
        .addField(`Available RAM (~${(os.freemem() / os.totalmem() * 100).toLocaleString()}%)`, `${os.freemem().toLocaleString()} bytes (~${(os.freemem() / 1000000000).toLocaleString()} gigabytes)`, true)

    await interaction.reply({embeds: [embed], ephemeral: is_ephemeral});
}

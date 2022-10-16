const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, ModalBuilder} = require('discord.js');

const CronJob = require('cron').CronJob;
const fetch = require('node-fetch');

const Sleep = require('./sleep'); // dedlayInMilliseconds;
const Log = require('./logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

var ready;
var client;
var guilds = [];
var channels = [];
var messages = [];
var embedMessage;

async function BotStop(_client, timestamp) {
}

async function ChecklistBotReady() {
    embedMessage.fields[0].value = embedMessage.fields[0].value.replace(/.*:x: Bot is not fully ready;.*/, `:white_check_mark: <@${client.user.id}> is fully ready;`)
    await UpdateEmbeds(embedMessage);
    await UpdateTimestamp();
}
async function ChecklistJobsStarted() {
    embedMessage.fields[0].value = embedMessage.fields[0].value.replace(/.*:x: Jobs inactive.*/i, `:white_check_mark: Jobs started;`);
    await UpdateEmbeds(embedMessage);
    await UpdateTimestamp();
}
async function ChecklistHeartbeatSynced() {
    embedMessage.fields[0].value = embedMessage.fields[0].value.replace(/.*:x: Heartbeat not synced;.*/i, `:white_check_mark: Heartbeat synced (every 1min + 10s max);`)
    await UpdateEmbeds(embedMessage);
    await UpdateTimestamp();
}


async function IniSystemMonitor(_client) {
    client = _client;
    guilds.push(await client.guilds.fetch('631939549332897842')); // devServer guild
    channels.push(await guilds[0].channels.fetch('1030988308202922084')); // system-monitor channel in devServer guild

    guilds.push(await client.guilds.fetch('1014278986135781438'));
    channels.push(await guilds[1].channels.fetch('1031014002093981746'));

    // if(!channels[0].lastMessage) {
    // Calculate next Heartbeat timestamp
    const now = Math.floor(Date.now() / 1000);
    const next_heartbeat_timestamp = Math.floor(now + 60);

    const embed = new MessageEmbed()
        .setColor('GREEN')
        .setTitle('JerryBot System Monitor')
        .setDescription(`Last updated: <t:${Math.floor(Date.now() / 1000)}:R>;`)
        .addField('Checklist', `:x: Bot is not fully ready;\n:x: Heartbeat not synced;\n:x: Jobs inactive;`, false)
        .addField('Last Heartbeat', `:heartbeat: N/A;`, true)
        .addField('Next expected Heartbeat', `:green_heart: <t:${next_heartbeat_timestamp}:R>;`, true);

    messages.push(await channels[0].send({embeds: [embed]}));
    messages.push(await channels[1].send({embeds: [embed]}));
    embedMessage = messages[0].embeds[0];
    // } else {
    //     if(channels[0].lastMessage.embeds[0].title == "JerryBot System Monitor") {
    //         embedMessage = channels[0].lastMessage.embeds[0];
    //     }
    // }
    ready = true;
}


async function UpdateEmbeds(newEmbed) {
    // DO NOT CALL UpdateTimestamp() IN THIS FUNCTION
    if(ready !== true) {
        throw "Cannot access HeartbeatNotifier before System Monitor ready.";
    }

    if(!messages[0]) {
        return;
    }

    try {
        await messages[0].edit({embeds: [newEmbed]});
    } catch(err) {
        console.error(err);
    }

    try {
        if(!messages[1]) {
            return;
        }

        await messages[1].edit({embeds: [newEmbed]});
    } catch(err) {
        console.error(err);
    }
}


async function UpdateHeartbeat(_client, timestamp) {
    client = _client;
    if(ready !== true) {
        throw "Cannot access HeartbeatNotifier before System Monitor ready.";
    }

    // Calculate next Heartbeat timestamp
    const now = Math.floor(Date.now() / 1000);
    const next_heartbeat_timestamp = Math.floor(now + 60);

    embedMessage.fields[1].value = `:heartbeat: <t:${timestamp}:R>;`;
    embedMessage.fields[2].value = `:green_heart: <t:${next_heartbeat_timestamp}:R>;`;

    await UpdateEmbeds(embedMessage);
    await UpdateTimestamp();
}


async function UpdateTimestamp() {
    if(ready !== true) {
        throw "Cannot access HeartbeatNotifier before System Monitor ready.";
    }

    embedMessage.description = embedMessage.description.replace(/Last updated:.*;/i, `Last updated: <t:${Math.floor(Date.now() / 1000)}:R>;`);

    await UpdateEmbeds(embedMessage);
}


module.exports = {
    BotStop,
    ChecklistBotReady,
    ChecklistJobsStarted,
    ChecklistHeartbeatSynced,
    IniSystemMonitor,
    UpdateEmbeds,
    UpdateHeartbeat,
    UpdateTimestamp,
};

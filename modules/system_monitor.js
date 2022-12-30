const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require('discord.js');

const CronJob = require('cron').CronJob;
const fetch = require('node-fetch');

const {Log, Sleep} = require('./JerryUtils');

const os = require('node:os');


var updateFailCount = 0;

var ready;
var client;
var guilds = [];
var channels = [];
var messages = [];
var embedMessage;
var isDeployed = false;

async function BotStop(_client, timestamp) {
}

async function ChecklistBotReady() {
    embedMessage.fields[1].value = embedMessage.fields[1].value.replace(/.*:x: Bot is not fully ready;.*/, `:white_check_mark: <@${client.user.id}> is fully ready;`)
    await UpdateEmbeds(embedMessage);
    await UpdateTimestamp();
}
async function ChecklistJobs() {
    embedMessage.fields[1].value = embedMessage.fields[1].value.replace(/.*:x: Jobs inactive.*/i, `:white_check_mark: Jobs running;`);
    await UpdateEmbeds(embedMessage);
    await UpdateTimestamp();
}
async function ChecklistHeartbeat() {
    embedMessage.fields[1].value = embedMessage.fields[1].value.replace(/.*:x: Heartbeat not synced;.*/i, `:white_check_mark: Heartbeat synced (1min + 10s);`)
    await UpdateEmbeds(embedMessage);
    await UpdateTimestamp();
}


async function DeploySystemMonitor(_client) {
    if(os.version().toLowerCase().includes('server')) {
        isDeployed = true;
    }

    client = _client;
    guilds.push(await client.guilds.fetch('631939549332897842')); // devServer guild
    channels.push(await guilds[0].channels.fetch('1030988308202922084')); // system-monitor channel in devServer guild

    guilds.push(await client.guilds.fetch('1014278986135781438'));
    channels.push(await guilds[1].channels.fetch('1031014002093981746'));

    // Delete previous messages if any
    for(const _channel of channels) {
        await _channel.bulkDelete(50, true)
    }

    // Create the system monitor embed
    const embed = new MessageEmbed()
        .setColor('GREEN')
        .setTitle('JerryBot System Monitor')
        .setDescription(`:arrows_counterclockwise: Last updated: <t:${Math.floor(Date.now() / 1000)}:R>;`)
        .addFields(
            {name: 'Deployed', value: `${isDeployed}`, inline: false},
            {name: 'Checklist', value: `:x: Bot is not fully ready;\n:white_check_mark: Event listeners ready;\n:x: Heartbeat not synced;\n:x: Jobs inactive;`, inline: false},
            {name: 'Last Heartbeat', value: `:black_heart: ---;`, inline: true},
            {name: 'Next expected Heartbeat', value: `:black_heart: ---;`, inline: true}
        ).setFooter({text: "Relative timestamps look out of sync depending on your timezone;"})
        .setTimestamp();

    messages.push(await channels[0].send({embeds: [embed]}));
    messages.push(await channels[1].send({embeds: [embed]}));
    embedMessage = messages[0].embeds[0];

    ready = true;
}


async function UpdateEmbeds(newEmbed) {
    // DO NOT CALL UpdateTimestamp() IN THIS FUNCTION
    if(ready !== true) {
        throw "Cannot access HeartbeatNotifier before System Monitor is ready.";
    }

    if(!messages[0]) {
        return;
    }

    try {
        await messages[0].edit({embeds: [newEmbed]});
    } catch(err) {
        if(updateFailCount === 3 && updateFailCount < 4) {
            console.log(`Failed to update embed 3 times. No longer logging error.`);
        } else {
            console.log(`Failed to update the embed 0. Fail count: ${updateFailCount}`);
        }
    }

    try {
        if(!messages[1]) {
            return;
        }

        await messages[1].edit({embeds: [newEmbed]});
    } catch(err) {
        if(updateFailCount === 3 && updateFailCount < 4) {
            console.log(`Failed to update embed 3 times. No longer logging error.`);
        } else {
            console.log(`Failed to update the embed 0. Fail count: ${updateFailCount}`);
        }
    }
}


async function UpdateHeartbeat(_client, timestamp) {
    client = _client;
    if(ready !== true) {
        throw "Cannot access HeartbeatNotifier before System Monitor is ready.";
    }

    // Calculate next Heartbeat timestamp
    const now = Math.floor(Date.now() / 1000);
    const next_heartbeat_timestamp = Math.floor(now + 60);

    embedMessage.fields[2].value = `:green_heart: <t:${timestamp}:R>;`;
    embedMessage.fields[3].value = `:yellow_heart: <t:${next_heartbeat_timestamp}:R>;`;

    await UpdateEmbeds(embedMessage);
    await UpdateTimestamp();
}


async function UpdateTimestamp() {
    if(ready !== true) {
        throw "Cannot access HeartbeatNotifier before System Monitor is ready.";
    }

    embedMessage.description = embedMessage.description.replace(/:arrows_counterclockwise: Last updated:.*;/i, `:arrows_counterclockwise: Last updated: <t:${Math.floor(Date.now() / 1000)}:R>;`);

    await UpdateEmbeds(embedMessage);
}


module.exports = {
    BotStop,
    ChecklistBotReady,
    ChecklistHeartbeat,
    ChecklistJobs,
    DeploySystemMonitor,
    UpdateEmbeds,
    UpdateHeartbeat,
    UpdateTimestamp
};

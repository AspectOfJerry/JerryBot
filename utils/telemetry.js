import {MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu} from "discord.js";
import {logger, sleep} from "./jerryUtils.js";

import CronJob from "cron";

import os from "node:os";


const success_emoji = "<:success:1102349129390248017>";
const warn_emoji = "<:warn:1102349145106284584>";
const fail_emoji = "<:fail:1102349156976185435>";

const globalFailedGuilds = [];

let ready;
let client;
const guilds = [];
const channels = [];
const messages = [];
let embedMessage;
let isDeployed = false;

async function botStop(_client, timestamp) {
}

async function checklistBotReady() {
    embedMessage.fields[1].value = embedMessage.fields[1].value.replace(/.*<:warn:1102349145106284584> Bot is not fully ready.*/, `<:success:1102349129390248017> <@${client.user.id}> is fully ready`);
    await updateEmbeds(embedMessage);
}

async function checklistJobs() {
    embedMessage.fields[1].value = embedMessage.fields[1].value.replace(/.*<:warn:1102349145106284584> Jobs inactive.*/i, "<:success:1102349129390248017> Jobs running");
    await updateEmbeds(embedMessage);
}

async function checklistHeartbeat() {
    embedMessage.fields[1].value = embedMessage.fields[1].value.replace(/.*<:warn:1102349145106284584> Heartbeat not synced.*/i, "<:success:1102349129390248017> Heartbeat synced (2min + jitter)");
    await updateEmbeds(embedMessage);
}


async function startTelemetry(_client) {
    // logger.apppend("debug", "INIT", "[Telemetry] Starting telemetry...");
    if (os.version().toLowerCase().includes("server")) {
        isDeployed = true;
    }

    client = _client;
    guilds.push(await client.guilds.fetch("631939549332897842")); // devServer guild
    channels.push(await guilds[0].channels.fetch("1030988308202922084")); // system-monitor channel in devServer guild

    // Delete previous messages if any
    for (const _channel of channels) {
        await _channel.bulkDelete(16, true);
    }

    // Create the telemetry embed
    const embed = new MessageEmbed()
    .setColor("GREEN")
    .setTitle("JerryBot telemetry")
    .setDescription(`:arrows_counterclockwise: Last updated: <t:${Math.floor(Date.now() / 1000)}:R>*`)
    .addFields(
        {name: "Deployed", value: `${isDeployed}`, inline: false},
        {
            name: "Checklist",
            value: `${warn_emoji} Bot is not fully ready\n${success_emoji} Database connected\n${success_emoji} Event listeners ready\n${warn_emoji} Heartbeat not synced\n${warn_emoji} Jobs inactive`,
            inline: false
        },
        {name: "Last Heartbeat*", value: ":black_heart: ---*", inline: true},
        {name: "Next expected Heartbeat*", value: ":black_heart: ---*", inline: true}
    ).setFooter({text: "*Relative timestamps look out of sync depending on your timezone"})
    .setTimestamp();

    // Add embeds here
    messages.push(await channels[0].send({embeds: [embed]}));
    embedMessage = messages[0].embeds[0];

    ready = true;
}


async function updateEmbeds(newEmbed) {
    if (ready !== true) {
        throw "Cannot access HeartbeatNotifier before telemetry is ready.";
    }

    newEmbed.description = embedMessage.description.replace(/:arrows_counterclockwise: Last updated:.*\*/i, `:arrows_counterclockwise: Last updated: <t:${Math.floor(Date.now() / 1000)}:R>*`);

    for (const msg of messages) {
        if (globalFailedGuilds.includes(msg.guild.id)) {
            continue;
        }

        try {
            await msg.edit({embeds: [newEmbed]});
        } catch (err) {
            console.error(err);

            console.log(`Failed to update a telemetry embed in the "${msg.guild.name}" guild. Abandoning telemetry for this guild.`);
            logger.append("error", "STDERR", `[Telemetry] Failed to update a telemetry embed in the "${msg.guild.name}" guild. Abandoning telemetry for this guild.`);
            globalFailedGuilds.push(msg.guild.id);
        }
    }
}


async function updateHeartbeat(_client, timestamp) {
    client = _client;
    if (ready !== true) {
        throw "Cannot access HeartbeatNotifier before telemetry is ready.";
    }

    // Calculate next Heartbeat timestamp
    const now = Math.floor(Date.now() / 1000);
    const next_heartbeat_timestamp = Math.floor(now + 121);

    embedMessage.fields[2].value = `:green_heart: <t:${timestamp}:R>;`;
    embedMessage.fields[3].value = `:yellow_heart: <t:${next_heartbeat_timestamp}:R>;`;

    await updateEmbeds(embedMessage);
}


export {
    botStop,
    checklistBotReady,
    checklistHeartbeat,
    checklistJobs,
    startTelemetry,
    updateEmbeds,
    updateHeartbeat,
};

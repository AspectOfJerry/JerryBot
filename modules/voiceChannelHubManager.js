// import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";
// const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} from "@discordjs/voice");

import {logger, sleep, toNormalized} from "./jerryUtils.js";
import {getConfig, updateConfig} from "../database/mongodb.js";
import fs from "fs";
import path from "path";


const active_channels = [];


/**
 * @param {string} id The channel's id
 */
async function addHub(id) {

    logger.append("info", "voiceHubs", "[voiceChannelHubCreate]");
}


/**
 * @param {Object} client The active Discord client.
 */
async function refreshHubs(client) {
    logger.append("info", "voiceHubs", "[voiceChannelHubManager] Refreshing the hub dataset...");
    const hubs = (await getConfig()).voiceChannelHubs;
    if(hubs.length <= 0) {
        throw "Could not retrieve voice channel hubs.";
    }
    const channels = [];

    for(const channel of hubs) {
        if(!client.channels.resolve(channel)) {
            continue;
        }
        channels.push(channel);
    }

    updateConfig("config", void (0), void (0), void (0), channels);
}


/**
 * @async
 * @returns {array} The voice channel hub ids.
 */
async function getVcHubs() {
    return (await getConfig()).voiceChannelHubs;
}


/**
 * @param {Object} newState The new voiceState provided by the `voiceStateUpdate` even listener.
 */
function handleJoin(newState) {
    newState.guild.channels.create(`🟢${newState.member.user.tag}`, {type: "GUILD_VOICE", parent: newState.channel.parent, position: newState.channel.rawPosition + 1, reason: "VoiceChannelHubManager CREATE"})
        .then((voiceChannel) => {
            active_channels.push(voiceChannel.id);
            newState.member.voice.setChannel(voiceChannel.id);
            logger.append("debug", "voiceHubs", `[voiceChannelHubCreate] Created "#${voiceChannel.name}" (total active hub: ${active_channels.length})!`);
        }).catch((err) => {
            console.error(err);
        });
}


/**
 * @param {Object} oldState The old voiceState provided by the `voiceStateUpdate` even listener.
 */
function handleLeave(oldState) {
    if(active_channels.includes(oldState.channel.id) && oldState.channel.members.size < 1) {
        oldState.channel.delete("VoiceChannelHubManager DELETE (empty)")
            .then((voiceChannel) => {
                const index = active_channels.indexOf(voiceChannel.id);

                if(index > -1) {
                    active_channels.splice(index, 1);
                    logger.append("debug", "voiceHubs", `[voiceChannelHubDelete] Deleted "#${voiceChannel.name}" (total active hubs: ${active_channels.length}.`);
                }
            }).catch((err) => {
                console.error(err);
            });
    }
}


/**
 * @param {string} id The channel's id
 */
async function removeHub(id) {

    logger.append("info", "voiceHubs", "[voiceChannelHubRemove]");
}


export {
    addHub,
    refreshHubs,
    getVcHubs,
    handleJoin,
    handleLeave,
    removeHub
};

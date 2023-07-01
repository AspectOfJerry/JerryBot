// const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
// const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require("@discordjs/voice");

const {log, sleep, toNormalized} = require("./jerryUtils.js");
const {getConfig, updateConfig} = require("../database/mongodb.js");
const fs = require("fs");
const Path = require("path");


const active_channels = [];


/**
 * @param {string} id The channel's id
 */
async function addHub(id) {

    log("append", "voiceChannelHubs", "[voiceChannelHubCreate]", "DEBUG");
}


/**
 * @param {Object} client The active Discord client.
 */
async function refreshHubs(client) {
    log("append", "voiceChannelHubs", "[voiceChannelHubManager] Refreshing the hub dataset...", "DEBUG");
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
            log("append", "voiceChannelHubs", `[voiceChannelHubCreate] Created "#${voiceChannel.name}" (total active hub: ${active_channels.length})!`, "DEBUG");
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
                    log("append", "voiceChannelHubs", `[voiceChannelHubDelete] Deleted "#${voiceChannel.name}" (total active hubs: ${active_channels.length}.`, "DEBUG");
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

    log("append", "voiceChannelHubs", "[voiceChannelHubRemove]", "DEBUG");
}


module.exports = {
    addHub,
    refreshHubs,
    getVcHubs,
    handleJoin,
    handleLeave,
    removeHub
};

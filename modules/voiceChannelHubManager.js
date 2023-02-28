const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const {GetConfig, Log, Sleep, ToNormalized} = require('./JerryUtils');
const fs = require('fs');
const Path = require("path");


const active_channels = [];


/**
 * @param {string} id The channel's id
 */
async function AddHub(id) {

    Log("append", "voiceChannelHubs", "[voiceChannelHubCreate]", "DEBUG");
}


/**
 * @param {object} client The active Discord client.
 */
async function RefreshHubs(client) {
    Log("append", "voiceChannelHubs", "[voiceChannelHubManager] Refreshing the hub dataset...", "DEBUG");
    const config = await GetConfig();
    const channelList = (await GetConfig()).voiceChannelHubs;
    const channels = [];

    for(const channel of channelList) {
        if(!client.channels.resolve(channel)) {
            continue;
        }
        channels.push(channel);
    }

    config.voiceChannelHubs = channels;

    fs.writeFileSync(Path.resolve(__dirname, "../database/config/config_guilds.json"), JSON.stringify(config), (err) => {
        if(err) {
            throw err;
        }
    });
}


/**
 * @async
 * @returns {array} The voice channel hub ids.
 */
async function GetVcHubs() {
    return (await GetConfig()).voiceChannelHubs;
}


/**
 * @param {object} newState The new voiceState provided by the `voiceStateUpdate` even listener.
 */
function HandleJoin(newState) {
    newState.guild.channels.create(`🟢${newState.member.user.tag}`, {type: "GUILD_VOICE", parent: newState.channel.parent, position: newState.channel.rawPosition + 1, reason: "VoiceChannelHubManager CREATE"})
        .then((voiceChannel) => {
            active_channels.push(voiceChannel.id);
            newState.member.voice.setChannel(voiceChannel.id);
            Log("append", "voiceChannelHubs", `[voiceChannelHubCreate] Created "#${newState.channel.name}" (total active hub: ${active_channels.length})!`, "DEBUG");
        }).catch((err) => {
            console.error(err);
        });
}


/**
 * @param {object} oldState The old voiceState provided by the `voiceStateUpdate` even listener.
 */
function HandleLeave(oldState) {
    if(active_channels.includes(oldState.channel.id) && oldState.channel.members.size < 1) {
        oldState.channel.delete("VoiceChannelHubManager DELETE (empty)")
            .then((voiceChannel) => {
                const index = active_channels.indexOf(voiceChannel.id);

                if(index > -1) {
                    active_channels.splice(index, 1);
                    Log("append", "voiceChannelHubs", `[voiceChannelHubDelete] Deleted "#${voiceChannel.name}" (total active hubs: ${active_channels.length}.`, "DEBUG");
                }
            }).catch((err) => {
                console.error(err);
            });
    }
}


/**
 * @param {string} id The channel's id
 */
async function RemoveHub(id) {

    Log("append", "voiceChannelHubs", "[voiceChannelHubRemove]", "DEBUG");
}


module.exports = {
    AddHub,
    RefreshHubs,
    GetVcHubs,
    HandleJoin,
    HandleLeave,
    RemoveHub
};

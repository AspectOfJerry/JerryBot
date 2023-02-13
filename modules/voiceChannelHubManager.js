const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const {GetConfig, Log, Sleep, ToNormalized} = require('./JerryUtils');


var channels = [];
const active_channels = [];


/**
 * 
 */
async function AddHub() {

}


/**
 * 
 */
async function RefreshHubs(client) {
    channels = GetConfig();
    channels = channels.voiceChannelHubs;

    for(const channel of channels) {
        if(!client.channels.has(channel)) {
            const index = channels.indexOf(channel)
            channels.splice(index, 1);
            continue;
        }
        channels.push(channel);
    }
}


/**
 * @returns The voice channel hub ids.
 */
async function GetVcHubs(client) {
    return await GetConfig().voiceChannelHubs;
}


/**
 * @param {object} newState The new voiceState provided by the `voiceStateUpdate` even listener.
 */
function HandleJoin(newState) {
    newState.guild.channels.create(newState.member.user.tag, {type: "GUILD_VOICE", position: newState.channel.rawPosition + 1, reason: "VoiceChannelHubManager CREATE"})
        .then((voiceChannel) => {
            active_channels.push(voiceChannel.id);
        }).catch((err) => {
            console.error(err);
        });
}


/**
 * @param {object} oldState The old voiceState provided by the `voiceStateUpdate` even listener.
 */
function HandleLeave(oldState) {
    if(oldState.channel.members.size === 0) {
        oldState.channel.delete("VoiceChannelHubManager DELETE (empty)")
            .then((voiceChannel) => {

            }).catch((err) => {
                console.error(err);
            });
    }
}


/**
 * @param {string} id The channel's id
 */
async function RemoveHub(id) {

}


module.exports = {
    AddHub,
    RefreshHubs,
    GetVcHubs,
    HandleJoin,
    HandleLeave,
    RemoveHub
};

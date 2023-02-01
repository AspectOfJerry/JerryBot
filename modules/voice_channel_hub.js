const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const {GetConfig, Log, Sleep} = require('../modules/JerryUtils');


var channels = [];
const active_channels = [];


async function AddHub() {

}


async function FetchHubs(client) {
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


async function HandleJoin(newState) {
    const guild = newState.guild;
    const member = newState.member;
    const channel = newState.channel

}


async function RemoveHub(guild) {

}


module.exports = {
    AddHub,
    FetchHubs,
    HandleJoin,
    RemoveHub
};

const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require('discord.js');
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');


const hub_channels = [];
const active_channels = [];


async function CreateChannel(guild) {

}


async function CreateHub() {

}


async function FetchHubs(client) {
    for(const channel of hub_channels) {
        if(!client.channels.has(channel)) {
            const index = hub_channels.indexOf(channel)
            hub_channels.splice(index, 1);
        }
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
    CreateChannel,
    CreateHub,
    FetchHubs,
    HandleJoin,
    RemoveHub
}

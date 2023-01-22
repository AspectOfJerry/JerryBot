const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const {Log, Sleep} = require("../modules/JerryUtils");
const {HandleJoin} = require('../modules/voice_channel_hub');


module.exports = {
    name: "voiceStateUpdate",
    once: false, // Whether or not this event should only be triggered once
    async execute(oldState, newState) {
        if(oldState.channel && newState.channel) {
            await Log("append", 'voiceStateUpdate', `<@${newState.member?.user.tag}> joined <#${newState.channel.name}> from <#${oldState.channel.name}> in <${newState.guild.name}>.`, "INFO");
        } else if(!newState.channel) {
            await Log("append", 'voiceStateUpdate', `<@${newState.member?.user.tag}> left <#${oldState.channel.name}> in <${newState.guild.name}>.`, "INFO");
        } else if(!oldState.channel) {
            await Log("append", 'voiceStateUpdate', `<@${newState.member?.user.tag}> joined <#${newState.channel.name}> in <${newState.guild.name}>.`, "INFO");
        }
        await HandleJoin(newState);
    }
};

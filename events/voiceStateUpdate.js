const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const Sleep = require('../modules/sleep.js'); // delayInMilliseconds
const Log = require('../modules/logger.js'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    name: "voiceStateUpdate",
    once: false, // Whether or not this event should only be triggered once
    async execute(oldState, newState) {
        if(oldState.channel && newState.channel) {
            await Log('append', 'voiceStateUpdate', `<@${newState.member?.user.name}> joined <#${newState.channel.name}> from <#${oldState.channel.name}>`, 'INFO'); // Logs
        } else if(!newState.channel) {
            await Log('append', 'voiceStateUpdate', `<@${newState.member?.user.name}> left <#${newState.channel.name}>`, 'INFO'); // Logs
        } else if(!oldState.channel) {
            await Log('append', 'voiceStateUpdate', `<@${newState.member?.user.name}> joined.`, 'INFO'); // Logs
        }
    }
};

const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require("@discordjs/voice");

const {log, sleep} = require("../modules/jerryUtils.js");
const {getVcHubs, handleJoin, handleLeave} = require("../modules/voiceChannelHubManager");


module.exports = {
    name: "voiceStateUpdate",
    once: false, // Whether or not this event should only be triggered once
    async execute(oldState, newState) {
        if(oldState.channel && newState.channel) {
            log("append", "", `[0x565355] "@${newState.member?.user.tag}" joined "#${newState.channel.name}" from "#${oldState.channel.name}" in "${newState.guild.name}".`, "INFO");
        } else if(!newState.channel) {
            log("append", "", `[0x565355] "@${newState.member?.user.tag}" left "#${oldState.channel.name}" in "${newState.guild.name}".`, "INFO");
            handleLeave(oldState);
            return;
        } else if(!oldState.channel) {
            log("append", "", `[0x565355] "@${newState.member?.user.tag}" joined "#${newState.channel.name}" in "${newState.guild.name}".`, "INFO");
        }

        if((await getVcHubs(newState)).includes(newState.channel.id)) {
            handleJoin(newState);
        }
    }
};

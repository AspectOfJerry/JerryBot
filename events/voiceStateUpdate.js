const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require("@discordjs/voice");

const {logger, sleep} = require("../modules/jerryUtils.js");
const {getVcHubs, handleJoin, handleLeave} = require("../modules/voiceChannelHubManager");


module.exports = {
    name: "voiceStateUpdate",
    once: false, // Whether or not this event should only be triggered once
    async execute(oldState, newState) {
        if(oldState.channel && newState.channel) {
            logger.append("info", "0x565355", `[VSU] "@${newState.member?.user.tag}" joined "#${newState.channel.name}" from "#${oldState.channel.name}" in "${newState.guild.name}".`);
        } else if(!newState.channel) {
            logger.append("info", "0x565355", `[VSU] "@${newState.member?.user.tag}" left "#${oldState.channel.name}" in "${newState.guild.name}".`);
            handleLeave(oldState);
            return;
        } else if(!oldState.channel) {
            logger.append("info", "0x565355", `[VSU] "@${newState.member?.user.tag}" joined "#${newState.channel.name}" in "${newState.guild.name}".`);
        }

        if((await getVcHubs(newState)).includes(newState.channel.id)) {
            handleJoin(newState);
        }
    }
};

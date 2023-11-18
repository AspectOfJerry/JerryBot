import {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    entersState,
    StreamType,
    AudioPlayerStatus,
    VoiceConnectionStatus,
    getVoiceConnection
} from "@discordjs/voice";

import {logger, sleep} from "../utils/jerryUtils.js";
import {getVcHubs, handleJoin, handleLeave} from "../utils/voiceChannelHubManager.js";


export default {
    name: "voiceStateUpdate",
    once: false, // Whether this event should only be triggered once
    async execute(oldState, newState) {
        if (oldState.channel && newState.channel) {
            logger.append("info", `VSU "@${newState.member?.user.tag}" joined "#${newState.channel.name}" from "#${oldState.channel.name}" in "${newState.guild.name}".`);
        } else if (!newState.channel) {
            logger.append("info", `VSU "@${newState.member?.user.tag}" left "#${oldState.channel.name}" in "${newState.guild.name}".`);
            handleLeave(oldState);
            return;
        } else if (!oldState.channel) {
            logger.append("info", "VSU", `"@${newState.member?.user.tag}" joined "#${newState.channel.name}" in "${newState.guild.name}".`);
        }

        if ((await getVcHubs(newState)).includes(newState.channel.id)) {
            handleJoin(newState);
        }
    }
};

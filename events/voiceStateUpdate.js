const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require("@discordjs/voice");

const {log, sleep} = require("../modules/JerryUtils.js");
const {getVcHubs, handleJoin, handleLeave} = require("../modules/voiceChannelHubManager");


module.exports = {
    name: "voiceStateUpdate",
    once: false, // Whether or not this event should only be triggered once
    async execute(oldState, newState) {
        if(oldState.channel && newState.channel) {
            await log("append", "voiceStateUpdate", `"@${newState.member?.user.tag}" joined "#${newState.channel.name}" from "#${oldState.channel.name}" in "${newState.guild.name}".`, "INFO");
        } else if(!newState.channel) {
            await log("append", "voiceStateUpdate", `"@${newState.member?.user.tag}" left "#${oldState.channel.name}" in "${newState.guild.name}".`, "INFO");
            handleLeave(oldState);
            return;
        } else if(!oldState.channel) {
            await log("append", "voiceStateUpdate", `"@${newState.member?.user.tag}" joined "#${newState.channel.name}" in "${newState.guild.name}".`, "INFO");
        }

        const hubs = await getVcHubs(newState);

        if(hubs.includes(newState.channel.id)) {
            handleJoin(newState);
        }
    }
};

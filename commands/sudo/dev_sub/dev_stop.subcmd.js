const fs = require("fs");
const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const {PermissionCheck, Log, Sleep} = require("../../../modules/JerryUtils.js");


module.exports = async function (client, interaction) {
    if(await PermissionCheck(interaction) === false) {
        return;
    }

    // Declaring variables
    const payload_body = null;

    // Checks

    // Main
    await interaction.reply("This command is currently under development.");
};

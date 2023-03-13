const fs = require("fs");
const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const {PermissionCheck, Log, Sleep} = require("../../modules/JerryUtils.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('typing')
        .setDescription("Sends the typing indicator."),
    async execute(client, interaction) {
        if(await PermissionCheck(interaction) === false) {
            return;
        }

        // Declaring variables

        // Checks

        // Main
        await interaction.reply({content: "Typing...", ephemeral: true});
        Log("append", interaction.guild.id, `Typing in <#${interaction.channel.name}>`, "INFO");

        interaction.channel.sendTyping();
    }
};

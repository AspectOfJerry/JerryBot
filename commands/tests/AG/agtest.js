const fs = require("fs");
const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const {PermissionCheck, Log, Sleep} = require("../../../modules/JerryUtils.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('agtest')
        .setDescription("[TEST] agtest")
        .addStringOption((options) =>
            options
                .setName('option1')
                .setDescription("[OPTIONAL] AG test")
                .setRequired(true)),
    async execute(client, interaction) {
        // interaction.deferReply()

        // Declaring variables
        // const target = interaction.options.getUser("user") || interaction.user;
        // const memberTarget = interaction.guild.members.cache.get(target.id);
        // await Log("append", interaction.guild.id, `├─memberTarget: '${memberTarget.user.tag}'`, "INFO");

        // Checks

        // Main
        const test = new MessageEmbed()
            .setColor("GREEN")
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle('Test')
            .setDescription("Test Concluded")
            .setFooter({text: `Test worked`});

        interaction.reply({embeds: [test]});
    }
};

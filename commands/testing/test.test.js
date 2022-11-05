const fs = require('fs');
const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const Sleep = require('../../modules/sleep'); // delayInMilliseconds
const Log = require('../../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

const date = require('date-and-time');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription("Test command")
        .addUserOption((options) =>
            options
                .setName('user')
                .setDescription("[OPTIONAL] User to test")
                .setRequired(false)),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/test'.`, 'INFO'); // Logs
        // Declaring variables
        let target = interaction.options.getUser('user') || interaction.member;
        let memberTarget = interaction.guild.members.cache.get(target.id);

        // Checks

        // Main
        // interaction.reply("Nothing here...");

        const test_modal = new Modal()
            .setCustomId('test_modal')
            .setTitle('Test modal!');

        const name_input = new TextInputComponent()
            .setCustomId('input_name')
            .setLabel("What's your name?")
            .setStyle('SHORT');

        const description_input = new TextInputComponent()
            .setCustomId('input_description')
            .setLabel("Tell me a bit about yourself!")
            .setStyle('PARAHRAPH');

        const first_row = new MessageActionRow().addComponents(name_input);
        const second_row = new MessageActionRow().addComponents(description_input);

        test_modal.addComponents(first_row, second_row);

        await interaction.showModal(test_modal);

        await client.on('interactionCreate', async (interaction) => {
            if(!interaction.isModalSubmit()) {
                return;
            }

            const input_name = interaction.fields.getTextInputValue('name_input')
            const input_description = interaction.fields.getTextInputValue('description_input')

            await interaction.reply(`Your name is ${input_name}. Description: ${input_description}`)
        });
    }
};

const fs = require('fs');
const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const {Log, Sleep} = require('../../modules/JerryUtils');

const date = require('date-and-time');

const test_label = "0x01";

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`test-${test_label}`)
        .setDescription(`[TEST/${test_label}] models test`)
        .addUserOption((options) =>
            options
                .setName('user')
                .setDescription("[OPTIONAL] User to test")
                .setRequired(false)),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed a test command (${test_label}).`, 'INFO'); // Logs
        await interaction.channel.send(`Executing Test ${test_label}...`);
        await Sleep(100);
        // Declaring variables 
        let testFailureCount = 0;

        let target = interaction.options.getUser('user') || interaction.member;
        let memberTarget = interaction.guild.members.cache.get(target.id);

        // Checks

        // Main
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
            .setStyle('PARAGRAPH');

        const first_row = new MessageActionRow().addComponents(name_input);
        const second_row = new MessageActionRow().addComponents(description_input);

        test_modal.addComponents(first_row, second_row);

        await interaction.showModal(test_modal);

        client.once('interactionCreate', async (modalInteraction) => {
            if(!modalInteraction.isModalSubmit()) {
                return;
            }

            if(modalInteraction.customId == 'test_modal') {
                const input_name = modalInteraction.fields.getTextInputValue('input_name')
                const input_description = modalInteraction.fields.getTextInputValue('input_description')

                console.log(input_name, input_description)

                await modalInteraction.reply(`Your name is ${input_name}. Description: ${input_description}`);
            }
        });
    }
};
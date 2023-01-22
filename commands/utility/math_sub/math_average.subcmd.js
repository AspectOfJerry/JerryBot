const fs = require("fs");
const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const {PermissionCheck, Log, Sleep} = require("../../../modules/JerryUtils");


module.exports = async function (client, interaction) {
    if(await PermissionCheck(interaction) === false) {
        return;
    }

    // Declaring variables

    // Checks

    // Main
    await interaction.reply({content: "This command is currently under development"});
    // return;
    const input_modal = new Modal()
        .setCustomId('input_modal')
        .setTitle('Number input');

    const numbers_input = new TextInputComponent()
        .setCustomId('input_numbers')
        .setLabel("Write the list of numbers seperated by spaces. Commas and periods are accepted for decimals.")
        .setStyle('SHORT');

    const first_row = new MessageActionRow.addComponents(numbers_input);

    input_modal.addComponents(first_row);

    await interaction.showModal(input_modal);

    await interaction.folloUp({content: "This command is currently under development."});

    client.once('interactionCreate', async (modalInteraction) => {
        if(!modalInteraction.isModalSubmit()) {
            return;
        }

        if(modalInteraction.customId == 'input_modal') {
            const input_numbers = modalInteraction.fields.getTextInputValue('input_numbers');

            await modalInteraction.reply(`your input: ${input_numbers}`);
        }
    });
};

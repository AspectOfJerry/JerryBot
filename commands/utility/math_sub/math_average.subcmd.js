const fs = require("fs");
const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const {PermissionCheck, Log, Sleep} = require("../../../modules/JerryUtils");


module.exports = async function (client, interaction) {
    // interaction.deferReply();

    if(await PermissionCheck(interaction) === false) {
        const error_permissions = new MessageEmbed()
            .setColor('RED')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle('PermissionError')
            .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
            .setFooter({text: `Use '/help' to access the documentation on command permissions.`});

        await interaction.reply({embeds: [error_permissions]});
        await Log('append', interaction.guild.id, `└─'@${interaction.user.tag}' did not have the required role to execute '/${interaction.commandName}${interaction.options.getSubcommand(false) ? " " + interaction.options.getSubcommand(false) : ""}'. [PermissionError]`, 'WARN');
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

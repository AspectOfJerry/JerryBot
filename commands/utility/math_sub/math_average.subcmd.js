const fs = require('fs');
const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require('discord.js');
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const {Log, Sleep} = require('../../../modules/JerryUtils');


module.exports = async function (client, interaction) {
    await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' executed '/math average'.`, 'INFO');
    // interaction.deferReply();

    // Set minimum execution role
    switch(interaction.guild.id) {
        case process.env.DISCORD_JERRY_GUILD_ID:
            var MINIMUM_EXECUTION_ROLE = null;
            break;
        case process.env.DISCORD_GOLDFISH_GUILD_ID:
            var MINIMUM_EXECUTION_ROLE = null;
            break;
        case process.env.DISCORD_CRA_GUILD_ID:
            var MINIMUM_EXECUTION_ROLE = null;
            break;
        case process.env.DISCORD_311_GUILD_ID:
            var MINIMUM_EXECUTION_ROLE = null;
            break;
        default:
            await Log('append', interaction.guild.id, "  └─Throwing because of bad permission configuration.", 'ERROR');
            throw `Error: Bad permission configuration.`;
    }

    // Declaring variables

    // Checks
    // -----BEGIN ROLE CHECK-----
    if(MINIMUM_EXECUTION_ROLE !== null) {
        if(!interaction.member.roles.cache.find(role => role.name === MINIMUM_EXECUTION_ROLE)) {
            const error_permissions = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                .setFooter({text: `You need at least the '${MINIMUM_EXECUTION_ROLE}' role to use this command.`});

            await interaction.reply({embeds: [error_permissions]});
            await Log('append', interaction.guild.id, `  └─'${interaction.user.id}' did not have the required role to perform '/math average'. [error_permissions]`, 'WARN');
            return;
        }
    }
    // -----END ROLE CHECK-----

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

const fs = require('fs');
const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const {Log, Sleep} = require('../../../modules/JerryUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('random')
        .setDescription("Chooses between an array of numbers randomly")
        .addIntegerOption((options) =>
            options
                .setName('min')
                .setDescription("The minimum number")
                .setRequired(true))
        .addIntegerOption((options) =>
            options
                .setName('max')
                .setDescription("The maximum number")
                .setRequired(true)),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/random'.`, 'INFO'); // Logs
        // interaction.deferReply()

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
                await Log('append', interaction.guild.id, "└─Throwing because of bad permission configuration.", 'ERROR'); // Logs
                throw `Error: Bad permission configuration.`;
        }

        // Declaring variables
        const min = interaction.options.getInteger('min');
        const max = interaction.options.getInteger('max');
        const now = Math.round(Date.now() / 1000);
        const auto_cancel_timestamp = now + 10;

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
                await Log('append', interaction.guild.id, `└─'${interaction.user.id}' did not have the required role to perform '/AGTest'. [error_permissions]`, 'WARN'); // Logs
                return 10;
            }
        } // -----END ROLE CHECK-----

        // Main

        let row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('random_redo_button')
                .setLabel(`Redo`)
                .setStyle('PRIMARY')
                .setDisabled(false),
            new MessageButton()
                .setCustomId('random_cancel_button')
                .setLabel('Cancel')
                .setStyle('SECONDARY')
                .setDisabled(false)
        );
            
        const test = new MessageEmbed()
            .setColor('GREEN')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle(`Random ${min}:${max}`)
            .setDescription(`Random Number is: ${Math.floor((Math.random()*(max-min))+min)}`)
            .addFields(
                {name: 'Auto cancel', value: `> :red_square: Canceling <t:${auto_cancel_timestamp}:R>*.`, inline: false})
            .setFooter(
                {text: "*Random values can repeat themselves."});

            await interaction.reply({embeds: [test], components: [row]});

            const filter = async (button_collector) => {
                if(button_collector.user.id == interaction.user.id){
                    return true;
                }
                else {
                    await button_collector.reply({content: "You cannot use this button.", ephemeral: true});
                    return;
                }
            };

            constantRedo(filter);

            async function constantRedo(filter){
                const button_collector = interaction.channel.createMessageComponentCollector({filter, time: 10000});
            
                button_collector.on('collect', async (buttonInteraction) => {
                await buttonInteraction.deferUpdate();
                await buttonInteraction.stop();

                if(buttonInteraction.customId == 'random_redo_button'){
                    row.components[0]
                    .setStyle('SUCCESS')
                    .setDisabled(false);
                    const newRandom = new MessageEmbed()
                    .setDescription(`Random Number is: ${Math.floor((Math.random()*(max-min))+min)}`);
                    await interaction.editReply({embeds: [newRandom]});
                    constantRedo(filter);
                }

                if(buttonInteraction.customId == 'random_cancel_button'){
                    row.components[0]
                    .setStyle('PRIMARY')
                    .setDisabled(true);
                row.components[1]
                    .setStyle('SUCCESS')
                    .setDisabled(true);
                    await buttonInteraction.stop();
                }
            });}
    }
}
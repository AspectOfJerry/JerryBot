const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, } = require('@discordjs/voice')
const Sleep = require('../../modules/sleep');
const Log = require('../../modules/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription("Joins a voice channel.")
        .addStringOption((options) =>
            options
                .setName('user')
                .setDescription("[OPTIONAL] The user's voice channel to join.")
                .setRequired(false))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                .setRequired(false)),
    async execute(client, interaction) {
        //Command information
        const REQUIRED_ROLE = "everyone";

        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
        await Log(interaction.guild.id, `├─ephemeral: ${is_ephemeral}`, 'INFO');
        const target = interaction.options.getUser('user') || interaction.user;
        const memberTarget = interaction.guild.members.cache.get(target.id);
        await Log(interaction.guild.id, `├─memberTarget: '${memberTarget.user.tag}'`, 'INFO');

        //Checks
        if(!memberTarget.voice.channel) {
            const error_user_not_in_vc = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('Error')
                .setDescription(`<@${memberTarget.user.id}> is not in a voice channel.`)

            await interaction.reply({embeds: [error_user_not_in_vc], ephemeral: is_ephemeral});
            return;
        }

        //Code
        return interaction.reply({content: "This command is currently under development. It will be very soon available.", ephemeral: is_ephemeral});
        const channel = memberTarget.voice.channel;
        const success_join = new MessageEmbed()
            .setColor('GREEN')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription(`Successfully joined <#${channel.id}>`);

        await interaction.reply({embeds: [success_join], ephemeral: is_ephemeral});
    }
}

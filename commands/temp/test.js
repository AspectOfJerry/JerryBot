const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const Sleep = require('../../modules/sleep');
const Log = require('../../modules/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription("Test command")
        .addUserOption((options) =>
            options
                .setName('user')
                .setDescription("User to test")
                .setRequired(false))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                .setRequired(false))
    ,
    async execute(client, interaction) {
        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;

        let target = interaction.options.getUser('user') || interaction.member;
        let memberTarget = interaction.guild.members.cache.get(target.id);

        //Checks

        //Code
        await interaction.reply({content: "testing VoiceConnection life cycle states embeds", ephemeral: is_ephemeral})
        const connection_signalling = new MessageEmbed()
            .setColor('YELLOW')
            .setTitle('VoiceConnection')
            .setDescription("__Signalling__. The bot is requesting to join the voice channel...")

        await interaction.channel.send({embeds: [connection_signalling], ephemeral: is_ephemeral})
        await Sleep(50);
        const connection_connecting = new MessageEmbed()
            .setColor('YELLOW')
            .setTitle('VoiceConnection')
            .setDescription("__Connecting__. The bot is establishing a connection to the voice channel...")

        await interaction.channel.send({embeds: [connection_connecting], ephemeral: is_ephemeral})
        await Sleep(50);
        const connection_ready = new MessageEmbed()
            .setColor('GREEN')
            .setTitle('VoiceConnection')
            .setDescription("__Ready__. The connection to the voice channel has been established.")

        interaction.channel.send({embeds: [connection_ready], ephemeral: is_ephemeral})
        await Sleep(50);
        const connection_disconnected = new MessageEmbed()
            .setColor('RED')
            .setTitle('VoiceConnection')
            .setDescription("__Disconnected__. The connection to the voice channel has been severed.")

        interaction.channel.send({embeds: [connection_disconnected], ephemeral: is_ephemeral})
        await Sleep(50);
        const connection_destroyed = new MessageEmbed()
            .setColor('FUCHSIA')
            .setTitle('VoiceConnection')
            .setDescription("__Destroyed__. The connection to the voice channel has been destroyed.")

        interaction.channel.send({embeds: [connection_destroyed], ephemeral: is_ephemeral})
    }
}

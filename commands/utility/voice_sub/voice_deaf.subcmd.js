const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require("@discordjs/voice");

const {log, permissionCheck, sleep} = require("../../../modules/JerryUtils.js");


module.exports = async function (client, interaction) {
    if(await permissionCheck(interaction, 2) === false) {
        return;
    }

    // Declaring variables

    // Checks
    const _connection = getVoiceConnection(interaction.guild.id);
    if(!_connection) {
        const error_not_in_vc = new MessageEmbed()
            .setColor("RED")
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle("Error")
            .setDescription("The bot is not in a voice channel.");

        interaction.reply({embeds: [error_not_in_vc]});
        return;
    }

    // Main
    const bot = interaction.guild.members.resolve(client.user.id);

    if(bot.voice.serverDeaf) {
        bot.voice.setDeaf(false);
    } else {
        bot.voice.setDeaf(true);
    }

    const self_deaf = new MessageEmbed()
        .setColor("GREEN")
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        .setTitle("Voice selfDeaf")
        .setDescription("Successfully toggled deafen.");

    interaction.relpy({embeds: [self_deaf]});
};

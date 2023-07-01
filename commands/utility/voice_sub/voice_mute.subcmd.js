const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require("@discordjs/voice");

const {log, permissionCheck, sleep} = require("../../../modules/jerryUtils.js");


module.exports = async function (client, interaction) {
    if(await permissionCheck(interaction, 2) === false) {
        return;
    }

    // Declaring variables

    // Checks
    const _connection = getVoiceConnection(interaction.guild.id);
    if(!_connection) {
        const voice_state_exception = new MessageEmbed()
            .setColor("RED")
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle("VoiceStateException")
            .setDescription("The bot is not in a voice channel.");

        interaction.reply({embeds: [voice_state_exception]});
        return;
    }

    // Main
    const bot = interaction.guild.members.resolve(client.user.id);

    if(bot.voice.serverMute) {
        bot.voice.setMute(false);
    } else {
        bot.voice.setMute(true);
    }

    const self_mute = new MessageEmbed()
        .setColor("GREEN")
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        .setTitle("Voice selfMute")
        .setDescription("Successfully toggled mute.");

    interaction.reply({embeds: [self_mute]});
};

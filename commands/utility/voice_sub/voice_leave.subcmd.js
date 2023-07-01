const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require("@discordjs/voice");

const {log, permissionCheck, sleep} = require("../../../modules/jerryUtils.js");


module.exports = async function (client, interaction) {
    if(await permissionCheck(interaction, 0) === false) {
        return;
    }

    // Declaring variables

    // Checks

    const fetching_connection = new MessageEmbed()
        .setColor("YELLOW")
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        .setTitle("VoiceConnection")
        .setDescription("Fetching voice connections in this guild...");

    await interaction.reply({embeds: [fetching_connection]});
    const connection = getVoiceConnection(interaction.guild.id);
    if(!connection) {
        const voice_state_exception = new MessageEmbed()
            .setColor("RED")
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle("VoiceStateException")
            .setDescription("The bot is not in a voice channel.");

        interaction.editReply({embeds: [voice_state_exception]});
        return;
    }

    // Main
    connection.on(VoiceConnectionStatus.Destroyed, async () => {
        const connection_destroyed = new MessageEmbed()
            .setColor("FUCHSIA")
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle("VoiceConnection")
            .setDescription("__Destroyed__. The connection to the voice channel has been destroyed.");

        await interaction.editReply({embeds: [connection_destroyed]});
        log("append", interaction.guild.id, "├─Destroyed. The connection to the voice channel has been destroyed.", "INFO");

        await sleep(500);

        const success_leave = new MessageEmbed()
            .setColor("GREEN")
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle("VoiceConnection")
            .setDescription("Successfully left the voice channel.");

        await interaction.editReply({embeds: [success_leave]});
        log("append", interaction.guild.id, "└─Successfully left the voice channel.", "INFO");
    });
    connection.destroy();
};

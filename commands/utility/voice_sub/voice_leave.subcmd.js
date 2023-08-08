import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} from "@discordjs/voice";

import {logger, permissionCheck, sleep} from "../../../utils/jerryUtils.js";


export default async function (client, interaction) {
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
            .setTitle("IllegalVoiceStateException")
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
        logger.apppend("info", "STDOUT", "'/voice leave' > Destroyed. The connection to the voice channel has been destroyed.");

        await sleep(500);

        const success_leave = new MessageEmbed()
            .setColor("GREEN")
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle("VoiceConnection")
            .setDescription("Successfully left the voice channel.");

        interaction.editReply({embeds: [success_leave]});
        logger.append("info", "STDOUT", "'/voice leave' > Successfully left the voice channel.");
    });
    connection.destroy();
}

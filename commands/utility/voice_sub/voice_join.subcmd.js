import {MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    entersState,
    StreamType,
    AudioPlayerStatus,
    VoiceConnectionStatus,
    getVoiceConnection
} from "@discordjs/voice";

import {logger, permissionCheck, sleep} from "../../../utils/jerryUtils.js";


export default async function (client, interaction) {
    if (await permissionCheck(interaction, 0) === false) {
        return;
    }

    // Declaring variables
    const voice_channel = interaction.options.getChannel("channel") || interaction.member.voice.channel;
    logger.append("debug", "IN", `'/voice join' > voice_channel: ${voice_channel?.name}`);

    // Checks
    if (!interaction.member.voice.channel && !voice_channel) {
        const voice_channel_resolve_exception = new MessageEmbed()
        .setColor("RED")
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        .setTitle("VoiceChannelResolveException")
        .setDescription("You must specify a voice channel for the bot to join if you are not currently in a voice channel.");

        interaction.reply({embeds: [voice_channel_resolve_exception]});
        return;
    }

    // Main
    const creating_connection = new MessageEmbed()
    .setColor("YELLOW")
    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
    .setDescription("Creating a connection...");

    await interaction.reply({embeds: [creating_connection]});

    const connection = joinVoiceChannel({
        channelId: voice_channel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
        selfMute: false,
        selfDeaf: false,
    });

    connection.on(VoiceConnectionStatus.Connecting, async () => {
        const connection_connecting = new MessageEmbed()
        .setColor("YELLOW")
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        .setTitle("VoiceConnection")
        .setDescription("*Connecting*. The bot is establishing a connection to the voice channel...");

        interaction.editReply({embeds: [connection_connecting]});
        logger.append("info", "STDOUT", "Connecting. Establishing a connection to the voice channel...");
    });

    connection.on(VoiceConnectionStatus.Ready, async () => {
        const connection_ready = new MessageEmbed()
        .setColor("GREEN")
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        .setTitle("VoiceConnection")
        .setDescription("*Ready*. The connection to the voice channel has been established.");

        await interaction.editReply({embeds: [connection_ready]});
        logger.append("info", "STDOUT", "'/voice join' > Ready. The connection to the voice channel has been established.");

        await sleep(500);

        const success_join = new MessageEmbed()
        .setColor("GREEN")
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        .setTitle("VoiceConnection")
        .setDescription(`Successfully joined <#${voice_channel.id}>`);

        await interaction.editReply({embeds: [success_join]});
        logger.append("info", "STDOUT", `'/voice join' > Successfully joined ${voice_channel.name}`);

        const bot = interaction.guild.members.cache.get(client.user.id);

        if (!bot.voice) {
            return;
        }

        if (bot.voice.serverMute) {
            await bot.voice.setMute(false);
        }
        if (bot.voice.serverDeaf) {
            bot.voice.setDeaf(false);
        }
    });
}

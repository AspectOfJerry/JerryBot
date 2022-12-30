const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const {Log, Sleep} = require('../../../modules/JerryUtils');


module.exports = async function (client, interaction) {
    await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' executed '/voice join'.`, 'INFO'); // Logs
    // await interaction.deferReply();

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
            await Log('append', interaction.guild.id, "  └─Throwing because of bad permission configuration.", 'ERROR'); // Logs
            throw `Error: Bad permission configuration.`;
    }

    // Declaring variables
    const voice_channel = interaction.options.getChannel('channel') || interaction.member.voice.channel;
    await Log('append', interaction.guild.id, `  ├─voice_channel: ${voice_channel.name}`, 'INFO'); // Logs

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
            await Log('append', interaction.guild.id, `  └─'${interaction.user.id}' did not have the required role to perform '/voice join'. [error_permissions]`, 'WARN'); // Logs
            return;
        }
    }
    // -----END ROLE CHECK-----
    if(!interaction.member.voice.channel && !voice_channel) {
        const error_not_in_vc = new MessageEmbed()
            .setColor('RED')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle('Error')
            .setDescription("You must specify a voice channel for the bot to join if you are not currently in a voice channel.");

        await interaction.reply({embeds: [error_not_in_vc]});
        return;
    }

    // Main
    const creating_connection = new MessageEmbed()
        .setColor('YELLOW')
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
        .setDescription('Creating a connection...');

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
            .setColor('YELLOW')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle('VoiceConnection')
            .setDescription("__Connecting__. The bot is establishing a connection to the voice channel...");

        await interaction.editReply({embeds: [connection_connecting]});
        await Log('append', interaction.guild.id, `  ├─Connecting. Establishing a connection to the voice channel...`, 'INFO'); // Logs
    });
    connection.on(VoiceConnectionStatus.Ready, async () => {
        const connection_ready = new MessageEmbed()
            .setColor('GREEN')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle('VoiceConnection')
            .setDescription("__Ready__. The connection to the voice channel has been established.");

        await interaction.editReply({embeds: [connection_ready]});
        await Log('append', interaction.guild.id, `  ├─Ready. The connection to the voice channel has been established.`, 'INFO'); // Logs

        await Sleep(500);

        const success_join = new MessageEmbed()
            .setColor('GREEN')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle('VoiceConnection')
            .setDescription(`Successfully joined <#${voice_channel.id}>`);

        await interaction.editReply({embeds: [success_join]});
        await Log('append', interaction.guild.id, `  └─Successfully joined ${voice_channel.name}`, 'INFO'); // Logs

        const bot = interaction.guild.members.cache.get(client.user.id);

        if(!bot.voice) {
            return;
        }

        if(bot.voice.serverMute) {
            await bot.voice.setMute(false);
        }
        if(bot.voice.serverDeaf) {
            await bot.voice.setDeaf(false);
        }
    });
};

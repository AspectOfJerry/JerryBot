const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const {PermissionCheck, Log, Sleep} = require("../../../modules/JerryUtils");


module.exports = async function (client, interaction) {
    await Log('append', interaction.guild.id, `'@${interaction.user.tag}' executed '/${interaction.commandName}${interaction.options.getSubcommand(false) ? " " + interaction.options.getSubcommand(false) : ""}'.`, 'INFO');
    // await interaction.deferReply();

    if(await PermissionCheck(interaction) === false) {
        const error_permissions = new MessageEmbed()
            .setColor('RED')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle('PermissionError')
            .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
            .setFooter({text: `Use '/help' to access the documentation on command permissions.`});

        await interaction.reply({embeds: [error_permissions]});
        await Log('append', interaction.guild.id, `└─'@${interaction.user.tag}' did not have the required role to execute '/${interaction.commandName}${interaction.options.getSubcommand(false) ? " " + interaction.options.getSubcommand(false) : ""}'. [PermissionError]`, 'WARN');
        return "PermissionError";
    }

    // Declaring variables

    // Checks

    const fetching_connection = new MessageEmbed()
        .setColor('YELLOW')
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        .setTitle('VoiceConnection')
        .setDescription("Fetching voice connections in this guild...");

    await interaction.reply({embeds: [fetching_connection]});
    const connection = getVoiceConnection(interaction.guild.id);
    if(!connection) {
        const error_not_in_vc = new MessageEmbed()
            .setColor('RED')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle('Error')
            .setDescription("The bot is not in a voice channel.");

        await interaction.reply({embeds: [error_not_in_vc]});
        return;
    }

    // Main
    connection.on(VoiceConnectionStatus.Destroyed, async () => {
        const connection_destroyed = new MessageEmbed()
            .setColor('FUCHSIA')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle('VoiceConnection')
            .setDescription("__Destroyed__. The connection to the voice channel has been destroyed.");

        await interaction.editReply({embeds: [connection_destroyed]});
        await Log('append', interaction.guild.id, `├─Destroyed. The connection to the voice channel has been destroyed.`, 'INFO');

        await Sleep(500);

        const success_leave = new MessageEmbed()
            .setColor('GREEN')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle('VoiceConnection')
            .setDescription(`Successfully left the voice channel.`);

        await interaction.editReply({embeds: [success_leave]});
        await Log('append', interaction.guild.id, `└─Successfully left the voice channel.`, 'INFO');
    });
    connection.destroy();
};

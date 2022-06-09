const fs = require('fs');
const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const Sleep = require('../../modules/sleep'); //delayInMilliseconds;
const Log = require('../../modules/logger'); //DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription("Unbans a user form the guild.")
        .addUserOption((options) =>
            options
                .setName('user')
                .setDescription("[REQUIRED] The user to unban (user ID).")
                .setRequired(true))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                .setRequired(false)),
    async execute(client, interaction) {
        await Log(interaction.guild.id, `'${interaction.user.tag}' executed '/unban'.`, 'INFO'); //Logs
        //Permission check
        let MINIMUM_EXECUTION_ROLE = undefined;
        switch(interaction.guild.id) {
            case process.env.DISCORD_JERRY_GUILD_ID:
                MINIMUM_EXECUTION_ROLE = "PL1";
                break;
            case process.env.DISCORD_GOLDFISH_GUILD_ID:
                MINIMUM_EXECUTION_ROLE = "Mod";
                break;
            case process.env.DISCORD_CRA_GUILD_ID:
                MINIMUM_EXECUTION_ROLE = "PL1";
                break;
            default:
                throw `Error: Bad permission configuration.`;
        }

        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
        await Log(interaction.guild.id, `├─ephemeral: ${is_ephemeral}`, 'INFO'); //Logs
        const target = interaction.options.getUser('user');
        const memberTarget = interaction.guild.members.cache.get(target.id);
        await Log(interaction.guild.id, `├─memberTarget: '${memberTarget.user.tag}'`, 'INFO');

        //Checks
        if(!interaction.member.roles.cache.find(role => role.name == MINIMUM_EXECUTION_ROLE)) {
            const error_permissions = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                .setFooter({text: `You need at least the '${MINIMUM_EXECUTION_ROLE}' role to use this command.`});

            await interaction.reply({embeds: [error_permissions], ephemeral: is_ephemeral});
            await Log(interaction.guild.id, `└─'${interaction.user.id}' did not have the required role to use '/unban'.`, 'WARN');
            return;
        }
        if(memberTarget.id == interaction.user.id) {
            const error_cannot_use_on_self = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('Error')
                .setDescription('You cannot unban yourself.');

            interaction.reply({embeds: [error_cannot_use_on_self], ephemeral: is_ephemeral});
            return;
        }
        // //Check if target is in the guild
        // const error_user_not_banned = new MessageEmbed()
        //     .setColor('RED')
        //     .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        //     .setTitle('Error')
        //     .setDescription(`<@${memberTarget.id}> is not banned from the guild`)

        // interaction.reply({embeds: [error_user_not_banned], ephemeral: is_ephemeral});
        // //return;

        //Code
        interaction.reply({content: "This command is currently unavailable.", ephemeral: is_ephemeral});
    }
}

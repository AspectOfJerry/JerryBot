const fs = require('fs');
const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const {Log, Sleep} = require('../../../modules/JerryUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription("Create a new poll")
        .addStringOption((options) =>
            options
                .setName('message')
                .setDescription("The question of the survey")
                .setRequired(true))
        .addIntegerOption((options) =>
            options
                .setName('time')
                .setDescription("The duration of the colector in seconds")
                .setRequired(true)),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/poll'.`, 'INFO'); // Logs
        // interaction.deferReply()

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
                await Log('append', interaction.guild.id, "└─Throwing because of bad permission configuration.", 'ERROR'); // Logs
                throw `Error: Bad permission configuration.`;
        }

        // Declaring variables
        const time = interaction.options.getInteger('time');

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
                await Log('append', interaction.guild.id, `└─'${interaction.user.id}' did not have the required role to perform '/AGTest'. [error_permissions]`, 'WARN'); // Logs
                return 10;
            }
        } // -----END ROLE CHECK-----

        // Main
        const test = new MessageEmbed()
            .setColor('GREEN')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle('Test')
            .setDescription("Test Concluded")

        await interaction.reply({embeds: [test]})
            .then(async (msg) => {
                let yesCount;
                let maybeCount;
                let noCount;

                await msg.react('✅')
                await msg.react('🤔')
                await msg.react('❌')

                const filter = (reaction, user) => reaction.emoji.name === '✅' || reaction.emoji.name === '🤔' || reaction.emoji.name === '❌';
                const collector = msg.createReactionCollector({filter, time: time * 1000});

                collector.on('collect', user, (collected) => {
                    if(collected.reaction.name === '✅') {
                        yesCount += 1;
                    } else if(collected.reaction.name === '🤔') {
                        maybeCount += 1;
                    } else if(collected.reaction.name === '❌') {
                        noCount += 1;
                    }
                    console.log(`Collected ${collected.emoji.name} by ${user}`);
                });
                collector.on('remove', user, (collected) => {
                    if(collected.reaction.name === '✅') {
                        yesCount -= 1;
                    } else if(collected.reaction.name === '🤔') {
                        maybeCount -= 1;
                    } else if(collected.reaction.name === '❌') {
                        noCount -= 1;
                    }
                    console.log(`Removed ${collected.emoji.name} by ${user}`);
                });
                collector.on('end', (collected) => {
                    interaction.channel.send({content: `:white_check_mark:: ${yesCount}, INSERT MAYBE EMOJI:x:: ${maybeCount}, :x:: ${noCount}`});
                });
            });
    }
};

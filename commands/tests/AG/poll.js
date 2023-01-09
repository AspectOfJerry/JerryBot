const fs = require('fs');
const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const {Log, Sleep} = require('../../../modules/JerryUtils');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription("[TEST] Create a new poll")
        .addStringOption((options) =>
            options
                .setName('title')
                .setDescription("The title of the poll")
                .setRequired(true))
        .addStringOption((options) =>
            options
                .setName('description')
                .setDescription("The description of the poll")
                .setRequired(true))
        .addIntegerOption((options) =>
            options
                .setName('time')
                .setDescription("The duration of the colector in seconds")
                .setRequired(true)),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/poll'.`, 'INFO');
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
                await Log('append', interaction.guild.id, "└─Throwing because of bad permission configuration.", 'ERROR');
                throw `Error: Bad permission configuration.`;
        }

        // Declaring variables
        const time = interaction.options.getInteger('time');
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');

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
                await Log('append', interaction.guild.id, `└─'${interaction.user.id}' did not have the required role to perform '/AGTest'. [error_permissions]`, 'WARN');
                return 10;
            }
        } // -----END ROLE CHECK-----

        // Main
        const test = new MessageEmbed()
            .setColor('GREEN')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle(`:ballot_box: Poll: ${title}`)
            .setDescription(`${description}`)
            .addFields(
                {name: "Time", value: `${time} seconds`, inline: false}
            ).setFooter({text: "Open to everyone. Do not spam the buttons."});

        await interaction.reply({embeds: [test], fetchReply: true})
            .then(async (msg) => {
                let yesCount = 0;
                let maybeCount = 0;
                let noCount = 0;

                const yes_reaction = await msg.react('✅');
                const maybe_reaction = await msg.react('🤔');
                const no_reaction = await msg.react('❌');

                const filter = (reaction, user) => reaction.emoji.name === '✅' || reaction.emoji.name === '🤔' || reaction.emoji.name === '❌';
                const collector = msg.createReactionCollector({filter, time: time * 1000, dispose: true});

                collector.on('collect', async (reaction, user) => {
                    if(reaction.emoji.name === '✅') {
                        await maybe_reaction.users.remove(user.id);
                        await no_reaction.users.remove(user.id);

                        yesCount += 1;
                    } else if(reaction.emoji.name === '🤔') {
                        await yes_reaction.users.remove(user.id);
                        await no_reaction.users.remove(user.id);

                        maybeCount += 1;
                    } else if(reaction.emoji.name === '❌') {
                        await yes_reaction.users.remove(user.id);
                        await maybe_reaction.users.remove(user.id);

                        noCount += 1;
                    }
                });

                collector.on('remove', (reaction, user) => {
                    if(reaction.emoji.name === '✅') {
                        yesCount -= 1;
                    } else if(reaction.emoji.name === '🤔') {
                        maybeCount -= 1;
                    } else if(reaction.emoji.name === '❌') {
                        noCount -= 1;
                    }
                });

                collector.on('end', async (collected) => {
                    if(yesCount < 0) {
                        yesCount = 0;
                    }
                    if(maybeCount < 0) {
                        maybeCount = 0;
                    }
                    if(noCount < 0) {
                        noCount = 0;
                    }

                    const result = new MessageEmbed()
                        .setColor('GREEN')
                        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                        .setTitle(':bar_chart: Poll results')
                        .setDescription(`Here are the results:\n\n:white_check_mark: : ${yesCount}\n :thinking: : ${maybeCount}\n :x: : ${noCount}`)

                    await interaction.followUp({embeds: [result]});
                });
            });
    }
};

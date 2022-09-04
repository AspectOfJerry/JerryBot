// https:// api.dictionaryapi.dev/api/v2/entries/en/<word>
const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const fetch = require('node-fetch');

const Sleep = require('../../modules/sleep'); // delayInMilliseconds
const Log = require('../../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dictionary')
        .setDescription("Get the definition of a word.")
        .addStringOption((options) =>
            options
                .setName('string')
                .setDescription("[REQUIRED] the word to define.")
                .setRequired(true))
        .addStringOption((options) =>
            options
                .setName('language')
                .setDescription("[OPTIONAL] the language to define the word in. Defaults to English.")
                .addChoice("English (English)", 'en')
                .addChoice("Français (French)", 'fr')
                .addChoice("Español (Spanish)", 'es')
                .setRequired(false))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself or not. Defaults to false.")
                .setRequired(false)),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/dictionary'.`, 'INFO'); // Logs
        const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
        await Log('append', interaction.guild.id, `├─ephemeral: ${is_ephemeral}`, 'INFO'); // Logs
        await interaction.deferReply({ephemeral: is_ephemeral});

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
        const word = interaction.options.getString('string');
        const language = interaction.options.getString('language') || 'en';

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

                await interaction.editReply({embeds: [error_permissions]});
                await Log('append', interaction.guild.id, `└─'${interaction.user.id}' did not have the required role to use '/dictionary'.`, 'WARN'); // Logs
                return;
            }
        }
        // -----END ROLE CHECK-----

        // Main
        await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/hello`)
            .then(res => {
                res => res.json();
            }).then(res => {
                console.log(res);
            });

        await interaction.editReply({content: "This command is currently unavailable."});
    }
};

const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const Sleep = require('../../modules/sleep'); // delayInMilliseconds
const Log = require('../../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription("Translator.")
        .addStringOption((options) =>
            options
                .setName('string')
                .setDescription("[REQUIRED] The string to translate.")
                .setRequired(true))
        .addStringOption((options) =>
            options
                .setName('to')
                .setDescription("[REQUIRED] The language to translate the string to.")
                .addChoice("English (English)", 'en')
                .addChoice("Français (French)", 'fr')
                .addChoice("German (German)", 'de')
                .addChoice("Español (Spanish)", 'es')
                .addChoice("中文 (Chinese Simplified)", 'zh-cn')
                .addChoice("Italiano (Italian)", 'it')
                .addChoice("日本語 (Japanese)", 'ja')
                .addChoice("한국어 (Korean)", 'ko')
                .addChoice("Tiếng Việt (Vietnamese)", 'vi')
                .addChoice("Português (Portuguese)", 'pt')
                .addChoice("Українська (Ukrainian)", 'uk')
                .addChoice("Polski (Polish)", 'pl')
                .addChoice("Svenska (Swedish)", 'sv')
                .addChoice("Türkçe (Turkish)", 'tr')
                .addChoice("Nederlands (Dutch)", 'nl')
                // .addChoice("Русский (Russian) #StandForUkraine", 'ru') // #StandForUkraine, Not adding russian for the moment sorry
                .setRequired(true))
        .addStringOption((options) =>
            options
                .setName('from')
                .setDescription("[REQUIRED] The language to translate the string from.")
                .addChoice("Automatic", 'auto')
                .addChoice("English (English)", 'en')
                .addChoice("Français (French)", 'fr')
                .addChoice("German (German)", 'de')
                .addChoice("Español (Spanish)", 'es')
                .addChoice("中文 (Chinese Simplified)", 'zh-cn')
                .addChoice("Italiano (Italian)", 'it')
                .addChoice("日本語 (Japanese)", 'ja')
                .addChoice("한국어 (Korean)", 'ko')
                .addChoice("Tiếng Việt (Vietnamese)", 'vi')
                .addChoice("Português (Portuguese)", 'pt')
                .addChoice("Українська (Ukrainian)", 'uk')
                .addChoice("Polski (Polish)", 'pl')
                .addChoice("Svenska (Swedish)", 'sv')
                .addChoice("Türkçe (Turkish)", 'tr')
                .addChoice("Nederlands (Dutch)", 'nl')
                // .addChoice("Русский (Russian) #StandForUkraine", 'ru') // #StandForUkraine, Not adding russian for the moment sorry
                .setRequired(true))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself or not. Defaults to false.")
                .setRequired(false)),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/translate'.`, 'INFO'); // Logs
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
        const string = interaction.options.getString('string');
        const original_language = interaction.options.getString('from');
        const target_language = interaction.options.getString('to');

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
                await Log('append', interaction.guild.id, `└─'${interaction.user.id}' did not have the required role to use '/translate'.`, 'WARN'); // Logs
                return;
            }
        }
        // -----END ROLE CHECK-----

        // Main
        interaction.editReply({content: "This command is currently unavailable."});
        return;
    }
};

const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const Sleep = require('../../modules/sleep');
const Log = require('../../modules/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription("[OBSOLETE] Please use the '/timeout' command instead. Mutes a member.")
        .addUserOption((options) =>
            options
                .setName('user')
                .setDescription("[REQUIRED] The user to mute.")
                .setRequired(true))
        .addIntegerOption((options) =>
            options
                .setName('duration')
                .setDescription("[OPTIONAL] The duration in minutes for the mute. Defualts to 0 (no duration).")
                .setRequired(false))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                .setRequired(false)),
    async execute(client, interaction) {
        await Log(`'${interaction.user.tag}' executed '/mute'.`, 'INFO');
        //Command information
        const REQUIRED_ROLE = "PL3";

        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
        await Log(`├─ephemeral: ${is_ephemeral}`, 'DEBUG'); //Logs
        const target = interaction.options.getUser('user');
        const memberTarget = interaction.guild.members.cache.get(target.id);
        await Log(`├─memberTarget: '${memberTarget.user.tag}'`, 'DEBUG');

        const duration = interaction.options.getInteger('duration');

        //Checks

        //Code
        const deprecation_warning = new MessageEmbed()
            .setColor('RED')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle('DeprecationWarning')
            .setDescription("This command is obsolete. Please use the `/timeout` command instead.")

        interaction.reply({embeds: [deprecation_warning], ephemeral: is_ephemeral});
        await Log(`└─This command is obsolete, and it is replaced by '/timeout'`, 'WARN')
    }
}

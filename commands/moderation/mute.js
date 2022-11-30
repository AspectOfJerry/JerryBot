const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const {Log, Sleep} = require('../../modules/JerryUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription("[DEPRECATED] Please use the '/timeout' command instead. Mutes a member."),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/mute'.`, 'INFO'); // Logs

        // Declaring variables

        // Checks

        // Main
        const deprecation_warning = new MessageEmbed()
            .setColor('RED')
            .setDescription("This command is deprecated. Please use the `/timeout` command instead.");

        interaction.reply({embeds: [deprecation_warning]});
        await Log('append', interaction.guild.id, `└─This command is deprecated, and it is replaced by '/timeout'`, 'WARN');
    }
};

const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const {Log, Sleep} = require('../../modules/JerryUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription("Help is here!"),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/help'.`, 'INFO'); // Logs

        // Set minimum execution role

        // Declaring variables

        // Checks

        // Main
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('Documentation')
                    .setEmoji('📘')
                    .setStyle('LINK')
                    .setURL('https://bot.aspectofjerry.dev')
            );

        const help = new MessageEmbed()
            .setColor('GREEN')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle("Need help?")
            .setDescription(":bookmark: You can find the documentation [here](https://bot.aspectofjerry.dev)!")

        await interaction.reply({embeds: [help], components: [row]});
    }
};

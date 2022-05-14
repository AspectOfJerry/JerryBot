const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const Sleep = require('../../modules/sleep').default;
const Log = require('../../modules/logger').default;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription("Test command")
        .addUserOption((options) =>
            options
                .setName('user')
                .setDescription("User to test")
                .setRequired(true))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                .setRequired(false))
    ,
    async execute(client, interaction) {
        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;

        let target = interaction.options.getUser('user') || interaction.member;
        let memberTarget = interaction.guild.members.cache.get(target.id);

        //Checks

        //Code

    }
}

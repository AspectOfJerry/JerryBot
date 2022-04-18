const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription("[DEPRECATED] Please use the '/profile' command instead. Sends a user's avatar.")
        .addUserOption((options) =>
            options
                .setName('user')
                .setDescription("The user's avatar to send. Defaults to yourself.")
                .setRequired(true))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("Whether you want the bot's messages to only be visible to yourself.")
                .setRequired(false)),
    async execute(client, interaction) {
        //Command information
        const REQUIRED_ROLE = "everyone";

        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral');
        const target = interaction.options.getUser('user');
        const memberTarget = interaction.guild.members.cache.get(target.id);

        //Checks

        //Code
        const deprecation_warning = new MessageEmbed()
            .setColor('RED')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle('DeprecationWarning')
            .setDescription("This command is deprecated. Please use the `/profile` command instead.")

        interaction.reply({emebds: [deprecation_warning], ephemeral: is_ephemeral});
    }
}

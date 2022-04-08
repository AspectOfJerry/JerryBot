const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('friend')
        .setDescription("Adds or removes a friend (adds or removes the friend role from a user).")
        .addStringOption((options) =>
            options
                .setName('action')
                .setDescription("Add or remove a friend. Defaults to add")
                .addChoice('Add', "add")
                .addChoice('Remove', "remove")
                .setRequired(false))
        .addUserOption((options) =>
            options
                .setName('user')
                .setDescription("The user to friend.")
                .setRequired(true))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("Whether you want the bot's messages to only be visible to yourself.")
                .setRequired(false)),
    async execute(client, interaction) {
        //Command information
        const REQUIRED_ROLE = "PL0";

        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral');
        const target = interaction.options.getUser('user');
        const memberTarget = interaction.guild.members.cache.get(target.id);
        
        const action = interaction.options.getString('action') || "add";
        const friend_role = interaction.guild.roles.cache.find(role => role.name == "Friend");

        //Checks
        if(interaction.member.roles.cache.find(role => role.name == REQUIRED_ROLE)) {
            const error_permissions = new MessageEmbed()
                .setColor('#ff2020')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("PermissionError")
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                .setFooter({text: "The friend command is only available for the server owner."});

            interaction.reply({embeds: [error_permissions]})
            return;
        }

        //Code

    }
}

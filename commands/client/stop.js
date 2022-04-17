const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription("Stops the bot.")
        .addStringOption((options) =>
            options
                .setName('reason')
                .setDescription("The reason for the stop request.")
                .setRequired(false))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("Whether you want the bot's messages to only be visible to yourself.")
                .setRequired(false)),
    async execute(client, interaction) {
        //Command information
        const REQUIRED_ROLE = "PL3";

        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral');
        const reason = interaction.options.getString('reason') || "No reason was provided.";

        //Checks
        if(!interaction.member.roles.cache.find(role => role.name = REQUIRED_ROLE)) {
            const error_permissions = new MessageEmbed()
                .setColor('#ff2020')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                .setFooter({text: `You need at least the '${REQUIRED_ROLE}' role to use this command.`});

            interaction.reply({embeds: [error_permissions], ephemeral: is_ephemeral});
            return;
        }

        //Code
        await interaction.reply({content: "This command is under developpement. The bot will stop after this message.", ephemeral: false})
        console.log("stop");
        client.destroy();

        /*Add buttons and ask for a confirmation.*/
    }
}

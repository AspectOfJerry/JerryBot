const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");

const {PermissionCheck, Log, Sleep} = require("../../../modules/JerryUtils");


module.exports = async function (client, interaction) {
    await interaction.deferReply()

    if(await PermissionCheck(interaction) === false) {
        const error_permissions = new MessageEmbed()
            .setColor('RED')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle('PermissionError')
            .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
            .setFooter({text: `Use '/help' to access the documentation on command permissions.`});

        await interaction.reply({embeds: [error_permissions]});
        await Log('append', interaction.guild.id, `└─'@${interaction.user.tag}' did not have the required role to execute '/${interaction.commandName}${interaction.options.getSubcommand(false) ? " " + interaction.options.getSubcommand(false) : ""}'. [PermissionError]`, 'WARN');
        return;
    }

    // Declaring variables

    // Checks

    // Main

    // Generate the one time use password

    // Approve for execution

    // Arm for execution

    // Execute

    // Logs
};

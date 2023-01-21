const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");

const {PermissionCheck, Log, Sleep} = require("../../../modules/JerryUtils");


module.exports = async function (client, interaction, string, object) {
    await interaction.deferReply();

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
    const writing_to_logs = new MessageEmbed()
        .setColor('YELLOW')
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
        .setTitle('Writing to logs...')
        .addFields(
            {name: 'Body string', value: `${string}`, inline: false},
            {name: 'Target directory', value: "../logs/", inline: false})
    const write_to_logs = new MessageEmbed()
        .setColor('GREEN')
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
        .setTitle('Write to logs')
        .addFields(
            {name: 'Body string', value: `${(await object).parsedString}`, inline: false},
            {name: 'Target directory', value: `../logs/${(await object).fileName}`, inline: false})

    await interaction.reply({embeds: [writing_to_logs]});
    await Log('append', interaction.guild.id, string, 'INFO');
    await interaction.editReply({embeds: [write_to_logs]});
};

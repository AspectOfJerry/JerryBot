// -----BEGIN ROLE CHECK-----
if(!interaction.member.roles.cache.find(role => role.name == MINIMUM_EXECUTION_ROLE)) {
    const error_permissions = new MessageEmbed()
        .setColor('RED')
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        .setTitle('PermissionError')
        .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
        .setFooter({text: `You need at least the '${MINIMUM_EXECUTION_ROLE}' role to use this command.`});

    await interaction.reply({embeds: [error_permissions], ephemeral: is_ephemeral});
    await Log('append', interaction.guild.id, `└─'${interaction.user.id}' did not have the required role to use '/CMD_NAME'.`, 'WARN'); // Logs
    return;
}
// -----END ROLE CHECK-----
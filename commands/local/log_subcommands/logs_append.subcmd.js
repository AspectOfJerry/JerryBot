const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent} = require('discord.js');

const {Log, Sleep} = require('../../../modules/JerryUtils');

module.exports = async function (client, interaction, string, object) {
    await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' executed '/logs append'.`, 'INFO'); // Logs
    await interaction.deferReply();

    // Set minimum execution role
    switch(interaction.guild.id) {
        case process.env.DISCORD_JERRY_GUILD_ID:
            var MINIMUM_EXECUTION_ROLE = "PL3";
            break;
        case process.env.DISCORD_GOLDFISH_GUILD_ID:
            var MINIMUM_EXECUTION_ROLE = "staff";
            break;
        case process.env.DISCORD_CRA_GUILD_ID:
            var MINIMUM_EXECUTION_ROLE = "PL3";
            break;
        case process.env.DISCORD_311_GUILD_ID:
            var MINIMUM_EXECUTION_ROLE = "PL2";
            break;
        default:
            await Log('append', interaction.guild.id, "  └─Throwing because of bad permission configuration.", 'ERROR'); // Logs
            throw `Error: Bad permission configuration.`;
    }

    // Declaring variables

    // Checks
    // -----BEGIN ROLE CHECK-----
    if(MINIMUM_EXECUTION_ROLE !== null) {
        if(!interaction.member.roles.cache.find(role => role.name === MINIMUM_EXECUTION_ROLE)) {
            const error_permissions = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                .setFooter({text: `You need at least the '${MINIMUM_EXECUTION_ROLE}' role to use this command.`});

            await interaction.editReply({embeds: [error_permissions]});
            await Log('append', interaction.guild.id, `  └─'${interaction.user.id}' did not have the required role to perform '/logs append'. [error_permissions]`, 'WARN'); // Logs
            return;
        }
    }
    // -----END ROLE CHECK-----

    // Main
    const writing_to_logs = new MessageEmbed()
        .setColor('YELLOW')
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
        .setTitle('Writing to logs...')
        .addField('String', `${string}`, false)
        .addField('Target Directory', `../logs/`, false);
    const _writing_to_logs = new MessageEmbed()
        .setColor('GREEN')
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
        .setTitle('Writing to logs')
        .addField('String', `${(await object).parsedString}`, false)
        .addField('Target Directory', `../logs/${(await object).fileName}`, false);

    await interaction.editReply({embeds: [writing_to_logs]});
    await Log('append', interaction.guild.id, string, 'LOG'); // Logs
    await interaction.editReply({embeds: [_writing_to_logs]});
};

const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent} = require('discord.js');

const {Log, Sleep} = require('../../../modules/JerryUtils');

const os = require('node:os');
module.exports = async function (client, interaction) {
    await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/stats system'.`, 'INFO'); // Logs
    await interaction.deferReply();

    // Checks
    switch(interaction.guild.id) {
        case process.env.DISCORD_JERRY_GUILD_ID:
            var MINIMUM_EXECUTION_ROLE = null;
            break;
        case process.env.DISCORD_GOLDFISH_GUILD_ID:
            var MINIMUM_EXECUTION_ROLE = null;
            break;
        case process.env.DISCORD_CRA_GUILD_ID:
            var MINIMUM_EXECUTION_ROLE = null;
            break;
        case process.env.DISCORD_311_GUILD_ID:
            var MINIMUM_EXECUTION_ROLE = null;
            break;
        default:
            await Log('append', interaction.guild.id, "  └─Throwing because of bad permission configuration.", 'ERROR'); // Logs
            throw `Error: Bad permission configuration.`;
    }

    // Declaring variables
    const ram_total = os.totalmem();
    const ram_free = os.freemem();
    const ram_used = ram_total - ram_free;

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
            await Log('append', interaction.guild.id, `└─'${interaction.user.id}' did not have the required role to perform '/stats system'. [error_permissions]`, 'WARN'); // Logs
            return;
        }
    }
    // -----END ROLE CHECK-----

    // Main
    const embed = new MessageEmbed()
        .setColor('BLUE')
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        .setTitle('System Statistics')
        .setDescription('Here are some statistics about the server running the bot.')
        .addField('Operating System', `${os.version()} (${os.type()}) ${os.release()}`, false)
        .addField('CPU average load', `*${os.loadavg()} unavailable on Windows*`, true)
        .addField(`Total allocatable RAM`, `${os.totalmem().toLocaleString()} bytes (~${(os.totalmem / 1000000000).toLocaleString()} gigabytes)`, false)
        .addField(`Allocated RAM (~${((os.totalmem() - os.freemem()) / os.totalmem() * 100).toLocaleString()}%)`, `${(os.totalmem() - os.freemem()).toLocaleString()} bytes (~${((os.totalmem() - os.freemem()) / 1000000000).toLocaleString()} gigabytes)`, true)
        .addField(`Available RAM (~${(os.freemem() / os.totalmem() * 100).toLocaleString()}%)`, `${os.freemem().toLocaleString()} bytes (~${(os.freemem() / 1000000000).toLocaleString()} gigabytes)`, true)
        .setFooter({text: "node:os"});

    await interaction.editReply({embeds: [embed]});
};

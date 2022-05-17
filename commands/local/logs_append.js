const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const Sleep = require('../../modules/sleep'); //delayInMilliseconds;
const Log = require('../../modules/logger'); //DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('log')
        .setDescription("Appends a message to the current log file.")
        .addStringOption((options) =>
            options
                .setName('string')
                .setDescription("[REQUIRED] The string to log.")
                .setRequired(true))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                .setRequired(false)),
    async execute(client, interaction) {
        //Command information
        await Log(interaction.guild.id, `'${interaction.user.tag}' executed '/logs_append'.`, 'INFO');
        const REQUIRED_ROLE = "Friends";

        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
        await Log(interaction.guild.id, `├─ephemeral: ${is_ephemeral}`, 'INFO'); //Logs

        const string = interaction.options.getString('string');
        await Log(interaction.guild.id, `└─string: ${string}`, 'INFO');  //Logs

        const object = Log(interaction.guild.id, string, 'LOG', true);

        //Checks
        if(!interaction.member.roles.cache.find(role => role.name == REQUIRED_ROLE)) {
            const error_permissions = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                .setFooter({text: `You need at least the '${REQUIRED_ROLE}' role to use this command.`});

            await interaction.reply({embeds: [error_permissions], ephemeral: is_ephemeral});
            await Log(interaction.guild.id, `└─'${interaction.user.id}' did not have the required role to use '/log'.`, 'WARN');
            return;
        }

        //Code
        const writing_to_logs = new MessageEmbed()
            .setColor('YELLOW')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setTitle('Writing to logs...')
            .addField('String', `${string}`, false)
            .addField('Target Directory', `../logs/`, false)
        const _writing_to_logs = new MessageEmbed()
            .setColor('GREEN')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setTitle('Writing to logs')
            .addField('String', `${(await object).parsedString}`, false)
            .addField('Target Directory', `../logs/${(await object).fileName}`, false)

        await interaction.reply({embeds: [writing_to_logs], ephemeral: is_ephemeral});
        await Log(interaction.guild.id, string, 'LOG');   //Logging
        await interaction.editReply({embeds: [_writing_to_logs], ephemeral: is_ephemeral});
    }
}

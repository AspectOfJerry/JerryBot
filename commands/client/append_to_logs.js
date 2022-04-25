const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const Sleep = require('../../modules/sleep');
const Log = require('../../modules/logger');

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
        const REQUIRED_ROLE = "PL3";

        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;

        const string = interaction.options.getString('string');

        //Checks
        if(!interaction.member.roles.cache.find(role => role.name == REQUIRED_ROLE)) {
            const error_permissions = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                .setFooter({text: `You need at least the '${REQUIRED_ROLE}' role to use this command.`});

            interaction.reply({embeds: [error_permissions], ephemeral: is_ephemeral});
            return;
        }

        //Code
        const object = Log(string, "INFO/LOG", true);

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
        await Log(string, "INFO/LOG")
        await Sleep(250);

        interaction.editReply({embeds: [_writing_to_logs], ephemeral: is_ephemeral});
    }
}

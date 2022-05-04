const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const portfinder = require('portfinder');

const Sleep = require('../../modules/sleep');
const Log = require('../../modules/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('portfinder')
        .setDescription("Sends available TCP ports in the local machine ready to be binded to.")
        .addIntegerOption((options) =>
            options
                .setName('amount')
                .setDescription("[OPTIONAL] The amount of available ports to search for. Defaults to 10.")
                .setRequired(false))
        .addIntegerOption((options) =>
            options
                .setName('start')
                .setDescription("[OPTIONAL] The start port value to search from. Defaults to 8000.")
                .setRequired(false))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                .setRequired(false)),
    async execute(client, interaction) {
        //Command information
        await Log(interaction.guild.id, `'${interaction.user.tag}' executed '/portfinder'.`, 'INFO');
        const REQUIRED_ROLE = "PL1";

        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
        await Log(interaction.guild.id, `├─ephemeral: ${is_ephemeral}`, 'DEBUG'); //Logs

        const search_amount = interaction.options.getInteger('amount') || 10;
        const start_port = interaction.options.getInteger('start') || 8000;

        let ports = [];
        let nextPort;
        //Checks
        if(!interaction.member.roles.cache.find(role => role.name == REQUIRED_ROLE)) {
            const error_permissions = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("PermissionError")
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.");

            await interaction.reply({embeds: [error_permissions], ephemeral: is_ephemeral});
            return;
        }

        //Code
        portfinder.basePort = start_port;
        // const available_ports = new MessageEmbed()
        //     .setColor('GREEN')
        //     .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        //     .setTitle(`Available ports starting from ${start_port}`)
        //     .setDescription(`Searched for ${search_amount} ports:\n` +
        //         `[${ports.join(', ')}]`);

        // interaction.reply({embeds: [available_ports], ephemeral: is_ephemeral});
        interaction.reply({content: "This command is currently unavailable.", ephemeral: is_ephemeral});
        await Log(interaction.guild.id, `└─This command is currently unavailable.`, 'ERROR');
    }
}

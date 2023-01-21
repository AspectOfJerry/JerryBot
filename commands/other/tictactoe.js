const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");

const {PermissionCheck, Log, Sleep} = require("../../modules/JerryUtils");

const TicTacToe = require('discord-tictactoe');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('tictactoe')
        .setDescription("Game of Tic Tac Toe with buttons.")
        .addUserOption((options) =>
            options
                .setName('opponent')
                .setDescription("[OPTIONAL] Who you want to play against.")
                .setRequired(false)),
    async execute(client, interaction) {

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
        const game = new TicTacToe({language: 'en'});

        // Checks

        // Main
        await Log('append', interaction.guild.id, `└─A game was started, and it is fully handeled by the 'discord-tictactoe' node module`, 'INFO');
        game.handleInteraction(interaction);

        const opponent = (interaction.options.getUser('opponent'))?.id ?? null
        const opponent_text = opponent ? ` opponent: <@${(interaction.options.getUser('opponent'))?.id}>` : ""

        const restart_embed = new MessageEmbed()
            .setDescription(`:clipboard: </${interaction.commandName}:${interaction.commandId}>${opponent_text}`)

        await interaction.channel.send({embeds: [restart_embed]});
    }
};

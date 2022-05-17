const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const TicTacToe = require('discord-tictactoe');
const game = new TicTacToe({language: 'en'});

const Sleep = require('../../modules/sleep'); //delayInMilliseconds;
const Log = require('../../modules/logger'); //DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─;

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
        await Log(interaction.guild.id, `'${interaction.user.tag}' executed '/tictactoe'.`, 'INFO');
        //Command information
        const REQUIRED_ROLE = "everyone";

        //Declaring variables

        //Checks

        //Code
        game.handleInteraction(interaction);
        await Log(interaction.guild.id, `└─A game was started, and it is fully handeled by the 'discord-tictactoe' module`, 'INFO')
    }
}

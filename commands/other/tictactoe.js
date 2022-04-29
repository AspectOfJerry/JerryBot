const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const TicTacToe = require('discord-tictactoe');
const game = new TicTacToe({language: 'en'});

const Sleep = require('../../modules/sleep');
const Log = require('../../modules/logger');

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
        await Log(`'${interaction.user.tag}' executed /tictactoe`, 'INFO');
        //Command information
        const REQUIRED_ROLE = "everyone";

        //Declaring variables

        //Checks

        //Code
        game.handleInteraction(interaction);
        await Log(`└─A game was started and it is fully handeled by the 'discord-tictactoe' package`, 'DEBUG')
    }
}

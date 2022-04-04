const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const TicTacToe = require('discord-tictactoe');
const game = new TicTacToe({language: 'en'});

module.exports = {
    data: new SlashCommandBuilder()
        .setName("tictactoe")
        .setDescription("Game of Tic Tac Toe with buttons.")
        .addUserOption((options) =>
            options
                .setName("opponent")
                .setDescription("Who you want to play against.")
                .setRequired(false)
        ),
    async execute(client, interaction) {
        //Declaring variables

        //Code
        game.handleInteraction(interaction);
    }
}

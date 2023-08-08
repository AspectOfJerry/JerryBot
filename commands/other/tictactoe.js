import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";

import {logger, permissionCheck, sleep} from "../../utils/jerryUtils.js";

import TicTacToe from "discord-tictactoe";


export default {
    data: new SlashCommandBuilder()
        .setName("tictactoe")
        .setDescription("Game of Tic Tac Toe with buttons.")
        .addUserOption((options) =>
            options
                .setName("opponent")
                .setDescription("[OPTIONAL] Who you want to play against.")
                .setRequired(false)),
    async execute(client, interaction) {
        if(await permissionCheck(interaction, 0) === false) {
            return;
        }

        // Declaring variables
        const game = new TicTacToe({language: "en"});

        // Checks

        // Main
        logger.append("info", "STDOUT", "'/tictactoe' > A game was started, and it is fully handeled by the 'discord-tictactoe' node module");
        game.handleInteraction(interaction);

        const opponent = (interaction.options.getUser("opponent"))?.id ?? null;
        const opponent_text = opponent ? ` opponent: <@${(interaction.options.getUser("opponent"))?.id}>` : "";

        const restart_embed = new MessageEmbed()
            .setDescription(`:clipboard: </${interaction.commandName}:${interaction.commandId}>${opponent_text}`);

        interaction.channel.send({embeds: [restart_embed]});
    }
};

const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const {Log, Sleep} = require('../../modules/JerryUtils');

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
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/tictactoe'.`, 'INFO');

        // Set minimum execution role
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
                await Log('append', interaction.guild.id, "└─Throwing because of bad permission configuration.", 'ERROR');
                throw `Error: Bad permission configuration.`;
        }

        // Declaring variables
        const game = new TicTacToe({language: 'en'});

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

                await interaction.reply({embeds: [error_permissions]});
                await Log('append', interaction.guild.id, `└─'${interaction.user.id}' did not have the required role to perform '/tictactoe'. [error_permissions]`, 'WARN');
                return 10;
            }
        } // -----END ROLE CHECK-----

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

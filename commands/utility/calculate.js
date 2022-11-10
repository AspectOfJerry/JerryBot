const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const Sleep = require('../../modules/sleep'); // delayInMilliseconds
const Log = require('../../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    data: new SlashCommandBuilder()
        .setName('calculate')
        .setDescription("Perform one of the arithmetic operations in JavaScript.")

        .addIntegerOption((options) =>
            options
                .setName('operand1')
                .setDescription("[REQUIRED] The first operand.")
                .setRequired(true))
        .addStringOption((options) =>
            options
                .setName('operation')
                .setDescription('[REQUIRED] The operation.')
                .addChoice("Addition", 'add')
                .addChoice("+", 'add')
                .addChoice("Subtraction", 'subtract')
                .addChoice("-", 'subtract')
                .addChoice("Multiplication", 'multiply')
                .addChoice("*", 'multiply')
                .addChoice("x", 'multiply')
                .addChoice("Division", 'divide')
                .addChoice("/", 'divide')
                .addChoice("Modulus", 'modulus')
                .addChoice("%", 'modulus')
                .addChoice("Exponent", 'exponent')
                .addChoice("^", 'exponent')
                .setRequired(true))
        .addIntegerOption((options) =>
            options
                .setName('operand2')
                .setDescription("[REQUIRED] The second operand.")
                .setRequired(true)),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/calculate'.`, 'INFO'); // Logs
        await interaction.deferReply();

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
                await Log('append', interaction.guild.id, "└─Throwing because of bad permission configuration.", 'ERROR'); // Logs
                throw `Error: Bad permission configuration.`;
        }

        // Declaring variables
        const operand1 = interaction.options.getInteger('operand1');
        const operation = interaction.options.getString('operation');
        const operand2 = interaction.options.getInteger('operand2');

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
                await Log('append', interaction.guild.id, `└─'${interaction.user.id}' did not have the required role to use '/calculate'. [error_permissions]`, 'WARN'); // Logs
                return;
            }
        } // -----END ROLE CHECK-----

        // Main
        switch(operation) {
            case 'add':
                const add_result = operand1 + operand2;
                const add_embed = new MessageEmbed()
                    .setColor('GREEN')
                    .setTitle("Addition")
                    .setURL(`https://mathsolver.microsoft.com/en/solve-problem/${operand1}%2B${operand2}`)
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                    .setDescription(`${operand1} + ${operand2} = **${add_result}**`)
                    .setFooter({text: "This command is still under development. More features will be added in the future."});

                interaction.editReply({embeds: [add_embed]});
                break;
            case 'subtract':
                const subtract_result = operand1 - operand2;
                const subtract_embed = new MessageEmbed()
                    .setColor('GREEN')
                    .setTitle("Subtraction")
                    .setURL(`https://mathsolver.microsoft.com/en/solve-problem/${operand1}%2D${operand2}`)
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                    .setDescription(`${operand1} - ${operand2} = **${subtract_result}**`)
                    .setFooter({text: "This command is still under development. More features will be added in the future."});

                interaction.editReply({embeds: [subtract_embed]});
                break;
            case 'multiply':
                const multiply_result = operand1 * operand2;
                const multiply_embed = new MessageEmbed()
                    .setColor('GREEN')
                    .setTitle("Multiplication")
                    .setURL(`https://mathsolver.microsoft.com/en/solve-problem/${operand1}%2A${operand2}`)
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                    .setDescription(`${operand1} * ${operand2} = **${multiply_result}**`)
                    .setFooter({text: "This command is still under development. More features will be added in the future."});

                interaction.editReply({embeds: [multiply_embed]});
                break;
            case 'divide':
                const divide_result = operand1 / operand2;
                const divide_embed = new MessageEmbed()
                    .setColor('GREEN')
                    .setTitle("Division")
                    .setURL(`https://mathsolver.microsoft.com/en/solve-problem/${operand1}%2F${operand2}`)
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                    .setDescription(`${operand1} / ${operand2} = **${divide_result}**`)
                    .setFooter({text: "This command is still under development. More features will be added in the future."});

                interaction.editReply({embeds: [divide_embed]});
                break;
            case 'modulus':
                const modulus_result = operand1 % operand2;
                const modulus_embed = new MessageEmbed()
                    .setColor('GREEN')
                    .setTitle("Modulus")
                    .setURL(`https://mathsolver.microsoft.com/en/solve-problem/${operand1}mod${operand2}`)
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                    .setDescription(`${operand1} % ${operand2} = **${modulus_result}**`)
                    .setFooter({text: "This command is still under development. More features will be added in the future."});

                interaction.editReply({embeds: [modulus_embed]});
                break;
            case 'exponent':
                const exponent_result = Math.pow(operand1, operand2);
                const exponent_embed = new MessageEmbed()
                    .setColor('GREEN')
                    .setTitle("Exponent")
                    .setURL(`https://mathsolver.microsoft.com/en/solve-problem/${operand1}%5E${operand2}`)
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                    .setDescription(`${operand1} ^ ${operand2} = **${exponent_result}**`)
                    .setFooter({text: "This command is still under development. More features will be added in the future."});

                interaction.editReply({embeds: [exponent_embed]});
                break;
            case 'increment':
                const increment_result = operand1 + 1;
                const increment_embed = new MessageEmbed()
                    .setColor('GREEN')
                    .setTitle("Increment")
                    .setURL(`https://mathsolver.microsoft.com/en/solve-problem/${operand1}%2B1`)
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                    .setDescription(`${operand1} + 1 = **${increment_result}**`)
                    .setFooter({text: "This command is still under development. More features will be added in the future."});

                interaction.editReply({embeds: [increment_embed]});
                break;
            case 'decrement':
                const decrement_result = operand1 - 1;
                const decrement_embed = new MessageEmbed()
                    .setColor('GREEN')
                    .setTitle("Decrement")
                    .setURL(`https://mathsolver.microsoft.com/en/solve-problem/${operand1}%2D1`)
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                    .setDescription(`${operand1} - 1 = **${decrement_result}**`)
                    .setFooter({text: "This command is still under development. More features will be added in the future."});

                interaction.editReply({embeds: [decrement_embed]});
                break;
        }
    }
};

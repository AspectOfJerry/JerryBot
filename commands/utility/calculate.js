const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('calculate')
        .setDescription("Perform one of the arithmetic operations in JavaScript.")

        .addIntegerOption((options) =>
            options
                .setName('operand1')
                .setDescription("The first operand.")
                .setRequired(true))
        .addStringOption((options) =>
            options
                .setName('operation')
                .setDescription('The operation.')
                .setRequired(true)
                .addChoice("Addition", 'add')
                .addChoice("Subtraction", 'subtract')
                .addChoice("Multiplication", 'multiply')
                .addChoice("Division", 'divide')
                .addChoice("Modulus", 'modulus')
                .addChoice("Exponent", 'exponent'))
        .addIntegerOption((options) =>
            options
                .setName('operand2')
                .setDescription("The second operand.")
                .setRequired(true))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("Whether you want the bot's messages to only be visible to yourself.")
                .setRequired(false)),
    async execute(client, interaction) {
        //Command information
        const REQUIRED_ROLE = "everyone";

        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral');

        const operand1 = interaction.options.getInteger('operand1');
        const operation = interaction.options.getString('operation');
        const operand2 = interaction.options.getInteger('operand2');

        //Checks

        //Code
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

                interaction.reply({embeds: [add_embed], ephemeral: is_ephemeral});
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

                interaction.reply({embeds: [subtract_embed], ephemeral: is_ephemeral});
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

                interaction.reply({embeds: [multiply_embed], ephemeral: is_ephemeral});
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

                interaction.reply({embeds: [divide_embed], ephemeral: is_ephemeral});
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

                interaction.reply({embeds: [modulus_embed], ephemeral: is_ephemeral});
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

                interaction.reply({embeds: [exponent_embed], ephemeral: is_ephemeral});
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

                interaction.reply({embeds: [increment_embed], ephemeral: is_ephemeral});
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

                interaction.reply({embeds: [decrement_embed], ephemeral: is_ephemeral});
                break;
        }
    }
}

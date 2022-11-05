const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent} = require('discord.js');

const Sleep = require('../modules/sleep'); // delayInMilliseconds
const Log = require('../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction) {
        await Log('append', 'interactionCreate', `An interaction was created.`, 'DEBUG'); // Logs
        if(!interaction.isCommand()) {  // Only managing application commands in this file
            return;
        }

        const command = interaction.client.commands.get(interaction.commandName);

        if(!command) {
            return;
        }

        try {
            await command.execute(interaction.client, interaction);
        } catch(err) {
            if(err) {
                console.error(err);
                const _error = ":\n```\n" + err + "\n```" || ". ```No further information is available.```";
                const execute_error = new MessageEmbed()
                    .setColor('#bb20ff')
                    .setTitle('Error')
                    .setDescription(`An error occured while executing the command${_error}`)
                    .setFooter({text: `${interaction.createdAt}`});
                try {
                    await interaction.reply({embeds: [execute_error]});
                } catch {
                    try {
                        await interaction.followUp({embeds: [execute_error]});
                    } catch {
                        try {
                            await interaction.channel.send({embeds: [execute_error]});
                        } catch {
                            console.log("All three attempts to send an error message to a text channel failed.");
                            await Log('append', 'interactionCreate', "All three attempts to send an error message to a text channel failed.", 'ERROR'); // Logs
                        }
                    }
                }
            }
        }
    }
};

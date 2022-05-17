const {Client, Intents, Collection, MessageEmbed} = require('discord.js');

const Sleep = require('../modules/sleep');
const Log = require('../modules/logger');

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction) {
        if(!interaction.isCommand()) {
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
                const execute_error = new MessageEmbed()
                    .setColor('#bb20ff')
                    .setTitle('Error')
                    .setDescription("An error occured while executing the command. No further information is available.")
                    .setTimestamp();

                try {
                    await interaction.channel.send({embeds: [execute_error], ephemeral: false});
                } catch {
                    try {
                        await interaction.followUp({embeds: [execute_error], ephemeral: false});
                        return;
                    } catch {
                        try {
                            await interaction.reply({embeds: [execute_error], ephemeral: false});
                            return;
                        } catch {
                            console.log(err)
                            return;
                        }
                    }
                }
            }
        }
    }
}
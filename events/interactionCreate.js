const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");

const {Log, Sleep} = require("../modules/JerryUtils.js");


module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction) {
        // await Log("append", 'interactionCreate', `An interaction was created.`, "DEBUG");
        if(!interaction.isCommand()) {
            return;
        }

        const command = interaction.client.commands.get(interaction.commandName);

        if(!command) {
            return;
        }

        try {
            Log("append", interaction.guild.id, `'@${interaction.user.tag}' executed '/${interaction.commandName}${interaction.options.getSubcommand(false) ? " " + interaction.options.getSubcommand(false) : ""}'.`, "INFO");
            await command.execute(interaction.client, interaction);
        } catch(err) {
            if(err) {
                console.error(err);
                const _err = ":\n```\n" + err + "\n```" || ". ```No further information is available.```";
                const execution_error = new MessageEmbed()
                    .setColor("FUCHSIA")
                    .setTitle('Error')
                    .setDescription(`An error occured while executing the command${_err}`)
                    .setFooter({text: `${interaction.createdAt}`});
                try {
                    interaction.reply({content: "<@611633988515266562>", embeds: [execution_error]});
                } catch {
                    try {
                        interaction.followUp({embeds: [execution_error]});
                    } catch {
                        try {
                            interaction.channel.send({embeds: [execution_error]});
                        } catch {
                            console.log("Failure to send error message (3 attempts).");
                            Log("append", "interactionCreate", "Failure to send error message (3 attempts).", "ERROR");
                        }
                    }
                }
            }
        }
    }
};

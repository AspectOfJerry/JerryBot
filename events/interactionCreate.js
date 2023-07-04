const {MessageActionRow, MessageButton, MessageEmbed} = require("discord.js");
const {logger, sleep} = require("../modules/jerryUtils.js");


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
            logger.append("info", "0x494352", `[ICR] "${interaction.guild.name}" > '@${interaction.user.tag}' executed '/${interaction.commandName}${interaction.options.getSubcommand(false) ? " " + interaction.options.getSubcommand(false) : ""}' in "${interaction.guild.id}".`);
            await command.execute(interaction.client, interaction);
        } catch(err) {
            if(err) {
                console.error(err);
                const _err = ":\n```\n" + err + "\n```" || ". ```No further information is available.```";
                const command_exec_failure_exception = new MessageEmbed()
                    .setColor("FUCHSIA")
                    .setTitle("CommandExecFailureException")
                    .setDescription(`An error occured while executing the command${_err}`)
                    .setFooter({text: `${interaction.createdAt}`});

                const super_users = "";

                const notify = new MessageEmbed()
                    .setColor("FUCHSIA")
                    .setTitle(":warning: CommandExecFailureException")
                    .setDescription(`An error occured while executing the command${_err}`)
                    .addFields(
                        {name: "User", value: `<@${interaction.user.id}>`, inline: true},
                        {name: "Command", value: `</${interaction.commandName}${interaction.options.getSubcommand(false) ? " " + interaction.options.getSubcommand(false) : ""}:${interaction.commandId}>`, inline: true},
                        {name: "Location", value: `<#${interaction.channel.id}>`, inline: false},
                    );

                for(const user of super_users) {
                    try {
                        interaction.client.users.resolve(user).send(user, {embeds: [notify]});
                    } catch(err) {
                        console.error(err);
                    }
                }

                try {
                    interaction.reply({content: "<@611633988515266562>,", embeds: [command_exec_failure_exception]});
                } catch {
                    try {
                        interaction.followUp({embeds: [command_exec_failure_exception]});
                    } catch {
                        try {
                            interaction.channel.send({embeds: [command_exec_failure_exception]});
                        } catch {
                            console.log("Failed to raise the exception (3 attempts).");
                            logger.append("error", "0x494352", "Failed to raise the exception (3 attempts).");
                        }
                    }
                }
            }
        }
    }
};

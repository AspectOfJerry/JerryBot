//Code to self-destruct the command
await interaction.reply(`This command was programmed to self-destruct.`);
await interaction.guild.commands.delete(interaction.commandId);
await interaction.channel.send(`Successfully deleted this command from the guild.`);
throw "Command self-destruction";
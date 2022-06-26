// Code to self-destruct the command
await interaction.reply(`Self-destructing this command...`);
await interaction.guild.commands.delete(interaction.commandId);
await interaction.channel.send(`Successfully deleted this command from the guild.`);
throw "Command self-destruction";

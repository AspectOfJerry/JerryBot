const {SlashCommandBuilder} = require("@discordjs/builders");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription("[DEPRECATED] Please use the '/timeout' command instead. Mutes a member."),
    async execute(client, interaction) {
        await interaction.reply("This command deprecated and will be removed in the next major release. Please use `/timeout` instead.");
        await interaction.channel.send("This command is disabled.");
    }
};

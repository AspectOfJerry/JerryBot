const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription("[DEPRECATED] Please use the '/profile' command instead. Sends a user's avatar.")
        .addUserOption((options) =>
            options
                .setName('user')
                .setDescription("[OPTIONAL] The user's avatar to send. Defaults to yourself.")
                .setRequired(false)),
    async execute(client, interaction) {
        await interaction.reply("This command is deprecated and will be removed in the next major release. Please use `/profile` instead.");
        await interaction.channel.send("This command is disabled.");
    }
};

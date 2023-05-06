const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");

const {log, permissionCheck, sleep} = require("../../modules/JerryUtils.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("Shows information about a user.")
        .addUserOption((options) =>
            options
                .setName("user")
                .setDescription("[OPTIONAL] The user to search for. Defaults to yourself.")
                .setRequired(false)),
    async execute(client, interaction) {
        if(await permissionCheck(interaction, 0) === false) {
            return;
        }

        // Declaring variables
        const target = interaction.options.getUser("user") || interaction.user;
        const memberTarget = interaction.guild.members.cache.get(target.id);
        await log("append", interaction.guild.id, `├─memberTarget: '@${memberTarget.user.tag}'`, "INFO");

        // Checks

        // Main
        interaction.reply({content: "This command is currently unavailable."});
        // User creation,
        // avatar,
        // guild nick,
        // guild avatar,
        // guild join,
    }
};

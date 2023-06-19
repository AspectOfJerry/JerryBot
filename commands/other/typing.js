const {MessageActionRow, MessageButton, MessageEmbed} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");

const {log, permissionCheck, sleep} = require("../../modules/JerryUtils.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("typing")
        .setDescription("Sends the typing indicator."),
    async execute(client, interaction) {
        if(await permissionCheck(interaction, 0) === false) {
            return;
        }

        // Declaring variables

        // Checks

        // Main
        await interaction.reply({content: "Typing...", ephemeral: true});
        log("append", interaction.guild.id, `Typing in <#${interaction.channel.name}>`, "INFO");

        interaction.channel.sendTyping();
    }
};

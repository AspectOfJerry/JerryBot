const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");

const {log, permissionCheck, sleep} = require("../../modules/JerryUtils.js");


module.exports = async function (client, interaction) {
    if(await permissionCheck(interaction, -1) === false) {
        return;
    }

    // Declaring variables


    // Checks

    // Main
    return interaction.reply("This command is under development");
};

const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");

const {PermissionCheck, Log, Sleep} = require("../../modules/JerryUtils.js");


module.exports = async function (client, interaction) {
    await interaction.deferReply();

    if(await PermissionCheck(interaction) === false) {
        return;
    }

    interaction.editReply("This command is disabled");

    // Declaring variables

    // Checks

    // Main

    // Generate the one time use password

    // Approve for execution

    // Arm for execution

    // Execute

    // Logs
};

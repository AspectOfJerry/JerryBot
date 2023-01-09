const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require('discord.js');

const {Log, Sleep} = require('../../../modules/JerryUtils');


module.exports = async function (client, interaction) {
    await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/sudo nuke'.`, 'INFO');
    // interaction.deferReply()


    // Declaring variables

    // Checks

    // Main

    // Generate the one time use password

    // Approve for execution

    // Arm for execution

    // Execute

    // Logs
};

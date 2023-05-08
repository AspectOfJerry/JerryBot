const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");

const {log, permissionCheck, sleep} = require("../../../modules/JerryUtils.js");

const birthdaySchema = require("../../database/schemas/birthdaySchema.js");


module.exports = async function (client, interaction) {
    // interaction.deferReply();
    if(await permissionCheck(interaction, -1) === false) {
        return;
    }

    // Declaring variables

    // Checks

    // Main

};

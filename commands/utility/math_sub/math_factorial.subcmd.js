import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";

const {logger, permissionCheck, sleep} = require("../../../modules/jerryUtils.js");


module.exports = async function (client, interaction) {
    // interaction.deferReply();
    if(await permissionCheck(interaction, 0) === false) {
        return;
    }

    // Declaring variables
    const n = interaction.options.getInteger("number");

    // Checks

    // Main

};

import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";

import {logger, permissionCheck, sleep} from "../../../utils/jerryUtils.js";


module.exports = async function (client, interaction) {
    // interaction.deferReply();
    if(await permissionCheck(interaction, INT) === false) {
        return;
    }

    // Declaring variables

    // Checks

    // Main

};

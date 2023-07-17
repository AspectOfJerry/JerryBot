import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";

import {logger, permissionCheck, sleep} from "../../../modules/jerryUtils.js";


export default async function (client, interaction) {
    // interaction.deferReply();
    if(await permissionCheck(interaction, 0) === false) {
        return;
    }

    // Declaring variables
    const n = interaction.options.getInteger("number");

    // Checks

    // Main

}

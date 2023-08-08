import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";

import {logger, permissionCheck, sleep} from "../../utils/jerryUtils.js";


export default async function (client, interaction) {
    if(await permissionCheck(interaction, -1) === false) {
        return;
    }

    // Declaring variables


    // Checks

    // Main
    return interaction.reply("This command is under development");
}

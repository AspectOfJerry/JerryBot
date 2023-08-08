import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";

import {log, permissionCheck, sleep} from "../../../utils/jerryUtils.js";


export default async function (client, interaction) {
    await interaction.deferReply();
    if(await permissionCheck(interaction, 0) === false) {
        return;
    }

    // Declaring variables

    // Checks

    // Main
    interaction.editReply({content: "This command is currently unavailable. It should be ready in 3 to 5 business days."});
}

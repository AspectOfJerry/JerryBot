import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";

import {logger, permissionCheck, sleep} from "../../../utils/jerryUtils.js";


export default async function (client, interaction) {
    if (await permissionCheck(interaction, 0) === false) {
        return;
    }

    const n = interaction.options.getInteger("number");
}

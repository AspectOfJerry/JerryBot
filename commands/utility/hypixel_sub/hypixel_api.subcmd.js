import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";

const {log, permissionCheck, sleep} = require("../../../modules/jerryUtils.js");


module.exports = async function (client, interaction) {
    // interaction.deferReply();
    if(await permissionCheck(interaction, 0) === false) {
        return;
    }

    // Declaring variables

    // Checks

    // Main
    interaction.reply("This command will be available in 5 buisness days.");
};

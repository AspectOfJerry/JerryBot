import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";

import {log, permissionCheck, sleep} from "../../modules/jerryUtils.js";


module.exports = async function (client, interaction) {
    // interaction.deferReply();
    if(await permissionCheck(interaction, -1) === false) {
        return;
    }

    // Declaring variables
    const status = interaction.options.getString("status");

    // Checks

    // Main
    client.user.setStatus(status);

    const success = new MessageEmbed()
        .setColor("GREEN")
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        .setTitle("PresenceUpdate")
        .setDescription(`Successfully set the bot's status to ${status}!`)
        .setFooter({text: "Use '/sudo presence' to change the bot's full presence."});

    interaction.reply({embeds: [success]});
};

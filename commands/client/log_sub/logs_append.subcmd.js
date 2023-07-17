import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";

import {logger, permissionCheck, sleep} from "../../../modules/jerryUtils.js";


export default async function (client, interaction, string, object) {
    await interaction.deferReply();
    if(await permissionCheck(interaction, 1) === false) {
        return;
    }

    // Declaring variables

    // Checks

    // Main
    const writing_to_logs = new MessageEmbed()
        .setColor("YELLOW")
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
        .setTitle("Writing to logs...")
        .addFields(
            {name: "Body string", value: `${string}`, inline: false},
            {name: "Target directory", value: "../logs/", inline: false});

    const write_to_logs = new MessageEmbed()
        .setColor("GREEN")
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
        .setTitle("Write to logs")
        .addFields(
            {name: "Body string", value: `${(await object).parsedBody}`, inline: false},
            {name: "Target directory", value: `../logs/${(await object).fileName}`, inline: false});

    interaction.reply({embeds: [writing_to_logs]});
    logger.append("notice", "STDOUT", `'/logs append' << ${string}`);
    interaction.editReply({embeds: [write_to_logs]});
}

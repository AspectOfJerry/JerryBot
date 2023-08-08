import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";
import {logger, permissionCheck, sleep, toNormalized} from "../../utils/jerryUtils.js";
import dayjs from "dayjs";

import {updateBirthday} from "../../database/mongodb.js";


export default async function (client, interaction) {
    await interaction.deferReply({ephemeral: true});
    if(await permissionCheck(interaction, -1) === false) {
        return;
    }

    // Declaring variables
    const user = interaction.options.getUser("user");
    logger.append("info", "IN", `'/sudo bday' > user: "@${user.tag}"`);
    const name = toNormalized(interaction.options.getString("name"));
    logger.append("info", "IN", `'/sudo bday' > name: "${name}"`);
    const day = interaction.options.getInteger("day");
    logger.append("info", "IN", `'/sudo bday' > day: "${day}"`);
    const month = interaction.options.getInteger("month");
    logger.append("info", "IN", `'/sudo bday' > month: "${month}"`);
    let notes = interaction.options.getString("notes");
    logger.append("info", "IN", `'/sudo bday' > notes: "${notes}"`);

    // Checks
    if(!dayjs(`${day}-${month}-2000`).isValid()) { // 2000 for placeholder leap year, D-M-YYYY
        const invalid_input_date_exception = new MessageEmbed()
            .setColor("RED")
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle("IllegalArgumentException")
            .setDescription(`Invalid date: \`${day}-${month}\`.`);

        interaction.editReply({embeds: [invalid_input_date_exception], ephemeral: true});
        logger.append("append", "Validation", "[IllegalArgumentException] Invalid date", "WARN");
        return;
    }

    if(notes !== void (0) && notes !== null) {
        notes = notes.split(",").map((s) => s.trim());
    }

    // Main
    await updateBirthday(user, name, day, month, notes);

    const updated = new MessageEmbed()
        .setColor("GREEN")
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        .setTitle("Birthday update")
        .setDescription(`Successfully updated ${name}'s (<@${user.id}>) birthday to ${day}-${month}!`);

    interaction.editReply({embeds: [updated], ephemeral: true});
    logger.append("append", interaction.guild.id, `└─Successfully updated ${name}'s (<@${user.tag}>) birthday to ${day}-${month}!`, "INFO");
}

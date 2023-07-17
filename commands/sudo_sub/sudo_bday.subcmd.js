import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";
import {log, permissionCheck, sleep, toNormalized} from "../../modules/jerryUtils.js";
import date from "date-and-time";

import {updateBirthday} from "../../database/mongodb.js";


export default async function (client, interaction) {
    await interaction.deferReply({ephemeral: true});
    if(await permissionCheck(interaction, -1) === false) {
        return;
    }

    // Declaring variables
    const user = interaction.options.getUser("user");
    log("append", interaction.guild.id, `├─user: "@${user.tag}"`, "INFO");
    const name = toNormalized(interaction.options.getString("name"));
    log("append", interaction.guild.id, `├─name: "${name}"`, "INFO");
    const day = interaction.options.getInteger("day");
    log("append", interaction.guild.id, `├─day: "${day}"`, "INFO");
    const month = interaction.options.getInteger("month");
    log("append", interaction.guild.id, `├─month: "${month}"`, "INFO");
    let notes = interaction.options.getString("notes");
    log("append", interaction.guild.id, `├─notes: "${notes}"`, "INFO");

    // Checks
    if(!date.isValid(`${day}-${month}-2000`, "D-M-YYYY")) { // 2000 for placeholder leap year
        const invalid_input_date_exception = new MessageEmbed()
            .setColor("RED")
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle("IllegalDateException")
            .setDescription("Invalid date.");

        interaction.editReply({embeds: [invalid_input_date_exception], ephemeral: true});
        log("append", interaction.guild.id, "└─Invalid date", "WARN");
        return;
    }

    if(notes !== void (0) && notes !== null) {
        notes = notes.split(",").map(s => s.trim());
    }

    // Main
    await updateBirthday(user, name, day, month, notes);
    const updated = new MessageEmbed()
        .setColor("GREEN")
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        .setTitle("Birthday update")
        .setDescription(`Successfully updated ${name}'s (<@${user.id}>) birthday to ${day}-${month}!`);

    interaction.editReply({embeds: [updated], ephemeral: true});
    log("append", interaction.guild.id, `└─Successfully updated ${name}'s (<@${user.tag}>) birthday to ${day}-${month}!`, "INFO");
}

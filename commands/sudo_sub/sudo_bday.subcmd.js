const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {log, permissionCheck, sleep, toNormalized} = require("../../modules/JerryUtils.js");

const date = require("date-and-time");
const {updateBirthday} = require("../../database/mongodb.js");


module.exports = async function (client, interaction) {
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
        const invalid_date = new MessageEmbed()
            .setColor("RED")
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle("Error")
            .setDescription("Invalid date.");

        interaction.editReply({embeds: [invalid_date], ephemeral: true});
        log("append", interaction.guild.id, "└─Invalid date", "WARN");
        return;
    }

    if(notes !== void (0)) {
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
};

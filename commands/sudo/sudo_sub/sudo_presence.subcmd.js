const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");

const {PermissionCheck, Log, Sleep} = require("../../../modules/JerryUtils.js");


module.exports = async function (client, interaction) {
    // interaction.deferReply();
    if(await PermissionCheck(interaction) === false) {
        return;
    }

    // Declaring variables
    const type = interaction.options.getString("type");
    const text = interaction.options.getString("text");
    const status = interaction.options.getString("status");
    const url = interaction.options.getString("url");

    // Checks

    // Main
    client.user.setPresence({activities: [{name: text, type: type, url: url}], status: status});

    let urlText = "None";
    if(url) {
        urlText = `[${url}](${url})`;
    }

    const success = new MessageEmbed()
        .setColor('GREEN')
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        .setTitle("PresenceUpdate")
        .addFields(
            {name: "Status", value: `${status}`, inline: true},
            {name: "Activity type", value: `${type}`, inline: true},
            {name: "Activity name", value: `${text}`, inline: false},
            {name: "?Url", value: `${urlText}`, inline: false}
        )
        .setFooter({text: "Use '/sudo presence_clear' to remove the presence."});

    interaction.reply({embeds: [success]});
};

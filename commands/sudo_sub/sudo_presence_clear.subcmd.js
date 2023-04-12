const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");

const {PermissionCheck, Log, Sleep} = require("../../modules/JerryUtils.js");


module.exports = async function (client, interaction) {
    // interaction.deferReply();
    if(await PermissionCheck(interaction) === false) {
        return;
    }

    // Declaring variables

    // Checks

    // Main
    client.user.setPresence({activities: null});

    const success = new MessageEmbed()
        .setColor("GREEN")
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
        .setDescription(`Successfully reset the bot's presence.`);

    interaction.reply({embeds: [success]});
};

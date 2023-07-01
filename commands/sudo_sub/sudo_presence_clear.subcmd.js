const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");

const {log, permissionCheck, sleep} = require("../../modules/jerryUtils.js");


module.exports = async function (client, interaction) {
    // interaction.deferReply();
    if(await permissionCheck(interaction, -1) === false) {
        return;
    }

    // Declaring variables

    // Checks

    // Main
    client.user.setPresence({activities: null});

    const success = new MessageEmbed()
        .setColor("GREEN")
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
        .setDescription("Successfully reset the bot's presence.");

    interaction.reply({embeds: [success]});
};

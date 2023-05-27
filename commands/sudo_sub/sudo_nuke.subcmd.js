const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");

const {log, permissionCheck, sleep, toNormalized} = require("../../modules/JerryUtils.js");

const crypto = require("crypto");


module.exports = async function (client, interaction) {
    // await interaction.deferReply();

    if(await permissionCheck(interaction, -1) === false) {
        return;
    }

    // Generate the one time use password
    const pal_code = "0x" + crypto.randomBytes(4).toString("hex").toUpperCase();

    // Generate the second-in-command superuser
    const sic = "";

    // Declaring variables
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId("arm_button")
                .setLabel("Arm")
                .setEmoji("🔓")
                .setStyle("SUCCESS")
                .setDisabled(false),
            new MessageButton()
                .setCustomId("execute_button")
                .setLabel("Execute")
                .setEmoji("🎯")
                .setStyle("DANGER")
                .setDisabled(true),
            new MessageButton()
                .setCustomId("abort_button")
                .setLabel("Abort")
                .setEmoji("🛑")
                .setStyle("SECONDARY")
        );

    const embed = new MessageEmbed()
        .setColor("FUCHSIA")
        .setTitle(":warning: Discord guild nuking request")
        .setAuthor({name: `${interaction.author.username}`, iconURL: `${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`})
        .setDescription(":test_tube: This is a test. This is only a test.")
        .addFields(
            {
                name: "Time", value: `${new Date()}`, inline: false
            },
            {
                name: ":key: Code", value: `Your Permissive Action Link (PAL) code is: \`${pal_code}\`.\nPlease send it to the bot in Direct Message within 30 seconds in order to confirm your choice.`
            },
            {
                name: "Dual-key holder", value: `A separate code has been sent to the second-in-command (2IC): ${sic}.\nThey have 2 minutes to confirm their choice.`
            }
        );

    // Checks

    // Main
    interaction.reply({embeds: [embed], components: [row]});

    // Approve for execution

    // Arm for execution

    // Execute

    // Logs
};

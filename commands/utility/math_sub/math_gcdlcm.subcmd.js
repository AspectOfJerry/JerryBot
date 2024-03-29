import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";

import {logger, permissionCheck, sleep, jMath} from "../../../utils/jerryUtils.js";


export default async function (client, interaction) {
    await interaction.deferReply();

    if (await permissionCheck(interaction, 0) === false) {
        return;
    }

    const n1 = Math.abs(interaction.options.getInteger("n1"));
    const n2 = Math.abs(interaction.options.getInteger("n2"));

    const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setStyle("LINK")
        .setLabel("GCD")
        .setEmoji("📚") // books
        .setURL("https://en.wikipedia.org/wiki/Greatest_common_divisor"),
        new MessageButton()
        .setStyle("LINK")
        .setLabel("LCM")
        .setEmoji("📚") // books
        .setURL("https://en.wikipedia.org/wiki/Least_common_multiple")
    );

    const gcd = jMath.findGCD(n1, n2);
    const lcm = jMath.findLCM(n1, n2);

    const gcdlcm = new MessageEmbed()
    .setColor("GREEN")
    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
    .setTitle("Math gcdlcm")
    .setDescription("Here's the Greatest Common Divisor and the Least Common Multiple of:")
    .addFields(
        {name: "Numbers", value: `${n1} and ${n2}`, inline: true},
        {name: "GCD (Euclidean algorithm)", value: `${gcd}`, inline: true},
        {name: "LCM (using GCD)", value: `${lcm}`, inline: true}
    );

    interaction.editReply({embeds: [gcdlcm], components: [row]});
}

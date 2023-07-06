const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");

const {logger, permissionCheck, sleep, jMath} = require("../../../modules/jerryUtils.js");


module.exports = async function (client, interaction) {
    interaction.deferReply();

    if(await permissionCheck(interaction, 0) === false) {
        return;
    }

    // Declaring variables
    const n1 = Math.abs(interaction.options.getInteger("n1"));
    const n2 = Math.abs(interaction.options.getInteger("n2"));

    // Checks

    // Main
    const gcd = jMath.findGCD(n1, n2);
    const lcm = jMath.findLCM(n1, n2);

    const gcdlcm = new MessageEmbed()
        .setColor("GREEN")
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        .setTitle("Math gcdlm")
        .setDescription(`Here's the greatest common divisor and the least common multiple of:\n**>**${n1} and ${n2}`)
        .addFields(
            {name: "GCD (Euclidean algorithm)", value: `**>** ${gcd}`, inline: true},
            {name: "GCD (using LCM)", value: `**>** ${lcm}`, inline: true}
        ).setImage("https://jerrydev.net/static/fcf6a2d3cac72c57de79a5a00039ac6c.png");

    interaction.editReply({embeds: [gcdlcm]});
};

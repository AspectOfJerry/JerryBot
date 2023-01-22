const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");

const {PermissionCheck, Log, Sleep} = require("../../modules/JerryUtils");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription("Help is on the way!"),
    async execute(client, interaction) {
        if(await PermissionCheck(interaction) === false) {
            return;
        }

        // Declaring variables

        // Checks

        // Main
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('Documentation')
                    .setEmoji('📘')
                    .setStyle("LINK")
                    .setURL('https://bot.aspectofjerry.dev')
            );

        const help = new MessageEmbed()
            .setColor("GREEN")
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle("Need help?")
            .setDescription(":bookmark: You can find the documentation [here](https://bot.aspectofjerry.dev) or [here](https://www.youtube.com/watch?v=xvFZjo5PgG0)!");

        interaction.reply({embeds: [help], components: [row]});
    }
};

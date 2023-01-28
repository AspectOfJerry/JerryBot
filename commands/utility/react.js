const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");

const {PermissionCheck, Log, Sleep} = require("../../modules/JerryUtils");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("react")
        .setDescription("Reacts to a message")
        .addIntegerOption((options) =>
            options
                .setName("message")
                .setDescription("[REQUIRED] The message Snowflake ID.")
                .setRequired(true))
        .addStringOption((options) =>
            options
                .setName("emoji")
                .setDescription("[REQUIRED] An EmojiIdentifierResolvable (EmojiResolvable, Unicode emoji)")),
    async execute(client, interaction) {
        // interaction.deferReply()
        if(await PermissionCheck(interaction) === false) {
            return;
        }

        // Declaring variables
        const snowflake = interaction.options.getInteger("message");

        // Checks

        // Main
        interaction.channel.messages.react(snowflake, emoji)
            .then(async (msg) => {
                const reacted = new MessageEmbed()
                    .setColor('GREEN')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription(`Successfully reacted () to [this message](${msg.url}).`);

                interaction.reply({embeds: [reacted]});
            });
    }
};

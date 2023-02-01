const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");

const {PermissionCheck, Log, Sleep} = require("../../modules/JerryUtils");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("react")
        .setDescription("Reacts to a message")
        .addStringOption((options) =>
            options
                .setName("message")
                .setDescription("[REQUIRED] The message Snowflake ID.")
                .setRequired(true))
        .addStringOption((options) =>
            options
                .setName("emoji")
                .setDescription("[REQUIRED] An EmojiIdentifierResolvable (EmojiResolvable, Unicode emoji)")
                .setRequired(true)),
    async execute(client, interaction) {
        // interaction.deferReply()
        if(await PermissionCheck(interaction) === false) {
            return;
        }

        // PreMain
        // Declaring variables

        const snowflake = interaction.options.getString("message");
        const message = await interaction.channel.messages.resolve(snowflake);
        console.log(message)

        if(!message) {
            const invalid_snowflake = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setTitle("Error")
                .setDescription(`Unable to reference the ${message} Snowflake to a message in <#${interaction.channel.id}>.`);

            interaction.reply({embeds: [invalid_snowflake], ephemeral: true});
            return;
        }
        const emoji = client.emojis.resolve(await interaction.options.getString("emoji"));

        // Checks

        if(!emoji) {
            const invalid_emoji = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setTitle("Error")
                .setDescription(`The ${emoji} emoji is non-existant or inaccessible by the bot.`);

            interaction.reply({embeds: [invalid_emoji], ephemeral: true});
            return;
        }

        // Main
        interaction.channel.messages.react(message, emoji)
            .then(async (msg) => {
                const reacted = new MessageEmbed()
                    .setColor('GREEN')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription(`Successfully reacted () to [this message](${msg.url}).`);

                interaction.reply({embeds: [reacted]});
            });
    }
};

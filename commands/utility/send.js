const {MessageEmbed} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");

const {log, permissionCheck, sleep} = require("../../modules/jerryUtils.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("send")
        .setDescription("Sends a message in a text channel")
        .addStringOption((options) =>
            options
                .setName("message")
                .setDescription("[REQUIRED] The message to send.")
                .setRequired(true))
        .addChannelOption((options) =>
            options
                .setName("channel")
                .setDescription("[OPTIONAL] The channel to send the message to. Defaults to the current channel.")
                .setRequired(false))
        .addBooleanOption((options) =>
            options
                .setName("typing")
                .setDescription("[OPTIONAL] Whether you want the bot to type before sending the message (dynamic typing speed).")
                .setRequired(false)),
    async execute(client, interaction) {
        if(await permissionCheck(interaction, 0) === false) {
            return;
        }

        // Declaring variables
        const channel = interaction.options.getChannel("channel") ?? interaction.channel;
        await log("append", interaction.guild.id, `├─channel: "#${channel.name}"`, "INFO");
        const message = interaction.options.getString("message");
        await log("append", interaction.guild.id, `├─message: "${message}"`, "INFO");
        const send_typing = interaction.options.getBoolean("typing") ?? true;
        await log("append", interaction.guild.id, `├─send_typing: ${send_typing}`, "INFO");

        const message_lenght = message.length;
        const duration_in_ms = Math.round((message_lenght / 15) * 1000 + 200);

        // Checks
        if(!channel.isText()) {
            const invalid_input_channel_type_exception = new MessageEmbed()
                .setColor("RED")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("InvalidInputChannelTypeException")
                .setDescription("You need to mention a text-based channel.");

            interaction.reply({embeds: [invalid_input_channel_type_exception]});
            return;
        }

        // Main
        switch(send_typing) {
        case true:
            await interaction.reply({content: `Sending "${message}" to #${channel} with ${duration_in_ms} ms of typing...`, ephemeral: true});

            channel.sendTyping();
            await sleep(duration_in_ms);

            channel.send({content: `${message}`});
            break;
        default:
            await interaction.reply({content: `Sending "${message}" to #${channel} without typing...`, ephemeral: true});

            channel.send({content: `${message}`});
            break;
        }
    }
};

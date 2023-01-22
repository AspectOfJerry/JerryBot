const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");

const {PermissionCheck, Log, Sleep} = require("../../modules/JerryUtils");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('send')
        .setDescription("Sends a message in a text channel")
        .addStringOption((options) =>
            options
                .setName('message')
                .setDescription("[REQUIRED] The message to send.")
                .setRequired(true))
        .addChannelOption((options) =>
            options
                .setName('channel')
                .setDescription("[OPTIONAL] The channel to send the message to. Defaults to the current channel.")
                .setRequired(false))
        .addBooleanOption((options) =>
            options
                .setName('typing')
                .setDescription("[OPTIONAL] Whether you want the bot to type before sending the message (dynamic typing speed).")
                .setRequired(false)),
    async execute(client, interaction) {
        // Set minimum execution role
        switch(interaction.guild.id) {
            case process.env.DISCORD_JERRY_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = null;
                break;
            case process.env.DISCORD_GOLDFISH_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = null;
                break;
            case process.env.DISCORD_CRA_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = null;
                break;
            case process.env.DISCORD_311_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = null;
                break;
            default:
                await Log('append', interaction.guild.id, "└─Throwing because of bad permission configuration.", 'ERROR');
                throw `Error: Bad permission configuration.`;
        }

        // Declaring variables
        const channel = interaction.options.getChannel('channel') || interaction.channel;
        await Log('append', interaction.guild.id, `├─channel: '#${channel.name}'`, 'INFO');
        const message = interaction.options.getString('message') || true;
        await Log('append', interaction.guild.id, `├─message: "${message}"`, 'INFO');
        const send_typing = interaction.options.getBoolean('typing') || false;
        await Log('append', interaction.guild.id, `├─send_typing: ${send_typing}`, 'INFO');

        // Checks
        // -----BEGIN ROLE CHECK-----
        if(MINIMUM_EXECUTION_ROLE !== null) {
            if(!interaction.member.roles.cache.find(role => role.name === MINIMUM_EXECUTION_ROLE)) {
                const error_permissions = new MessageEmbed()
                    .setColor('RED')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                    .setTitle('PermissionError')
                    .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the bot administrators if you believe that this is an error.")
                    .setFooter({text: `Use '/help' to access the documentation on command permissions.`});

                await interaction.reply({embeds: [error_permissions]});
                await Log('append', interaction.guild.id, `└─'@${interaction.user.tag}' did not have the required role to execute '/${interaction.commandName}${interaction.options.getSubcommand(false) ? " " + interaction.options.getSubcommand(false) : ""}'. [PermissionError]`, 'WARN');
                return;
            }
        } // -----END ROLE CHECK-----
        if(!channel.isText()) {
            const error_require_text_based_channel = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("Error")
                .setDescription("You need to mention a text-based channel.");

            interaction.reply({embeds: [error_require_text_based_channel]});
            return;
        }

        // Main
        switch(send_typing) {
            case true:
                const message_lenght = message.lenght;
                const duration_in_ms = Math.round(message_lenght / 14 * 1000);

                await interaction.reply({content: `Sending "${message}" to #${channel} with ${duration_in_ms}ms of typing...`, ephemeral: true});

                await channel.sendTyping();
                await Sleep(duration_in_ms);

                await channel.send({content: `${message}`, ephe});
                break;
            case false:
                await interaction.reply({content: `Sending "${message}" to #${channel} without typing...`, ephemeral: true});

                await channel.send({content: `${message}`});
                break;
        }
    }
};

const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const {Log, Sleep} = require('../../modules/JerryUtils');


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
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/send'.`, 'INFO'); // Logs
        // await interaction.deferReply();

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
                await Log('append', interaction.guild.id, "└─Throwing because of bad permission configuration.", 'ERROR'); // Logs
                throw `Error: Bad permission configuration.`;
        }

        // Declaring variables
        const channel = interaction.options.getChannel('channel') || interaction.channel;
        await Log('append', interaction.guild.id, `├─channel: '#${channel.name}'`, 'INFO'); // Logs
        const message = interaction.options.getString('message') || true;
        await Log('append', interaction.guild.id, `├─message: "${message}"`, 'INFO'); // Logs
        const send_typing = interaction.options.getBoolean('typing') || false;
        await Log('append', interaction.guild.id, `├─send_typing: ${send_typing}`, 'INFO'); // Logs

        // Checks
        // -----BEGIN ROLE CHECK-----
        if(MINIMUM_EXECUTION_ROLE !== null) {
            if(!interaction.member.roles.cache.find(role => role.name === MINIMUM_EXECUTION_ROLE)) {
                const error_permissions = new MessageEmbed()
                    .setColor('RED')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                    .setTitle('PermissionError')
                    .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                    .setFooter({text: `You need at least the '${MINIMUM_EXECUTION_ROLE}' role to use this command.`});

                await interaction.reply({embeds: [error_permissions]});
                await Log('append', interaction.guild.id, `└─'${interaction.user.id}' did not have the required role to perform '/send'. [error_permissions]`, 'WARN'); // Logs
                return 10;
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

const fs = require('fs');
const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const Sleep = require('../../modules/sleep'); //delayInMilliseconds;
const Log = require('../../modules/logger'); //DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('message')
        .setDescription("Sends a private message to a guild member.")
        .addUserOption((options) =>
            options
                .setName('user')
                .setDescription("[REQUIRED] The user to send the message to.")
                .setRequired(true))
        .addStringOption((options) =>
            options
                .setName('message')
                .setDescription("[REQUIRED] The message to send.")
                .setRequired(true))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                .setRequired(false)),
    async execute(client, interaction) {
        //Permission check
        await Log(interaction.guild.id, `'${interaction.user.tag}' executed '/message'.`, 'INFO'); //Logs
        let MINIMUM_EXECUTION_ROLE = undefined;
        switch(interaction.guild.id) {
            case process.env.DISCORD_JERRY_GUILD_ID:
                MINIMUM_EXECUTION_ROLE = "PL0";
                break;
            case process.env.DISCORD_GOLDFISH_GUILD_ID:
                MINIMUM_EXECUTION_ROLE = "Admin";
                break;
            case process.env.DISCORD_CRA_GUILD_ID:
                MINIMUM_EXECUTION_ROLE = "PL2";
                break;
            default:
                throw `Error: Bad permission configuration.`;
        }

        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
        await Log(interaction.guild.id, `├─ephemeral: ${is_ephemeral}`, 'INFO'); //Logs
        const target = interaction.options.getUser('user');
        const memberTarget = interaction.guild.members.cache.get(target.id);
        await Log(interaction.guild.id, `├─memberTarget: '${memberTarget.user.tag}'`, 'INFO');

        const message = interaction.options.getString('message');

        let DMChannel;

        //Checks
        if(!interaction.member.roles.cache.find(role => role.name == MINIMUM_EXECUTION_ROLE)) {
            const error_permissions = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                .setFooter({text: `You need at least the '${MINIMUM_EXECUTION_ROLE}' role to use this command.`});

            await interaction.reply({embeds: [error_permissions], ephemeral: is_ephemeral});
            return;
        }
        if(memberTarget.user.bot) {
            const error_cannot_message_bot = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setTitle('Error')
                .setDescription("You cannot message a bot.");

            interaction.reply({embeds: [error_cannot_message_bot], ephemeral: is_ephemeral});
            return;
        }

        //Code
        const messaging_user = new MessageEmbed()
            .setColor('YELLOW')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription(`Sending "${message}" to <@${memberTarget.id}>...`)

        await interaction.reply({embeds: [messaging_user], ephemeral: is_ephemeral});

        memberTarget.send({content: `${message}`})
            .then(async messageResult => {
                DMChannel = await messageResult.channel;
                const message_sent = new MessageEmbed()
                    .setColor('GREEN')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                    .setTitle("Message sent!")
                    .setDescription(`This command creates a message collector in the DM channel. That is to say, you will be able to see what <@${memberTarget.id}> sends to the bot.\n` +
                        "You will also be able to chat with this person. Just send a message in this channel it they will receive it!")
                    .addField('Important', "Send '**msg.stop**' in this channel to stop the collector.")

                await interaction.followUp({embeds: [message_sent], ephemeral: is_ephemeral});

                const filter = m => m.author.id == interaction.member.id;

                const receive_collector = DMChannel.createMessageCollector({idle: 300000});
                const send_collector = interaction.channel.createMessageCollector({filter, idle: 300000});

                receive_collector.on('collect', msg => {
                    if(msg.author.id != client.user.id) {
                        const message_embed = new MessageEmbed()
                            .setColor('BLURPLE')
                            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                            .setAuthor({name: `${msg.author.tag}`, iconURL: `${msg.author.displayAvatarURL({dynamic: true})}`})
                            .setDescription(`*Receive:* ${msg.content}`)

                        interaction.followUp({embeds: [message_embed], ephemeral: is_ephemeral});
                    }
                })

                send_collector.on('collect', msg => {
                    if(msg.content.toUpperCase() == 'MSG.STOP') {
                        const stopping_collector = new MessageEmbed()
                            .setColor('RED')
                            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                            .setTitle('Stopping Collector')
                            .setDescription(`Stopping the message collector. That is to say, you will no longer be able to see what <@${memberTarget.id}> sends to the bot.\n` +
                                "You can use `/message` to start this again.")

                        msg.reply({embeds: [stopping_collector], ephemeral: is_ephemeral});

                        receive_collector.stop();
                        send_collector.stop();
                    } else {
                        const sending_message = new MessageEmbed()
                            .setColor('YELLOW')
                            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                            .setDescription(`Sending "${msg.content}" to <@${memberTarget.id}>...`)

                        msg.reply({embeds: [sending_message], ephemeral: is_ephemeral})
                            .then(embed => {
                                memberTarget.send({content: `${msg.content}`})
                                    .then(messageResult => {
                                        const message_sent = new MessageEmbed()
                                            .setColor('GREEN')
                                            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                                            .setAuthor({name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL({dynamic: true})}`})
                                            .setDescription(`*Send:* ${msg.content}`)

                                        embed.edit({embeds: [message_sent]})
                                    })
                            })
                    }
                })
            })
    }
}

const {Client, Intents, Collection, MessageEmbed, DMChannel} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const Sleep = require('../../modules/sleep');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('message')
        .setDescription("Sends a private message to a guild member.")
        .addUserOption((options) =>
            options
                .setName('user')
                .setDescription("The user to send the message to.")
                .setRequired(true))
        .addStringOption((options) =>
            options
                .setName('message')
                .setDescription("The message to send.")
                .setRequired(true))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("Whether you want the bot's messages to only be visible to yourself.")
                .setRequired(false)),
    async execute(client, interaction) {
        //Command information
        const REQUIRED_ROLE = "";

        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral');
        const target = interaction.options.getUser('user');
        const memberTarget = interaction.guild.members.cache.get(target.id);

        const message = interaction.options.getString('message');

        let DMChannel;

        //Checks
        if(interaction.member.user.id != "611633988515266562") {
            const error_permissions = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                .setFooter({text: `You cannot use this command. Only Jerry#3756 can!`});

            interaction.reply({embeds: [error_permissions], ephemeral: is_ephemeral});
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

        await interaction.reply({embeds: [messaging_user], ephemeral: is_ephemeral})
        memberTarget.send({content: `${message}`})
            .then(messageResult => {
                DMChannel = messageResult.channel;
                const message_sent = new MessageEmbed()
                    .setColor('20ff20')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                    .setTitle("Message sent!")
                    .setDescription("This command creates a message collector in the DM channel. That is to say, you will be able to see what the targeted member sends to the bot.")
                    .addField('Important', "Send '**bot.stop**' in this channel to stop the collector.")

                interaction.followUp({embeds: [message_sent], ephemeral: is_ephemeral});

                let filter = m => m.author.id == interaction.member.id;

                const receive_collector = DMChannel.createMessageCollector({idle: 300000});
                const send_collector = interaction.channel.createMessageCollector({filter, idle: 300000});

                send_collector.on('collect', message => {
                    if(message.content.toUpperCase() == 'BOT.STOP') {
                        const stopping_collector = new MessageEmbed()
                            .setColor('RED')
                            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                            .setTitle('Stopping Collector')
                            .setDescription("Stopping the message collector. That is it say, you will no longer be able to see what the targeted member sends to the bot.\n" +
                                "You can use `/message` to start this again.")

                        message.reply({embeds: [stopping_collector], ephemeral: is_ephemeral});

                        receive_collector.stop();
                        send_collector.stop();
                    } else {
                        const sending_message = new MessageEmbed()
                            .setColor('YELLOW')
                            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                            .setDescription(`Sending "${message.content}" to <@${memberTarget.id}>...`)

                        message.reply({embeds: [sending_message], ephemeral: is_ephemeral})
                            .then(embed => {
                                memberTarget.send({content: `${message.content}`})
                                    .then(messageResult => {
                                        const message_sent = new MessageEmbed()
                                            .setColor('GREEN')
                                            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                                            .setAuthor({name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL({dynamic: true})}`})
                                            .setDescription(`*Send:* "${message.content}" to <@${memberTarget.id}>!`)

                                        embed.edit({embeds: [message_sent]})
                                    })
                            })
                    }
                })

                receive_collector.on('collect', message => {
                    if(message.author.id != client.user.id) {
                        const message_embed = new MessageEmbed()
                            .setColor('BLURPLE')
                            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                            .setAuthor({name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})
                            .setDescription(`*Receive:* ${message.content}`)

                        interaction.followUp({embeds: [message_embed], ephemeral: is_ephemeral});
                    }
                })
            })
    }
}

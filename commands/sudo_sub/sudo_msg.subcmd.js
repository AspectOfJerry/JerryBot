import {MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";

import {logger, permissionCheck, sleep} from "../../utils/jerryUtils.js";


export default async function (client, interaction) {
    if(await permissionCheck(interaction, -1) === false) {
        return;
    }

    await interaction.reply("This command is currently disabled.");

    // Declaring variables
    const target = interaction.options.getUser("user");
    const memberTarget = interaction.guild.members.cache.get(target.id);
    logger.append("info", "IN", `'/sudo msg' > memberTarget: '@${memberTarget.user.tag}'`);

    const message = interaction.options.getString("message");

    let DMChannel;

    // Checks
    if(memberTarget.user.bot) {
        const invalid_input_recipient_exception = new MessageEmbed()
            .setColor("RED")
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setTitle("IllegalRecipientException")
            .setDescription("You cannot message a bot.");

        interaction.reply({embeds: [invalid_input_recipient_exception]});
        return;
    }

    // Main
    const messaging_user = new MessageEmbed()
        .setColor("YELLOW")
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
        .setDescription(`Sending "${message}" to <@${memberTarget.id}>...`);

    await interaction.reply({embeds: [messaging_user]});

    memberTarget.send({content: `${message}`})
        .then(async messageResult => {
            DMChannel = await messageResult.channel;
            const message_sent = new MessageEmbed()
                .setColor("GREEN")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("Message sent!")
                .setDescription(`Creating a message collector in the DM channel. You will be able to see what <@${memberTarget.id}> sends to the bot.\n` +
                    "To send them a message, type your message in this channel and the bot will relay it!")
                .addField("Important", "Send '**msg.stop**' in this channel to stop the collector.");

            await interaction.followUp({embeds: [message_sent]});

            const filter = m => m.author.id == interaction.member.id;

            const receive_collector = DMChannel.createMessageCollector({idle: 300000});
            const send_collector = interaction.channel.createMessageCollector({filter, idle: 300000});

            receive_collector.on("collect", (msg) => {
                if(msg.author.id != client.user.id) {
                    const message_embed = new MessageEmbed()
                        .setColor("BLURPLE")
                        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                        .setAuthor({name: `${msg.author.tag}`, iconURL: `${msg.author.displayAvatarURL({dynamic: true})}`})
                        .setDescription(`*Receive:* ${msg.content}`);

                    interaction.followUp({embeds: [message_embed]});
                }
            });

            send_collector.on("collect", (msg) => {
                if(msg.content.toUpperCase() == "MSG.STOP") {
                    const stopping_collector = new MessageEmbed()
                        .setColor("RED")
                        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                        .setTitle("Stopping Collector")
                        .setDescription(`Stopping the message collector. You will no longer be able to see what <@${memberTarget.id}> sends to the bot.`);

                    msg.reply({embeds: [stopping_collector]});

                    receive_collector.stop();
                    send_collector.stop();
                } else {
                    const sending_message = new MessageEmbed()
                        .setColor("YELLOW")
                        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                        .setDescription(`Sending "${msg.content}" to <@${memberTarget.id}>...`);

                    msg.reply({embeds: [sending_message]})
                        .then(embed => {
                            memberTarget.send({content: `${msg.content}`})
                                .then(async () => {
                                    const message_sent = new MessageEmbed()
                                        .setColor("GREEN")
                                        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                                        .setAuthor({name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL({dynamic: true})}`})
                                        .setDescription(`*Send:* ${msg.content}`);

                                    embed.edit({embeds: [message_sent]});
                                });
                        });
                }
            });
        });
}

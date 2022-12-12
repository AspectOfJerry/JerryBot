const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const {Log, Sleep} = require('../../modules/JerryUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('send')
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
                .setRequired(true)),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/message'.`, 'INFO'); // Logs
        // await interaction.deferReply();

        // Set minimum execution role
        switch(interaction.guild.id) {
            case process.env.DISCORD_JERRY_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = "PL0";
                break;
            case process.env.DISCORD_GOLDFISH_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = "Admin";
                break;
            case process.env.DISCORD_CRA_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = "PL0";
                break;
            case process.env.DISCORD_311_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = "PL0";
                break;
            default:
                await Log('append', interaction.guild.id, "└─Throwing because of bad permission configuration.", 'ERROR'); // Logs
                throw `Error: Bad permission configuration.`;
        }

        // Declaring variables
        const target = interaction.options.getUser('user');
        const memberTarget = interaction.guild.members.cache.get(target.id);
        await Log('append', interaction.guild.id, `├─memberTarget: '${memberTarget.user.tag}'`, 'INFO'); // Logs

        const message = interaction.options.getString('message');

        let DMChannel;

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
        if(memberTarget.user.bot) {
            const error_cannot_message_bot = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setTitle('Error')
                .setDescription("You cannot message a bot.");

            interaction.reply({embeds: [error_cannot_message_bot]});
            return;
        }

        // Main
        const messaging_user = new MessageEmbed()
            .setColor('YELLOW')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription(`Sending "${message}" to <@${memberTarget.id}>...`);

        await interaction.reply({embeds: [messaging_user]});

        memberTarget.send({content: `${message}`})
            .then(async messageResult => {
                DMChannel = await messageResult.channel;
                const message_sent = new MessageEmbed()
                    .setColor('GREEN')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                    .setTitle("Message sent!")
                    .setDescription(`Creating a message collector in the DM channel. You will be able to see what <@${memberTarget.id}> sends to the bot.\n` +
                        "To send them a message, type your message in this channel and the bot will relay it!")
                    .addField('Important', "Send '**msg.stop**' in this channel to stop the collector.");

                await interaction.followUp({embeds: [message_sent]});

                const filter = m => m.author.id == interaction.member.id;

                const receive_collector = DMChannel.createMessageCollector({idle: 300000});
                const send_collector = interaction.channel.createMessageCollector({filter, idle: 300000});

                receive_collector.on('collect', msg => {
                    if(msg.author.id != client.user.id) {
                        const message_embed = new MessageEmbed()
                            .setColor('BLURPLE')
                            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                            .setAuthor({name: `${msg.author.tag}`, iconURL: `${msg.author.displayAvatarURL({dynamic: true})}`})
                            .setDescription(`*Receive:* ${msg.content}`);

                        interaction.followUp({embeds: [message_embed]});
                    }
                })

                send_collector.on('collect', msg => {
                    if(msg.content.toUpperCase() == 'MSG.STOP') {
                        const stopping_collector = new MessageEmbed()
                            .setColor('RED')
                            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                            .setTitle('Stopping Collector')
                            .setDescription(`Stopping the message collector. You will no longer be able to see what <@${memberTarget.id}> sends to the bot.`);

                        msg.reply({embeds: [stopping_collector]});

                        receive_collector.stop();
                        send_collector.stop();
                    } else {
                        const sending_message = new MessageEmbed()
                            .setColor('YELLOW')
                            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                            .setDescription(`Sending "${msg.content}" to <@${memberTarget.id}>...`);

                        msg.reply({embeds: [sending_message]})
                            .then(embed => {
                                memberTarget.send({content: `${msg.content}`})
                                    .then(async messageResult => {
                                        const message_sent = new MessageEmbed()
                                            .setColor('GREEN')
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
};

const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("disconnect")
        .setDescription("Disconnect a user from their voice channel.")
        .addUserOption((options) =>
            options
                .setName("user")
                .setDescription("The user to disconnect.")
                .setRequired(false)
        )
        .addBooleanOption((options) =>
            options
                .setName("all")
                .setDescription("If you want to disconnect everyone in the targted user's voice channel.")
                .setRequired(false)
        ),
    async execute(client, interaction) {
        //Command information
        const REQUIRED_ROLE = "PL3";

        //Declaring variables
        const target = interaction.options.getUser('user') || interaction.user;
        const memberTarget = interaction.guild.members.cache.get(target.id);
        const isAll = interaction.options.getBoolean('all') || false;
        
        //Checks
        if(!interaction.member.roles.cache.find(role => role.name == REQUIRED_ROLE)) {
            const error_permissions = new MessageEmbed()
                .setColor('#ff2020')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("PermissionError")
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.");

            interaction.reply({embeds: [error_permissions], ephemeral: false});
            return;
        }

        //Code
        if(!memberTarget.voice.channel) {
            const user_not_in_vc = new MessageEmbed()
                .setColor('#ff2020')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription(`Error: <@${memberTarget.id}> is not in a voice channel.`)

            interaction.reply({embeds: [user_not_in_vc], ephemeral: false});
            return;
        }
        if(!isAll) {
            const voice_channel = memberTarget.voice.channel;
            memberTarget.voice.setChannel(null)
                .then(() => {
                    const disconnect_success = new MessageEmbed()
                        .setColor('#20ff20')
                        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                        .setDescription(`Successfully disconnected <@${memberTarget.id}> from ${voice_channel}.`)

                    interaction.reply({embeds: [disconnect_success], ephemeral: false});
                })
        } else {
            const voice_channel = memberTarget.voice.channel;
            const member_count = memberTarget.voice.channel.members.size;
            const disconnecting_members = new MessageEmbed()
                .setColor('#ffff20')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription(`Disconnecting all ${member_count} members from ${voice_channel}...`)

            interaction.reply({embeds: [disconnecting_members], ephemeral: false});

            memberTarget.voice.channel.members.forEach(member => {
                let voice_channel = member.voice.channel
                member.voice.setChannel(null)
                    .then(() => {
                        const disconnect_success = new MessageEmbed()
                            .setColor('#20ff20')
                            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                            .setDescription(`Successfully disconnected <@${member.id}> from ${voice_channel}.`)

                        interaction.channel.send({embeds: [disconnect_success], ephemeral: false});
                    })
            })
        }
    }
}
